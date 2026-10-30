import Stripe from "stripe";
import { getProductById } from "@/lib/products";
import { siteConfig, type Size } from "@/lib/config";

type IncomingLine = { productId?: unknown; size?: unknown; qty?: unknown };

function toMinorUnits(amount: number) {
  return Math.round(amount * 100);
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return Response.json(
      { error: "Checkout is not configured yet. Add STRIPE_SECRET_KEY to .env.local." },
      { status: 503 },
    );
  }

  let body: { items?: IncomingLine[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return Response.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Re-derive every price from the server-side catalog. Never trust client totals.
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotal = 0;

  for (const item of items) {
    const product = typeof item.productId === "string" ? getProductById(item.productId) : undefined;
    const size = typeof item.size === "string" ? (item.size as Size) : undefined;
    const qty = typeof item.qty === "number" ? Math.floor(item.qty) : 0;

    if (!product || !size || !siteConfig.sizes.includes(size) || qty < 1 || qty > 10) {
      return Response.json({ error: "One of the items in your cart is invalid." }, { status: 400 });
    }
    if (product.soldOutSizes?.includes(size)) {
      return Response.json(
        { error: `${product.name} is sold out in size ${size}.` },
        { status: 400 },
      );
    }

    subtotal += product.price * qty;
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: siteConfig.currency,
        unit_amount: toMinorUnits(product.price),
        product_data: {
          name: `${product.name} (${size})`,
          description: `${product.colour} - Size ${size}`,
          metadata: { productId: product.id, size },
        },
      },
    });
  }

  const shipping = subtotal >= siteConfig.freeShippingThreshold ? 0 : siteConfig.flatShipping;
  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["PK", "AE", "SA", "GB", "US", "CA", "AU"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: shipping === 0 ? "Free shipping" : "Standard shipping",
            fixed_amount: { amount: toMinorUnits(shipping), currency: siteConfig.currency },
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error", err);
    return Response.json({ error: "Could not start checkout. Please try again." }, { status: 502 });
  }
}
