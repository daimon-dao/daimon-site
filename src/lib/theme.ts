/**
 * Theme: "dark" (navy) or "light" (warm off-white).
 *
 * The choice lives in localStorage only, under THEME_KEY; nothing leaves the
 * device and no cookie is set. With no stored choice the OS preference wins.
 * `themeScript` runs inline in <head> before first paint so the page never
 * flashes the wrong theme (the export is static, so this is the only place
 * it can happen).
 */
export const THEME_KEY = "daimon-theme";

export type Theme = "light" | "dark";

export const themeScript = `(function(){var t;try{t=localStorage.getItem(${JSON.stringify(THEME_KEY)})}catch(e){}if(t!=="light"&&t!=="dark"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.setAttribute("data-theme",t)})();`;
