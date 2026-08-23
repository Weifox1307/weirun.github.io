import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { DownloadSection } from "@/components/landing/download-section";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { Showcase } from "@/components/landing/showcase";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div id="top" className="page-shell">
      <div className="noise-layer" aria-hidden />
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <DownloadSection />
      </main>
      <SiteFooter />
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          className: "glass-strong !border-0 !text-foreground",
        }}
      />
    </div>
  );
}
