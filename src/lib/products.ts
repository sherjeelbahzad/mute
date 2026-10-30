export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number; // major units (rupees)
  colour: string;
  hex: string;
  category: "graphic" | "simple";
  description: string;
  details: string[];
  image: string; // main picture (cards, share image, catalog feed)
  hover: string; // picture shown when hovering a card
  gallery: string[]; // every other picture, shown as thumbnails
  video?: { src: string; poster?: string }; // optional product video (mp4)
  featured?: boolean;
  badge?: string;
  soldOutSizes?: string[];
};

/** Photos live at public/products/<slug>/01.jpg ... NN.jpg */
function shots(slug: string, count: number) {
  return Array.from({ length: count }, (_, i) => `/products/${slug}/${String(i + 1).padStart(2, "0")}.jpg`);
}

/** Build the picture fields from a folder of numbered photos. `main` and `hover` are 1-based. */
function pictures(slug: string, count: number, main: number, hover: number) {
  const all = shots(slug, count);
  return {
    image: all[main - 1],
    hover: all[hover - 1],
    gallery: all.filter((_, i) => i !== main - 1),
  };
}

/** Brand reels live at public/media/reels/reel-NN.mp4 with a matching reel-NN.jpg poster. */
export function reel(n: string) {
  return { src: `/media/reels/reel-${n}.mp4`, poster: `/media/reels/reel-${n}.jpg` };
}

const fabric = ["240 gsm combed cotton", "Regular fit, ribbed crew neck", "Pre-washed, no shrink"];

export const products: Product[] = [
  {
    id: "astronaut",
    slug: "astronaut",
    name: "Astronaut Dunk",
    price: 3200,
    colour: "Black",
    hex: "#121212",
    category: "graphic",
    description:
      "An astronaut dunking the planet through a hoop on your chest. Side-body print that wraps the hem, small hoop at the heart.",
    details: ["Two-position screen print", ...fabric],
    ...pictures("astronaut", 8, 6, 4),
    video: reel("01"),
    featured: true,
    badge: "Best seller",
  },
  {
    id: "not-found",
    slug: "not-found",
    name: "Not Found",
    price: 3200,
    colour: "Black",
    hex: "#121212",
    category: "graphic",
    description:
      "A 404 for your torso. Hand-drawn orbit lines circling three crossed-out marks, under a NOT FOUND block across the chest.",
    details: ["Single-colour screen print", ...fabric],
    ...pictures("not-found", 8, 5, 2),
    video: reel("02"),
    featured: true,
    badge: "New",
  },
  {
    id: "map",
    slug: "map",
    name: "Map",
    price: 3000,
    colour: "Commando Green",
    hex: "#3f4a24",
    category: "graphic",
    description:
      "The outline of home, provinces and all, drawn in one white line across the chest. Quiet from far away, obvious up close.",
    details: ["Single-line chest print", ...fabric],
    ...pictures("map", 11, 10, 2),
    video: reel("03"),
    featured: true,
  },
  {
    id: "mute-wordmark",
    slug: "mute-wordmark",
    name: "Mute Wordmark",
    price: 3000,
    colour: "Grey",
    hex: "#9b9b9d",
    category: "graphic",
    description:
      "Our name, cut up and stacked twice. The glitch is the point: the only shirt we make that says Mute out loud.",
    details: ["Chest print, charcoal on grey", ...fabric],
    ...pictures("mute-wordmark", 8, 4, 6),
    video: reel("04"),
    featured: true,
  },
  {
    id: "simple-green",
    slug: "simple-green",
    name: "Simple Tee",
    price: 2500,
    colour: "Commando Green",
    hex: "#3f4a24",
    category: "simple",
    description: "The blank. Same heavyweight cotton as the graphics, no print, nothing to explain.",
    details: ["No print, tagless neck", ...fabric],
    ...pictures("simple-green", 10, 4, 6),
    video: reel("05"),
  },
  {
    id: "simple-grey",
    slug: "simple-grey",
    name: "Simple Tee",
    price: 2500,
    colour: "Grey",
    hex: "#9b9b9d",
    category: "simple",
    description: "The blank, in grey. Same heavyweight cotton as the graphics, no print, nothing to explain.",
    details: ["No print, tagless neck", ...fabric],
    ...pictures("simple-grey", 7, 1, 5),
    video: reel("06"),
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function featuredProducts() {
  return products.filter((p) => p.featured);
}

/** Hand-picked shots for the home page lookbook: [product id, 1-based photo number]. */
export const lookbook: [string, number][] = [
  ["astronaut", 4],
  ["map", 2],
  ["not-found", 1],
  ["mute-wordmark", 8],
  ["simple-green", 2],
  ["not-found", 6],
  ["astronaut", 1],
  ["map", 6],
];

export function shot(productId: string, n: number) {
  return `/products/${productId}/${String(n).padStart(2, "0")}.jpg`;
}
