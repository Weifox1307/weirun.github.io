import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, X, Navigation } from "lucide-react";
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

  const totalKm = (stats.distance / 1000).toFixed(2);
  const avgDist = stats.count > 0 ? ((stats.distance / 1000) / stats.count).toFixed(1) : "0.0";

  return (
    <div className="pb-safe px-4 pt-6 md:pt-12 relative min-h-screen">
      <h1 className="font-display text-4xl font-bold uppercase mb-1">Архив треков</h1>
      <p className="text-primary text-xs font-display tracking-widest uppercase mb-8">Твоя лента побед и рекордов</p>

      {/* Модалка деталей трека */}
      {selectedRun && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto p-4 pt-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-2xl font-bold uppercase">{selectedRun.title || "Бег на улице"}</h2>
            <button onClick={() => setSelectedRun(null)} className="p-2 bg-card rounded-full"><X size={20}/></button>
          </div>
          
          {/* Детали (Здесь можно вставить мини-карту с MapLibre, если есть path_points_json) */}
          <div className="glass-card p-6 mb-6 bg-[#0A0D12]">
             <div className="flex items-center justify-center h-40 border-2 border-dashed border-border rounded-xl text-muted mb-6">
                <Navigation size={32} className="mr-2 opacity-50"/> 
                {selectedRun.path_points_json ? "Карта маршрута" : "GPS трек отсутствует"}
             </div>
             
             <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-xs text-muted uppercase font-display tracking-widest">Дистанция</p>
                  <p className="font-display text-4xl font-bold text-primary">{(selectedRun.distance_meters/1000).toFixed(2)} <span className="text-sm text-white">км</span></p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase font-display tracking-widest">Время</p>
                  <p className="font-display text-4xl font-bold">{formatDuration(selectedRun.duration_seconds)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase font-display tracking-widest">Темп</p>
                  <p className="font-display text-2xl font-bold">{calculatePace(selectedRun.duration_seconds, selectedRun.distance_meters)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase font-display tracking-widest">Калории</p>
                  <p className="font-display text-2xl font-bold">{selectedRun.calories || 0} ккал</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Сводка */}
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

      {/* Список */}
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
