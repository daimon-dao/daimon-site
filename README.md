# daimon-site

The showcase site of the Daimon protocol, served at **daimon.money**.
One page, two languages, no wallet, no contract calls, no analytics, no cookies.
It is not the dApp: the dApp lives at <https://app.daimon.money> and is a separate project.

## Run it

Requires Node 20.9 or newer.

```bash
npm install        # once
npm run dev        # http://localhost:3000, hot reload
npm run build      # static export → ./out
npm run preview    # serves ./out exactly as a static host would (PORT=3000)
npm run typecheck  # tsc --noEmit
```

Deploy: `vercel deploy`. The project is a Next.js static export (`output: "export"` in
[next.config.ts](next.config.ts)); Vercel detects it and serves `out/` with clean URLs.
Any other static host works too: upload `out/`.

## Where things live

| What | Where |
| --- | --- |
| English copy (the reference) | [src/content/en.ts](src/content/en.ts) |
| Italian copy | [src/content/it.ts](src/content/it.ts) |
| Shape of the copy (types) | [src/content/types.ts](src/content/types.ts) |
| Section anchors (shared by both languages) | [src/content/sections.ts](src/content/sections.ts) |
| **All outbound URLs** | [src/links.ts](src/links.ts) |
| `<head>` metadata, hreflang, Open Graph | [src/content/metadata.ts](src/content/metadata.ts) |
| Design tokens (colours, fonts, container width) and component classes | [src/app/globals.css](src/app/globals.css) |
| The page, section by section | [src/components/Site.tsx](src/components/Site.tsx) |
| **The particle engine** | [src/components/Particles.tsx](src/components/Particles.tsx) |
| The shapes the particles form | [src/lib/shapes.ts](src/lib/shapes.ts) |
| Hand-drawn line icons for the proof cards | [src/components/icons.tsx](src/components/icons.tsx) |
| Sticky masthead (logo, nav, language switch, app button) | [src/components/Header.tsx](src/components/Header.tsx) |
| `<html>`/`<body>` shell | [src/components/RootShell.tsx](src/components/RootShell.tsx) |
| Inter, vendored under the SIL Open Font License | [src/fonts/](src/fonts/) |
| Logo (copied from the contracts repo, `social-assets/logo-512.png`) | [public/logo-512.png](public/logo-512.png) |

### The copy

The copy is transcribed verbatim from `docs/VETRINA_TESTI.md` in the contracts repo.
Each language is one plain object; strings may use `**bold**` and `*italic*`, which
[Inline.tsx](src/components/Inline.tsx) renders. A block that starts with a bold lead
(`**Socrates — …** text`) is split by the page into heading + text. The only strings
not in the source document are the constants band (`constants`) and the FAQ questions.
Section 5 ("Where it stands") is the only block that ages: update `status` in both files
(`current` is the index of the highlighted stage).

### The links

Every URL is a named constant in [src/links.ts](src/links.ts), verified against the
contracts repo. A `{ en, it }` value is language-specific. `contracts` points to the
source tree until mainnet; at launch it becomes the verified contract on BscScan.

### The particles

One engine, many shapes. `<Particles spec={…} />` takes a shape from
[src/lib/shapes.ts](src/lib/shapes.ts) — the logo (sampled from the PNG by brightness),
an hourglass, a lattice, a curve falling onto a floor line, or a dispersing field — and
animates gold particles into it on a plain `<canvas>`. Every tunable (counts, sizes,
spring constants, drift, repel radius, ring orbits, stagger time) is a named constant at
the top of `Particles.tsx`.

Rules the engine keeps, for the visitor's sake:

- `requestAnimationFrame` only, devicePixelRatio capped at 2;
- only the most visible canvas on the page animates, all others are paused
  (IntersectionObserver), and everything pauses when the tab is hidden;
- the particle budget drops on phones (`COUNT_MOBILE`);
- under `prefers-reduced-motion`, or without a 2D canvas, a static SVG of the same
  shape is rendered instead;
- a `daimon:restart` event dispatched on a canvas wrapper re-scatters its particles
  (used for recordings; not wired to any UI).

All other motion (fade-in on scroll, hover states, the timeline pulse) is CSS only and
switched off under `prefers-reduced-motion` in `globals.css`. The fade-in uses CSS
scroll-driven animations (`animation-timeline: view()`), a progressive enhancement:
browsers without it show everything immediately.

### Routes

```
src/app/
  (en)/layout.tsx   ← root layout for English, <html lang="en">
  (en)/page.tsx     ← /
  (it)/layout.tsx   ← root layout for Italian, <html lang="it">
  (it)/it/page.tsx  ← /it
```

Two route groups, each with its own root layout, so every language version gets its
own `<html lang>` while sharing the same shell and the same anchors.

## Adding /blog or /status later

No restructuring needed. The route groups already hold one path per language:

- `/blog` → `src/app/(en)/blog/page.tsx`, and `/it/blog` → `src/app/(it)/it/blog/page.tsx`.
  Both inherit the shell (font, colours, masthead) from their root layout.
  For posts, add `blog/[slug]/page.tsx` with `generateStaticParams` and keep the sources
  as Markdown or MDX in `src/content/blog/`; the export stays fully static.
- `/status` → `src/app/(en)/status/page.tsx`. A static export cannot run server code,
  so a live status page either renders a JSON snapshot committed at build time or
  fetches the monitor's public report from the browser. Either way it stays a plain
  page under the same shell.

Keep new pages on the same tokens (`navy`, `navy-deep`, `gold`, `cream` in `globals.css`)
and the same `max-w-site` container; the site should keep reading as one thing.

## What is deliberately absent

No web3 dependency, no CMS, no animation library, no icon library, no analytics, no
cookie banner (there are no cookies), no external hosts at runtime, no stock imagery,
no price, no yield figure, no chart, no countdown, no dated roadmap, no newsletter form.
