import Link from "next/link";
import StatsCounter from "./ui/stats-counter";

/** The motto. Copy rises in on scroll (CSS .motto-in) and the brand mark revolves in 3D beside it (#logo-anchor). */
export function Hero() {
  return (
    <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-32">
      <div className="motto-in" style={{ perspective: "1200px" }}>
        <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-3 py-1 text-xs font-medium backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-mint-deep" />
          New drop: six designs, three colours
        </p>
        <h1 className="mt-6 font-display text-[3.4rem] font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-[6.5rem]">
          <span className="motto-flip block" style={{ "--from": "15%", "--to": "60%" } as React.CSSProperties}>
            Say
          </span>
          <span className="motto-flip block text-mint-deep" style={{ "--from": "25%", "--to": "75%" } as React.CSSProperties}>
            less.
          </span>
        </h1>
        <p className="mt-6 max-w-md text-lg text-ink/70">
          Heavyweight tees from Pakistan. Loud ideas, quiet execution: one print per shirt, and nothing that
          needs explaining.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition-transform hover:scale-[1.03]"
          >
            Shop the drop
          </Link>
          <Link
            href="/#lookbook"
            className="inline-flex h-12 items-center rounded-full border border-ink/15 bg-white/50 px-7 text-sm font-medium backdrop-blur transition-colors hover:border-ink"
          >
            See the lookbook
          </Link>
        </div>
        {/* Numbers count up when they scroll into view (Vengeance Stats Counter). */}
        <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-ink/10 pt-6 text-sm">
          {[
            { value: 240, suffix: " gsm", label: "Heavyweight cotton" },
            { value: 6, suffix: "", label: "Designs" },
            { value: 2, suffix: " days", label: "To dispatch" },
          ].map((s) => (
            <div key={s.label}>
              <dt className="font-display text-xl font-bold">
                <StatsCounter value={s.value} suffix={s.suffix} duration={1.4} />
              </dt>
              <dd className="mt-1 text-ink/60">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-xs sm:max-w-sm lg:max-w-md">
        <div aria-hidden className="pointer-events-none absolute inset-[-20%] rounded-full bg-mint/30 blur-3xl" />
        <div id="logo-anchor" className="absolute inset-0" aria-hidden />
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 rounded-full bg-mint px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-ink shadow-lg">
          From Rs 2,500
        </div>
      </div>
    </section>
  );
}
