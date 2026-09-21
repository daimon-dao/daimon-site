import localFont from "next/font/local";

/**
 * Inter, vendored (SIL Open Font License) so the build never depends on a
 * font CDN being reachable. See src/fonts/README.md.
 */
export const inter = localFont({
  src: "../fonts/Inter-latin-variable.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
});
