"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { getProductById } from "./products";
import { siteConfig, type Size } from "./config";

export type CartLine = { productId: string; size: Size; qty: number };

const STORAGE_KEY = "mute-cart-v1";
const MAX_QTY = 10;
const EMPTY: CartLine[] = [];

// A tiny external store so the cart survives navigation and reloads
// (localStorage) without state-in-effect hacks. Server snapshot is always
// empty; the real cart appears right after hydration.
let cached: CartLine[] | null = null;
const listeners = new Set<() => void>();

function isValidLine(l: unknown): l is CartLine {
  if (!l || typeof l !== "object") return false;
  const { productId, size, qty } = l as Record<string, unknown>;
  return (
    typeof productId === "string" &&
    !!getProductById(productId) &&
    typeof size === "string" &&
    (siteConfig.sizes as readonly string[]).includes(size) &&
    typeof qty === "number" &&
    qty > 0
  );
}

function read(): CartLine[] {
  if (cached) return cached;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cached = Array.isArray(parsed) ? parsed.filter(isValidLine) : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function write(next: CartLine[]) {
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable (private mode, quota) - cart still works in memory */
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cached = null; // another tab changed the cart; re-read lazily
      fn();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

const getServerSnapshot = () => EMPTY;
const subscribeNoop = () => () => {};

function sameLine(a: CartLine, productId: string, size: Size) {
  return a.productId === productId && a.size === size;
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, read, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  const add = useCallback((productId: string, size: Size, qty = 1) => {
    const prev = read();
    const idx = prev.findIndex((l) => sameLine(l, productId, size));
    if (idx === -1) {
      write([...prev, { productId, size, qty: Math.min(MAX_QTY, qty) }]);
    } else {
      const next = [...prev];
      next[idx] = { ...next[idx], qty: Math.min(MAX_QTY, next[idx].qty + qty) };
      write(next);
    }
  }, []);

  const setQty = useCallback((productId: string, size: Size, qty: number) => {
    const prev = read();
    write(
      qty <= 0
        ? prev.filter((l) => !sameLine(l, productId, size))
        : prev.map((l) => (sameLine(l, productId, size) ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);

  const remove = useCallback((productId: string, size: Size) => {
    write(read().filter((l) => !sameLine(l, productId, size)));
  }, []);

  const clear = useCallback(() => write(EMPTY), []);

  return useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((sum, l) => {
      const p = getProductById(l.productId);
      return sum + (p ? p.price * l.qty : 0);
    }, 0);
    const shipping =
      subtotal === 0 || subtotal >= siteConfig.freeShippingThreshold ? 0 : siteConfig.flatShipping;
    return {
      lines,
      hydrated,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      add,
      setQty,
      remove,
      clear,
    };
  }, [lines, hydrated, add, setQty, remove, clear]);
}
