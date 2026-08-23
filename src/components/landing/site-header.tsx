import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoLockup } from "@/components/landing/logo";
import { downloadApk } from "@/components/landing/apk-download";
import { NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 px-4 pt-3 sm:px-6",
        open && "z-50",
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl px-3 transition-[background-color,box-shadow] duration-200 ease-out sm:h-16 sm:px-4",
          scrolled || open ? "glass-strong" : "bg-transparent",
        )}
      >
        <a href="#top" className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary/70">
          <LogoLockup />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Разделы">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-[color] duration-150 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => void downloadApk()}
          >
            <Download className="size-4" />
            Скачать APK
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="glass-strong mx-auto mt-2 max-w-6xl rounded-2xl p-3 md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Мобильная навигация">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/10"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button
              type="button"
              className="mt-2 w-full"
              onClick={() => {
                setOpen(false);
                void downloadApk();
              }}
            >
              <Download className="size-4" />
              Скачать APK
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
