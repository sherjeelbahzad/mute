import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Every Mute tee: four graphics, two blanks.",
};

const groups = [
  { id: "graphic", title: "Graphics", blurb: "One print per shirt. Astronaut, Not Found, Map, Wordmark." },
  { id: "simple", title: "Simples", blurb: "The same heavyweight cotton with nothing on it." },
] as const;

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.25em] text-mint-deep">Shop</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-6xl">All tees</h1>
        <p className="mt-3 text-ink/60">{products.length} styles. One fit. Six sizes.</p>
      </Reveal>

      {groups.map((g) => {
        const items = products.filter((p) => p.category === g.id);
        return (
          <section key={g.id} id={g.id} className="mt-14 scroll-mt-24">
            <Reveal className="flex items-baseline justify-between border-t border-ink/10 pt-6">
              <h2 className="font-display text-xl font-bold">{g.title}</h2>
              <p className="hidden text-sm text-ink/60 sm:block">{g.blurb}</p>
            </Reveal>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <ProductCard product={p} priority={g.id === "graphic" && i < 4} />
                </Reveal>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
