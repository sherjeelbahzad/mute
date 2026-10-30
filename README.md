# Mute — storefront

E-commerce site for the Mute T-shirt brand. Built with Next.js (App Router), Tailwind CSS and Stripe Checkout. Prices in Pakistani rupees (PKR).

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the keys
npm run dev
```

Open http://localhost:3000.

Without a Stripe key the whole site works except the final Checkout button, which shows a "not configured" message. Without a Meta Pixel ID, no tracking code is loaded at all.

## Where things live

| What | Where |
| --- | --- |
| Products (names, prices, colours, pictures, video) | `src/lib/products.ts` |
| Banners, announcement bar | `src/lib/content.ts` |
| Store settings (currency, shipping, sizes, contact) | `src/lib/config.ts` |
| Product photos | `public/products/<id>/01.jpg ...` (web-sized exports of the studio shoot) |
| Logo and share image | `public/brand/logo.png`, `public/media/og.jpg`, favicon at `src/app/icon.png` |
| Banner pictures and videos | `public/media/` |
| Brand colours and display font | `src/app/globals.css` (mint `#8ACFB5`, ink, paper; Unbounded for headlines) |
| Cart state (persisted in localStorage) | `src/lib/cart.tsx` |
| Drop-in animated components (Vengeance UI, Skiper UI, Animata) | `src/components/ui/`: Stagger Text (section headings), Stats Counter (hero numbers), Line Hover Link (nav underline), Animated Tooltip ("Which size?" on product pages), Animated Button ("Add to cart"), all from https://www.vengenceui.com/components (MIT). See the `ui-components` skill in `.claude/skills/` for how to add more |
| Stripe Checkout session | `src/app/api/checkout/route.ts` |
| Meta Pixel events | `src/lib/pixel.ts`, `src/components/MetaPixel.tsx` |
| Meta catalog feed | `src/app/api/meta-catalog/route.ts` |
| Pages | `src/app/` (home, shop, shop/[slug], cart, about, checkout/success) |

## Pictures, banners and videos

Drop files into `public/` and reference them by path.

**Product pictures and video** — in `src/lib/products.ts`. Each product's photos live in `public/products/<id>/` as `01.jpg`, `02.jpg`, and so on. The `pictures(id, count, main, hover)` helper picks the main card photo, the photo shown on hover, and puts the rest in the gallery:

```ts
...pictures("astronaut", 5, 3, 1),   // 5 photos; #3 on the card, #1 on hover
video: { src: "/products/astronaut/film.mp4", poster: "/products/astronaut/06.jpg" },  // optional
```

To add photos to a design, drop more numbered JPGs in its folder (keep them around 1600px tall) and bump the count. The product page shows thumbnails for every picture plus a play button for the video. The home page lookbook picks specific shots in the `lookbook` list at the bottom of the same file.

The original photos were exported from `E:\Mute Img` with ffmpeg at 1600px height, quality 4. Re-run that export if you replace the shoot.

**Reels** (the vertical brand videos) live in `public/media/reels/` as `reel-NN.mp4` with a `reel-NN.jpg` poster, exported from `E:\mute brand reel video` at 720x1280 (H.264, CRF 27, AAC 96k). The `reels` list in `src/lib/content.ts` picks which ones show in the swipeable strip on the home page and which product each links to; `video: reel("NN")` on a product in `src/lib/products.ts` adds it to that product's gallery. Reels 01-06 are the six tees in catalogue order, 13 a short extra. (The second model's reels and photos were removed from the site; the originals are still in `E:\Mute Img` and `E:\mute brand reel video`.)

**Hero banners** (top of the home page) and **promo banners** (further down) — in `src/lib/content.ts`. Each banner is a picture or a video plus headline, body and button:

```ts
{
  id: "studio-film",
  media: { type: "video", src: "/media/hero.mp4", poster: "/media/hero.jpg" },
  eyebrow: "New season",
  headline: "Say less.",
  cta: { label: "Shop", href: "/shop" },
  text: "light",   // or "dark", depending on the media
}
```

With more than one hero banner the home page becomes an auto-rotating carousel. The announcement strip above the header is `announcement` in the same file; set its text to `""` to hide it.

Tips: banners look best at 1600x900 or wider. Use mp4 (H.264) for video, keep hero videos short and under ~5 MB, and always give a `poster`. Facebook and Instagram will not render SVG share images, so replace the placeholder SVGs with JPG or PNG before running ads.

## Scroll-driven 3D scene

The home page (`src/app/page.tsx`) is a scroll story:

1. **The drop on film.** Four reels fill the first screen (`Reels variant="hero"`), playing muted while on screen; the speaker button unmutes one at a time.
2. **Every tee's film, played by the scrollbar.** `ScrubFilms` is one pinned section with six films (`films` in `src/lib/content.ts`). Each film owns two screens of scrolling: scroll position maps to video time, so the model moves only as you scroll. The name, price and description sit beside it and the Shop button appears when the film reaches its end. The files are `public/media/reels/scrub-NN.mp4`: 540x960, silent, encoded with a keyframe on every frame (`-g 1 -keyint_min 1 -bf 0`) so any seek is instant. A normal mp4 will stutter here.
3. **The motto**, where the copy rises in on scroll (CSS `.motto-in` / `.motto-flip`) and the brand mark revolves in 3D beside it. That mark is the only WebGL on the site (`src/components/three/ScrollScene.tsx`, mounted by `SceneLoader` in the root layout, glued to `#logo-anchor` in `Hero.tsx`). It is skipped for `prefers-reduced-motion`, and if WebGL fails the page renders without it.
4. Marquee, the product grid, the collage of all six reels, the lookbook and the brand section.

DOM visuals also move with CSS scroll timelines (no JS): `.drift` parallaxes any picture inside its frame (`--drift` sets the distance). Defined in `src/app/globals.css`; browsers without scroll-timeline support just see the static layout.

## Meta (Facebook / Instagram)

1. **Pixel** — put your Pixel ID in `NEXT_PUBLIC_META_PIXEL_ID`. The site then fires PageView on every page, ViewContent on product pages, AddToCart, InitiateCheckout, and Purchase (with order value and currency) on the confirmation page. Check them in Events Manager > Test events.
2. **Catalog** — in Commerce Manager add a scheduled feed pointing at `https://<your-domain>/api/meta-catalog`. Product IDs in the feed match the pixel's `content_ids`, so dynamic ads and Instagram Shopping tags work.
3. **Sharing** — every page has Open Graph tags; product pages also carry price and retailer item id tags so Meta can link them to the catalog.
4. **Conversions API** (server-side events) is not set up. The Purchase event already sends an `eventID` (the Stripe session id), so adding CAPI later will de-duplicate cleanly.

## Payments

Checkout uses Stripe-hosted Checkout, so no card data touches this app. Shipping is a flat rate below the free-shipping threshold set in `src/lib/config.ts`. Allowed shipping countries are listed in the checkout route.

Note: Stripe does not currently onboard merchants based in Pakistan. You need a Stripe account registered in a supported country, or swap the checkout route for a local gateway (Safepay, PayFast, JazzCash). The cart and pricing code does not depend on Stripe.

To go live: swap the `sk_test_` key for your `sk_live_` key in the hosting provider's environment variables.

## Adding a product

1. Add an entry to the `products` array in `src/lib/products.ts`.
2. Put its pictures in `public/products/` and reference them in `image` and `gallery`.
3. Mark sizes that are out of stock in `soldOutSizes`.

Prices are always taken from this file on the server, so the client can never change what it pays.

## Deploy

Push to GitHub and import the repo on [Vercel](https://vercel.com/new). Add `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL` (your real domain, used for share tags and the catalog feed) and `NEXT_PUBLIC_META_PIXEL_ID` as environment variables.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint
