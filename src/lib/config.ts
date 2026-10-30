export const siteConfig = {
  name: "Mute",
  tagline: "Say less.",
  description:
    "Mute is a heavyweight T-shirt label from Pakistan. Loud ideas, quiet execution: six designs, three colours, nothing that shouts.",
  foundedYear: 2024,
  currency: "pkr", // ISO code used for Stripe + price formatting
  locale: "en-PK",
  freeShippingThreshold: 5000, // in major units (rupees)
  flatShipping: 250,
  sizes: ["XS", "S", "M", "L", "XL", "XXL"] as const,
  social: {
    instagram: "https://instagram.com/",
    email: "hello@mute.example",
  },
};

export type Size = (typeof siteConfig.sizes)[number];
