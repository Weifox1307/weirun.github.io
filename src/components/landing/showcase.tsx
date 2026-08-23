import { SCREENS } from "@/lib/site";
import { PhoneFrame } from "@/components/landing/phone-frame";

export function Showcase() {
  return (
    <section id="showcase" className="scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="section-kicker">Интерфейс</p>
        <h2 className="mt-3 font-display text-4xl font-semibold uppercase tracking-section text-foreground sm:text-5xl">
          Вся история забегов в одном месте
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
          Тёмные стеклянные экраны, лаймовый акцент и шум — как в самом приложении.
        </p>
      </div>

      <div className="relative mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent sm:w-16" />
        <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 sm:px-8 lg:px-12">
          {SCREENS.map((screen) => (
            <figure
              key={screen.src}
              className="w-[220px] shrink-0 snap-center sm:w-[260px]"
            >
              <PhoneFrame src={screen.src} alt={screen.alt} />
              <figcaption className="mt-4 text-center text-sm font-medium uppercase tracking-section text-muted">
                {screen.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
