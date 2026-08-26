import { createFileRoute } from "@tanstack/react-router";
import { Medal, Flag, Flame, Diamond } from "lucide-react";

export const Route = createFileRoute("/awards")({ component: Awards });

function Awards() {
  return (
    <div className="pb-safe px-4 pt-6 md:pt-12 min-h-screen">
      <h1 className="font-display text-4xl font-bold uppercase mb-1">Зал славы</h1>
      <p className="text-primary text-xs font-display tracking-widest uppercase mb-8">Твои беговые достижения</p>

      {/* Ранг */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border border-primary text-primary flex items-center justify-center bg-primary/10">
              <Medal size={24} />
            </div>
            <div>
              <p className="font-display text-2xl font-bold uppercase">Ранг 7</p>
              <p className="text-xs text-muted uppercase font-display tracking-widest">Опыт достижений: 3210 XP</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display text-xl font-bold text-primary">11 / 20</p>
            <p className="text-[10px] text-muted uppercase font-display tracking-widest mt-1">Наград</p>
          </div>
        </div>
        
        <div className="flex gap-1 mb-3">
          <div className="h-2 w-1/2 bg-primary rounded-full" />
          <div className="h-2 w-1/2 bg-card border border-border rounded-full" />
        </div>
        <p className="text-[9px] text-center text-muted uppercase font-display tracking-widest">Получайте награды для повышения ранга</p>
      </div>

      {/* Следующий рубеж */}
      <p className="text-[10px] text-muted uppercase font-display tracking-widest mb-2 px-2">Следующий рубеж</p>
      <div className="glass-card p-6 border-cyan-500/30 bg-cyan-500/5 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="font-bold text-lg mb-1">ДИСТАНЦИЯ 250 КМ</p>
            <p className="text-xs text-muted">Преодолей суммарно 250 километров.</p>
          </div>
          <Flag size={32} className="text-cyan-400" />
        </div>
        <div className="flex gap-1">
          <div className="h-2 w-1/3 bg-cyan-400 rounded-full" />
          <div className="h-2 w-2/3 bg-card border border-border rounded-full" />
        </div>
      </div>

      {/* Табы */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        <button className="bg-primary text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap"><Medal size={14}/> Все</button>
        <button className="bg-card border border-border text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap"><Flag size={14}/> Дистанция</button>
        <button className="bg-card border border-border text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap"><Flame size={14}/> Серии дней</button>
      </div>

      {/* Сетка наград */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { icon: Flag, title: "1 КМ", color: "text-muted" },
          { icon: Flag, title: "5 КМ", color: "text-muted" },
          { icon: Flag, title: "10 КМ", color: "text-muted" },
          { icon: Flag, title: "25 КМ", color: "text-muted" },
          { icon: Flag, title: "50 КМ", color: "text-cyan-400", active: true },
          { icon: Flag, title: "100 КМ", color: "text-cyan-400", active: true },
          { icon: Flame, title: "1 день", color: "text-white", active: true },
          { icon: Flame, title: "3 дня", color: "text-white", active: true },
          { icon: Flame, title: "7 дней", color: "text-cyan-400", active: true },
        ].map((award, i) => (
          <div key={i} className={`glass-card p-4 flex flex-col items-center justify-center text-center aspect-[4/5] ${award.active ? 'border-border' : 'opacity-40'}`}>
            <div className={`w-12 h-12 rounded-lg bg-card/50 flex items-center justify-center mb-3 ${award.active ? 'shadow-inner' : ''}`}>
              <award.icon size={24} className={award.color} />
            </div>
            <p className="text-[10px] font-bold mb-1">Дистанция {award.title}</p>
            <p className="text-[8px] text-muted uppercase font-display tracking-widest">{award.active ? (award.color.includes('cyan') ? 'Редкая' : 'Обычная') : 'Обычная'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
