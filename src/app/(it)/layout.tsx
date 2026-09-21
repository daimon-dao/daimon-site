import { RootShell } from "@/components/RootShell";
import { it } from "@/content/it";
import { siteMetadata, siteViewport } from "@/content/metadata";

export const metadata = siteMetadata(it);
export const viewport = siteViewport;

export default function ItalianLayout({ children }: { children: React.ReactNode }) {
  return <RootShell copy={it}>{children}</RootShell>;
}
