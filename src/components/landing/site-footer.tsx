import { LogoLockup } from "@/components/landing/logo";
import { NAV, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <LogoLockup />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {SITE.tagline}. Современный GPS-трекер для бега — карта, тренер, архив и
            достижения.
          </p>
        </div>
        <nav className="flex flex-col gap-3" aria-label="Подвал">
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
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pb-10 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {SITE.year} {SITE.name}. Все права защищены.</p>
        <p>RuStore · AppGallery · APK</p>
      </div>
    </footer>
  );
}
