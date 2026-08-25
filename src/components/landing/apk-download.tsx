import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const APK_HREF = "https://github.com/Weifox1307/weirun.github.io/releases/download/v1.0.0/WEIRUN.apk";

export const ApkLink = forwardRef<
  HTMLAnchorElement,
  { className?: string; children: ReactNode }
>(function ApkLink({ className, children }, ref) {
  return (
    <a
      ref={ref}
      className={cn("no-underline", className)}
      href={APK_HREF}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
});
