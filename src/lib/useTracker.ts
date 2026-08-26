import { useState, useEffect, useRef, useCallback } from "react";
import { getDistanceMeters } from "./utils";

const SILENT_AUDIO = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

interface TrackPoint { lat: number; lon: number; time: number; }

export function useTracker() {
  const [runState, setRunState] = useState<"idle" | "running" | "paused">("idle");
  const [distance, setDistance] = useState(0);
  const [elapsedTimeMs, setElapsedTimeMs] = useState(0);
  const [path, setPath] = useState<number[][]>([]);
  const [steps, setSteps] = useState(0);
  const [currentPaceSec, setCurrentPaceSec] = useState<number>(0);

  const stateRef = useRef({
    startTime: 0,
    accumulatedTime: 0,
    lastPoints: [] as TrackPoint[],
    lastStepTime: 0,
    audio: typeof Audio !== "undefined" ? new Audio(SILENT_AUDIO) : null,
    wakeLock: null as WakeLockSentinel | null,
    watchId: null as number | null,
    timerId: null as number | null,
  });

  // --- ВОССТАНОВЛЕНИЕ (Offline-first) ---
  useEffect(() => {
    const saved = localStorage.getItem("weifox_active_run");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setRunState("paused");
        setDistance(data.distance);
        setElapsedTimeMs(data.elapsedTimeMs);
        setPath(data.path);
        setSteps(data.steps);
        stateRef.current.accumulatedTime = data.elapsedTimeMs;
      } catch (e) { localStorage.removeItem("weifox_active_run"); }
    }
  }, []);

  useEffect(() => {
    if (runState !== "idle") {
      const syncInterval = setInterval(() => {
        localStorage.setItem("weifox_active_run", JSON.stringify({ distance, elapsedTimeMs, path, steps }));
      }, 2000);
      return () => clearInterval(syncInterval);
    } else {
      localStorage.removeItem("weifox_active_run");
    }
  }, [runState, distance, elapsedTimeMs, path, steps]);

  // --- WAKE LOCK И АУДИО ---
  const requestWakeLock = async () => {
    try { if ("wakeLock" in navigator) stateRef.current.wakeLock = await navigator.wakeLock.request("screen"); } 
    catch (err) {}
  };

  const startBackgroundHacks = () => {
    requestWakeLock();
    if (stateRef.current.audio) {
      stateRef.current.audio.loop = true;
      stateRef.current.audio.play().catch(() => {});
    }
  };

  const stopBackgroundHacks = () => {
    if (stateRef.current.wakeLock) { stateRef.current.wakeLock.release().catch(() => {}); stateRef.current.wakeLock = null; }
    if (stateRef.current.audio) stateRef.current.audio.pause();
  };

  // --- ШАГОМЕР (Универсальный iOS/Android) ---
  const handleDeviceMotion = useCallback((e: DeviceMotionEvent) => {
    if (runState !== "running") return;
    const acc = e.accelerationIncludingGravity;
    if (!acc || acc.x === null) return;
    
    const mag = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
    
    // Снижен порог до 10.8 для корректной работы на Android
    if (mag > 10.8 && Date.now() - stateRef.current.lastStepTime > 300) {
      setSteps(s => s + 1);
      stateRef.current.lastStepTime = Date.now();
    }
  }, [runState]);

  const requestMotionPermission = async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') window.addEventListener('devicemotion', handleDeviceMotion);
      } catch (e) {}
    } else {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }
  };

  useEffect(() => {
    return () => window.removeEventListener('devicemotion', handleDeviceMotion);
  }, [handleDeviceMotion]);

  // --- ТАЙМЕР И GPS ---
  useEffect(() => {
    if (runState === "running") {
      startBackgroundHacks();
      
      stateRef.current.startTime = Date.now();
      const updateTimer = () => {
        setElapsedTimeMs(stateRef.current.accumulatedTime + (Date.now() - stateRef.current.startTime));
        stateRef.current.timerId = requestAnimationFrame(updateTimer);
      };
      stateRef.current.timerId = requestAnimationFrame(updateTimer);

      if ("geolocation" in navigator) {
        stateRef.current.watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude: lat, longitude: lon, accuracy } = pos.coords;
            
            // Смягченный фильтр для квартир/домов: допускаем погрешность до 40м
            if (accuracy > 40) return;

            const now = Date.now();
            const lastPoints = stateRef.current.lastPoints;

            if (lastPoints.length > 0) {
              const lastPt = lastPoints[lastPoints.length - 1];
              const dist = getDistanceMeters(lastPt.lat, lastPt.lon, lat, lon);
              const timeDeltaSec = (now - lastPt.time) / 1000;
              const speed = dist / timeDeltaSec;

              // Смягченный фильтр стоянки: 0.4 м/с (~1.4 км/ч), дистанция > 1 метра
              if (speed >= 0.4 && dist > 1) {
                setDistance(d => d + dist);
                setPath(p => [...p, [lon, lat]]);
                setCurrentPaceSec(timeDeltaSec / (dist / 1000));
              }
            } else {
              setPath(p => [...p, [lon, lat]]);
            }

            lastPoints.push({ lat, lon, time: now });
            if (lastPoints.length > 3) lastPoints.shift();
          },
          (err) => console.warn("GPS Error", err),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }
    } else {
      stopBackgroundHacks();
      if (stateRef.current.timerId) cancelAnimationFrame(stateRef.current.timerId);
      if (stateRef.current.watchId) navigator.geolocation.clearWatch(stateRef.current.watchId);
    }

    return () => {
      stopBackgroundHacks();
      if (stateRef.current.timerId) cancelAnimationFrame(stateRef.current.timerId);
      if (stateRef.current.watchId) navigator.geolocation.clearWatch(stateRef.current.watchId);
    };
  }, [runState]);

  // --- УПРАВЛЕНИЕ ---
  const startRun = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    requestMotionPermission(); 
    if (elapsedTimeMs === 0) {
      setDistance(0); setPath([]); setSteps(0); stateRef.current.accumulatedTime = 0; stateRef.current.lastPoints = [];
    }
    setRunState("running");
  };

  const pauseRun = () => {
    if (navigator.vibrate) navigator.vibrate([50, 50]);
    setRunState("paused");
    stateRef.current.accumulatedTime += (Date.now() - stateRef.current.startTime);
  };

  const stopRun = () => {
    if (navigator.vibrate) navigator.vibrate(200);
    setRunState("idle");
    localStorage.removeItem("weifox_active_run");
    
    // Копируем данные ДО сброса состояния
    const finalData = {
      durationSec: Math.floor(elapsedTimeMs / 1000),
      distanceMeters: distance,
      steps: steps,
      path: [...path] // Копируем массив, чтобы он не обнулился при сохранении
    };
    
    setDistance(0); setElapsedTimeMs(0); setPath([]); setSteps(0); setCurrentPaceSec(0);
    stateRef.current.accumulatedTime = 0;

    return finalData;
  };

  return { runState, distance, elapsedTimeMs, path, steps, currentPaceSec, startRun, pauseRun, stopRun };
}
