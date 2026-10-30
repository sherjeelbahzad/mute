"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { reels, type Reel } from "@/lib/content";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { Reveal } from "./Reveal";
import StaggerText from "./ui/staggerText";

/**
 * Brand reels. Each plays muted while on screen and pauses off screen; the speaker button unmutes
 * one reel at a time. Every card links to its product.
 *
 *  - variant "hero":    the first four reels as a balanced row filling the first screen.
 *  - variant "collage": every reel in an equal-tile grid.
 */
export function Reels({ variant = "collage" }: { variant?: "hero" | "collage" }) {
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [loud, setLoud] = useState<number | null>(null);
  const list: Reel[] = variant === "hero" ? reels.slice(0, 4) : reels;

  // Play what is visible, pause what is not. Pure DOM work: no React state involved.
  useEffect(() => {
    const els = videos.current.filter((v): v is HTMLVideoElement => !!v);
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.intersectionRatio >= 0.4) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: [0, 0.4, 1] },
    );
    els.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  function toggleSound(i: number) {
    const next = loud === i ? null : i;
    videos.current.forEach((v, k) => {
      if (v) v.muted = k !== next;
    });
    setLoud(next);
  }

  if (list.length === 0) return null;

  const cards = list.map((r, i) => {
    const p = getProductById(r.productId);
    return (
      <li
        key={r.id}
        className="group relative aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-ink shadow-[0_30px_60px_-30px_rgba(15,22,19,0.5)] sm:rounded-[1.75rem]"
      >
        <video
          ref={(el) => {
            videos.current[i] = el;
          }}
          className="absolute inset-0 h-full w-full object-cover"
          src={r.src}
          poster={r.poster}
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent" />
        <button
          type="button"
          onClick={() => toggleSound(i)}
          aria-label={loud === i ? "Mute" : "Unmute"}
          aria-pressed={loud === i}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-paper backdrop-blur transition-colors hover:bg-ink"
        >
          {loud === i ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 5 6 9H2v6h4l5 4z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 5 6 9H2v6h4l5 4z" />
              <path d="m22 9-6 6M16 9l6 6" />
            </svg>
          )}
        </button>
        {p && (
          <Link
            href={`/shop/${p.slug}`}
            className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-full bg-paper/90 px-4 py-2.5 text-sm backdrop-blur transition-colors hover:bg-mint"
          >
            <span className="font-medium">{p.name}</span>
            <span className="text-ink/70">{formatPrice(p.price)}</span>
          </Link>
        )}
      </li>
    );
  });

  if (variant === "hero") {
    return (
      <section className="relative flex min-h-[calc(100svh-6.5rem)] flex-col justify-center px-4 py-6 sm:px-6">
        <p className="mb-4 text-center text-[11px] uppercase tracking-[0.3em] text-ink/40">Mute &middot; the drop on film</p>
        {/* Four 9:16 blocks; the row is capped so it fits the first screen on any width. */}
        <ul
          className="mx-auto grid w-full grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
          style={{ maxWidth: "min(1560px, calc((100svh - 11rem) * 9 / 16 * 4 + 3rem))" }}
        >
          {cards}
        </ul>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-mint-deep">Reels</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            <StaggerText>All six, in motion.</StaggerText>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-ink/60">Tap the speaker for sound. Tap a name to shop it.</p>
      </Reveal>
      {/* Six equal tiles: three across on desktop, two on phones. */}
      <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">{cards}</ul>
    </section>
  );
}
