import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trophy, RotateCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/leaderboard")({ component: Leaderboard });

function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchLeaders = async () => {
    setRefreshing(true);
    const { data } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, total_distance_meters')
      .order('total_distance_meters', { ascending: false })
      .limit(50);
      
    if (data) setLeaders(data);
    setTimeout(() => setRefreshing(false), 500); 
  };

  useEffect(() => {
    // Узнаем ID текущего пользователя
    supabase.auth.getSession().then(({ data }) => {
      setCurrentUserId(data.session?.user?.id || null);
    });
    
    fetchLeaders();

    const channel = supabase.channel('leaderboard_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchLeaders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="pb-safe px-4 pt-6 md:pt-12 min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase mb-1">Лидеры</h1>
          <p className="text-primary text-xs font-display tracking-widest uppercase">Кто бегает больше всех?</p>
        </div>
        <button 
          onClick={fetchLeaders} 
          className={`text-primary p-2 cursor-pointer ${refreshing ? 'animate-spin' : ''}`}
        >
          <RotateCw size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {leaders.length === 0 && <p className="text-center text-muted">Загрузка рейтинга...</p>}
        
        {leaders.map((user, idx) => {
          const isMe = currentUserId === user.id;
          const km = ((user.total_distance_meters || 0) / 1000).toFixed(1);
          
          return (
            <div 
              key={user.id} 
              className={`glass-card p-4 flex items-center justify-between transition-colors ${
                isMe ? 'border-primary/60 bg-primary/10 shadow-[0_0_15px_rgba(200,248,8,0.1)]' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-6 flex justify-center">
                  <Trophy size={18} className={idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-600' : 'text-muted'} />
                </div>
                
                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <span className="font-bold text-muted">{user.name?.charAt(0)?.toUpperCase() || "?"}</span>
                  )}
                </div>
                
                <span className={`font-bold text-sm ${isMe ? 'text-primary' : 'text-white'}`}>
                  {user.name || "Аноним"}
                  {isMe && <span className="ml-2 text-[10px] bg-primary text-black px-1.5 py-0.5 rounded font-black">ВЫ</span>}
                </span>
              </div>
              
              <div className="text-right">
                <p className="font-display text-xl font-bold text-primary">{km}</p>
                <p className="text-[10px] text-muted font-display uppercase tracking-widest mt-0.5">КМ</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
