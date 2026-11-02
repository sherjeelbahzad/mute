import type { ReactNode } from "react";

/** Shared frame for the privacy and terms pages. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-xs uppercase tracking-[0.25em] text-mint-deep">Legal</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-ink/50">Last updated {updated}</p>
      <div className="mt-10 space-y-8 text-ink/80 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:space-y-1">
        {children}
      </div>
    </article>
  );
}
