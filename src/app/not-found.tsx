import "@/app/globals.css";
import type { Metadata } from "next";
import { inter } from "@/app/fonts";
import { themeScript } from "@/lib/theme";

/**
 * The 404 page, written to out/404.html by the static export and served by
 * Vercel for any path that matches nothing.
 *
 * The site has one root layout per language, so this page sits outside both:
 * Next wraps it in a bare <html><body> and the styles, the font and the theme
 * script are applied here. One page serves both languages: the English block
 * points to /, the Italian one to /it.
 */
export const metadata: Metadata = {
  title: "404 — Daimon",
  robots: { index: false, follow: false },
};

const versions = [
  {
    lang: "en",
    path: "/",
    heading: "Page not found",
    text: "There is nothing at this address.",
    back: "Back to daimon.money",
  },
  {
    lang: "it",
    path: "/it",
    heading: "Pagina non trovata",
    text: "A questo indirizzo non c'è nulla.",
    back: "Torna a daimon.money",
  },
] as const;

export default function NotFound() {
  return (
    <div className={`${inter.className} flex min-h-dvh flex-col bg-bg text-fg`}>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 w-full max-w-site items-center px-5 sm:px-8 md:h-[72px]">
          <a href="/" className="flex items-center gap-3 text-fg">
            <img src="/logo-512.png" alt="" width={32} height={32} className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight">Daimon</span>
          </a>
        </div>
      </header>
      <main className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-site px-5 py-16 sm:px-8 md:py-24">
          <p className="text-center text-7xl font-bold leading-none tracking-tight text-accent-text tabular-nums md:text-8xl">
            404
          </p>
          <div className="mx-auto mt-12 grid max-w-3xl gap-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-line">
            {versions.map((v) => (
              <section key={v.lang} lang={v.lang} className="text-center md:px-10">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{v.heading}</h1>
                <p className="mt-3 text-fg/80">{v.text}</p>
                <p className="mt-6">
                  <a href={v.path} hrefLang={v.lang} className="link font-medium">
                    <span aria-hidden="true">→ </span>
                    {v.back}
                  </a>
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
