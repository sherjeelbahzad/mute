"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import { trackPurchase } from "@/lib/pixel";
import { siteConfig } from "@/lib/config";

export type OrderSummary = {
  id: string;
  value: number;
  currency: string;
  contents: { id: string; quantity: number }[];
};

/**
 * Fires the Meta Purchase event once and empties the cart.
 * `order` comes from Stripe when available; otherwise we fall back to the
 * local cart so the event still carries a value.
 */
export function OrderComplete({ order }: { order: OrderSummary | null }) {
  const cart = useCart();
  const done = useRef(false);

  useEffect(() => {
    if (!cart.hydrated || done.current) return;
    done.current = true;

    const summary: OrderSummary =
      order ??
      {
        id: `local-${Date.now()}`,
        value: cart.total,
        currency: siteConfig.currency,
        contents: cart.lines.map((l) => ({ id: l.productId, quantity: l.qty })),
      };
    if (summary.contents.length > 0) trackPurchase(summary);
    cart.clear();
  }, [cart, order]);

  if (!order) return null;
  return (
    <p className="mt-4 text-xs text-ink/50">
      Order reference: <span className="font-mono">{order.id.slice(-12)}</span>
    </p>
  );
}
