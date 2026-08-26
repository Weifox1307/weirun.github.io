import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LogOut, Activity } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Запрос к таблице profiles в Supabase
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data || { full_name: user.email, total_distance: 0, total_runs: 0 });
      }
    }
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/login" });
  };

  if (!profile) return <div className="flex h-screen items-center justify-center">Загрузка...</div>;

  return (
    <div className="pt-safe px-6 py-8 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold uppercase">Профиль</h1>
        <button onClick={handleLogout} className="p-2 bg-card rounded-full text-danger"><LogOut size={20}/></button>
      </div>

      <div className="glass rounded-3xl p-6 flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4 border-2 border-primary">
          <span className="text-3xl text-primary font-bold">{profile.full_name?.charAt(0).toUpperCase()}</span>
        </div>
        <h2 className="text-xl font-bold">{profile.full_name}</h2>
        <p className="text-muted text-sm uppercase tracking-widest mt-1">Runner ID: #{profile.id?.substring(0,6)}</p>
      </div>

      <h3 className="font-display text-xl uppercase text-primary mb-4">Статистика</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-2xl border border-border">
          <Activity className="text-primary mb-2" size={24} />
          <p className="text-sm text-muted uppercase">Километраж</p>
          <p className="text-3xl font-bold font-display">{profile.total_distance?.toFixed(1) || 0} <span className="text-lg">км</span></p>
        </div>
        <div className="bg-card p-4 rounded-2xl border border-border">
          <TrophyIcon className="text-primary mb-2" size={24} />
          <p className="text-sm text-muted uppercase">Забеги</p>
          <p className="text-3xl font-bold font-display">{profile.total_runs || 0}</p>
        </div>
      </div>
    </div>
  );
}

function TrophyIcon(props: any) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .172.16.0.4 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
}
