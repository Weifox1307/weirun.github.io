import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Navigation, CloudLightning, Sun, Cloud, CloudRain } from "lucide-react";
import Map, { Marker } from "react-map-gl";
import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [city, setCity] = useState<string>("Определение...");
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"Поиск" | "Готов" | "Ошибка">("Поиск");

  useEffect(() => {
    // 1. Получаем реальную геопозицию пользователя
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setLocation({ lat, lon });
          setGpsStatus("Готов");
          fetchCityAndWeather(lat, lon);
        },
        (err) => {
          console.error(err);
          setGpsStatus("Ошибка");
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setGpsStatus("Ошибка");
    }
  }, []);

  // 2. Получаем реальный город и погоду по координатам (Бесплатные API без ключей)
  const fetchCityAndWeather = async (lat: number, lon: number) => {
    try {
      // Город (OpenStreetMap Nominatim)
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&accept-language=ru`);
      const geoData = await geoRes.json();
      setCity(geoData.address.city || geoData.address.town || geoData.address.state || "Неизвестно");

      // Погода (Open-Meteo)
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const weatherData = await weatherRes.json();
      setWeather({
        temp: Math.round(weatherData.current_weather.temperature),
        code: weatherData.current_weather.weathercode
      });
    } catch (error) {
      console.error("Ошибка загрузки данных API", error);
    }
  };

  // Иконка погоды в зависимости от кода
  const WeatherIcon = () => {
    if (!weather) return <CloudLightning className="text-primary mb-1" size={24} />;
    if (weather.code === 0) return <Sun className="text-yellow-400 mb-1" size={24} />;
    if (weather.code > 0 && weather.code <= 3) return <Cloud className="text-gray-300 mb-1" size={24} />;
    return <CloudRain className="text-blue-400 mb-1" size={24} />;
  };

  // Красивый темный стиль карты (CartoDB Dark Matter)
  const mapStyle = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

  return (
    <div className="min-h-screen pb-safe relative overflow-hidden bg-background">
      
      {/* Карта на заднем фоне */}
      <div className="absolute inset-0 z-0">
        {location ? (
          <Map
            mapLib={maplibreGl}
            initialViewState={{ longitude: location.lon, latitude: location.lat, zoom: 14 }}
            mapStyle={mapStyle}
            interactive={false} // Запрещаем двигать карту на стартовом экране
          >
            <Marker longitude={location.lon} latitude={location.lat} anchor="center">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
            </Marker>
          </Map>
        ) : (
          <div className="w-full h-full map-bg" />
        )}
        {/* Градиентное затемнение карты снизу и сверху, чтобы текст читался */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-transparent to-background/90 pointer-events-none" />
      </div>

      {/* Интерфейс поверх карты */}
      <div className="relative z-10 px-4 pt-6 h-full flex flex-col">
        
        {/* Приветствие и Погода */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-white drop-shadow-md text-sm mb-1">Доброй ночи, Атлет 👋</p>
            <h1 className="font-display text-3xl font-bold uppercase drop-shadow-lg text-white">Готов к старту?</h1>
            <div className="flex items-center gap-2 mt-4 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full w-max backdrop-blur-md">
              <div className={`w-2 h-2 rounded-full ${gpsStatus === 'Готов' ? 'bg-primary' : 'bg-red-500'} animate-pulse`} />
              <span className="text-xs font-display tracking-widest text-white/80 uppercase">
                GPS: {gpsStatus}
              </span>
            </div>
          </div>
          <div className="bg-black/60 border border-white/10 p-3 rounded-2xl backdrop-blur-md flex flex-col items-center">
            <WeatherIcon />
            <span className="font-bold text-white">{weather ? `${weather.temp}°C` : '--°C'}</span>
            <span className="text-[10px] text-white/60 uppercase text-center max-w-[80px] truncate">
              {city}
            </span>
          </div>
        </div>

        {/* Центральная кнопка старта */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
          <div className="flex justify-between w-full max-w-[400px] px-6 mb-8">
            <div className="bg-black/60 border border-white/10 p-4 rounded-2xl backdrop-blur-md w-[46%] shadow-xl">
              <p className="text-[10px] text-white/60 uppercase font-display tracking-widest mb-1">Всего преодолено</p>
              <p className="font-display text-2xl font-bold text-white">98.2 <span className="text-sm text-white/60">км</span></p>
            </div>
            <div className="bg-black/60 border border-white/10 p-4 rounded-2xl backdrop-blur-md w-[46%] shadow-xl">
              <p className="text-[10px] text-white/60 uppercase font-display tracking-widest mb-1">Средний темп</p>
              <p className="font-display text-2xl font-bold text-white">4:41 <span className="text-sm text-white/60">/км</span></p>
            </div>
          </div>

          <button className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-primary flex flex-col items-center justify-center shadow-[0_0_80px_rgba(200,248,8,0.4)] active:scale-95 transition-transform border-[8px] border-primary/20 relative cursor-pointer">
            <div className="absolute inset-0 rounded-full border border-primary/50 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <Play className="text-black ml-3 mb-2 fill-black" size={48} />
            <span className="text-black font-display text-3xl font-bold uppercase tracking-widest">Старт</span>
          </button>
        </div>

        {/* Плашка последнего забега */}
        <div className="absolute bottom-[90px] md:bottom-[110px] left-4 right-4 max-w-[500px] mx-auto">
          <div className="bg-black/70 border border-white/10 p-4 rounded-2xl backdrop-blur-xl flex items-center justify-between cursor-pointer hover:bg-black/80 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center text-primary bg-primary/10">
                <Navigation size={20} />
              </div>
              <div>
                <p className="text-[10px] text-primary uppercase font-display tracking-widest mb-0.5">Последний забег</p>
                <p className="font-bold text-white text-sm">7,15 км — 41:54</p>
              </div>
            </div>
            <div className="text-white/40">{'>'}</div>
          </div>
        </div>

      </div>
    </div>
  );
}
