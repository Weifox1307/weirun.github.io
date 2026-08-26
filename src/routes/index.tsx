import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Globe } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#090A0D] relative overflow-hidden">
      
      {/* Правильный, едва заметный текстурный шум */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay z-0"
        style={{ backgroundImage: "url('/noise.png')", backgroundRepeat: "repeat", backgroundSize: "180px" }}
      />
      
      {/* Мягкое неоновое свечение в центре */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
      
      <div className="relative z-10 flex flex-col items-center w-full">
        <img 
          src="/logo-mark.png" 
          alt="WEIRUN" 
          className="w-28 h-28 mb-6 drop-shadow-[0_0_30px_rgba(200,248,8,0.4)]" 
        />
        
        <h1 className="font-display text-6xl font-bold uppercase tracking-[0.2em] mb-3 text-white drop-shadow-md">
          WEIRUN
        </h1>
        
        <p className="text-muted mb-12 max-w-sm uppercase tracking-widest text-sm font-medium">
          Победы начинаются с тебя
        </p>
        
        <div className="w-full max-w-sm space-y-4">
          <a 
            href="https://github.com/Weifox1307/weirun.github.io/releases/download/v1.0.0/WEIRUN.apk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-primary text-black font-display font-bold uppercase tracking-widest py-4 rounded-xl text-lg hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(200,248,8,0.3)] cursor-pointer"
          >
            <Download size={24} />
            СКАЧАТЬ APK
          </a>

          <Link 
            to="/login" 
            className="w-full flex items-center justify-center gap-3 bg-card/80 backdrop-blur-md border border-border text-white font-display font-bold uppercase tracking-wider py-4 rounded-xl text-lg hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
          >
            <Globe size={24} className="text-primary" />
            ВЕБ-ВЕРСИЯ (PWA)
          </Link>
        </div>
        
        <p className="text-muted/50 text-[10px] mt-12 max-w-[280px] uppercase font-display tracking-widest leading-relaxed">
          Добавь веб-версию на экран "Домой" в браузере Safari, чтобы использовать как нативное приложение на iOS.
        </p>
      </div>
    </div>
  );
}
