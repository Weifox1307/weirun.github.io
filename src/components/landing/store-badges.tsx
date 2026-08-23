import { SITE } from "@/lib/site";

function RuStoreMark() {
  return (
    <span className="store-rustore flex size-11 items-center justify-center rounded-xl">
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        <path
          fill="white"
          d="M7 6.5h4.2c2.4 0 3.8 1.3 3.8 3.2 0 1.4-.8 2.4-2 2.9l2.4 4.9h-2.5l-2.2-4.6H9.2V17.5H7V6.5Zm2.2 1.8v3.2h1.8c1.2 0 1.9-.5 1.9-1.6s-.7-1.6-1.9-1.6H9.2Z"
        />
      </svg>
    </span>
  );
}

function GalleryMark() {
  return (
    <span className="store-gallery flex size-11 items-center justify-center rounded-xl">
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        <path
          fill="white"
          d="M7 8.2c0-1.8 1.6-3.2 5-3.2s5 1.4 5 3.2c0 1.2-.7 2.1-1.9 2.6 1.4.5 2.3 1.5 2.3 2.9 0 2-1.7 3.5-5.4 3.5S6.6 15.7 6.6 13.7c0-1.4.9-2.4 2.3-2.9C7.7 10.3 7 9.4 7 8.2Zm2.3.2c0 .8.8 1.3 2.7 1.3s2.7-.5 2.7-1.3-.8-1.3-2.7-1.3-2.7.5-2.7 1.3Zm-0.1 4.8c0 .9.9 1.5 3 1.5s3-.6 3-1.5-.9-1.4-3-1.4-3 .6-3 1.4Z"
        />
      </svg>
    </span>
  );
}

export function StoreBadges() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-section text-muted">
        Скоро в магазинах приложений
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <a
          href={SITE.rustoreUrl}
          target="_blank"
          rel="noreferrer"
          className="glass flex h-16 items-center gap-3 rounded-2xl px-4 transition-[background-color] duration-150 hover:bg-card"
        >
          <RuStoreMark />
          <span>
            <span className="block text-sm font-semibold text-foreground">RuStore</span>
            <span className="block text-xs text-muted">Скоро</span>
          </span>
        </a>
        <a
          href={SITE.appgalleryUrl}
          target="_blank"
          rel="noreferrer"
          className="glass flex h-16 items-center gap-3 rounded-2xl px-4 transition-[background-color] duration-150 hover:bg-card"
        >
          <GalleryMark />
          <span>
            <span className="block text-sm font-semibold text-foreground">AppGallery</span>
            <span className="block text-xs text-muted">Скоро</span>
          </span>
        </a>
      </div>
    </div>
  );
}
