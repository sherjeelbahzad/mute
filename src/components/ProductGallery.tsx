"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/products";

type Slide = { kind: "image"; src: string } | { kind: "video"; src: string; poster?: string };

export function ProductGallery({ product }: { product: Product }) {
  const slides: Slide[] = [
    { kind: "image", src: product.image },
    ...(product.gallery ?? []).map((src) => ({ kind: "image" as const, src })),
    ...(product.video ? [{ kind: "video" as const, ...product.video }] : []),
  ];
  const [active, setActive] = useState(0);
  const current = slides[active] ?? slides[0];
  const alt = `${product.name} in ${product.colour}`;

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-stone-100">
        {current.kind === "video" ? (
          <video
            key={current.src}
            className="absolute inset-0 h-full w-full object-cover"
            src={current.src}
            poster={current.poster ?? product.image}
            controls
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <Image
            key={current.src}
            src={current.src}
            alt={`${alt}, view ${active + 1}`}
            fill
            priority={active === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>

      {slides.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto" aria-label="Product media">
          {slides.map((s, i) => (
            <li key={s.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={s.kind === "video" ? "Play video" : `Show picture ${i + 1}`}
                aria-current={i === active}
                className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-md border bg-stone-100 ${
                  i === active ? "border-ink" : "border-transparent hover:border-ink/40"
                }`}
              >
                <Image
                  src={s.kind === "video" ? (s.poster ?? product.image) : s.src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
                {s.kind === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/30 text-paper">
                    &#9654;
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
