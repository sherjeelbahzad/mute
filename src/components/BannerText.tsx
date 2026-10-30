import Link from "next/link";
import type { Banner } from "@/lib/content";

export function BannerText({ banner, large = false }: { banner: Banner; large?: boolean }) {
  const light = banner.text !== "dark";
  const tone = light ? "text-paper" : "text-ink";
  const muted = light ? "text-paper/70" : "text-ink/70";
  const button = light
    ? "bg-paper text-ink hover:opacity-85"
    : "bg-ink text-paper hover:opacity-85";

  return (
    <div className={`relative z-10 max-w-xl ${tone}`}>
      {banner.eyebrow && (
        <p className={`text-xs uppercase tracking-[0.2em] sm:text-sm ${muted}`}>{banner.eyebrow}</p>
      )}
      <h2
        className={`mt-3 font-semibold leading-[1.05] tracking-tight ${
          large ? "text-4xl sm:text-6xl lg:text-7xl" : "text-3xl sm:text-4xl"
        }`}
      >
        {banner.headline}
      </h2>
      {banner.body && <p className={`mt-4 max-w-md text-base sm:text-lg ${muted}`}>{banner.body}</p>}
      {banner.cta && (
        <Link
          href={banner.cta.href}
          className={`mt-6 inline-flex h-11 items-center rounded-md px-6 text-sm font-medium ${button}`}
        >
          {banner.cta.label}
        </Link>
      )}
    </div>
  );
}
