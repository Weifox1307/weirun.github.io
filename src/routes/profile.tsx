import { createFileRoute } from "@tanstack/react-router";
import { Camera, Zap } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  return (
    <div className="pb-safe px-4 pt-6">
      
      {/* Аватар и Имя */}
      <div className="flex flex-col items-center mb-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full border-[3px] border-primary p-1">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-4xl text-muted overflow-hidden">
              <img src="/noise.png" className="opacity-20 absolute inset-0 object-cover" alt=""/>
              RB
            </div>
          </div>
          <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center border-4 border-background text-black">
            <Camera size={18} />
          </button>
        </div>
        
        <h1 className="text-2xl font-bold mb-3">Roman Bekov</h1>
        
        <div className="border border-primary text-primary px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-display tracking-widest uppercase">
          <Zap size={14} className="fill-primary" />
          Level 1 Athlete
        </div>
      </div>

      {/* Главная статистика */}
      <div className="glass-card p-6 grid grid-cols-3 divide-x divide-border mb-8 text-center">
        <div>
          <p className="font-display text-3xl font-bold">98.2 <span className="text-sm text-muted">км</span></p>
          <p className="text-[10px] text-primary uppercase font-display tracking-widest mt-1">Дистанция</p>
        </div>
        <div>
          <p className="font-display text-3xl font-bold">7</p>
          <p className="text-[10px] text-primary uppercase font-display tracking-widest mt-1">Забеги</p>
        </div>
        <div>
          <p className="font-display text-3xl font-bold">4:41</p>
          <p className="text-[10px] text-primary uppercase font-display tracking-widest mt-1">Ср. темп</p>
        </div>
      </div>

      {/* Награды */}
      <h3 className="text-xs font-display tracking-widest text-muted uppercase mb-3">Коллекция наград</h3>
      <div className="glass-card p-6 mb-8 flex gap-4 overflow-x-auto">
        <div className="w-16 h-16 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center">
          <span className="text-primary font-display font-bold text-xl">W</span>
        </div>
        <div className="w-16 h-16 rounded-full border border-border bg-card/50" />
        <div className="w-16 h-16 rounded-full border border-border bg-card/50" />
      </div>

      {/* Физические показатели */}
      <h3 className="text-xs font-display tracking-widest text-muted uppercase mb-3">Физические показатели</h3>
      <div className="glass-card p-6 flex justify-between">
        <div>
          <p className="text-[10px] text-muted uppercase mb-1 flex items-center gap-1">Вес</p>
          <p className="font-bold text-lg">60.1 кг</p>
        </div>
        <div>
          <p className="text-[10px] text-muted uppercase mb-1 flex items-center gap-1">Рост</p>
          <p className="font-bold text-lg">172 см</p>
        </div>
        <div>
          <p className="text-[10px] text-muted uppercase mb-1 flex items-center gap-1">Возраст</p>
          <p className="font-bold text-lg">21 г.</p>
        </div>
      </div>
    </div>
  );
}
