import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Play, Square, Pause, Flame, Clock, Activity, Footprints, Heart, Navigation } from "lucide-react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { supabase } from "@/lib/supabase";
import { formatStopwatch, calculatePace } from "@/lib/utils";
import { useTracker } from "@/lib/useTracker";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  
  // Подключаем наш мощный хук трекинга
  const { runState, distance, elapsedTimeMs, path, steps, currentPaceSec, startRun, pauseRun, stopRun } = useTracker();

  // Логика кнопки "Долгое нажатие для стопа"
  const [stopProgress, setStopProgress] = useState(0);
  const stopIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user?.id || null));
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => {}, { enableHighAccuracy: true }
      );
    }
  }, []);

  // --- Хэндлеры UI ---
  const handleStopStart = () => {
    // Начинаем заполнять прогресс-бар кнопки (1.5 секунды)
    if (navigator.vibrate) navigator.vibrate(50);
    let progress = 0;
    stopIntervalRef.current = setInterval(() => {
      progress += 5; // 20 итераций по 5% = 100%
      setStopProgress(progress);
      if (progress >= 100) {
        clearInterval(stopIntervalRef.current!);
        handleFinalStop();
      }
    }, 75); // 75ms * 20 = 1500ms
  };

  const handleStopCancel = () => {
    // Если отпустили палец раньше - сбрасываем
    if (stopIntervalRef.current) clearInterval(stopIntervalRef.current);
    setStopProgress(0);
  };

  const handleFinalStop = async () => {
    setStopProgress(0);
    const result = stopRun(); // Вызываем стоп в ядре
    
    if (result.distanceMeters > 20 && userId) {
      const avg_speed_kmh = (result.distanceMeters / 1000) / (result.durationSec / 3600);
      const calories = Math.round((result.distanceMeters / 1000) * 70); // Оценка ккал
      
      await supabase.from('cloud_runs').insert({
        id: crypto.randomUUID(),
        user_id: userId,
        timestamp: Date.now(),
        duration_seconds: result.durationSec,
        distance_meters: Math.round(result.distanceMeters),
        calories: calories,
        steps: result.steps,
        avg_speed_kmh: avg_speed_kmh,
        title: "Бег на улице",
        path_points_json: JSON.stringify(result.path),
        source: "WEIFOX" // <-- Правильный источник, как ты просил!
      });
      alert("Тренировка WEIFOX сохранена!");
    } else {
      alert("Дистанция слишком мала для сохранения.");
    }
  };

  // --- ВЫЧИСЛЕНИЯ ДЛЯ UI ---
  const durationSec = Math.floor(elapsedTimeMs / 1000);
  const avgPace = calculatePace(durationSec, distance); // Средний темп
  const currentPaceStr = calculatePace(currentPaceSec, 1000); // Текущий темп (за последние 10 сек)
  const liveCalories = Math.round((distance / 1000) * 70);
  
  // Текущая локация для центрирования карты
  const currentLoc = path.length > 0 ? { lon: path[path.length-1][0], lat: path[path.length-1][1] } : location;
  const geojsonLine = { type: "Feature" as const, properties: {}, geometry: { type: "LineString" as const, coordinates: path } };

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      
      {/* КАРТА */}
      <div className="absolute inset-0 z-0">
        {currentLoc ? (
          <Map
            mapLib={maplibreGl as any}
            longitude={currentLoc.lon} latitude={currentLoc.lat} zoom={16}
            style={{ width: "100%", height: "100%" }}
            mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          >
            <Marker longitude={currentLoc.lon} latitude={currentLoc.lat} anchor="center">
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
        <div className="absolute inset-0 bg-background/80 pointer-events-none" />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-between pt-[60px] pb-[90px] px-4">
        
        {/* ИНДИКАТОР СТАТУСА (В левом верхнем углу) */}
        <div className="flex justify-between items-start">
          {runState !== "idle" && (
            <div className="border border-primary text-primary px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold font-display tracking-widest uppercase bg-black/60 backdrop-blur-md">
              <div className={`w-2 h-2 rounded-full ${runState === 'running' ? 'bg-primary animate-pulse' : 'bg-yellow-500'}`} />
              {runState === "running" ? "Запись" : "Пауза"}
            </div>
          )}
        </div>

        {/* ГЛАВНЫЙ БОЕВОЙ ИНТЕРФЕЙС */}
        {runState !== "idle" ? (
          <div className="flex flex-col h-full justify-end pb-4">
            
            {/* ГИГАНТСКАЯ ДИСТАНЦИЯ */}
            <div className="text-center mb-8">
              <h1 className="font-display text-[100px] md:text-[120px] leading-none font-bold tracking-tight text-white drop-shadow-xl">
                {(distance / 1000).toFixed(2).replace('.', ',')}
              </h1>
              <p className="text-primary font-display tracking-[0.3em] uppercase mt-1 text-sm font-bold">Километров</p>
            </div>

            {/* СЕТКА ПАРАМЕТРОВ (Точь-в-точь как на скриншоте 6) */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-card/80 border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center backdrop-blur-xl">
                <Navigation className="text-primary mb-2" size={20} strokeWidth={2.5}/>
                <p className="font-bold text-xl leading-tight font-display">{currentPaceStr}</p>
                <p className="text-[9px] text-muted uppercase font-display tracking-widest mt-1">Темп</p>
              </div>
              <div className="bg-card/80 border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center backdrop-blur-xl">
                <Clock className="text-primary mb-2" size={20} strokeWidth={2.5}/>
                <p className="font-bold text-xl leading-tight font-display">{formatStopwatch(elapsedTimeMs)}</p>
                <p className="text-[9px] text-muted uppercase font-display tracking-widest mt-1">Время</p>
              </div>
              <div className="bg-card/80 border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center backdrop-blur-xl">
                <Footprints className="text-primary mb-2" size={20} strokeWidth={2.5}/>
                <p className="font-bold text-xl leading-tight font-display">{steps}</p>
                <p className="text-[9px] text-muted uppercase font-display tracking-widest mt-1">Шаги</p>
              </div>
              <div className="bg-card/80 border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center backdrop-blur-xl">
                <Activity className="text-primary mb-2" size={20} strokeWidth={2.5}/>
                <p className="font-bold text-xl leading-tight font-display">{avgPace}</p>
                <p className="text-[9px] text-muted uppercase font-display tracking-widest mt-1">Ср. темп</p>
              </div>
              <div className="bg-card/80 border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center backdrop-blur-xl">
                <Flame className="text-primary mb-2" size={20} strokeWidth={2.5}/>
                <p className="font-bold text-xl leading-tight font-display">{liveCalories}</p>
                <p className="text-[9px] text-muted uppercase font-display tracking-widest mt-1">Ккал</p>
              </div>
              <div className="bg-card/80 border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center backdrop-blur-xl opacity-60">
                <Heart className="text-muted mb-2" size={20} strokeWidth={2.5}/>
                <p className="font-bold text-lg leading-tight font-display">--</p>
                <p className="text-[8px] text-muted uppercase font-display tracking-widest mt-1 leading-tight text-center">Без датчика</p>
              </div>
            </div>

            {/* КНОПКИ УПРАВЛЕНИЯ */}
            <div className="flex gap-4">
              <button 
                onClick={runState === "running" ? pauseRun : startRun} 
                className="w-[80px] h-[80px] rounded-full bg-[#1C2026] flex items-center justify-center active:scale-95 transition-transform"
              >
                {runState === "running" ? <Pause className="text-white fill-white" size={32} /> : <Play className="text-white fill-white ml-2" size={36} />}
              </button>
              
              {/* Кнопка "Удерживать для стопа" */}
              <button 
                onPointerDown={handleStopStart}
                onPointerUp={handleStopCancel}
                onPointerLeave={handleStopCancel}
                className="flex-1 rounded-full bg-[#FF3B4E] flex items-center justify-center gap-3 relative overflow-hidden active:scale-[0.98] transition-transform shadow-[0_0_30px_rgba(255,59,78,0.3)] select-none touch-none"
              >
                {/* Индикатор прогресса нажатия */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-red-700 transition-all duration-75 ease-linear" 
                  style={{ width: `${stopProgress}%` }}
                />
                <div className="relative z-10 flex items-center gap-3">
                  <Square className="text-white fill-white" size={20} />
                  <span className="font-display text-xl font-bold uppercase tracking-widest text-white">
                    {stopProgress > 0 ? "Удерживайте..." : "Завершить"}
                  </span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* ИНТЕРФЕЙС ДО СТАРТА */
          <div className="flex flex-col items-center w-full h-full justify-center">
            <button onClick={startRun} className="w-48 h-48 rounded-full flex flex-col items-center justify-center bg-primary border-[8px] border-primary/20 shadow-[0_0_80px_rgba(200,248,8,0.4)] active:scale-95 transition-transform relative mb-6 cursor-pointer">
              <div className="absolute inset-0 rounded-full border border-primary/50 animate-ping" />
              <Play className="text-black fill-black ml-3 mb-2" size={48} />
              <span className="font-display text-2xl font-bold uppercase tracking-widest text-black">СТАРТ</span>
            </button>
            <p className="text-muted text-sm uppercase tracking-widest font-display">Нажмите для начала записи</p>
          </div>
        )}
      </div>
    </div>
  );
}
