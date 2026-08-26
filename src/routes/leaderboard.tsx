import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/leaderboard")({ component: Leaderboard });

function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);

  const fetchLeaders = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, total_distance')
      .order('total_distance', { ascending: false })
      .limit(50);
    if (data) setLeaders(data);
  };

  useEffect(() => {
    fetchLeaders();
    // Realtime подписка на изменения (Supabase Realtime)
    const channel = supabase.channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchLeaders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="pt-safe px-6 py-8 pb-24">
      <h1 className="text-3xl font-display font-bold uppercase mb-2">Рейтинг</h1>
      <p className="text-muted mb-6 text-sm">Топ атлетов по километражу. Обновляется в реальном времени.</p>
      
      <div className="space-y-3">
        {leaders.map((user, index) => (
          <div key={user.id} className="flex items-center justify-between bg-card p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-4">
              <span className={`font-display text-xl font-bold w-6 ${index < 3 ? 'text-primary' : 'text-muted'}`}>
                {index + 1}
              </span>
              <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-sm">
                {user.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="font-medium">{user.full_name || 'Атлет'}</span>
            </div>
            <span className="font-display text-xl font-bold">{user.total_distance?.toFixed(1) || 0} км</span>
          </div>
        ))}
      </div>
    </div>
  );
}
