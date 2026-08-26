import { createRootRoute, HeadContent, Outlet, Scripts, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, User, Activity, MapPin, Trophy, History, X, Medal, Settings, Rss, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({ /* ... Твои старые метатеги и линки (оставь как было в предыдущем шаге) ... */
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" },
      { title: "WEIRUN" },
      { name: "theme-color", content: "#090A0D" },
    ],
    links: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
    ]
  }),
  component: RootComponent,
});

function RootComponent() {
  const [session, setSession] = useState<Session | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const showNav = session && router.state.location.pathname !== '/' && router.state.location.pathname !== '/login';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const MainNavLinks = () => (
    <>
      <Link to="/home" className="flex md:flex-row flex-col items-center gap-2 p-3 text-muted hover:text-primary [&.active]:text-primary"><MapPin size={24} /><span className="text-[10px] md:text-sm font-display uppercase tracking-widest">Старт</span></Link>
      <Link to="/archive" className="flex md:flex-row flex-col items-center gap-2 p-3 text-muted hover:text-primary [&.active]:text-primary"><History size={24} /><span className="text-[10px] md:text-sm font-display uppercase tracking-widest">Архив</span></Link>
      <Link to="/leaderboard" className="flex md:flex-row flex-col items-center gap-2 p-3 text-muted hover:text-primary [&.active]:text-primary"><Trophy size={24} /><span className="text-[10px] md:text-sm font-display uppercase tracking-widest">Лидеры</span></Link>
      <Link to="/profile" className="flex md:flex-row flex-col items-center gap-2 p-3 text-muted hover:text-primary [&.active]:text-primary"><User size={24} /><span className="text-[10px] md:text-sm font-display uppercase tracking-widest">Профиль</span></Link>
    </>
  );

  const SideMenuLinks = () => (
    <div className="flex flex-col gap-4 mt-8">
      <Link to="/awards" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 text-lg font-bold text-white hover:text-primary"><Medal size={24}/> Зал Славы</Link>
      {/* Здесь потом добавим роуты /records, /news, /coach, /settings */}
      <Link to="/" className="flex items-center gap-4 text-lg font-bold text-white hover:text-primary"><Activity size={24}/> Рекорды (Скоро)</Link>
      <Link to="/" className="flex items-center gap-4 text-lg font-bold text-white hover:text-primary"><Rss size={24}/> Лента (Скоро)</Link>
      <Link to="/" className="flex items-center gap-4 text-lg font-bold text-white hover:text-primary"><Users size={24}/> Тренер (Скоро)</Link>
      <Link to="/" className="flex items-center gap-4 text-lg font-bold text-white hover:text-primary"><Settings size={24}/> Настройки (Скоро)</Link>
    </div>
  );

  return (
    <html lang="ru" className="antialiased bg-background text-foreground">
      <head><HeadContent /></head>
      <body className="min-h-screen flex">
        
        {/* Боковое меню на ПК */}
        {showNav && (
          <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-card border-r border-border p-6 z-50">
            <div className="flex items-center gap-3 mb-12"><img src="/logo-mark.png" className="w-10 h-10" alt=""/><span className="font-display text-2xl font-bold tracking-[0.2em] uppercase">Weirun</span></div>
            <nav className="flex flex-col gap-2 border-b border-border pb-6 mb-6"><MainNavLinks /></nav>
            <nav><SideMenuLinks /></nav>
          </aside>
        )}

        {/* Шторка меню для Мобилок */}
        {showNav && menuOpen && (
          <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl p-6 md:hidden">
            <div className="flex justify-between items-center mb-8">
              <span className="font-display text-2xl font-bold tracking-[0.2em] uppercase text-primary">Меню</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 bg-card rounded-full"><X size={24}/></button>
            </div>
            <SideMenuLinks />
          </div>
        )}

        <main className={`flex-1 w-full relative ${showNav ? 'md:ml-64' : ''}`}>
          {showNav && (
            <header className="md:hidden fixed top-0 w-full pt-safe z-40 bg-background/90 backdrop-blur-md border-b border-border">
              <div className="flex justify-between items-center h-16 px-4">
                <button onClick={() => setMenuOpen(true)} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:text-white"><Menu size={20} /></button>
                <span className="font-display text-2xl font-bold tracking-[0.2em] uppercase">Weirun</span>
                <div className="w-10" />
              </div>
            </header>
          )}

          <div className={`${showNav ? 'md:pt-0 pt-[80px]' : ''} mx-auto max-w-[800px] w-full min-h-screen`}>
            <Outlet context={{ session }} />
          </div>

          {showNav && (
            <nav className="md:hidden fixed bottom-0 w-full bg-card/95 backdrop-blur-lg border-t border-border pb-[env(safe-area-inset-bottom)] z-50">
              <div className="flex justify-around items-center h-16 px-2"><MainNavLinks /></div>
            </nav>
          )}
        </main>
        <Scripts />
      </body>
    </html>
  );
}
