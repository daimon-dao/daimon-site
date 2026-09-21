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
| Design tokens (colours, fonts) and the few component classes | [src/app/globals.css](src/app/globals.css) |
| The page itself, section by section | [src/components/Site.tsx](src/components/Site.tsx) |
| Masthead (logo, language switch, section index) | [src/components/Header.tsx](src/components/Header.tsx) |
| `<html>`/`<body>` shell and the text column | [src/components/RootShell.tsx](src/components/RootShell.tsx) |
| Inter, vendored under the SIL Open Font License | [src/fonts/](src/fonts/) |
| Logo (copied from the contracts repo, `social-assets/logo-512.png`) | [public/logo-512.png](public/logo-512.png) |

### The copy

The copy is transcribed verbatim from `docs/VETRINA_TESTI.md` in the contracts repo.
Each language is one plain object; strings may use `**bold**` and `*italic*`, which
[Inline.tsx](src/components/Inline.tsx) renders. Nothing else is interpreted.
Section 5 ("Where it stands") is the only block that ages: update `status` in both files.

### The links

Every URL is a named constant in [src/links.ts](src/links.ts). Entries still set to
`TODO` render as an in-page `#` anchor until they are filled. Fill them there; the copy
files reference them by name, so nothing else changes.

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
  Both inherit the shell (font, colours, masthead, text column) from their root layout.
  For posts, add `blog/[slug]/page.tsx` with `generateStaticParams` and keep the sources
  as Markdown or MDX in `src/content/blog/`; the export stays fully static.
- `/status` → `src/app/(en)/status/page.tsx`. A static export cannot run server code,
  so a live status page either renders a JSON snapshot committed at build time or
  fetches the monitor's public report from the browser. Either way it stays a plain
  page under the same shell.

Keep new pages on the same tokens (`navy`, `gold`, `cream` in `globals.css`) and the
same `max-w-[60ch]` column; the site should keep reading as one document.

## What is deliberately absent

No web3 dependency, no CMS, no animation library, no analytics, no cookie banner
(there are no cookies), no price, no yield figure, no chart, no countdown, no dated
roadmap, no newsletter form. Empty `<figure>` elements in
[Site.tsx](src/components/Site.tsx) mark where a visual could go one day; they render
nothing until then.
