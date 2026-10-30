import type { Banner } from "@/lib/content";
import { BannerMedia } from "./BannerMedia";
import { BannerText } from "./BannerText";

export function PromoBanner({ banner }: { banner: Banner }) {
  return (
    <section className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ink sm:aspect-[21/9]">
      <div className="drift absolute inset-x-0 -inset-y-14" style={{ "--drift": "56px" } as React.CSSProperties}>
        <BannerMedia media={banner.media} sizes="(min-width: 1152px) 1152px, 100vw" />
      </div>
      <div
        className={`absolute inset-0 ${
          banner.text === "dark" ? "bg-gradient-to-t from-paper/50 to-transparent" : "bg-gradient-to-t from-ink/70 to-transparent"
        }`}
      />
      <div className="absolute inset-0 flex items-end p-6 sm:p-10">
        <BannerText banner={banner} />
      </div>
    </section>
  );
}
