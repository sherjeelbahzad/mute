import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { Reveal } from "@/components/Reveal";
import { ViewContentTracker } from "@/components/ViewContentTracker";
import { getProduct, products } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/config";

// Every product is known at build time; anything else is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) return { title: "Not found" };
  return {
    title: `${product.name} in ${product.colour}`,
    description: product.description,
    openGraph: {
      type: "website",
      title: `${product.name} | ${siteConfig.name}`,
      description: product.description,
      images: [{ url: product.image, alt: `${product.name} in ${product.colour}` }],
    },
    other: {
      // Lets Meta match this page to the catalog item with the same id.
      "product:retailer_item_id": product.id,
      "product:price:amount": product.price.toFixed(2),
      "product:price:currency": siteConfig.currency.toUpperCase(),
    },
  };
}

export default async function ProductPage(props: PageProps<"/shop/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <ViewContentTracker product={product} />

      <nav className="text-sm text-ink/60">
        <Link href="/shop" className="hover:opacity-60">
          Shop
        </Link>{" "}
        / <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <ProductGallery product={product} />

        <div className="lg:sticky lg:top-28 lg:self-start">
          {product.badge && (
            <span className="inline-block rounded-full bg-mint px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">
              {product.badge}
            </span>
          )}
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-ink/60">
            <span
              className="inline-block h-3.5 w-3.5 rounded-full ring-1 ring-ink/10"
              style={{ backgroundColor: product.hex }}
              aria-hidden
            />
            {product.colour}
          </div>
          <p className="mt-5 font-display text-2xl font-bold tabular-nums">{formatPrice(product.price)}</p>
          <p className="mt-6 text-ink/70">{product.description}</p>

          <AddToCart product={product} />

          <ul className="mt-10 grid gap-2 border-t border-ink/10 pt-6 text-sm text-ink/70 sm:grid-cols-2">
            {product.details.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="text-mint-deep" aria-hidden>
                  &#10003;
                </span>
                {d}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-ink/50">
            Free shipping over {formatPrice(siteConfig.freeShippingThreshold)}. 30-day returns on unworn tees.
          </p>
        </div>
      </div>

      <section className="mt-24">
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">You might also like</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
