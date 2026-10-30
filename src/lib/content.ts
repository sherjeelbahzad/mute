import { siteConfig } from "./config";
import { formatPrice } from "./format";
import { reel } from "./products";

/**
 * Site content you can edit without touching components.
 *
 * Put media files in `public/media/` and reference them as "/media/<file>".
 * Product photos already live in `public/products/<id>/NN.jpg`; `shot(id, n)`
 * returns the path of one of them.
 * - Pictures: jpg, png or webp. Banners look best at 1600x900 or wider.
 * - Videos: mp4 (H.264). Keep hero videos short, muted and under ~5 MB,
 *   and give a `poster` image so something shows before it loads.
 */

export type BannerMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string };

export type Banner = {
  id: string;
  media: BannerMedia;
  eyebrow?: string;
  headline: string;
  body?: string;
  cta?: { label: string; href: string };
  /** Colour of the text laid over the media. */
  text?: "light" | "dark";
};

/** Thin strip above the header. Set `text` to "" to hide it. */
export const announcement = {
  text: `Free shipping on orders over ${formatPrice(siteConfig.freeShippingThreshold)}`,
  href: "/shop",
};

/**
 * Optional full-width slides shown under the main hero. Leave empty for none.
 * Add one or more banners (picture or video) to show a carousel.
 */
export const heroBanners: Banner[] = [
  // {
  //   id: "studio-film",
  //   media: { type: "video", src: "/media/hero.mp4", poster: shot("astronaut", 4) },
  //   headline: "Made in small runs.",
  //   cta: { label: "Our story", href: "/about" },
  //   text: "light",
  // },
];

/**
 * Vertical brand reels (9:16 mp4) shown as a swipeable strip on the home page.
 * Reels 01-06 are the six tees on the first model, 07-12 the same six on the second, 13 a short extra.
 */
export type Reel = { id: string; src: string; poster: string; productId: string };
export const reels: Reel[] = [
  { id: "reel-01", ...reel("01"), productId: "astronaut" },
  { id: "reel-02", ...reel("02"), productId: "not-found" },
  { id: "reel-03", ...reel("03"), productId: "map" },
  { id: "reel-04", ...reel("04"), productId: "mute-wordmark" },
  { id: "reel-05", ...reel("05"), productId: "simple-green" },
  { id: "reel-06", ...reel("06"), productId: "simple-grey" },
];

/**
 * Scroll-played films, one per tee (public/media/reels/scrub-NN.mp4: 540x960, silent, keyframe on every
 * frame so seeking is instant). The home page plays them in this order, one after another, as you scroll.
 */
export const films = reels.map((r) => ({
  src: r.src.replace("/reel-", "/scrub-"),
  poster: r.poster.replace("/reel-", "/scrub-"),
  productId: r.productId,
}));

/** Wide banners shown further down the home page. Empty for none; example below. */
export const promoBanners: Banner[] = [
  // (import { shot } from "./products" to pick a product photo)
  // {
  //   id: "map",
  //   media: { type: "image", src: shot("map", 2), alt: "Map tee in commando green, close up" },
  //   eyebrow: "Designed in Pakistan",
  //   headline: "Wear the map.",
  //   body: "One white line, every province. The quietest flag you can own.",
  //   cta: { label: "Shop the Map tee", href: "/shop/map" },
  //   text: "light",
  // },
];
