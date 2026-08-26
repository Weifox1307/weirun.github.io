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

  return (
    <html lang="ru" className="antialiased bg-background text-foreground">
      <head><HeadContent /></head>
      <body className="min-h-screen">
        
        {/* Верхний Header как в Android */}
        {showNav && (
          <header className="fixed top-0 w-full pt-safe z-50 bg-background/90 backdrop-blur-md border-b border-white/5">
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

        <div className={showNav ? "pt-[80px]" : ""}>
          <Outlet context={{ session }} />
        </div>
        
        {/* Нижняя панель для iOS/Web (чтобы удобно переключаться) */}
        {showNav && (
          <nav className="fixed bottom-0 w-full bg-card/95 backdrop-blur-lg border-t border-border pb-[env(safe-area-inset-bottom)] z-50">
            <div className="flex justify-around items-center h-16 px-2">
              <Link to="/home" className="flex flex-col items-center p-2 text-muted hover:text-primary [&.active]:text-primary">
                <MapPin size={22} /><span className="text-[10px] mt-1 font-medium font-display tracking-widest uppercase">Старт</span>
              </Link>
              <Link to="/archive" className="flex flex-col items-center p-2 text-muted hover:text-primary [&.active]:text-primary">
                <History size={22} /><span className="text-[10px] mt-1 font-medium font-display tracking-widest uppercase">Архив</span>
              </Link>
              <Link to="/leaderboard" className="flex flex-col items-center p-2 text-muted hover:text-primary [&.active]:text-primary">
                <Trophy size={22} /><span className="text-[10px] mt-1 font-medium font-display tracking-widest uppercase">Лидеры</span>
              </Link>
              <Link to="/profile" className="flex flex-col items-center p-2 text-muted hover:text-primary [&.active]:text-primary">
                <Activity size={22} /><span className="text-[10px] mt-1 font-medium font-display tracking-widest uppercase">Профиль</span>
              </Link>
            </div>
          </nav>
        )}
        <Scripts />
      </body>
    </html>
  );
}
