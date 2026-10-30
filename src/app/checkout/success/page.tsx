import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";
import { OrderComplete, type OrderSummary } from "@/components/OrderComplete";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

async function loadOrder(sessionId: string | undefined): Promise<OrderSummary | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!sessionId || !key) return null;
  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });
    if (session.payment_status !== "paid") return null;
    const contents = (session.line_items?.data ?? []).map((li) => {
      const product = li.price?.product;
      const id =
        product && typeof product === "object" && "metadata" in product
          ? (product.metadata?.productId ?? li.id)
          : li.id;
      return { id, quantity: li.quantity ?? 1 };
    });
    return {
      id: session.id,
      value: (session.amount_total ?? 0) / 100,
      currency: session.currency ?? "pkr",
      contents,
    };
  } catch {
    return null;
  }
}

export default async function SuccessPage(props: PageProps<"/checkout/success">) {
  const { session_id } = await props.searchParams;
  const order = await loadOrder(typeof session_id === "string" ? session_id : undefined);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-ink/50">Thank you</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Order confirmed.</h1>
      <p className="mt-4 text-ink/70">
        A receipt is on its way to your inbox. We will email again when your tees ship.
      </p>
      <OrderComplete order={order} />
      <Link
        href="/shop"
        className="mt-10 inline-flex h-11 items-center rounded-md border border-ink/20 px-6 text-sm font-medium hover:border-ink"
      >
        Back to shop
      </Link>
    </div>
  );
}
