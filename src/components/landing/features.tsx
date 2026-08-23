import { FEATURES } from "@/lib/site";
import { FeatureIcon } from "@/components/landing/feature-icons";

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-kicker">Возможности</p>
        <h2 className="mt-3 font-display text-4xl font-semibold uppercase tracking-section text-foreground sm:text-5xl">
          Удобный трекер для любых дистанций, условий и целей
        </h2>
      </div>

      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <article key={feature.id} className="glass rounded-3xl p-5 sm:p-6">
            <div className="icon-ring flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FeatureIcon name={feature.icon} className="size-5" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold uppercase tracking-wide text-foreground">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
