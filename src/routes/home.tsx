import { createFileRoute } from "@tanstack/react-router";
import { Play, Navigation, CloudLightning } from "lucide-react";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  return (
    <div className="map-bg min-h-screen pb-safe px-4 pt-6 relative overflow-hidden">
      
      {/* Приветствие и Погода */}
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div>
          <p className="text-muted text-sm mb-1">Доброй ночи, Атлет 👋</p>
          <h1 className="font-display text-3xl font-bold uppercase">Готов к старту?</h1>
          <div className="flex items-center gap-2 mt-4 bg-black/50 border border-border px-3 py-1.5 rounded-full w-max backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-display tracking-widest text-muted uppercase">GPS: Готов</span>
          </div>
        </div>
        <div className="bg-card/80 border border-border p-3 rounded-2xl backdrop-blur-md flex flex-col items-center">
          <CloudLightning className="text-primary mb-1" size={24} />
          <span className="font-bold">12°C</span>
          <span className="text-[10px] text-muted uppercase">N. Novgorod</span>
        </div>
      </div>

      {/* Центральная кнопка старта */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 w-full">
        <div className="flex justify-between w-full max-w-sm px-6 mb-8">
          <div className="glass-card p-4 w-[45%]">
            <p className="text-[10px] text-muted uppercase font-display tracking-widest mb-1">Всего преодолено</p>
            <p className="font-display text-2xl font-bold">98.2 <span className="text-sm">км</span></p>
          </div>
          <div className="glass-card p-4 w-[45%]">
            <p className="text-[10px] text-muted uppercase font-display tracking-widest mb-1">Средний темп</p>
            <p className="font-display text-2xl font-bold">4:41 <span className="text-sm">/км</span></p>
          </div>
        </div>

        <button className="w-64 h-64 rounded-full bg-primary flex flex-col items-center justify-center shadow-[0_0_60px_rgba(200,248,8,0.3)] active:scale-95 transition-transform border-[8px] border-primary/20 relative">
          <div className="absolute inset-0 rounded-full border border-primary/50 animate-ping" />
          <Play className="text-black ml-3 mb-2 fill-black" size={48} />
          <span className="text-black font-display text-3xl font-bold uppercase tracking-widest">Старт</span>
        </button>
      </div>

      {/* Плашка последнего забега внизу */}
      <div className="absolute bottom-[100px] left-4 right-4 z-10">
        <div className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center text-primary">
              <Navigation size={20} />
            </div>
            <div>
              <p className="text-[10px] text-primary uppercase font-display tracking-widest mb-0.5">Последний забег</p>
              <p className="font-bold">7,15 км — 41:54</p>
            </div>
          </div>
          <div className="text-muted">{'>'}</div>
        </div>
      </div>
    </div>
  );
}
