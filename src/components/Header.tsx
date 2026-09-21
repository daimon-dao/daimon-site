import { LanguageSwitch } from "./LanguageSwitch";
import { href } from "@/links";
import type { SiteCopy } from "@/content/types";

/** Sticky masthead: logo and wordmark, section navigation, language switch, app button. */
export function Header({ copy }: { copy: SiteCopy }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gold/10 bg-navy/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-site items-center justify-between gap-6 px-5 sm:px-8 md:h-[72px]">
        <a href={copy.path} className="flex items-center gap-3 text-cream">
          <img src="/logo-512.png" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight">{copy.opening.title}</span>
        </a>
        <nav aria-label={copy.ui.sections} className="hidden lg:block">
          <ul className="flex items-center gap-8 text-sm text-cream/75">
            {copy.nav.map((item) => (
              <li key={item.label}>
                <a href={href(item.href, copy.lang)} className="transition-colors hover:text-cream">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-5">
          <LanguageSwitch current={copy.lang} label={copy.ui.language} />
          <a href={href(copy.opening.ctaApp.href, copy.lang)} className="btn btn-primary btn-small hidden sm:inline-flex">
            {copy.opening.ctaApp.label}
          </a>
        </div>
      </div>
    </header>
  );
}
