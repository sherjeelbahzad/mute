---
name: ui-components
description: Add animated components from Skiper UI, Vengeance UI or Animata (the free copy-paste React/Tailwind/Motion libraries) to this Next.js storefront, restyled to the Mute brand. Use when the user asks for a component or effect from one of those libraries, or names an effect (stagger text, count-up numbers, flip text, animated buttons, card carousel, cursor trail, gooey reveal) and wants it dropped into the site.
---

# Adding Skiper UI, Vengeance UI and Animata components

These are not npm packages. Each is a catalogue of components you copy into the repo (shadcn style),
so every component becomes our code under `src/components/ui/` and can be edited freely.

The project is already prepared:

- `components.json` (shadcn config, aliases `@/components/ui`, `@/lib/utils`) exists at the repo root.
- `src/lib/utils.ts` exports `cn()`.
- `motion` (Framer Motion's successor), `clsx`, `tailwind-merge` and `lucide-react` are installed.
- Tailwind v4 with the brand tokens in `src/app/globals.css`: `bg-mint`, `bg-mint-deep`, `bg-mint-soft`,
  `bg-ink`, `bg-paper`, `font-display` (Unbounded). Use these, never the component's own hard-coded colours.

## 1. Pick the library and the install route

| Library | Where to browse | How to install | Licence |
| --- | --- | --- | --- |
| Vengeance UI | https://www.vengenceui.com/components | `npx shadcn@latest add https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public/r/<slug>.json --yes` (the slug is the last part of the component's page URL, e.g. `stagger-text`, `stats-counter`, `flip-text`, `gooey-text-reveal`, `line-hover-link`, `animated-tooltip`, `pop-button`, `liquid-metal`). The page's "Installation > Manual" tab has the source if the registry file is missing. | Free, MIT (GitHub Ashutoshx7/VengeanceUI). |
| Skiper UI | https://skiper-ui.com/components (every component is `/v1/skiperNN`) | Free ones: `npx shadcn@latest add @skiper-ui/skiperNN --yes` (Skiper is a trusted shadcn registry; files land in `src/components/ui/skiper-ui/`). Components marked Premium need a paid licence: put `SKIPER_LICENSE_KEY=...` in `.env.local` and add the registry block from https://skiper-ui.com/docs/quick-start to `components.json`. Never paste a Pro component's source into the repo without that licence. | Free tier requires attribution to Skiper UI (a line in README is enough); Pro does not. |
| Animata | https://animata.design (the user may call it "Animaster Lab"; nothing by that exact name exists) | Copy-paste only: open the component page, copy the source into `src/components/ui/<name>.tsx`, and copy any `@keyframes` / `@theme` it lists into `src/app/globals.css`. Uses `cn` from `@/lib/utils` and sometimes `motion` or `lucide-react`. | Free, MIT. |

If the user says "Animaster", confirm they mean Animata before installing; if they have a URL, use that.

## 2. Install, then make it ours

1. Run the command from the repo root (`E:\Repositories\Mute`). The CLI writes into `src/components/ui/`.
2. Open the new file and fix what the generator assumes:
   - It may import `framer-motion`; change to `motion/react` (same API). Do not add `framer-motion`.
   - Replace hard-coded colours (`bg-black`, `text-white`, `#000`, `zinc-*`, `neutral-*`) with the brand
     tokens above. Headlines use `font-display`; body copy uses the default font.
   - `"use client"` must be the first line if the component uses hooks or `motion`.
   - Delete demo wrappers, lorem ipsum and unused props. Keep the component small.
3. Lint rules that bite here (React Compiler): no `Math.random` or `Date.now` in render (hoist to module
   scope or `useMemo` with a seed), no `ref.current` reads in JSX, no `setState` called directly in an
   effect body (put it in a listener or `requestAnimationFrame`). Run `npm run lint` and fix before wiring it in.
4. Use it in one place first, then screenshot it with the CDP script (see memory) before adding more.

## 3. Where effects belong on this site (so it stays restrained)

The user rejected busy, decorative 3D ("messy"). Add one effect per place, and only where it carries meaning:

- Section headings (`<h2>` in Lookbook, Reels collage, product grid): Vengeance **Stagger Text** or **Gooey Text Reveal**, scroll-triggered, once.
- The "240 gsm / 6 / 2 days" stats in `Hero.tsx`: Vengeance **Stats Counter** (count up on scroll).
- Nav links in `Header.tsx`: Vengeance **Line Hover Link**.
- Buttons: keep the existing rounded-full mint/ink buttons. Only swap "Add to cart" or "Shop the drop" for an
  animated button if the user asks for that specific one.
- Never put an animated background (wave grid, aurora, perspective grid) behind the reels, the scroll-played
  films or the product grid; those sections are the content.

## 4. Verify

```bash
npm run lint && npx tsc --noEmit && npm run build
```

Then start `npx next start -p 3200`, screenshot the section with the CDP script, and stop the server by its
command line (PowerShell `Get-CimInstance Win32_Process` filter on `start -p 3200`), not by port.

## 5. Record it

Add a line to the "Where things live" table in `README.md` for each component added, with its source URL, and
keep the Skiper attribution line in the README if any free Skiper component is used.
