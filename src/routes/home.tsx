import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Play, Square, Pause, Navigation, CloudLightning, Sun, Cloud, CloudRain, Heart, Activity, Flame, Clock, Footprints } from "lucide-react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { supabase } from "@/lib/supabase";
import { formatStopwatch, calculatePace, formatDuration } from "@/lib/utils";
import { useTracker } from "@/lib/useTracker";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [city, setCity] = useState("Город");
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"Поиск" | "Готов" | "Ошибка">("Поиск");
  
  const [userStats, setUserStats] = useState({ totalDist: 0, avgPace: "0:00" });
  const [lastRun, setLastRun] = useState<any>(null);

  const { runState, distance, elapsedTimeMs, path, steps, currentPaceSec, startRun, pauseRun, stopRun } = useTracker();
  const [stopProgress, setStopProgress] = useState(0);
  const stopIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const id = data.session?.user?.id;
      if (id) {
        setUserId(id);
        supabase.from('cloud_runs').select('*').eq('user_id', id).order('timestamp', { ascending: false })
          .then(({ data: runs }) => {
            if (runs && runs.length > 0) {
              setLastRun(runs[0]);
              const tDist = runs.reduce((a, r) => a + (r.distance_meters || 0), 0);
              const tDur = runs.reduce((a, r) => a + (r.duration_seconds || 0), 0);
              setUserStats({ totalDist: tDist, avgPace: calculatePace(tDur, tDist) });
            }
          });
      }
    });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lon: longitude });
          setGpsStatus("Готов");
          fetchCityAndWeather(latitude, longitude);
        },
        () => setGpsStatus("Ошибка"), { enableHighAccuracy: true }
      );
    }
  }, []);

  const fetchCityAndWeather = async (lat: number, lon: number) => {
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&accept-language=ru`);
      const geoData = await geoRes.json();
      setCity(geoData.address?.city || geoData.address?.town || geoData.address?.state || "Локация");
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const weatherData = await weatherRes.json();
      setWeather({ temp: Math.round(weatherData.current_weather.temperature), code: weatherData.current_weather.weathercode });
    } catch (e) {}
  };

  const handleStopStart = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    let progress = 0;
    stopIntervalRef.current = setInterval(() => {
      progress += 5;
      setStopProgress(progress);
      if (progress >= 100) { clearInterval(stopIntervalRef.current!); handleFinalStop(); }
    }, 75); 
  };

  const handleStopCancel = () => {
    if (stopIntervalRef.current) clearInterval(stopIntervalRef.current);
    setStopProgress(0);
  };

  const handleFinalStop = async () => {
    setStopProgress(0);
    const result = stopRun(); 
    
    if (result.distanceMeters > 20 && userId) {
      const avg_speed_kmh = (result.distanceMeters / 1000) / (result.durationSec / 3600);
      const calories = Math.round((result.distanceMeters / 1000) * 70); 
      
      // ИМЕННО WEIRUN И НИКАК ИНАЧЕ
      await supabase.from('cloud_runs').insert({
        user_id: userId,
        timestamp: Date.now(),
        duration_seconds: result.durationSec,
        distance_meters: Math.round(result.distanceMeters),
        calories: calories,
        steps: result.steps,
        avg_speed_kmh: avg_speed_kmh,
        title: "Бег на улице",
        path_points_json: JSON.stringify(result.path), // Теперь формат [ {latitude, longitude} ]
        source: "WEIRUN" // <-- ЖЕЛЕЗНО
      });
      alert("Тренировка WEIRUN сохранена!");
    } else {
      alert("Дистанция слишком мала для сохранения (минимум 20 м).");
    }
  };

  const durationSec = Math.floor(elapsedTimeMs / 1000);
  const avgPace = calculatePace(durationSec, distance); 
  const currentPaceStr = calculatePace(currentPaceSec, 1000); 
  const liveCalories = Math.round((distance / 1000) * 70);
  
  // Конвертируем объекты Android формата в массив чисел для библиотеки карты MapLibre
  const mapCoordinates = path.map(p => [p.longitude, p.latitude]);
  const currentLoc = path.length > 0 ? { lon: path[path.length-1].longitude, lat: path[path.length-1].latitude } : location;
  const geojsonLine = { type: "Feature" as const, properties: {}, geometry: { type: "LineString" as const, coordinates: mapCoordinates } };

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        {currentLoc ? (
          <Map
            mapLib={maplibreGl as any}
            longitude={currentLoc.lon} latitude={currentLoc.lat} zoom={15}
            style={{ width: "100%", height: "100%" }}
            mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
            dragPan={runState === "idle"} 
            scrollZoom={runState === "idle"}
          >
            <Marker longitude={currentLoc.lon} latitude={currentLoc.lat} anchor="center">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
            </Marker>
            {mapCoordinates.length > 1 && (
              <Source id="route" type="geojson" data={geojsonLine as any}>
                <Layer id="route-line" type="line" layout={{ "line-join": "round", "line-cap": "round" }} paint={{ "line-color": "#C8F808", "line-width": 6 }} />
              </Source>
            )}
          </Map>
        ) : (
          <div className="w-full h-full bg-[#0A0D12]" />
        )}
        <div className="absolute inset-0 bg-background/50 pointer-events-none" />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between pt-[60px] pb-[90px] px-4">
        
        <div className="flex justify-between items-start pointer-events-auto">
          {runState === "idle" ? (
            <div>
              <p className="text-white drop-shadow-md text-sm mb-1 flex items-center gap-2">
                <Navigation size={14} className="text-primary"/> Доброй ночи, Атлет
              </p>
              <h1 className="font-display text-3xl font-bold uppercase drop-shadow-lg text-white">ГОТОВ К СТАРТУ?</h1>
              <div className="flex items-center gap-2 mt-4 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full w-max backdrop-blur-md">
                <div className={`w-2 h-2 rounded-full ${gpsStatus === 'Готов' ? 'bg-primary' : 'bg-red-500'} animate-pulse`} />
                <span className="text-xs font-display tracking-widest text-white/80 uppercase">GPS: {gpsStatus}</span>
              </div>
            </div>
          ) : (
            <div className="border border-primary text-primary px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold font-display tracking-widest uppercase bg-black/60 backdrop-blur-md">
              <div className={`w-2 h-2 rounded-full ${runState === 'running' ? 'bg-primary animate-pulse' : 'bg-yellow-500'}`} />
              {runState === "running" ? "Запись" : "Пауза"}
            </div>
          )}

          {runState === "idle" && (
            <div className="bg-black/60 border border-white/10 p-3 rounded-2xl backdrop-blur-md flex flex-col items-center">
              {weather?.code === 0 ? <Sun className="text-yellow-400 mb-1" size={24} /> : <CloudLightning className="text-primary mb-1" size={24} />}
              <span className="font-bold text-white">{weather ? `${weather.temp}°C` : '--°C'}</span>
              <span className="text-[10px] text-white/60 uppercase text-center max-w-[80px] truncate">{city}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center pointer-events-auto w-full max-w-[500px] mx-auto">
          {runState === "idle" ? (
            <>
              <div className="flex justify-between w-full px-2 mb-8">
                <div className="bg-black/80 border border-white/10 p-4 rounded-2xl backdrop-blur-xl w-[48%] shadow-xl">
                  <p className="text-[10px] text-white/60 uppercase font-display tracking-widest mb-1">Всего преодолено</p>
                  <p className="font-display text-2xl font-bold text-white">{(userStats.totalDist/1000).toFixed(1)} <span className="text-sm text-white/60">км</span></p>
                </div>
                <div className="bg-black/80 border border-white/10 p-4 rounded-2xl backdrop-blur-xl w-[48%] shadow-xl">
                  <p className="text-[10px] text-white/60 uppercase font-display tracking-widest mb-1">Средний темп</p>
                  <p className="font-display text-2xl font-bold text-white">{userStats.avgPace} <span className="text-sm text-white/60">/км</span></p>
                </div>
              </div>

              <button onClick={startRun} className="w-48 h-48 rounded-full flex flex-col items-center justify-center bg-primary border-[8px] border-primary/20 shadow-[0_0_80px_rgba(200,248,8,0.4)] active:scale-95 transition-transform relative mb-6 cursor-pointer">
                <div className="absolute inset-0 rounded-full border border-primary/50 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <Play className="text-black fill-black ml-3 mb-2" size={48} />
                <span className="font-display text-2xl font-bold uppercase tracking-widest text-black">СТАРТ</span>
              </button>

              {lastRun && (
                <div className="w-full bg-black/80 border border-white/10 p-4 rounded-2xl backdrop-blur-xl flex items-center justify-between cursor-pointer hover:bg-black/90 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center text-primary bg-primary/10">
                      <Navigation size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-primary uppercase font-display tracking-widest mb-0.5">Последний забег</p>
                      <p className="font-bold text-white text-sm">{(lastRun.distance_meters/1000).toFixed(2)} км — {formatDuration(lastRun.duration_seconds)}</p>
                    </div>
                  </div>
                  <div className="text-white/40">{'>'}</div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-center mb-8 bg-black/40 backdrop-blur-sm rounded-3xl py-4 px-12 border border-white/5">
                <h1 className="font-display text-[100px] leading-none font-bold tracking-tight text-white drop-shadow-xl">
                  {(distance / 1000).toFixed(2).replace('.', ',')}
                </h1>
                <p className="text-primary font-display tracking-[0.3em] uppercase mt-1 text-sm font-bold">Километров</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8 w-full">
                <div className="bg-card/90 border border-white/10 p-3 rounded-2xl flex flex-col items-center justify-center backdrop-blur-xl">
                  <Activity className="text-primary mb-1" size={20} strokeWidth={2.5}/>
                  <p className="font-bold text-lg leading-tight font-display">{currentPaceStr}</p>
                  <p className="text-[9px] text-muted uppercase font-display tracking-widest">Темп</p>
                </div>
                <div className="bg-card/90 border border-white/10 p-3 rounded-2xl flex flex-col items-center justify-center backdrop-blur-xl">
                  <Clock className="text-primary mb-1" size={20} strokeWidth={2.5}/>
                  <p className="font-bold text-lg leading-tight font-display">{formatStopwatch(elapsedTimeMs)}</p>
                  <p className="text-[9px] text-muted uppercase font-display tracking-widest">Время</p>
                </div>
                <div className="bg-card/90 border border-white/10 p-3 rounded-2xl flex flex-col items-center justify-center backdrop-blur-xl">
                  <Footprints className="text-primary mb-1" size={20} strokeWidth={2.5}/>
                  <p className="font-bold text-lg leading-tight font-display">{steps}</p>
                  <p className="text-[9px] text-muted uppercase font-display tracking-widest">Шаги</p>
                </div>
                <div className="bg-card/90 border border-white/10 p-3 rounded-2xl flex flex-col items-center justify-center backdrop-blur-xl">
                  <Activity className="text-primary mb-1" size={20} strokeWidth={2.5}/>
                  <p className="font-bold text-lg leading-tight font-display">{avgPace}</p>
                  <p className="text-[9px] text-muted uppercase font-display tracking-widest">Ср. темп</p>
                </div>
                <div className="bg-card/90 border border-white/10 p-3 rounded-2xl flex flex-col items-center justify-center backdrop-blur-xl">
                  <Flame className="text-primary mb-1" size={20} strokeWidth={2.5}/>
                  <p className="font-bold text-lg leading-tight font-display">{liveCalories}</p>
                  <p className="text-[9px] text-muted uppercase font-display tracking-widest">Ккал</p>
                </div>
                <div className="bg-card/90 border border-white/10 p-3 rounded-2xl flex flex-col items-center justify-center backdrop-blur-xl opacity-60">
                  <Heart className="text-muted mb-1" size={20} strokeWidth={2.5}/>
                  <p className="font-bold text-lg leading-tight font-display">--</p>
                  <p className="text-[8px] text-muted uppercase font-display tracking-widest text-center leading-tight">Без датчика</p>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <button onClick={runState === "running" ? pauseRun : startRun} className="w-[80px] h-[80px] rounded-full bg-[#1C2026] flex items-center justify-center active:scale-95 transition-transform">
                  {runState === "running" ? <Pause className="text-white fill-white" size={32} /> : <Play className="text-white fill-white ml-2" size={36} />}
                </button>
                
                <button 
                  onPointerDown={handleStopStart} onPointerUp={handleStopCancel} onPointerLeave={handleStopCancel}
                  className="flex-1 rounded-full bg-[#FF3B4E] flex items-center justify-center gap-3 relative overflow-hidden active:scale-[0.98] transition-transform shadow-[0_0_30px_rgba(255,59,78,0.3)] select-none touch-none"
                >
                  <div className="absolute left-0 top-0 bottom-0 bg-red-700 transition-all duration-75 ease-linear" style={{ width: `${stopProgress}%` }} />
                  <div className="relative z-10 flex items-center gap-3">
                    <Square className="text-white fill-white" size={20} />
                    <span className="font-display text-xl font-bold uppercase tracking-widest text-white">{stopProgress > 0 ? "Удерживайте..." : "Завершить"}</span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
