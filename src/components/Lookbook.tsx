import Image from "next/image";
import Link from "next/link";
import { getProductById, lookbook, shot } from "@/lib/products";
import { Reveal } from "./Reveal";
import StaggerText from "./ui/staggerText";

// Row spans give the grid an editorial rhythm instead of a uniform tile wall.
const spans = ["row-span-2", "", "", "row-span-2", "", "row-span-2", "", ""];

export function Lookbook() {
  return (
    <section id="lookbook" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-mint-deep">Lookbook</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            <StaggerText>Worn, not styled.</StaggerText>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-ink/60">
          Shot in one afternoon, one light, one model. What you see is what arrives.
        </p>
      </Reveal>
      <ul className="mt-10 grid auto-rows-[220px] grid-cols-2 gap-3 sm:auto-rows-[260px] lg:grid-cols-4">
        {lookbook.map(([id, n], i) => {
          const p = getProductById(id);
          if (!p) return null;
          return (
            <Reveal as="li" key={`${id}-${n}`} delay={(i % 4) * 80} className={`group relative overflow-hidden rounded-2xl bg-stone-100 ${spans[i] ?? ""}`}>
              <Link href={`/shop/${p.slug}`} className="absolute inset-0">
                {/* Oversized, parallaxing crop: the photo slides inside the tile as you scroll. */}
                <div className="drift absolute inset-x-0 -inset-y-10" style={{ "--drift": `${32 + (i % 3) * 14}px` } as React.CSSProperties}>
                  <Image
                    src={shot(id, n)}
                    alt={`${p.name} tee`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                </div>
                <span className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-between rounded-full bg-ink/80 px-4 py-2 text-xs text-paper opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {p.name}
                  <span className="text-mint">&rarr;</span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
