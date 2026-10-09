import type { Metadata, Viewport } from "next";
import { links } from "@/links";
import type { SiteCopy } from "./types";

/**
 * The link-preview card (Open Graph and X), 1200 × 630: the ring logo from
 * social-assets/brand/ of the contracts repo on navy, with the wordmark.
 * Rendered from the brand files; the logo itself is not redrawn.
 */
const ogImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Daimon — Ownerless DAO on BNB Chain — daimon.money",
};

/** <head> metadata for one language version. Same shape for both. */
export function siteMetadata(copy: SiteCopy): Metadata {
  const title = `${copy.opening.title} — ${copy.opening.tagline}`;
  return {
    metadataBase: new URL(links.site),
    title,
    description: copy.meta.description,
    alternates: {
      canonical: copy.path,
      languages: { en: "/", it: "/it", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      siteName: "Daimon",
      title,
      description: copy.meta.description,
      url: copy.path,
      locale: copy.lang === "it" ? "it_IT" : "en_US",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: copy.meta.description,
      images: [ogImage],
    },
    icons: { icon: "/logo-512.png", apple: "/logo-512.png" },
    robots: { index: true, follow: true },
  };
}

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf7ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1128" },
  ],
};
