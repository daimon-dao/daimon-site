import "@/app/globals.css";
import { inter } from "@/app/fonts";
import { themeScript } from "@/lib/theme";
import { Header } from "./Header";
import type { SiteCopy } from "@/content/types";

/**
 * The <html>/<body> shell shared by every language version.
 * The theme attribute is set by an inline script before first paint, so React
 * is told not to complain about the attribute it did not render itself.
 */
export function RootShell({ copy, children }: { copy: SiteCopy; children: React.ReactNode }) {
  return (
    <html lang={copy.lang} className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh overflow-x-hidden bg-bg text-fg">
        <Header copy={copy} />
        {children}
      </body>
    </html>
  );
}
