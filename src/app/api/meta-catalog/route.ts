// Product feed for Meta Commerce Manager (Facebook / Instagram Shops and
// catalog ads). In Commerce Manager: Catalog -> Data sources -> Scheduled feed,
// and paste <your site>/api/meta-catalog. Product ids match the pixel's
// content_ids so Meta can attribute views, carts and purchases to catalog items.
import { products } from "@/lib/products";
import { siteConfig } from "@/lib/config";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const columns = [
  "id",
  "title",
  "description",
  "availability",
  "condition",
  "price",
  "link",
  "image_link",
  "additional_image_link",
  "brand",
  "google_product_category",
  "size",
  "color",
];

function csvCell(value: string) {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function GET() {
  const currency = siteConfig.currency.toUpperCase();
  const rows = products.map((p) => {
    const available = siteConfig.sizes.some((s) => !p.soldOutSizes?.includes(s));
    const sizes = siteConfig.sizes.filter((s) => !p.soldOutSizes?.includes(s)).join("/");
    return [
      p.id,
      `${siteConfig.name} ${p.name}`,
      p.description,
      available ? "in stock" : "out of stock",
      "new",
      `${p.price.toFixed(2)} ${currency}`,
      `${SITE_URL}/shop/${p.slug}`,
      `${SITE_URL}${p.image}`,
      (p.gallery ?? []).map((g) => `${SITE_URL}${g}`).join(","),
      siteConfig.name,
      "Apparel & Accessories > Clothing > Shirts & Tops",
      sizes,
      p.colour,
    ]
      .map(csvCell)
      .join(",");
  });

  const body = [columns.join(","), ...rows].join("\n");
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="mute-catalog.csv"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
