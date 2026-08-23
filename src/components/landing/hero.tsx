import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/landing/countdown";
import { LogoMark } from "@/components/landing/logo";
import { PhoneFrame } from "@/components/landing/phone-frame";
import { downloadApk } from "@/components/landing/apk-download";
import { SITE } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-24 lg:pt-10">
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <div className="mb-6 flex items-center gap-3">
          <span className="soon-pill inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-section text-primary">
            <span className="dot size-1.5 rounded-full bg-primary" aria-hidden />
            Скоро релиз
          </span>
        </div>

        <LogoMark className="logo-glow mb-5 h-16 w-16 sm:h-20 sm:w-20" />

        <div className="mb-6 flex w-full max-w-md items-center gap-4 lg:max-w-none">
          <span className="h-px flex-1 bg-foreground/20" />
          <p className="wordmark text-xs text-foreground/80">{SITE.tagline}</p>
          <span className="h-px flex-1 bg-foreground/20" />
        </div>

        <p className="text-sm font-medium uppercase tracking-section text-muted sm:text-base">
          {SITE.kicker}
        </p>
        <h1 className="wordmark mt-2 text-6xl leading-none text-foreground sm:text-7xl lg:text-8xl">
          {SITE.name}
        </h1>
        <p className="mt-2 font-display text-2xl font-medium uppercase tracking-section text-foreground/85 sm:text-3xl">
          {SITE.headline}
        </p>
        <p className="mt-5 max-w-md text-base leading-relaxed text-muted lg:max-w-lg">
          {SITE.description}
        </p>

        <Countdown className="mt-8 w-full max-w-md lg:max-w-lg" />

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-center">
          <button type="button" className="start-orb" onClick={() => void downloadApk()}>
            <Download className="size-7" strokeWidth={2.2} />
            <span className="text-sm">Скачать</span>
          </button>
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Button asChild variant="ghost" size="lg">
              <a href="#features">Что внутри</a>
            </Button>
            <p className="max-w-[16rem] text-xs leading-relaxed text-muted">
              Прямая загрузка APK. RuStore и AppGallery — в день релиза.
            </p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
        <div
          className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <PhoneFrame src="/screens/01.jpg" alt="Главный экран WEIRUN" />
      </div>
    </section>
  );
}
