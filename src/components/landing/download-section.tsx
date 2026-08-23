import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/landing/countdown";
import { StoreBadges } from "@/components/landing/store-badges";
import { downloadApk } from "@/components/landing/apk-download";
import { LogoMark } from "@/components/landing/logo";

export function DownloadSection() {
  return (
    <section id="download" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 lg:py-28">
      <div className="glass relative overflow-hidden rounded-3xl px-6 py-12 sm:rounded-3xl sm:px-12 sm:py-16">
        <div
          className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <LogoMark className="mb-6 h-14 w-14" />
            <p className="section-kicker">Релиз</p>
            <h2 className="mt-3 font-display text-4xl font-semibold uppercase tracking-section text-foreground sm:text-5xl">
              Скачай WEIRUN
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              Победы начинаются с тебя. Прямая установка APK — без ожидания витрин.
              Магазины подключим в день запуска.
            </p>
            <Countdown className="mt-8 max-w-lg" />
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button type="button" size="lg" onClick={() => void downloadApk()}>
                <Download className="size-5" />
                Скачать APK
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#showcase">Смотреть экраны</a>
              </Button>
            </div>
          </div>
          <StoreBadges />
        </div>
      </div>
    </section>
  );
}
