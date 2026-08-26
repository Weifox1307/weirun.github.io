import { createFileRoute, useOutletContext } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Play, Square, Navigation, CloudLightning, Sun, Cloud, CloudRain } from "lucide-react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { supabase } from "@/lib/supabase";
import { getDistanceMeters, formatDuration, calculatePace } from "@/lib/utils";
import type { Session } from "@supabase/supabase-js";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const { session } = useOutletContext<{ session: Session | null }>();
  
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [city, setCity] = useState("Определение...");
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"Поиск" | "Готов" | "Ошибка">("Поиск");

  const [isRecording, setIsRecording] = useState(false);
  const [path, setPath] = useState<number[][]>([]); 
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [lastRun, setLastRun] = useState<any>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      supabase.from('cloud_runs').select('*').eq('user_id', session.user.id).order('timestamp', { ascending: false }).limit(1)
        .then(({ data }) => { if (data && data.length > 0) setLastRun(data[0]); });
    }

    if ("geolocation" in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setLocation({ lat, lon });
          setGpsStatus("Готов");
          
          if (!weather) fetchCityAndWeather(lat, lon); 

          if (isRecording) {
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
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, session?.user?.id, weather]);

  const fetchCityAndWeather = async (lat: number, lon: number) => {
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
      const geoData = await geoRes.json();
      setCity(geoData.address?.city || geoData.address?.town || "Город");
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const weatherData = await weatherRes.json();
      setWeather({ temp: Math.round(weatherData.current_weather.temperature), code: weatherData.current_weather.weathercode });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      setPath(location ? [[location.lon, location.lat]] : []);
      setDistanceMeters(0);
      setDurationSec(0);
      timerRef.current = setInterval(() => setDurationSec(s => s + 1), 1000);
    } else {
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      
      if (distanceMeters > 50 && session?.user?.id) {
        const newRun = {
          id: crypto.randomUUID(),
          user_id: session.user.id,
          timestamp: Date.now(),
          duration_seconds: durationSec,
          distance_meters: Math.round(distanceMeters),
          title: "Бег на улице",
          path_points_json: JSON.stringify(path),
          source: "web_pwa"
        };
        await supabase.from('cloud_runs').insert(newRun);
        setLastRun(newRun);
        alert("Тренировка сохранена!");
      } else {
        alert("Дистанция слишком мала для сохранения.");
      }
      setPath([]);
    }
  };

  const geojsonLine = { 
    type: "Feature" as const, 
    properties: {}, 
    geometry: { type: "LineString" as const, coordinates: path } 
  };

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        {location ? (
          <Map
            mapLib={maplibreGl as any}
            initialViewState={{ longitude: location.lon, latitude: location.lat, zoom: 15 }}
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
          <div className="w-full h-full bg-[#0A0D12] flex items-center justify-center text-muted">Поиск GPS...</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-transparent to-background/90 pointer-events-none" />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between pt-[80px] pb-[100px] px-4">
        <div className="flex justify-between items-start pointer-events-auto">
          <div>
            <p className="text-white drop-shadow-md text-sm mb-1">Доброй ночи, Атлет 👋</p>
            <h1 className="font-display text-3xl font-bold uppercase drop-shadow-lg text-white">
              {isRecording ? "ТРЕНИРОВКА ИДЕТ" : "ГОТОВ К СТАРТУ?"}
            </h1>
            <div className="flex items-center gap-2 mt-4 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full w-max backdrop-blur-md">
              <div className={`w-2 h-2 rounded-full ${gpsStatus === 'Готов' ? 'bg-primary' : 'bg-red-500'} animate-pulse`} />
              <span className="text-xs font-display tracking-widest text-white/80 uppercase">GPS: {gpsStatus}</span>
            </div>
          </div>
          <div className="bg-black/60 border border-white/10 p-3 rounded-2xl backdrop-blur-md flex flex-col items-center">
            {weather?.code === 0 ? <Sun className="text-yellow-400 mb-1" size={24} /> : <CloudLightning className="text-primary mb-1" size={24} />}
            <span className="font-bold text-white">{weather ? `${weather.temp}°C` : '--°C'}</span>
            <span className="text-[10px] text-white/60 uppercase text-center max-w-[80px] truncate">{city}</span>
          </div>
        </div>

        <div className="flex flex-col items-center pointer-events-auto w-full max-w-[500px] mx-auto">
          {isRecording ? (
            <div className="flex justify-between w-full px-2 mb-8">
              <div className="bg-black/80 border border-white/10 p-4 rounded-2xl backdrop-blur-md w-[31%] text-center">
                <p className="text-[10px] text-primary uppercase font-display tracking-widest mb-1">Дистанция</p>
                <p className="font-display text-2xl font-bold text-white">{(distanceMeters/1000).toFixed(2)}</p>
              </div>
              <div className="bg-black/80 border border-white/10 p-4 rounded-2xl backdrop-blur-md w-[31%] text-center">
                <p className="text-[10px] text-primary uppercase font-display tracking-widest mb-1">Время</p>
                <p className="font-display text-2xl font-bold text-white">{formatDuration(durationSec)}</p>
              </div>
              <div className="bg-black/80 border border-white/10 p-4 rounded-2xl backdrop-blur-md w-[31%] text-center">
                <p className="text-[10px] text-primary uppercase font-display tracking-widest mb-1">Темп</p>
                <p className="font-display text-2xl font-bold text-white">{calculatePace(durationSec, distanceMeters)}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-between w-full px-6 mb-8">
              <div className="bg-black/60 border border-white/10 p-4 rounded-2xl backdrop-blur-md w-[46%] shadow-xl">
                <p className="text-[10px] text-white/60 uppercase font-display tracking-widest mb-1">Последняя дистанция</p>
                <p className="font-display text-2xl font-bold text-white">{lastRun ? (lastRun.distance_meters/1000).toFixed(2) : "0.0"} <span className="text-sm">км</span></p>
              </div>
              <div className="bg-black/60 border border-white/10 p-4 rounded-2xl backdrop-blur-md w-[46%] shadow-xl">
                <p className="text-[10px] text-white/60 uppercase font-display tracking-widest mb-1">Время</p>
                <p className="font-display text-2xl font-bold text-white">{lastRun ? formatDuration(lastRun.duration_seconds) : "00:00"}</p>
              </div>
            </div>
          )}

          <button 
            onClick={toggleRecording}
            className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center active:scale-95 transition-all border-[6px] relative cursor-pointer mb-6 ${
              isRecording 
                ? 'bg-red-500 border-red-500/30 shadow-[0_0_60px_rgba(239,68,68,0.5)]' 
                : 'bg-primary border-primary/30 shadow-[0_0_60px_rgba(200,248,8,0.4)]'
            }`}
          >
            {isRecording && <div className="absolute inset-0 rounded-full border border-red-500/50 animate-ping" />}
            {!isRecording && <div className="absolute inset-0 rounded-full border border-primary/50 animate-ping" />}
            
            {isRecording ? <Square className="text-white fill-white mb-1" size={32} /> : <Play className="text-black fill-black ml-2 mb-1" size={36} />}
            <span className={`font-display text-xl font-bold uppercase tracking-widest ${isRecording ? 'text-white' : 'text-black'}`}>
              {isRecording ? "СТОП" : "СТАРТ"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
