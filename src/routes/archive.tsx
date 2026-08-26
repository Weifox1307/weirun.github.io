import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Activity, X, Navigation } from "lucide-react";
import Map, { Source, Layer } from "react-map-gl";
import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { supabase } from "@/lib/supabase";
import { formatDuration, calculatePace, formatDate } from "@/lib/utils";

export const Route = createFileRoute("/archive")({ component: Archive });

function Archive() {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ distance: 0, duration: 0, calories: 0, count: 0 });
  const [selectedRun, setSelectedRun] = useState<any | null>(null);

  useEffect(() => {
    async function loadRuns() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) { setLoading(false); return; }
      
      const { data } = await supabase.from('cloud_runs').select('*').eq('user_id', session.user.id).order('timestamp', { ascending: false });
      if (data) {
        setRuns(data);
        const tDist = data.reduce((a, r) => a + (r.distance_meters || 0), 0);
        const tDur = data.reduce((a, r) => a + (r.duration_seconds || 0), 0);
        const tCal = data.reduce((a, r) => a + (r.calories || 0), 0);
        setStats({ distance: tDist, duration: tDur, calories: tCal, count: data.length });
      }
      setLoading(false);
    }
    loadRuns();
  }, []);

  // Подготовка данных карты для выбранного забега
  const mapData = useMemo(() => {
    if (!selectedRun?.path_points_json) return null;
    try {
      let parsed = typeof selectedRun.path_points_json === 'string' 
        ? JSON.parse(selectedRun.path_points_json) 
        : selectedRun.path_points_json;
        
      if (!Array.isArray(parsed) || parsed.length === 0) return null;

      // Конвертируем объекты Android [{latitude, longitude}] -> в массив [[lon, lat]] для MapLibre
      const coords = parsed.map((p: any) => [
        p.longitude ?? p[0], 
        p.latitude ?? p[1]
      ]);

      if (coords.length === 0) return null;

      return {
        center: { lon: coords[0][0], lat: coords[0][1] },
        geojson: { type: "Feature" as const, properties: {}, geometry: { type: "LineString" as const, coordinates: coords } }
      };
    } catch (e) {
      console.error("Ошибка парсинга трека", e);
      return null;
    }
  }, [selectedRun]);

  const totalKm = (stats.distance / 1000).toFixed(2);
  const avgDist = stats.count > 0 ? ((stats.distance / 1000) / stats.count).toFixed(1) : "0.0";

  return (
    <div className="pb-safe px-4 pt-6 md:pt-12 relative min-h-screen">
      <h1 className="font-display text-4xl font-bold uppercase mb-1">Архив треков</h1>
      <p className="text-primary text-xs font-display tracking-widest uppercase mb-8">Твоя лента побед и рекордов</p>

      {/* МОДАЛКА ДЕТАЛЕЙ */}
      {selectedRun && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto p-4 pt-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase">{selectedRun.title || "Бег на улице"}</h2>
              <p className="text-muted text-xs font-display tracking-widest">{formatDate(selectedRun.timestamp)}</p>
            </div>
            <button onClick={() => setSelectedRun(null)} className="p-2 bg-card rounded-full"><X size={20}/></button>
          </div>
          
          <div className="glass-card p-6 mb-6 bg-[#0A0D12]">
             
             {/* РЕАЛЬНАЯ КАРТА МАРШРУТА */}
             <div className="h-48 rounded-xl overflow-hidden mb-6 relative bg-card/30">
               {mapData ? (
                 <Map
                   mapLib={maplibreGl as any}
                   initialViewState={{ longitude: mapData.center.lon, latitude: mapData.center.lat, zoom: 14 }}
                   style={{ width: "100%", height: "100%" }}
                   mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                   interactive={false}
                 >
                   <Source id="archive-route" type="geojson" data={mapData.geojson as any}>
                     <Layer id="archive-line" type="line" layout={{ "line-join": "round", "line-cap": "round" }} paint={{ "line-color": "#C8F808", "line-width": 4 }} />
                   </Source>
                 </Map>
               ) : (
                 <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-border rounded-xl text-muted">
                   <Navigation size={32} className="mr-2 opacity-50 text-primary"/> 
                   <span className="font-display tracking-widest uppercase text-xs">GPS трек отсутствует</span>
                 </div>
               )}
             </div>
             
             <div className="grid grid-cols-2 gap-6 text-center border-b border-border pb-6 mb-6">
                <div>
                  <p className="text-[10px] text-muted uppercase font-display tracking-widest mb-1">Дистанция</p>
                  <p className="font-display text-5xl font-bold text-primary">{(selectedRun.distance_meters/1000).toFixed(2)} <span className="text-sm text-white">км</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase font-display tracking-widest mb-1">Время</p>
                  <p className="font-display text-4xl font-bold mt-1">{formatDuration(selectedRun.duration_seconds)}</p>
                </div>
             </div>

             <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-[9px] text-muted uppercase font-display tracking-widest mb-1">Темп</p>
                  <p className="font-bold text-sm">{calculatePace(selectedRun.duration_seconds, selectedRun.distance_meters)}</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted uppercase font-display tracking-widest mb-1">Скорость</p>
                  <p className="font-bold text-sm">{selectedRun.avg_speed_kmh?.toFixed(1) || 0} км/ч</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted uppercase font-display tracking-widest mb-1">Калории</p>
                  <p className="font-bold text-sm">{selectedRun.calories || 0}</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted uppercase font-display tracking-widest mb-1">Шаги</p>
                  <p className="font-bold text-sm">{selectedRun.steps || 0}</p>
                </div>
             </div>
          </div>
          
          <div className="text-center mt-8">
            <span className="text-[10px] text-muted uppercase tracking-widest border border-border px-3 py-1 rounded-full">
              Источник: {selectedRun.source || "Неизвестно"}
            </span>
          </div>
        </div>
      )}

      {/* СВОДКА */}
      <div className="glass-card p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div><p className="text-xs text-muted uppercase mb-1">Общий километраж</p><p className="font-display text-5xl font-bold">{totalKm}</p></div>
          <div className="border border-primary text-primary px-3 py-1.5 rounded-full text-xs font-bold bg-background/50">{stats.count} ЗАБЕГОВ</div>
        </div>
        <div className="flex justify-between border-t border-border pt-4 text-center">
          <div className="w-1/2 border-r border-border"><p className="text-[10px] text-muted uppercase mb-1">Сожжено</p><p className="font-bold text-sm">{stats.calories} ккал</p></div>
          <div className="w-1/2"><p className="text-[10px] text-muted uppercase mb-1">Ср. дистанция</p><p className="font-bold text-sm text-primary">{avgDist} км</p></div>
        </div>
      </div>

      {/* СПИСОК */}
      {loading ? <div className="text-center text-muted">Загрузка...</div> : (
        <div className="space-y-4">
          {runs.map((run) => (
            <div key={run.id} onClick={() => setSelectedRun(run)} className="glass-card p-5 border-l-4 border-l-primary cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Activity size={18} /></div>
                  <div><p className="font-bold uppercase tracking-wider text-sm">{run.title || "Бег на улице"}</p><p className="text-xs text-muted mt-0.5">{formatDate(run.timestamp)}</p></div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div><p className="text-[10px] text-muted uppercase mb-1">Дистанция</p><p className="font-display text-3xl font-bold text-primary">{(run.distance_meters/1000).toFixed(2)} <span className="text-sm text-white">км</span></p></div>
                <div className="text-right"><p className="text-[10px] text-muted uppercase mb-1">Время</p><p className="font-display text-xl font-bold">{formatDuration(run.duration_seconds)}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
