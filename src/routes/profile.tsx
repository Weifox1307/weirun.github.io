import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Camera, Zap, LogOut, Edit2, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { calculateAge, calculatePace } from "@/lib/utils";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [avgPace, setAvgPace] = useState("0:00");
  const [loading, setLoading] = useState(true);
  
  // Состояния редактирования
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ weight: 0, height: 0, birth_year: 2000, name: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) { setLoading(false); return; }
      
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(prof);
      setEditForm({ 
        weight: prof?.weight || 0, 
        height: prof?.height || 0, 
        name: prof?.name || "",
        birth_year: prof?.birth_date ? new Date(prof.birth_date).getFullYear() : 2000 
      });

      const { data: runs } = await supabase.from('cloud_runs').select('distance_meters, duration_seconds').eq('user_id', session.user.id);
      if (runs && runs.length > 0) {
        const totalDist = runs.reduce((a, r) => a + (r.distance_meters || 0), 0);
        const totalDur = runs.reduce((a, r) => a + (r.duration_seconds || 0), 0);
        setAvgPace(calculatePace(totalDur, totalDist));
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Загрузка аватарки
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
    
    // Загружаем в Storage
    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
    if (uploadError) { alert("Ошибка загрузки: " + uploadError.message); return; }
    
    // Получаем публичную ссылку
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
    
    // Обновляем профиль
    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id);
    setProfile({ ...profile, avatar_url: publicUrl });
  };

  // Сохранение текстовых данных
  const saveProfile = async () => {
    if (!profile) return;
    const birth_date = new Date(editForm.birth_year, 0, 1).getTime(); // Упрощенно: 1 января года
    const updates = { name: editForm.name, weight: editForm.weight, height: editForm.height, birth_date };
    
    await supabase.from('profiles').update(updates).eq('id', profile.id);
    setProfile({ ...profile, ...updates });
    setIsEditing(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.navigate({ to: '/login' }); };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Загрузка профиля...</div>;

  const totalKm = ((profile?.total_distance_meters || 0) / 1000).toFixed(1);

  return (
    <div className="pb-safe px-4 pt-6 md:pt-12">
      <div className="flex justify-end mb-4 gap-4">
        {isEditing ? (
          <>
            <button onClick={() => setIsEditing(false)} className="text-muted"><X size={20} /></button>
            <button onClick={saveProfile} className="text-primary"><Check size={20} /></button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="text-muted hover:text-white"><Edit2 size={16} /></button>
            <button onClick={handleLogout} className="text-muted hover:text-red-500"><LogOut size={16} /></button>
          </>
        )}
      </div>

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
          <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center border-4 border-background text-black cursor-pointer">
            <Camera size={18} />
          </button>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleAvatarUpload} />
        </div>
        
        {isEditing ? (
          <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="bg-card border border-border rounded px-3 py-1 text-center text-xl font-bold mb-3 outline-none focus:border-primary" />
        ) : (
          <h1 className="text-2xl font-bold mb-3 text-center">{profile?.name || "Атлет Weirun"}</h1>
        )}
        
        <div className="border border-primary text-primary px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-display tracking-widest uppercase">
          <Zap size={14} className="fill-primary" />
          Level 1 Athlete
        </div>
      </div>

      <div className="glass-card p-6 grid grid-cols-3 divide-x divide-border mb-8 text-center">
        <div><p className="font-display text-3xl font-bold">{totalKm}</p><p className="text-[10px] text-primary uppercase mt-1">Дистанция</p></div>
        <div><p className="font-display text-3xl font-bold">{profile?.total_run_count || 0}</p><p className="text-[10px] text-primary uppercase mt-1">Забеги</p></div>
        <div><p className="font-display text-3xl font-bold">{avgPace}</p><p className="text-[10px] text-primary uppercase mt-1">Ср. темп</p></div>
      </div>

      <h3 className="text-xs font-display tracking-widest text-muted uppercase mb-3">Физические показатели</h3>
      <div className="glass-card p-6 flex justify-between">
        <div className="flex flex-col items-center">
          <p className="text-[10px] text-muted uppercase mb-1">Вес</p>
          {isEditing ? <input type="number" value={editForm.weight} onChange={e => setEditForm({...editForm, weight: Number(e.target.value)})} className="w-16 bg-transparent border-b border-primary text-center font-bold text-lg outline-none" /> : <p className="font-bold text-lg">{profile?.weight || "--"} кг</p>}
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[10px] text-muted uppercase mb-1">Рост</p>
          {isEditing ? <input type="number" value={editForm.height} onChange={e => setEditForm({...editForm, height: Number(e.target.value)})} className="w-16 bg-transparent border-b border-primary text-center font-bold text-lg outline-none" /> : <p className="font-bold text-lg">{profile?.height || "--"} см</p>}
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[10px] text-muted uppercase mb-1">Г. рожд.</p>
          {isEditing ? <input type="number" value={editForm.birth_year} onChange={e => setEditForm({...editForm, birth_year: Number(e.target.value)})} className="w-16 bg-transparent border-b border-primary text-center font-bold text-lg outline-none" /> : <p className="font-bold text-lg">{calculateAge(profile?.birth_date)} л.</p>}
        </div>
      </div>
    </div>
  );
}
