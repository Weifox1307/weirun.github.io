import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Play, Square, Pause, Navigation, CloudLightning, Sun, Cloud, CloudRain, Heart, Activity, Flame, Clock } from "lucide-react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { supabase } from "@/lib/supabase";
import { getDistanceMeters, formatDuration, formatStopwatch, calculatePace } from "@/lib/utils";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [city, setCity] = useState("Определение...");
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"Поиск" | "Готов" | "Ошибка">("Поиск");

  // Состояния трекера
  const [runState, setRunState] = useState<"idle" | "running" | "paused">("idle");
  const [path, setPath] = useState<number[][]>([]); 
  const [distanceMeters, setDistanceMeters] = useState(0);
  
  // Высокоточный таймер
  const [elapsedTimeMs, setElapsedTimeMs] = useState(0);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const [lastRun, setLastRun] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.id) {
        setUserId(data.session.user.id);
        supabase.from('cloud_runs').select('*').eq('user_id', data.session.user.id).order('timestamp', { ascending: false }).limit(1)
          .then(({ data: runs }) => { if (runs && runs.length > 0) setLastRun(runs[0]); });
      }
    });

    if ("geolocation" in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setLocation({ lat, lon });
          setGpsStatus("Готов");
          
          if (!weather) fetchCityAndWeather(lat, lon); 

          if (runState === "running") {
            setPath(prev => {
              const newPath = [...prev, [lon, lat]];
              if (prev.length > 0) {
                const [prevLon, prevLat] = prev[prev.length - 1];
                const dist = getDistanceMeters(prevLat, prevLon, lat, lon);
                setDistanceMeters(d => d + dist);
              }
              return newPath;
            });
          }
        },
        (err) => { console.error(err); setGpsStatus("Ошибка"); },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [runState, weather]);

  // Запуск высокоточного таймера через requestAnimationFrame для плавности
  useEffect(() => {
    if (runState === "running") {
      const updateTimer = () => {
        setElapsedTimeMs(accumulatedTimeRef.current + (Date.now() - startTimeRef.current));
        timerRef.current = requestAnimationFrame(updateTimer);
      };
      timerRef.current = requestAnimationFrame(updateTimer);
    } else if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
    }
    return () => { if (timerRef.current) cancelAnimationFrame(timerRef.current); };
  }, [runState]);

  const fetchCityAndWeather = async (lat: number, lon: number) => {
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
      const geoData = await geoRes.json();
      setCity(geoData.address?.city || geoData.address?.town || "Город");
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const weatherData = await weatherRes.json();
      setWeather({ temp: Math.round(weatherData.current_weather.temperature), code: weatherData.current_weather.weathercode });
    } catch (e) {}
  };

  const handleStart = () => {
    setRunState("running");
    startTimeRef.current = Date.now();
    if (elapsedTimeMs === 0) {
      setPath(location ? [[location.lon, location.lat]] : []);
      setDistanceMeters(0);
    }
  };

  const handlePause = () => {
    setRunState("paused");
    accumulatedTimeRef.current += (Date.now() - startTimeRef.current);
  };

  const handleStop = async () => {
    setRunState("idle");
    const totalDurationSec = Math.floor(elapsedTimeMs / 1000);
    
    if (distanceMeters > 20 && userId) {
      // Подсчет параметров для базы
      const calories = Math.round((distanceMeters / 1000) * 70); // Примерно 70ккал на км
      const steps = Math.round((distanceMeters / 1000) * 1300); // Примерно 1300 шагов на км
      const avg_speed_kmh = (distanceMeters / 1000) / (totalDurationSec / 3600);

      const newRun = {
        id: crypto.randomUUID(),
        user_id: userId,
        timestamp: Date.now(),
        duration_seconds: totalDurationSec,
        distance_meters: Math.round(distanceMeters),
        calories: calories,
        steps: steps,
        avg_speed_kmh: avg_speed_kmh,
        title: "Бег на улице",
        path_points_json: JSON.stringify(path),
        source: "WEIRUN" // Записываем правильный source!
      };
      
      await supabase.from('cloud_runs').insert(newRun);
      setLastRun(newRun);
      alert("Тренировка сохранена!");
    } else {
      alert("Дистанция слишком мала для сохранения (минимум 20 м).");
    }
    
    // Сброс
    setPath([]);
    setDistanceMeters(0);
    setElapsedTimeMs(0);
    accumulatedTimeRef.current = 0;
  };

  const geojsonLine = { type: "Feature" as const, properties: {}, geometry: { type: "LineString" as const, coordinates: path } };

  // Вычисляемые параметры для экрана бега
  const durationSec = Math.floor(elapsedTimeMs / 1000);
  const currentPace = calculatePace(durationSec, distanceMeters);
  const liveCalories = Math.round((distanceMeters / 1000) * 70);
  const liveSteps = Math.round((distanceMeters / 1000) * 1300);

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      
      {/* КАРТА */}
      <div className="absolute inset-0 z-0">
        {location ? (
          <Map
            mapLib={maplibreGl as any}
            initialViewState={{ longitude: location.lon, latitude: location.lat, zoom: 16 }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          >
            <Marker longitude={location.lon} latitude={location.lat} anchor="center">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
            </Marker>
            {path.length > 1 && (
              <Source id="route" type="geojson" data={geojsonLine as any}>
                <Layer id="route-line" type="line" layout={{ "line-join": "round", "line-cap": "round" }} paint={{ "line-color": "#C8F808", "line-width": 6 }} />
              </Source>
            )}
          </Map>
        ) : (
          <div className="w-full h-full bg-[#0A0D12]" />
        )}
        <div className="absolute inset-0 bg-background/70 pointer-events-none" />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-between pt-[60px] pb-[90px]">
        
        {/* ИНТЕРФЕЙС "В ОЖИДАНИИ" */}
        {runState === "idle" && (
          <>
            <div className="flex justify-between items-start px-4">
              <div>
                <p className="text-white drop-shadow-md text-sm mb-1">Доброй ночи, Атлет 👋</p>
                <h1 className="font-display text-3xl font-bold uppercase drop-shadow-lg text-white">ГОТОВ К СТАРТУ?</h1>
                <div className="flex items-center gap-2 mt-4 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full w-max">
                  <div className={`w-2 h-2 rounded-full ${gpsStatus === 'Готов' ? 'bg-primary' : 'bg-red-500'} animate-pulse`} />
                  <span className="text-xs font-display tracking-widest text-white/80 uppercase">GPS: {gpsStatus}</span>
                </div>
              </div>
              <div className="bg-black/60 border border-white/10 p-3 rounded-2xl flex flex-col items-center">
                {weather?.code === 0 ? <Sun className="text-yellow-400 mb-1" size={24} /> : <CloudLightning className="text-primary mb-1" size={24} />}
                <span className="font-bold text-white">{weather ? `${weather.temp}°C` : '--°C'}</span>
                <span className="text-[10px] text-white/60 uppercase text-center max-w-[80px] truncate">{city}</span>
              </div>
            </div>

            <div className="flex flex-col items-center w-full max-w-[500px] mx-auto px-4">
              <div className="flex justify-between w-full mb-8">
                <div className="bg-black/60 border border-white/10 p-4 rounded-2xl w-[48%] shadow-xl">
                  <p className="text-[10px] text-white/60 uppercase font-display tracking-widest mb-1">Последняя дистанция</p>
                  <p className="font-display text-2xl font-bold text-white">{lastRun ? (lastRun.distance_meters/1000).toFixed(2) : "0.0"} <span className="text-sm">км</span></p>
                </div>
                <div className="bg-black/60 border border-white/10 p-4 rounded-2xl w-[48%] shadow-xl">
                  <p className="text-[10px] text-white/60 uppercase font-display tracking-widest mb-1">Время</p>
                  <p className="font-display text-2xl font-bold text-white">{lastRun ? formatDuration(lastRun.duration_seconds) : "00:00"}</p>
                </div>
              </div>

              <button onClick={handleStart} className="w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center bg-primary border-[6px] border-primary/30 shadow-[0_0_60px_rgba(200,248,8,0.4)] active:scale-95 transition-transform relative mb-6">
                <div className="absolute inset-0 rounded-full border border-primary/50 animate-ping" />
                <Play className="text-black fill-black ml-2 mb-1" size={36} />
                <span className="font-display text-xl font-bold uppercase tracking-widest text-black">СТАРТ</span>
              </button>
            </div>
          </>
        )}

        {/* БОЕВОЙ ИНТЕРФЕЙС ВО ВРЕМЯ БЕГА (КАК НА СКРИНШОТЕ 6) */}
        {runState !== "idle" && (
          <div className="flex flex-col h-full justify-between px-4">
            
            <div className="flex justify-between items-center mt-2">
              <div className="border border-primary text-primary px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold font-display tracking-widest uppercase bg-black/50 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {runState === "running" ? "Запись" : "Пауза"}
              </div>
            </div>

            <div className="text-center mt-6">
              <h1 className="font-display text-[100px] leading-none font-bold tracking-tight">
                {(distanceMeters / 1000).toFixed(2).replace('.', ',')}
              </h1>
              <p className="text-primary font-display tracking-[0.3em] uppercase mt-2">Километров</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-10">
              <div className="bg-card/90 border border-white/10 p-3 rounded-2xl flex flex-col items-center justify-center backdrop-blur-md">
                <Activity className="text-primary mb-1" size={20} />
                <p className="font-bold text-lg leading-tight">{currentPace}</p>
                <p className="text-[9px] text-muted uppercase font-display tracking-widest">Темп</p>
              </div>
              <div className="bg-card/90 border border-white/10 p-3 rounded-2xl flex flex-col items-center justify-center backdrop-blur-md">
                <Clock className="text-primary mb-1" size={20} />
                <p className="font-bold text-lg leading-tight font-display">{formatStopwatch(elapsedTimeMs)}</p>
                <p className="text-[9px] text-muted uppercase font-display tracking-widest">Время</p>
              </div>
              <div className="bg-card/90 border border-white/10 p-3 rounded-2xl flex flex-col items-center justify-center backdrop-blur-md">
                <Navigation className="text-primary mb-1" size={20} />
                <p className="font-bold text-lg leading-tight">{liveSteps}</p>
                <p className="text-[9px] text-muted uppercase font-display tracking-widest">Шаги</p>
              </div>
              <div className="bg-card/90 border border-white/10 p-3 rounded-2xl flex flex-col items-center justify-center backdrop-blur-md">
                <Activity className="text-primary mb-1" size={20} />
                <p className="font-bold text-lg leading-tight">{currentPace}</p>
                <p className="text-[9px] text-muted uppercase font-display tracking-widest">Ср. темп</p>
              </div>
              <div className="bg-card/90 border border-white/10 p-3 rounded-2xl flex flex-col items-center justify-center backdrop-blur-md">
                <Flame className="text-primary mb-1" size={20} />
                <p className="font-bold text-lg leading-tight">{liveCalories}</p>
                <p className="text-[9px] text-muted uppercase font-display tracking-widest">Ккал</p>
              </div>
              <div className="bg-card/90 border border-white/10 p-3 rounded-2xl flex flex-col items-center justify-center backdrop-blur-md opacity-50">
                <Heart className="text-muted mb-1" size={20} />
                <p className="font-bold text-sm leading-tight">--</p>
                <p className="text-[8px] text-muted uppercase font-display tracking-widest text-center leading-tight">Без датчика</p>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button 
                onClick={runState === "running" ? handlePause : handleStart} 
                className="w-20 h-20 rounded-full bg-[#1C2026] flex items-center justify-center active:scale-95 transition-transform"
              >
                {runState === "running" ? <Pause className="text-white fill-white" size={28} /> : <Play className="text-white fill-white" size={28} />}
              </button>
              <button 
                onClick={handleStop}
                className="flex-1 rounded-full bg-[#FF3B4E] flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-[0_0_30px_rgba(255,59,78,0.4)]"
              >
                <Square className="text-white fill-white" size={20} />
                <span className="font-display text-lg font-bold uppercase tracking-widest text-white">Завершить</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
