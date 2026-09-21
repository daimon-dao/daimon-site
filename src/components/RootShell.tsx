import "@/app/globals.css";
import { inter } from "@/app/fonts";
import { Header } from "./Header";
import type { SiteCopy } from "@/content/types";

/** The <html>/<body> shell shared by every language version. */
export function RootShell({ copy, children }: { copy: SiteCopy; children: React.ReactNode }) {
  return (
    <html lang={copy.lang} className={inter.variable}>
      <body className="min-h-dvh overflow-x-hidden">
        <Header copy={copy} />
        {children}
      </body>
    </html>
  );
}
