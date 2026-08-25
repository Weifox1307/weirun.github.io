import { forwardRef, type ReactNode } from "react";
import { toast } from "sonner";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export const APK_HREF = SITE.apkUrl.trim();

export function openApk() {
  if (!APK_HREF) {
    toast.message("APK появится в день релиза", {
      description: "Файл ещё не опубликован.",
    });
    return;
  }
  window.open(APK_HREF, "_blank", "noopener,noreferrer");
}

export const ApkLink = forwardRef<
  HTMLAnchorElement,
  { className?: string; children: ReactNode }
>(function ApkLink({ className, children }, ref) {
  if (!APK_HREF) {
    return (
      <button type="button" className={className} onClick={openApk}>
        {children}
      </button>
    );
  }
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
