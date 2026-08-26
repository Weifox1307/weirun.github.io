import { createRootRoute, HeadContent, Outlet, Scripts, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, User, Activity, MapPin, Trophy, History } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" },
      { title: "WEIRUN" },
      { name: "theme-color", content: "#090A0D" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const isLanding = router.state.location.pathname === '/';
  const isLogin = router.state.location.pathname === '/login';
  const showNav = session && !isLanding && !isLogin;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const NavLinks = () => (
    <>
      <Link to="/home" className="flex md:flex-row flex-col items-center gap-2 p-3 text-muted hover:text-primary [&.active]:text-primary rounded-xl transition-colors">
        <MapPin size={24} /><span className="text-[10px] md:text-sm mt-1 md:mt-0 font-medium font-display tracking-widest uppercase">Старт</span>
      </Link>
      <Link to="/archive" className="flex md:flex-row flex-col items-center gap-2 p-3 text-muted hover:text-primary [&.active]:text-primary rounded-xl transition-colors">
        <History size={24} /><span className="text-[10px] md:text-sm mt-1 md:mt-0 font-medium font-display tracking-widest uppercase">Архив</span>
      </Link>
      <Link to="/leaderboard" className="flex md:flex-row flex-col items-center gap-2 p-3 text-muted hover:text-primary [&.active]:text-primary rounded-xl transition-colors">
        <Trophy size={24} /><span className="text-[10px] md:text-sm mt-1 md:mt-0 font-medium font-display tracking-widest uppercase">Лидеры</span>
      </Link>
      <Link to="/profile" className="flex md:flex-row flex-col items-center gap-2 p-3 text-muted hover:text-primary [&.active]:text-primary rounded-xl transition-colors">
        <Activity size={24} /><span className="text-[10px] md:text-sm mt-1 md:mt-0 font-medium font-display tracking-widest uppercase">Профиль</span>
      </Link>
    </>
  );

  return (
    <html lang="ru" className="antialiased bg-background text-foreground">
      <head><HeadContent /></head>
      <body className="min-h-screen flex">
        
        {/* DESKTOP SIDEBAR (Только на ПК) */}
        {showNav && (
          <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-card border-r border-border p-6 z-50">
            <div className="flex items-center gap-3 mb-12">
              <img src="/logo-mark.png" alt="WEIRUN" className="w-10 h-10" />
              <span className="font-display text-2xl font-bold tracking-[0.2em] uppercase text-white">Weirun</span>
            </div>
            <nav className="flex flex-col gap-2">
              <NavLinks />
            </nav>
          </aside>
        )}

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <main className={`flex-1 w-full relative ${showNav ? 'md:ml-64' : ''}`}>
          
          {/* MOBILE HEADER (Только на телефонах) */}
          {showNav && (
            <header className="md:hidden fixed top-0 w-full pt-safe z-40 bg-background/90 backdrop-blur-md border-b border-border">
              <div className="flex justify-between items-center h-16 px-4">
                <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted hover:text-white">
                  <Menu size={20} />
                </button>
                <span className="font-display text-2xl font-bold tracking-[0.2em] uppercase">Weirun</span>
                <Link to="/profile" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-primary">
                  <User size={20} />
                </Link>
              </div>
            </header>
          )}

          {/* КОНТЕЙНЕР (Ограничиваем ширину на ПК для красоты) */}
          <div className={`${showNav ? 'md:pt-0 pt-[80px]' : ''} mx-auto max-w-[800px] w-full min-h-screen`}>
            <Outlet context={{ session }} />
          </div>

          {/* MOBILE BOTTOM NAV (Только на телефонах) */}
          {showNav && (
            <nav className="md:hidden fixed bottom-0 w-full bg-card/95 backdrop-blur-lg border-t border-border pb-[env(safe-area-inset-bottom)] z-50">
              <div className="flex justify-around items-center h-16 px-2">
                <NavLinks />
              </div>
            </nav>
          )}

        </main>
        <Scripts />
      </body>
    </html>
  );
}
