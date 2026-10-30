import Link from "next/link";
import { BrandStatement } from "@/components/BrandStatement";
import { Hero } from "@/components/Hero";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Lookbook } from "@/components/Lookbook";
import { Marquee } from "@/components/Marquee";
import { PromoBanner } from "@/components/PromoBanner";
import { ProductCard } from "@/components/ProductCard";
import { Reels } from "@/components/Reels";
import { Reveal } from "@/components/Reveal";
import { ScrubFilms } from "@/components/ScrubFilm";
import { featuredProducts } from "@/lib/products";
import { films, heroBanners, promoBanners } from "@/lib/content";

export default function Home() {
  const featured = featuredProducts();

  return (
    <div>
      {/* 1. the drop on film  2. every tee's film, played by the scrollbar  3. the motto and the revolving mark */}
      <Reels variant="hero" />
      <ScrubFilms films={films} />
      <Hero />
      <Marquee />
      {heroBanners.length > 0 && <HeroCarousel banners={heroBanners} />}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-mint-deep">The drop</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">Four graphics. Two blanks.</h2>
          </div>
          <Link href="/shop" className="text-sm underline underline-offset-4 hover:opacity-60">
            View everything
          </Link>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <ProductCard product={p} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      <Reels variant="collage" />

      {promoBanners.length > 0 && (
        <section className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
          {promoBanners.map((b) => (
            <Reveal key={b.id}>
              <PromoBanner banner={b} />
            </Reveal>
          ))}
        </section>
      )}

      <Lookbook />
      <BrandStatement />
    </div>
  );
}
