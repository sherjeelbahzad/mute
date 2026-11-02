import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer data-scene-stop className="relative mt-24 overflow-hidden bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 text-sm sm:grid-cols-3 sm:px-6">
        <div>
          <Image src="/brand/logo.png" alt="Mute" width={44} height={47} className="h-11 w-auto" />
          <p className="mt-4 max-w-xs text-paper/60">{siteConfig.description}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-mint">Shop</p>
          <Link href="/shop" className="hover:text-mint">All tees</Link>
          <Link href="/shop#graphic" className="hover:text-mint">Graphics</Link>
          <Link href="/shop#simple" className="hover:text-mint">Simples</Link>
          <Link href="/about#sizing" className="hover:text-mint">Size guide</Link>
        </div>
        <div className="flex flex-col gap-2">
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-mint">Talk</p>
          <a href={`mailto:${siteConfig.social.email}`} className="hover:text-mint">
            {siteConfig.social.email}
          </a>
          <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="hover:text-mint">
            Instagram
          </a>
          <Link href="/about" className="hover:text-mint">Shipping and returns</Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 pb-6 text-xs text-paper/40 sm:px-6">
        <p>
          &copy; {siteConfig.foundedYear} {siteConfig.name}. {siteConfig.tagline}
        </p>
        <p className="flex gap-5">
          <Link href="/privacy" className="hover:text-mint">Privacy</Link>
          <Link href="/terms" className="hover:text-mint">Terms</Link>
        </p>
      </div>
      <p
        aria-hidden
        className="drift pointer-events-none select-none px-4 font-display text-[22vw] font-bold leading-[0.75] tracking-tighter text-mint/10 sm:px-6"
        style={{ "--drift": "90px" } as React.CSSProperties}
      >
        mute
      </p>
    </footer>
  );
}
