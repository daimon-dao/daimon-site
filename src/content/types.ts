/**
 * Shape of the page copy. One object per language (en.ts, it.ts).
 *
 * Strings may carry the two inline marks used in VETRINA_TESTI.md:
 *   **bold**  and  *italic*
 * They are rendered by <Inline/>; nothing else is interpreted.
 */
export type Lang = "en" | "it";

export interface LinkItem {
  label: string;
  href: string;
}

export interface Reading {
  text: string;
  /** Optional Solidity line rendered as evidence under the reading. */
  code?: string;
}

export interface Proof {
  text: string;
  link: LinkItem;
}

export interface SiteCopy {
  lang: Lang;
  /** Route of this language version, e.g. "/" or "/it". */
  path: string;
  meta: { description: string };
  /** Accessibility labels only; not visible copy. */
  ui: { sections: string; language: string; footerLinks: string };
  /** Section index shown under the masthead. */
  nav: LinkItem[];
  opening: {
    title: string;
    tagline: string;
    paragraphs: string[];
    ctaApp: LinkItem;
    ctaPaper: LinkItem;
  };
  why: { label: string; heading: string; paragraphs: string[] };
  name: {
    label: string;
    heading: string;
    intro: string[];
    readings: Reading[];
    more: LinkItem;
  };
  proofs: { label: string; heading: string; intro: string; items: Proof[] };
  status: {
    label: string;
    heading: string;
    lines: string[];
    note: string;
    closing: string;
  };
  footer: {
    notText: string;
    notLink: LinkItem;
    nav: LinkItem[];
    official: string;
    disclaimer: string;
  };
}
