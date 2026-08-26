import { createRootRoute, HeadContent, Outlet, Scripts, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Home, User, Trophy, Flag, Upload, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" },
      { title: "WEIRUN — Трекер" },
      { name: "description", content: "GPS-трекер для бега." },
      { name: "theme-color", content: "#0F1115" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "WEIRUN" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Регистрируем Service Worker для PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && router.state.location.pathname !== '/') {
        router.navigate({ to: '/login' });
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <html lang="ru" className="antialiased bg-background text-foreground">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen pb-[80px]">
        <Outlet context={{ session }} />
        
        {/* Нижняя навигация а-ля iOS PWA */}
        {session && (
          <nav className="fixed bottom-0 w-full bg-card/90 backdrop-blur-lg border-t border-white/5 pb-safe z-50">
            <div className="flex justify-around items-center h-16 px-2">
              <Link to="/profile" className="flex flex-col items-center p-2 text-muted hover:text-primary [&.active]:text-primary">
                <User size={24} />
                <span className="text-[10px] mt-1 font-medium">Профиль</span>
              </Link>
              <Link to="/leaderboard" className="flex flex-col items-center p-2 text-muted hover:text-primary [&.active]:text-primary">
                <Trophy size={24} />
                <span className="text-[10px] mt-1 font-medium">Рейтинг</span>
              </Link>
              <Link to="/challenges" className="flex flex-col items-center p-2 text-muted hover:text-primary [&.active]:text-primary">
                <Flag size={24} />
                <span className="text-[10px] mt-1 font-medium">Старты</span>
              </Link>
              <Link to="/upload" className="flex flex-col items-center p-2 text-muted hover:text-primary [&.active]:text-primary">
                <Upload size={24} />
                <span className="text-[10px] mt-1 font-medium">GPX</span>
              </Link>
              <Link to="/contact" className="flex flex-col items-center p-2 text-muted hover:text-primary [&.active]:text-primary">
                <Mail size={24} />
                <span className="text-[10px] mt-1 font-medium">Связь с тренером</span>
              </Link>
            </div>
          </nav>
        )}
        <Scripts />
      </body>
    </html>
  );
}
