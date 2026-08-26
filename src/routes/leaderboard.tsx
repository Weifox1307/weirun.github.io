import { createFileRoute } from "@tanstack/react-router";
import { Trophy, RotateCw } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({ component: Leaderboard });

function Leaderboard() {
  const leaders = [
    { id: 1, name: "Roman Bekov", distance: 98.2, isMe: true },
    { id: 2, name: "TEST_USER", distance: 0.0, isMe: false },
    { id: 3, name: "Testoviy_akkaunt", distance: 0.0, isMe: false },
  ];

  return (
    <div className="pb-safe px-4 pt-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase mb-1">Лидеры</h1>
          <p className="text-primary text-xs font-display tracking-widest uppercase">Кто бегает больше всех?</p>
        </div>
        <button className="text-primary p-2"><RotateCw size={20} /></button>
      </div>

      <div className="space-y-3">
        {leaders.map((user, idx) => (
          <div key={user.id} className={`glass-card p-4 flex items-center justify-between ${user.isMe ? 'border-primary/50 bg-primary/5' : ''}`}>
            <div className="flex items-center gap-4">
              <Trophy size={18} className={idx === 0 ? 'text-yellow-500' : 'text-orange-500'} />
              <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden">
                {user.isMe ? <img src="/noise.png" className="opacity-30" alt="" /> : <UserIcon />}
              </div>
              <span className="font-bold text-sm">{user.name}</span>
            </div>
            <div className="text-right">
              <p className="font-display text-xl font-bold text-primary">{user.distance.toFixed(1)}</p>
              <p className="text-[10px] text-muted font-display uppercase tracking-widest mt-0.5">КМ</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7A8490" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>;
}
