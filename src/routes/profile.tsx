import { createFileRoute, useOutletContext, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Camera, Zap, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { calculateAge, calculatePace } from "@/lib/utils";
import type { Session } from "@supabase/supabase-js";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const { session } = useOutletContext<{ session: Session | null }>();
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(null);
  const [avgPace, setAvgPace] = useState("0:00");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    
    async function loadData() {
      // 1. Грузим профиль
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(prof);

      // 2. Считаем средний темп из всех треков
      const { data: runs } = await supabase.from('cloud_runs')
        .select('distance_meters, duration_seconds')
        .eq('user_id', session.user.id);
        
      if (runs && runs.length > 0) {
        const totalDist = runs.reduce((acc, run) => acc + (run.distance_meters || 0), 0);
        const totalDur = runs.reduce((acc, run) => acc + (run.duration_seconds || 0), 0);
        setAvgPace(calculatePace(totalDur, totalDist));
      }
      setLoading(false);
    }
    
    loadData();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: '/login' });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Загрузка профиля...</div>;

  const totalKm = ((profile?.total_distance_meters || 0) / 1000).toFixed(1);

  return (
    <div className="pb-safe px-4 pt-6 md:pt-12">
      <div className="flex justify-end mb-4">
        <button onClick={handleLogout} className="text-muted flex items-center gap-2 text-sm hover:text-red-500 transition-colors">
          <LogOut size={16} /> Выйти
        </button>
      </div>

      {/* Аватар и Имя */}
      <div className="flex flex-col items-center mb-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full border-[3px] border-primary p-1 overflow-hidden bg-card">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} className="w-full h-full object-cover rounded-full" alt="" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-muted font-bold">
                {profile?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center border-4 border-background text-black cursor-pointer">
            <Camera size={18} />
          </button>
        </div>
        
        <h1 className="text-2xl font-bold mb-3 text-center">{profile?.name || "Атлет Weirun"}</h1>
        
        <div className="border border-primary text-primary px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-display tracking-widest uppercase">
          <Zap size={14} className="fill-primary" />
          {profile?.user_role === 'coach' ? "Тренер" : "Level 1 Athlete"}
        </div>
      </div>

      {/* Главная статистика */}
      <div className="glass-card p-6 grid grid-cols-3 divide-x divide-border mb-8 text-center">
        <div>
          <p className="font-display text-3xl font-bold">{totalKm} <span className="text-sm text-muted">км</span></p>
          <p className="text-[10px] text-primary uppercase font-display tracking-widest mt-1">Дистанция</p>
        </div>
        <div>
          <p className="font-display text-3xl font-bold">{profile?.total_run_count || 0}</p>
          <p className="text-[10px] text-primary uppercase font-display tracking-widest mt-1">Забеги</p>
        </div>
        <div>
          <p className="font-display text-3xl font-bold">{avgPace}</p>
          <p className="text-[10px] text-primary uppercase font-display tracking-widest mt-1">Ср. темп</p>
        </div>
      </div>

      {/* Физические показатели */}
      <h3 className="text-xs font-display tracking-widest text-muted uppercase mb-3">Физические показатели</h3>
      <div className="glass-card p-6 flex justify-between">
        <div>
          <p className="text-[10px] text-muted uppercase mb-1 flex items-center gap-1">Вес</p>
          <p className="font-bold text-lg">{profile?.weight || "--"} кг</p>
        </div>
        <div>
          <p className="text-[10px] text-muted uppercase mb-1 flex items-center gap-1">Рост</p>
          <p className="font-bold text-lg">{profile?.height || "--"} см</p>
        </div>
        <div>
          <p className="text-[10px] text-muted uppercase mb-1 flex items-center gap-1">Возраст</p>
          <p className="font-bold text-lg">{calculateAge(profile?.birth_date)} л.</p>
        </div>
      </div>
    </div>
  );
}
