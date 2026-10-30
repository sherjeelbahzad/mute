"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/config";
import { trackInitiateCheckout } from "@/lib/pixel";

export function CartView() {
  const cart = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setCheckingOut(true);
    setError(null);
    trackInitiateCheckout(cart.lines, cart.total);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.lines }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout is unavailable right now.");
      }
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setCheckingOut(false);
    }
  }

  if (!cart.hydrated) {
    return <p className="text-sm text-ink/60">Loading your cart...</p>;
  }

  if (cart.lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-ink/60">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper hover:opacity-85"
        >
          Shop tees
        </Link>
      </div>
    );
  }

  const remaining = siteConfig.freeShippingThreshold - cart.subtotal;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
      <ul className="divide-y divide-ink/10">
        {cart.lines.map((line) => {
          const p = getProductById(line.productId);
          if (!p) return null;
          return (
            <li key={`${line.productId}-${line.size}`} className="flex gap-5 py-6">
              <Link
                href={`/shop/${p.slug}`}
                className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md bg-stone-100"
              >
                <Image src={p.image} alt={p.name} fill sizes="96px" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/shop/${p.slug}`} className="font-medium hover:opacity-60">
                      {p.name}
                    </Link>
                    <p className="text-sm text-ink/60">
                      {p.colour} &middot; Size {line.size}
                    </p>
                  </div>
                  <p className="tabular-nums">{formatPrice(p.price * line.qty)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center rounded-md border border-ink/20">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      className="h-9 w-9 hover:bg-ink/5"
                      onClick={() => cart.setQty(line.productId, line.size, line.qty - 1)}
                    >
                      &minus;
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums">{line.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="h-9 w-9 hover:bg-ink/5"
                      onClick={() => cart.setQty(line.productId, line.size, line.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-ink/60 underline underline-offset-4 hover:opacity-60"
                    onClick={() => cart.remove(line.productId, line.size)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className="h-fit rounded-lg border border-ink/10 p-6 lg:sticky lg:top-24">
        <h2 className="font-medium">Summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink/60">Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(cart.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/60">Shipping</dt>
            <dd className="tabular-nums">{cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-medium">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatPrice(cart.total)}</dd>
          </div>
        </dl>
        {remaining > 0 && (
          <p className="mt-3 text-xs text-ink/60">Add {formatPrice(remaining)} more for free shipping.</p>
        )}
        <button
          type="button"
          onClick={checkout}
          disabled={checkingOut}
          className="mt-6 h-12 w-full rounded-full bg-mint font-display text-sm font-bold text-ink transition-colors hover:bg-mint-deep hover:text-paper disabled:opacity-50"
        >
          {checkingOut ? "Redirecting..." : "Checkout"}
        </button>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <p className="mt-4 text-center text-xs text-ink/50">Secure payment via Stripe.</p>
      </aside>
    </div>
  );
}
