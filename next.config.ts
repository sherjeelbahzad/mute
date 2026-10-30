import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain static generation: the catalog is a file, so every page can be fully prerendered.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
