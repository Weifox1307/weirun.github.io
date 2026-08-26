import { useState, useEffect, useRef, useCallback } from "react";
import { getDistanceMeters } from "./utils";

// Пустой wav файл (base64) для удержания фоновой работы iOS Safari
const SILENT_AUDIO = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

interface TrackPoint {
  lat: number;
  lon: number;
  time: number;
}

export function useTracker() {
  const [runState, setRunState] = useState<"idle" | "running" | "paused">("idle");
  const [distance, setDistance] = useState(0);
  const [elapsedTimeMs, setElapsedTimeMs] = useState(0);
  const [path, setPath] = useState<number[][]>([]);
  const [steps, setSteps] = useState(0);
  const [currentPaceSec, setCurrentPaceSec] = useState<number>(0); // Для текущего темпа

  // Рефы для работы без перерисовок React
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

  // --- ВОССТАНОВЛЕНИЕ ПРИ ПЕРЕЗАГРУЗКЕ (Offline-first) ---
  useEffect(() => {
    const saved = localStorage.getItem("weifox_active_run");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setRunState("paused"); // Восстанавливаем на паузе
        setDistance(data.distance);
        setElapsedTimeMs(data.elapsedTimeMs);
        setPath(data.path);
        setSteps(data.steps);
        stateRef.current.accumulatedTime = data.elapsedTimeMs;
      } catch (e) {
        localStorage.removeItem("weifox_active_run");
      }
    }
  }, []);

  // --- СОХРАНЕНИЕ В LOCALSTORAGE ---
  useEffect(() => {
    if (runState !== "idle") {
      const syncInterval = setInterval(() => {
        localStorage.setItem("weifox_active_run", JSON.stringify({
          distance, elapsedTimeMs, path, steps
        }));
      }, 2000);
      return () => clearInterval(syncInterval);
    } else {
      localStorage.removeItem("weifox_active_run");
    }
  }, [runState, distance, elapsedTimeMs, path, steps]);

  // --- WAKE LOCK И АУДИО ХАК (ЗАЩИТА ОТ ЗАСЫПАНИЯ IOS) ---
  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        stateRef.current.wakeLock = await navigator.wakeLock.request("screen");
      }
    } catch (err) { console.warn("Wake Lock failed", err); }
  };

  const startBackgroundHacks = () => {
    requestWakeLock();
    if (stateRef.current.audio) {
      stateRef.current.audio.loop = true;
      stateRef.current.audio.play().catch(() => {});
    }
  };

  const stopBackgroundHacks = () => {
    if (stateRef.current.wakeLock) {
      stateRef.current.wakeLock.release().catch(() => {});
      stateRef.current.wakeLock = null;
    }
    if (stateRef.current.audio) {
      stateRef.current.audio.pause();
    }
  };

  // Переподключение WakeLock если юзер свернул и развернул окно
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && runState === "running") {
        requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [runState]);

  // --- ШАГОМЕР (АКСЕЛЕРОМЕТР) ---
  const handleDeviceMotion = useCallback((e: DeviceMotionEvent) => {
    if (runState !== "running") return;
    const acc = e.accelerationIncludingGravity;
    if (!acc || acc.x === null) return;
    
    // Вычисляем вектор ускорения
    const mag = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
    
    // Если вектор превышает 11.5 м/с² (шаг) и прошло более 300мс с прошлого шага
    if (mag > 11.5 && Date.now() - stateRef.current.lastStepTime > 300) {
      setSteps(s => s + 1);
      stateRef.current.lastStepTime = Date.now();
    }
  }, [runState]);

  const requestMotionPermission = async () => {
    // Специфика iOS 13+
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') {
          window.addEventListener('devicemotion', handleDeviceMotion);
        }
      } catch (e) { console.error("Motion permission error", e); }
    } else {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }
  };

  useEffect(() => {
    return () => window.removeEventListener('devicemotion', handleDeviceMotion);
  }, [handleDeviceMotion]);


  // --- ГЛАВНАЯ ЛОГИКА (ТАЙМЕР И GPS) ---
  useEffect(() => {
    if (runState === "running") {
      startBackgroundHacks();
      
      // 1. Таймер (Высокоточный)
      stateRef.current.startTime = Date.now();
      const updateTimer = () => {
        setElapsedTimeMs(stateRef.current.accumulatedTime + (Date.now() - stateRef.current.startTime));
        stateRef.current.timerId = requestAnimationFrame(updateTimer);
      };
      stateRef.current.timerId = requestAnimationFrame(updateTimer);

      // 2. GPS (Жесткая фильтрация)
      if ("geolocation" in navigator) {
        stateRef.current.watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude: lat, longitude: lon, accuracy } = pos.coords;
            
            // ФИЛЬТР 1: Игнорируем плохие точки (погрешность > 25 метров)
            if (accuracy > 25) return;

            const now = Date.now();
            const lastPoints = stateRef.current.lastPoints;

            if (lastPoints.length > 0) {
              const lastPt = lastPoints[lastPoints.length - 1];
              const dist = getDistanceMeters(lastPt.lat, lastPt.lon, lat, lon);
              const timeDeltaSec = (now - lastPt.time) / 1000;
              const speed = dist / timeDeltaSec;

              // ФИЛЬТР 2: Стоянка (если скорость < 0.8 м/с (~2.8 км/ч), не прибавляем дистанцию)
              if (speed >= 0.8 && dist > 2) {
                setDistance(d => d + dist);
                setPath(p => [...p, [lon, lat]]);
                
                // Вычисляем текущий темп (на основе последних 10 секунд)
                setCurrentPaceSec(timeDeltaSec / (dist / 1000));
              }
            } else {
              setPath(p => [...p, [lon, lat]]);
            }

            lastPoints.push({ lat, lon, time: now });
            if (lastPoints.length > 5) lastPoints.shift(); // Храним только последние 5 точек
          },
          (err) => console.warn("GPS Error", err),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Жесткие настройки GPS
        );
      }
    } else {
      // Пауза / Стоп
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

  // --- ЭКСПОРТ ФУНКЦИЙ УПРАВЛЕНИЯ ---
  const startRun = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    requestMotionPermission(); // Запрос акселерометра при первом старте
    
    if (elapsedTimeMs === 0) {
      setDistance(0);
      setPath([]);
      setSteps(0);
      stateRef.current.accumulatedTime = 0;
      stateRef.current.lastPoints = [];
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
    const finalTime = Math.floor(elapsedTimeMs / 1000);
    const finalDist = distance;
    const finalSteps = steps;
    const finalPath = path;
    
    // Сброс хука
    setDistance(0); setElapsedTimeMs(0); setPath([]); setSteps(0); setCurrentPaceSec(0);
    stateRef.current.accumulatedTime = 0;

    return { durationSec: finalTime, distanceMeters: finalDist, steps: finalSteps, path: finalPath };
  };

  return {
    runState, distance, elapsedTimeMs, path, steps, currentPaceSec,
    startRun, pauseRun, stopRun
  };
}
