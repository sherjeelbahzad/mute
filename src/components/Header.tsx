"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Logo } from "./Logo";
import { LineHoverStyles } from "./ui/line-hover-link";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/#lookbook", label: "Lookbook" },
  { href: "/about", label: "About" },
];

export function Header() {
  const { count, hydrated } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-paper/70 backdrop-blur-xl">
      <LineHoverStyles />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-5 text-sm sm:gap-8">
          {nav.map((item) => {
            const active = item.href !== "/#lookbook" && pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                // Vengeance "line hover" underline slides in from the left; the active page keeps a mint line.
                className={`link-hover link-hover--slide hidden sm:inline-flex ${
                  active ? "after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-mint" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 py-1.5 pl-4 pr-1.5 transition-colors hover:border-ink/30"
          >
            Cart
            <span
              className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-mint px-1.5 text-xs font-semibold text-ink tabular-nums"
              aria-label={`${count} items in cart`}
            >
              {hydrated ? count : 0}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
