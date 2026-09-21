# Fonts

`Inter-latin-variable.woff2` is Inter (variable, weight axis 100–900, latin subset)
by Rasmus Andersson and the Inter Project Authors, licensed under the
SIL Open Font License 1.1 (see `LICENSE.txt`). The file is the latin subset as
served by Google Fonts (Inter v20), vendored here so that `npm run build` never
depends on a font CDN being reachable.

It is loaded through `next/font/local` in `src/app/fonts.ts` and exposed as the
`--font-inter` CSS variable, which `globals.css` maps to `--font-sans`.
