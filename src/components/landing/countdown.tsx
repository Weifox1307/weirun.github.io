import { useEffect, useMemo, useState } from "react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function split(ms: number): Parts {
  const clamped = Math.max(0, ms);
  const days = Math.floor(clamped / 86_400_000);
  const hours = Math.floor((clamped % 86_400_000) / 3_600_000);
  const minutes = Math.floor((clamped % 3_600_000) / 60_000);
  const seconds = Math.floor((clamped % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

const LABELS: { key: keyof Parts; label: string }[] = [
  { key: "days", label: "Дни" },
  { key: "hours", label: "Часы" },
  { key: "minutes", label: "Минуты" },
  { key: "seconds", label: "Секунды" },
];

export function useLaunchCountdown() {
  const target = useMemo(() => new Date(SITE.launchAt).getTime(), []);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null) {
    return { ready: false as const, remaining: 0, parts: split(0), launched: false };
  }
  const remaining = target - now;
  return {
    ready: true as const,
    remaining,
    parts: split(remaining),
    launched: remaining <= 0,
  };
}

export function Countdown({ className }: { className?: string }) {
  const { ready, parts, launched } = useLaunchCountdown();

  if (launched) {
    return (
      <p className={cn("section-kicker", className)}>Доступно сейчас</p>
    );
  }

  return (
    <div
      className={cn("grid grid-cols-4 gap-2 sm:gap-3", className)}
      role="timer"
      aria-live="polite"
      aria-label="До релиза"
    >
      {LABELS.map((item) => (
        <div
          key={item.key}
          className="glass flex flex-col items-center rounded-2xl px-2 py-3 sm:px-3 sm:py-4"
        >
          <span className="font-display text-3xl font-semibold tabular-nums leading-none tracking-tight text-foreground sm:text-4xl">
            {ready ? String(parts[item.key]).padStart(2, "0") : "––"}
          </span>
          <span className="mt-2 text-xs font-medium uppercase tracking-section text-muted">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
