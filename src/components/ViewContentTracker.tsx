"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/pixel";
import type { Product } from "@/lib/products";

export function ViewContentTracker({ product }: { product: Product }) {
  useEffect(() => {
    trackViewContent(product);
  }, [product]);
  return null;
}
