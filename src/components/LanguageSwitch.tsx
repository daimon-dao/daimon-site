import type { Lang } from "@/content/types";

const versions: { lang: Lang; path: string; label: string }[] = [
  { lang: "en", path: "/", label: "EN" },
  { lang: "it", path: "/it", label: "IT" },
];

export function LanguageSwitch({ current, label }: { current: Lang; label: string }) {
  return (
    <nav aria-label={label} className="flex items-center gap-2 text-sm tracking-wide">
      {versions.map((v, i) => (
        <span key={v.lang} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true">·</span>}
          {v.lang === current ? (
            <span aria-current="page" className="font-semibold text-cream underline underline-offset-4">
              {v.label}
            </span>
          ) : (
            <a href={v.path} hrefLang={v.lang} lang={v.lang} className="no-underline hover:underline">
              {v.label}
            </a>
          )}
        </span>
      ))}
    </nav>
  );
}
