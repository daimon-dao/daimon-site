"use client";

import { THEME_KEY } from "@/lib/theme";

/**
 * Sun / moon toggle. Both icons are rendered and CSS shows the one that
 * matches <html data-theme>, so there is nothing to hydrate and no flash.
 */
export function ThemeToggle({ label }: { label: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* private mode or storage blocked: the choice simply is not remembered */
    }
  };
  return (
    <button type="button" onClick={toggle} aria-label={label} title={label} className="theme-toggle">
      {/* sun: shown in the dark theme (click → light) */}
      <svg className="icon-sun" viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
      </svg>
      {/* moon: shown in the light theme (click → dark) */}
      <svg className="icon-moon" viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" />
      </svg>
    </button>
  );
}
