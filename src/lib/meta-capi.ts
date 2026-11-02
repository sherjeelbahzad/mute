import { createHash } from "node:crypto";

/**
 * Meta Conversions API: the server-side copy of the browser Purchase event.
 * Sends nothing unless NEXT_PUBLIC_META_PIXEL_ID and META_CAPI_ACCESS_TOKEN are set.
 * The event_id equals the Stripe session id, which the browser pixel also sends as eventID,
 * so Meta counts the sale once even when both arrive.
 */

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE;
const GRAPH_VERSION = process.env.META_GRAPH_VERSION ?? "v23.0";

export const capiEnabled = Boolean(PIXEL_ID && ACCESS_TOKEN);

function sha256(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export type PurchaseEvent = {
  /** Stripe Checkout session id; must match the browser event's eventID */
  orderId: string;
  value: number;
  currency: string;
  contents: { id: string; quantity: number }[];
  /** Page the event happened on */
  sourceUrl: string;
  /** Customer signals; all optional, more is better for matching */
  email?: string | null;
  phone?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
};

export async function sendPurchaseToMeta(e: PurchaseEvent): Promise<void> {
  if (!capiEnabled) return;

  const userData: Record<string, unknown> = {};
  if (e.email) userData.em = [sha256(e.email)];
  if (e.phone) userData.ph = [sha256(e.phone.replace(/[^\d]/g, ""))];
  if (e.clientIp) userData.client_ip_address = e.clientIp;
  if (e.userAgent) userData.client_user_agent = e.userAgent;
  if (e.fbp) userData.fbp = e.fbp;
  if (e.fbc) userData.fbc = e.fbc;

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: e.orderId,
        event_source_url: e.sourceUrl,
        action_source: "website",
        user_data: userData,
        custom_data: {
          currency: e.currency.toUpperCase(),
          value: e.value,
          content_type: "product",
          content_ids: e.contents.map((c) => c.id),
          contents: e.contents.map((c) => ({ id: c.id, quantity: c.quantity })),
          num_items: e.contents.reduce((n, c) => n + c.quantity, 0),
          order_id: e.orderId,
        },
      },
    ],
    access_token: ACCESS_TOKEN,
  };
  if (TEST_EVENT_CODE) body.test_event_code = TEST_EVENT_CODE;

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("Meta CAPI rejected the Purchase event:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Meta CAPI request failed:", err);
  }
}
