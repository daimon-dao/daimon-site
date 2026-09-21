/**
 * Shape of the page copy. One object per language (en.ts, it.ts).
 *
 * Strings may carry the two inline marks used in VETRINA_TESTI.md:
 *   **bold**  and  *italic*
 * They are rendered by <Inline/>; nothing else is interpreted. A block that
 * starts with a **bold lead.** is split by the page into heading + text.
 */
import type { Localized } from "@/links";

export type Lang = "en" | "it";

export interface LinkItem {
  label: string;
  href: Localized;
}

export interface Reading {
  text: string;
  /** Optional Solidity line rendered as evidence under the reading. */
  code?: string;
}

export type ProofIconName = "audit" | "frozen" | "rehearsed" | "monitor" | "contracts";

export interface Proof {
  text: string;
  link: LinkItem;
  icon: ProofIconName;
}

/** One of the rules nobody can change, shown as a big number. */
export interface Constant {
  value: string;
  unit?: string;
  label: string;
}

export interface Stage {
  label: string;
  /** Items separated by " · " in the source; the page renders them as a list. */
  text: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteCopy {
  lang: Lang;
  /** Route of this language version, e.g. "/" or "/it". */
  path: string;
  meta: { description: string };
  /** Accessibility labels only; not visible copy. */
  ui: { sections: string; language: string; theme: string; footerLinks: string; constants: string; currentStage: string };
  /** Section navigation in the header. */
  nav: LinkItem[];
  opening: {
    title: string;
    tagline: string;
    /** The long opening paragraph, shown as a large statement after the constants band. */
    lead: string;
    /** The one-line sub under the tagline. */
    sub: string;
    ctaApp: LinkItem;
    ctaPaper: LinkItem;
  };
  constants: Constant[];
  why: { heading: string; paragraphs: string[] };
  name: { heading: string; intro: string[]; readings: Reading[]; more: LinkItem };
  proofs: { heading: string; intro: string; items: Proof[] };
  status: { heading: string; stages: Stage[]; current: number; note: string; closing: string };
  faq: { heading: string; items: FaqItem[]; terms: LinkItem };
  footer: { nav: LinkItem[]; official: string; disclaimer: string };
}
