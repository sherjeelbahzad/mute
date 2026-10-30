// Meta Pixel helpers. Every call is a safe no-op when the pixel is not loaded
// (no NEXT_PUBLIC_META_PIXEL_ID, ad blocker, server render).
import { siteConfig } from "./config";
import type { Product } from "./products";

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

function fbq(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq(...args);
}

const currency = siteConfig.currency.toUpperCase();

export function trackPageView() {
  fbq("track", "PageView");
}

export function trackViewContent(product: Product) {
  fbq("track", "ViewContent", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value: product.price,
    currency,
  });
}

export function trackAddToCart(product: Product, size: string, qty = 1) {
  fbq("track", "AddToCart", {
    content_ids: [product.id],
    content_name: `${product.name} (${size})`,
    content_type: "product",
    contents: [{ id: product.id, quantity: qty }],
    value: product.price * qty,
    currency,
  });
}

export function trackInitiateCheckout(
  lines: { productId: string; qty: number }[],
  value: number,
) {
  fbq("track", "InitiateCheckout", {
    content_ids: lines.map((l) => l.productId),
    content_type: "product",
    contents: lines.map((l) => ({ id: l.productId, quantity: l.qty })),
    num_items: lines.reduce((n, l) => n + l.qty, 0),
    value,
    currency,
  });
}

export function trackPurchase(
  order: { id: string; value: number; currency: string; contents: { id: string; quantity: number }[] },
) {
  // eventID lets Meta de-duplicate this against a server-side Conversions API
  // event with the same ID, if you add one later.
  fbq(
    "track",
    "Purchase",
    {
      content_ids: order.contents.map((c) => c.id),
      content_type: "product",
      contents: order.contents,
      num_items: order.contents.reduce((n, c) => n + c.quantity, 0),
      value: order.value,
      currency: order.currency.toUpperCase(),
    },
    { eventID: order.id },
  );
}
