import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Globe } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[url('/noise.png')] bg-repeat relative">
      <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <img src="/logo-mark.png" alt="WEIRUN" className="w-28 h-28 mb-6 drop-shadow-[0_0_20px_rgba(200,248,8,0.3)] relative z-10" />
      <h1 className="font-display text-6xl font-bold uppercase tracking-[0.2em] mb-3 relative z-10">WEIRUN</h1>
      <p className="text-muted mb-12 max-w-sm uppercase tracking-widest text-sm relative z-10">Победы начинаются с тебя</p>
      
      <div className="w-full max-w-sm space-y-4 relative z-10">
        <a 
          href="https://github.com/Weifox1307/weirun.github.io/releases/download/v1.0.0/WEIRUN.apk" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 neon-button py-4 rounded-xl text-lg"
        >
          <Download size={24} />
          СКАЧАТЬ APK
        </a>

        <Link 
          to="/login" 
          className="w-full flex items-center justify-center gap-3 bg-card border border-border text-white font-display font-bold uppercase tracking-wider py-4 rounded-xl text-lg hover:bg-border transition-colors"
        >
          <Globe size={24} className="text-primary" />
          ВЕБ-ВЕРСИЯ (PWA)
        </Link>
      </div>
      
      <p className="text-muted text-xs mt-12 relative z-10">Добавь веб-версию на экран "Домой" в Safari,<br/>чтобы использовать как приложение на iOS.</p>
    </div>
  );
}
