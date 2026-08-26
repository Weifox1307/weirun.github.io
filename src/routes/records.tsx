import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trophy, Zap, Clock, History } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatDuration } from "@/lib/utils";

export const Route = createFileRoute("/records")({ component: Records });

function Records() {
  const [maxDist, setMaxDist] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        supabase.from('cloud_runs')
          .select('distance_meters')
          .eq('user_id', session.user.id)
          .order('distance_meters', { ascending: false })
          .limit(1)
          .then(({ data }) => {
            if (data && data.length > 0) setMaxDist(data[0].distance_meters);
          });
      }
    });
  }, []);

  return (
    <div className="pb-safe px-4 pt-6 md:pt-12 min-h-screen">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase mb-1">Рекорды</h1>
          <p className="text-primary text-xs font-display tracking-widest uppercase">Личные достижения</p>
        </div>
        <div className="w-14 h-14 rounded-full border border-primary flex flex-col items-center justify-center text-primary">
          <span className="text-[8px] font-display uppercase tracking-widest">LVL</span>
          <span className="font-bold text-xl leading-none mt-0.5">1</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Максимальная дистанция */}
        <div className="glass-card p-5 border-l-4 border-l-primary flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
            <Trophy size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] text-muted font-display tracking-widest uppercase">Максимальная дистанция</p>
              <span className="bg-primary text-black text-[9px] font-bold px-1.5 py-0.5 rounded">TOP</span>
            </div>
            <p className="font-display text-3xl font-bold">{(maxDist / 1000).toFixed(2)} <span className="text-lg">км</span></p>
            <p className="text-[10px] text-primary mt-1">Детали рекорда →</p>
          </div>
        </div>

        {/* Лучшее время */}
        {[
          { icon: Zap, title: "Самый быстрый 1 КМ", val: "03:11" },
          { icon: Clock, title: "Лучшие 5 КМ", val: "15:56" },
          { icon: Clock, title: "Лучшие 10 КМ", val: "37:41" },
          { icon: History, title: "Полумарафон (21.1 КМ)", val: "01:24:15" },
        ].map((rec, i) => (
          <div key={i} className="glass-card p-5 flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-8 flex justify-center text-primary"><rec.icon size={24} /></div>
              <div>
                <p className="text-[10px] text-muted font-display tracking-widest uppercase mb-1">{rec.title}</p>
                <p className="font-display text-2xl font-bold">{rec.val}</p>
                <p className="text-[10px] text-primary mt-1">Детали рекорда →</p>
              </div>
            </div>
            <Trophy size={28} className="text-border" />
          </div>
        ))}
      </div>
    </div>
  );
}
