import { createFileRoute, useOutletContext } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Activity, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatDuration, calculatePace, formatDate } from "@/lib/utils";
import type { Session } from "@supabase/supabase-js";

export const Route = createFileRoute("/archive")({ component: Archive });

function Archive() {
  const { session } = useOutletContext<{ session: Session | null }>();
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Статистика за всё время
  const [stats, setStats] = useState({ distance: 0, duration: 0, calories: 0, count: 0 });

  useEffect(() => {
    if (!session?.user?.id) return;
    
    async function loadRuns() {
      // Подтягиваем тренировки с сортировкой по времени (свежие сверху)
      const { data } = await supabase
        .from('cloud_runs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('timestamp', { ascending: false });

      if (data) {
        setRuns(data);
        
        // Считаем общую статику
        const totalDist = data.reduce((acc, r) => acc + (r.distance_meters || 0), 0);
        const totalDur = data.reduce((acc, r) => acc + (r.duration_seconds || 0), 0);
        const totalCal = data.reduce((acc, r) => acc + (r.calories || 0), 0);
        setStats({ distance: totalDist, duration: totalDur, calories: totalCal, count: data.length });
      }
      setLoading(false);
    }
    loadRuns();
  }, [session]);

  const totalKm = (stats.distance / 1000).toFixed(2);
  const avgDist = stats.count > 0 ? ((stats.distance / 1000) / stats.count).toFixed(1) : "0.0";

  return (
    <div className="pb-safe px-4 pt-6 md:pt-12 relative min-h-screen">
      <h1 className="font-display text-4xl font-bold uppercase mb-1">Архив треков</h1>
      <p className="text-primary text-xs font-display tracking-widest uppercase mb-8">Твоя лента побед и рекордов</p>

      {/* Карточка суммарной статистики */}
      <div className="glass-card p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <p className="text-xs text-muted font-display tracking-widest uppercase mb-1">Общий километраж</p>
            <p className="font-display text-5xl font-bold">{totalKm}</p>
          </div>
          <div className="border border-primary text-primary px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold bg-background/50">
            <Activity size={14} /> {stats.count} ЗАБЕГОВ
          </div>
        </div>

        <div className="flex justify-between border-t border-border pt-4 text-center relative z-10">
          <div className="w-1/2 border-r border-border">
            <p className="text-[10px] text-muted font-display tracking-widest uppercase mb-1">Сожжено</p>
            <p className="font-bold text-sm">{stats.calories} ккал</p>
          </div>
          <div className="w-1/2">
            <p className="text-[10px] text-muted font-display tracking-widest uppercase mb-1">Средняя дистанция</p>
            <p className="font-bold text-sm text-primary">{avgDist} км</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-muted">Синхронизация треков...</div>
      ) : runs.length === 0 ? (
        <div className="text-center text-muted mt-10">У вас пока нет сохраненных забегов.</div>
      ) : (
        <div className="space-y-4">
          {runs.map((run) => {
            const km = (run.distance_meters / 1000).toFixed(2);
            return (
              <div key={run.id} className="glass-card p-5 border-l-4 border-l-primary cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Activity size={18} />
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-wider text-sm">{run.title || "Бег на улице"}</p>
                      <p className="text-xs text-muted mt-0.5">{formatDate(run.timestamp)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-[10px] text-muted font-display tracking-widest uppercase mb-1">Дистанция</p>
                    <p className="font-display text-3xl font-bold text-primary">{km} <span className="text-sm text-white">км</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted font-display tracking-widest uppercase mb-1">Время</p>
                    <p className="font-display text-xl font-bold">{formatDuration(run.duration_seconds)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 border-t border-border pt-4">
                  <div>
                    <p className="text-[9px] text-muted uppercase mb-1">Темп</p>
                    <p className="font-bold text-xs">{calculatePace(run.duration_seconds, run.distance_meters)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted uppercase mb-1">Скорость</p>
                    <p className="font-bold text-xs">{run.avg_speed_kmh?.toFixed(1) || 0} км/ч</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted uppercase mb-1">Калории</p>
                    <p className="font-bold text-xs">{run.calories || 0} ккал</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted uppercase mb-1">Шаги</p>
                    <p className="font-bold text-xs">{run.steps || 0}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Плавающая кнопка для добавления трека вручную / загрузки GPX */}
      <button className="fixed md:absolute bottom-[100px] md:bottom-10 right-4 md:right-0 w-16 h-16 bg-primary rounded-full shadow-[0_0_20px_rgba(200,248,8,0.3)] flex items-center justify-center text-black active:scale-95 transition-transform z-40">
        <Plus size={32} />
      </button>
    </div>
  );
}
