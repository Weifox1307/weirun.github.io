import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/challenges")({ component: Challenges });

function Challenges() {
  const challenges = [
    { id: 1, title: "Первая волна", distance: 10, current: 4.5, participants: 1250 },
    { id: 2, title: "Марафонский месяц", distance: 42.2, current: 15, participants: 840 },
  ];

  return (
    <div className="pt-safe px-6 py-8 pb-24">
      <h1 className="text-3xl font-display font-bold uppercase mb-6">Онлайн Старты</h1>
      
      <div className="grid gap-6">
        {challenges.map(c => (
          <div key={c.id} className="glass rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <h3 className="text-2xl font-display font-bold uppercase mb-1">{c.title}</h3>
            <p className="text-sm text-muted mb-4">{c.participants} участников</p>
            
            <div className="flex justify-between text-sm mb-2 font-medium">
              <span>{c.current} км</span>
              <span>Цель: {c.distance} км</span>
            </div>
            
            <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden mb-6">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((c.current / c.distance) * 100, 100)}%` }}
              />
            </div>
            
            <button className="w-full bg-card border border-primary text-primary font-bold uppercase py-3 rounded-xl hover:bg-primary hover:text-black transition-colors">
              Продолжить забег
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
