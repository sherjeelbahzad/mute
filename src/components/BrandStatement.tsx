import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";

const pillars = [
  ["One print per shirt", "If a design needs a second one to make sense, it is not finished."],
  ["Heavyweight only", "240 gsm combed cotton, pre-washed. It drapes instead of clinging."],
  ["Small runs", "A few hundred of each. Sold out means sold out, not restocking Monday."],
];

export function BrandStatement() {
  return (
    <section data-scene-stop className="relative overflow-hidden bg-ink text-paper">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/15 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:py-32">
        <Reveal>
          <Image src="/brand/logo.png" alt="Mute logo" width={160} height={172} className="h-28 w-auto sm:h-40" />
          <h2 className="mt-8 font-display text-4xl font-bold leading-[1] tracking-tight sm:text-6xl">
            Loud ideas.
            <br />
            <span className="text-mint">Quiet shirts.</span>
          </h2>
          <p className="mt-6 max-w-md text-paper/60">
            Mute started with a simple complaint: every T-shirt we owned was trying too hard. So we make the
            opposite, and we make it heavy.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex h-11 items-center rounded-full bg-mint px-6 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
          >
            Read the story
          </Link>
        </Reveal>
        <ul className="grid gap-4 self-center sm:grid-cols-3 lg:grid-cols-1">
          {pillars.map(([title, body], i) => (
            <Reveal as="li" key={title} delay={i * 120} className="rounded-2xl border border-paper/10 bg-paper/5 p-6 backdrop-blur">
              <p className="font-display text-xl font-bold text-mint">0{i + 1}</p>
              <p className="mt-3 font-medium">{title}</p>
              <p className="mt-2 text-sm text-paper/60">{body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
