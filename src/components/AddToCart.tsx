"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { siteConfig, type Size } from "@/lib/config";
import type { Product } from "@/lib/products";
import { trackAddToCart } from "@/lib/pixel";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [size, setSize] = useState<Size | null>(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleAdd() {
    if (!size) {
      setError("Pick a size first.");
      return;
    }
    add(product.id, size);
    trackAddToCart(product, size);
    setError(null);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Size</span>
        <Link href="/about#sizing" className="text-ink/60 underline underline-offset-4 hover:opacity-60">
          Size guide
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-6 gap-2" role="radiogroup" aria-label="Size">
        {siteConfig.sizes.map((s) => {
          const soldOut = product.soldOutSizes?.includes(s);
          const selected = size === s;
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={soldOut}
              onClick={() => {
                setSize(s);
                setError(null);
              }}
              className={`h-11 rounded-full border text-sm transition-colors ${
                selected ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink"
              } disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/30 disabled:line-through disabled:hover:border-ink/10`}
            >
              {s}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      <button
        type="button"
        onClick={handleAdd}
        className="mt-6 h-13 w-full rounded-full bg-mint font-display text-sm font-bold text-ink transition-all hover:bg-mint-deep hover:text-paper"
      >
        {added ? "Added to cart" : "Add to cart"}
      </button>
      {added && (
        <p className="mt-3 text-center text-sm text-ink/60">
          <Link href="/cart" className="underline underline-offset-4">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}
