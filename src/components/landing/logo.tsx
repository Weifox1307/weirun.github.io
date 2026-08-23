import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo-mark.png"
      alt=""
      width={209}
      height={214}
      className={cn("select-none object-contain", className)}
    />
  );
}

export function LogoLockup({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8" />
      <span className="wordmark text-lg leading-none text-foreground">WEIRUN</span>
    </span>
  );
}
