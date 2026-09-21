import "@/app/globals.css";
import { inter } from "@/app/fonts";
import { Header } from "./Header";
import type { SiteCopy } from "@/content/types";

/**
 * The <html>/<body> shell shared by every language version.
 * A single centred text column, no wider than about 70 characters.
 */
export function RootShell({ copy, children }: { copy: SiteCopy; children: React.ReactNode }) {
  return (
    <html lang={copy.lang} className={inter.variable}>
      <body className="min-h-dvh">
        <div className="mx-auto w-full max-w-[60ch] px-5 sm:px-6">
          <Header copy={copy} />
          {children}
        </div>
      </body>
    </html>
  );
}
