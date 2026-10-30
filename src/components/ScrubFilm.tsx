"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/format";

export type Film = { src: string; poster: string; productId: string };

/**
 * Films that play only as you scroll, one tee after another, in a single pinned section.
 * Each film owns `perFilm` screens of scrolling; scroll position maps to video time.
 * Files must be encoded with a keyframe on every frame (see README) or seeking stutters.
 */
export function ScrubFilms({ films, perFilm = 2 }: { films: Film[]; perFilm?: number }) {
  const N = films.length;
  const section = useRef<HTMLElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let raf = 0;
    let target = 0; // 0..N
    let shown = 0;

    const measure = () => {
      const r = el.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      target = range > 0 ? Math.min(N, Math.max(0, (-r.top / range) * N)) : 0;
      const i = Math.min(N - 1, Math.floor(target));
      setActive((prev) => (prev === i ? prev : i));
      setDone(target - i > 0.92 || target >= N);
    };

    // Glide toward the scroll position every frame; wheels move in steps.
    const tick = () => {
      shown += (target - shown) * 0.14;
      if (Math.abs(target - shown) < 0.0005) shown = target;
      const i = Math.min(N - 1, Math.floor(shown));
      const t = Math.min(1, shown - i);
      const v = videos.current[i];
      if (v && v.duration && v.readyState >= 2) {
        const time = t * (v.duration - 0.05);
        if (Math.abs(v.currentTime - time) > 0.02) v.currentTime = time;
      }
      // Films that are not current rest on their first or last frame.
      videos.current.forEach((o, k) => {
        if (!o || k === i || !o.duration || o.readyState < 2) return;
        const rest = k < i ? o.duration - 0.05 : 0;
        if (Math.abs(o.currentTime - rest) > 0.05) o.currentTime = rest;
      });
      if (bar.current) bar.current.style.transform = `scaleX(${t})`;
      raf = requestAnimationFrame(tick);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [N]);

  const product = getProductById(films[active]?.productId ?? "");

  return (
    <section ref={section} className="relative" style={{ height: `calc(${N * perFilm + 1} * 100svh)` }}>
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-center justify-center overflow-hidden px-4 sm:px-6">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-[auto_1fr] lg:gap-12">
          <div className="relative mx-auto aspect-[9/16] h-[min(58svh,520px)] overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_40px_80px_-30px_rgba(15,22,19,0.5)] sm:h-[min(70svh,700px)] lg:h-[min(78svh,760px)]">
            {films.map((f, i) => (
              <video
                key={f.src}
                ref={(el) => {
                  videos.current[i] = el;
                }}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
                src={f.src}
                poster={f.poster}
                muted
                playsInline
                // The current film and the next one are fetched ahead; the rest wait for their turn.
                preload={i <= active + 1 ? "auto" : "metadata"}
              />
            ))}
            <div className="absolute inset-x-4 bottom-4 h-1 overflow-hidden rounded-full bg-paper/30">
              <div ref={bar} className="h-full w-full origin-left bg-mint" style={{ transform: "scaleX(0)" }} />
            </div>
            <p className="absolute left-4 top-4 rounded-full bg-ink/60 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-paper backdrop-blur">
              {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </p>
          </div>

          {product && (
            <div key={product.id} className="showcase-text text-center lg:text-left">
              <p className="text-xs uppercase tracking-[0.25em] text-mint-deep">Scroll to play</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">{product.name}</h2>
              <p className="mt-3 text-ink/60">
                {product.colour} &middot; {formatPrice(product.price)}
              </p>
              <p className="mx-auto mt-5 hidden max-w-md text-ink/70 sm:block lg:mx-0">{product.description}</p>
              <Link
                href={`/shop/${product.slug}`}
                className={`mt-7 inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition-all duration-500 hover:scale-[1.03] ${
                  done ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
              >
                Shop the {product.name}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
