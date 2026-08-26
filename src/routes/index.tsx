import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <img src="/logo-mark.png" alt="WEIRUN" className="w-24 h-24 mb-6" />
      <h1 className="font-display text-5xl font-bold uppercase tracking-widest mb-2">WEIRUN</h1>
      <p className="text-muted mb-10 max-w-sm">Победы начинаются с тебя. Современный GPS-трекер для бега.</p>
      
      <Link 
        to="/login" 
        className="w-full max-w-xs bg-primary text-black font-bold uppercase py-4 rounded-xl hover:brightness-110 active:scale-95 transition-all"
      >
        Войти в приложение
      </Link>
    </div>
  );
}
