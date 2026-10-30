const items = ["Say less", "Astronaut Dunk", "Not Found", "Map", "Mute Wordmark", "240 gsm cotton", "Designed in Pakistan"];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-mint py-3 text-ink" aria-hidden>
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-sm font-bold uppercase tracking-[0.25em]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            {t}
            <span className="h-1.5 w-1.5 rounded-full bg-ink/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
