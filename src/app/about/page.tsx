import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { shot } from "@/lib/products";

export const metadata: Metadata = {
  title: "About",
  description: "Why Mute exists, and how our tees fit.",
};

const sizing = [
  ["XS", "48", "66"],
  ["S", "51", "68"],
  ["M", "54", "70"],
  ["L", "57", "72"],
  ["XL", "60", "74"],
  ["XXL", "63", "76"],
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-mint-deep">About</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Loud ideas.
            <br />
            Quiet shirts.
          </h1>
          <div className="mt-8 space-y-5 text-lg text-ink/70">
            <p>
              {siteConfig.name} started with a simple complaint: every T-shirt we owned was trying too hard.
              Logos, slogans, graphics shouting for attention.
            </p>
            <p>
              So we make the opposite. A short list of heavyweight tees in three quiet colours, each with one
              idea on it and nothing else. An astronaut. A map. A 404. Our own name, broken up.
            </p>
            <p>
              Everything is made in small runs from 240 gsm combed cotton and pre-washed, so the fit you buy is
              the fit you keep.
            </p>
          </div>
        </Reveal>
        <Reveal delay={150} className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-stone-100">
          <div className="drift absolute inset-x-0 -inset-y-16" style={{ "--drift": "64px" } as React.CSSProperties}>
            <Image src={shot("mute-wordmark", 1)} alt="Mute Wordmark tee" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
      </div>

      <section id="sizing" className="mx-auto mt-24 max-w-3xl scroll-mt-24">
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Sizing</h2>
          <p className="mt-2 text-sm text-ink/60">
            Regular fit. If you are between sizes, go down for a closer fit or up for more room. Measurements in
            centimetres, garment laid flat.
          </p>
          <table className="mt-6 w-full text-left text-sm">
            <thead className="border-b border-ink/10 text-ink/60">
              <tr>
                <th className="py-2 font-medium">Size</th>
                <th className="py-2 font-medium">Chest (pit to pit)</th>
                <th className="py-2 font-medium">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {sizing.map(([size, chest, length]) => (
                <tr key={size}>
                  <td className="py-2 font-medium">{size}</td>
                  <td className="py-2 tabular-nums">{chest}</td>
                  <td className="py-2 tabular-nums">{length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      <section className="mx-auto mt-20 max-w-3xl">
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Shipping and returns</h2>
          <div className="mt-4 space-y-3 text-ink/70">
            <p>
              Orders ship within two business days. Free shipping on orders over{" "}
              {formatPrice(siteConfig.freeShippingThreshold)}, {formatPrice(siteConfig.flatShipping)} flat rate
              below.
            </p>
            <p>Unworn tees can be returned within 30 days for a full refund. Email us and we will sort it.</p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
