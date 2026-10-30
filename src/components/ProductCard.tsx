import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block rounded-2xl bg-white p-2 ring-1 ring-ink/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-24px_rgba(15,22,19,0.35)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-100">
        <Image
          src={product.image}
          alt={`${product.name} in ${product.colour}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          priority={priority}
        />
        <Image
          src={product.hover}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover opacity-0 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-mint px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-3 px-2 pb-2 pt-3">
        <div>
          <p className="font-display text-sm font-bold">{product.name}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/60">
            <span className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-ink/10" style={{ backgroundColor: product.hex }} />
            {product.colour}
          </p>
        </div>
        <p className="rounded-full bg-mint-soft px-2.5 py-1 text-xs font-medium tabular-nums">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
