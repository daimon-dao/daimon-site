import { LanguageSwitch } from "./LanguageSwitch";
import type { SiteCopy } from "@/content/types";

/** Masthead: logo, language switch, and the section index. */
export function Header({ copy }: { copy: SiteCopy }) {
  return (
    <header className="pt-6 md:pt-10">
      <div className="flex items-center justify-between gap-4">
        <a href={copy.path} className="flex items-center no-underline" aria-label={copy.opening.title}>
          <img src="/logo-512.png" alt="" width={36} height={36} className="h-9 w-9" />
        </a>
        <LanguageSwitch current={copy.lang} label={copy.ui.language} />
      </div>
      <nav aria-label={copy.ui.sections} className="mt-8 text-sm">
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {copy.nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="no-underline hover:underline">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
