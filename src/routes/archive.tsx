import { createFileRoute } from "@tanstack/react-router";
import { Search, Activity, Plus } from "lucide-react";

export const Route = createFileRoute("/archive")({ component: Archive });

function Archive() {
  return (
    <div className="pb-safe px-4 pt-6 relative">
      <h1 className="font-display text-4xl font-bold uppercase mb-1">Архив треков</h1>
      <p className="text-primary text-xs font-display tracking-widest uppercase mb-6">Твоя лента побед и рекордов</p>

      {/* Карточка суммарной статистики */}
      <div className="glass-card p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs text-muted font-display tracking-widest uppercase mb-1">Общий километраж</p>
            <p className="font-display text-5xl font-bold">98.24</p>
          </div>
          <div className="border border-primary text-primary px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold">
            <Activity size={14} /> 7 ЗАБЕГОВ
          </div>
        </div>

        <div className="flex justify-between border-t border-border pt-4 text-center">
          <div className="w-1/2 border-r border-border">
            <p className="text-[10px] text-muted font-display tracking-widest uppercase mb-1">Сожжено</p>
            <p className="font-bold text-sm">6449 ккал</p>
          </div>
          <div className="w-1/2">
            <p className="text-[10px] text-muted font-display tracking-widest uppercase mb-1">Средняя дистанция</p>
            <p className="font-bold text-sm text-primary">14.0 км</p>
          </div>
        </div>
      </div>

      {/* Поиск и Фильтры */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input 
          type="text" 
          placeholder="Поиск по названию..." 
          className="w-full bg-[#0A0D12] border border-border rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-primary"
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        <button className="bg-primary text-black px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap">Все забеги</button>
        <button className="bg-card border border-border text-white px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap">Дистанционные (≥5км)</button>
        <button className="bg-card border border-border text-white px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap">Спринты ({"<"}5км)</button>
      </div>

      {/* Список забегов */}
      <div className="space-y-4">
        <div className="glass-card p-5 border-l-4 border-l-primary relative">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Activity size={18} />
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider text-sm">Бег на улице</p>
                <p className="text-xs text-muted mt-0.5">24 авг. 2026, 17:47</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] text-muted font-display tracking-widest uppercase mb-1">Дистанция</p>
              <p className="font-display text-3xl font-bold text-primary">7.15 <span className="text-sm text-white">км</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted font-display tracking-widest uppercase mb-1">Время</p>
              <p className="font-display text-xl font-bold">41:54</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 border-t border-border pt-4">
            <div>
              <p className="text-[9px] text-muted uppercase mb-1">Темп</p>
              <p className="font-bold text-xs">5:51 /км</p>
            </div>
            <div>
              <p className="text-[9px] text-muted uppercase mb-1">Скорость</p>
              <p className="font-bold text-xs">10.2 км/ч</p>
            </div>
            <div>
              <p className="text-[9px] text-muted uppercase mb-1">Калории</p>
              <p className="font-bold text-xs">306 ккал</p>
            </div>
            <div>
              <p className="text-[9px] text-muted uppercase mb-1">Шаги</p>
              <p className="font-bold text-xs">4,170</p>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопка добавления GPX */}
      <button className="fixed bottom-[100px] right-4 w-16 h-16 bg-primary rounded-full shadow-[0_0_20px_rgba(200,248,8,0.3)] flex items-center justify-center text-black active:scale-95 transition-transform z-40">
        <Plus size={32} />
      </button>
    </div>
  );
}
