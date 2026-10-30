"use client";

import { useEffect, useState } from "react";
import type { Banner } from "@/lib/content";
import { BannerMedia } from "./BannerMedia";
import { BannerText } from "./BannerText";

const INTERVAL_MS = 6000;

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [count, paused]);

  if (count === 0) return null;

  return (
    <section
      className="relative aspect-[4/5] w-full overflow-hidden bg-ink sm:aspect-[16/9] lg:aspect-[21/9]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {banners.map((b, i) => {
        const active = i === index;
        return (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!active}
          >
            <BannerMedia media={b.media} priority={i === 0} />
            <div
              className={`absolute inset-0 ${
                b.text === "dark" ? "bg-gradient-to-r from-paper/40 to-transparent" : "bg-gradient-to-r from-ink/60 to-transparent"
              }`}
            />
            <div className="absolute inset-0 flex items-end sm:items-center">
              <div className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 sm:pb-0">
                <BannerText banner={b} large />
              </div>
            </div>
          </div>
        );
      })}

      {count > 1 && (
        <>
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-paper" : "w-3 bg-paper/50 hover:bg-paper/80"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/80 text-ink hover:bg-paper sm:flex"
          >
            &larr;
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % count)}
            className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/80 text-ink hover:bg-paper sm:flex"
          >
            &rarr;
          </button>
        </>
      )}
    </section>
  );
}
