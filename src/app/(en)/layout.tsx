import { RootShell } from "@/components/RootShell";
import { en } from "@/content/en";
import { siteMetadata, siteViewport } from "@/content/metadata";

export const metadata = siteMetadata(en);
export const viewport = siteViewport;

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <RootShell copy={en}>{children}</RootShell>;
}
