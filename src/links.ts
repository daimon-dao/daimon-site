/**
 * Every outbound URL on the site lives here and nowhere else.
 *
 * Verified against the contracts repo (github.com/daimon-dao/daimon-dao,
 * branch master) on 2026-09-21. A `{ en, it }` value is language-specific;
 * `href()` picks the right one. Entries set to TODO render as an in-page "#"
 * anchor until they are filled.
 */
import type { Lang } from "@/content/types";

const TODO = "#";
const REPO = "https://github.com/daimon-dao/daimon-dao";
const BLOB = `${REPO}/blob/master`;

export type Localized = string | { en: string; it: string };

export const links = {
  /** The site itself (canonical / hreflang metadata). */
  site: "https://daimon.money",

  /** "Launch app" — the dApp. */
  app: "https://app.daimon.money",

  /** "Read the protocol paper" and the footer "Protocol paper" entry: the v0.2 release (PDFs, EN + IT). */
  protocolPaper: `${REPO}/releases/tag/protocol-paper-v0.2`,

  /** Section 3 — "The full reading, with the code for each: protocol paper, Section 2". */
  protocolPaperSection2: {
    en: `${BLOB}/docs/protocol-paper/protocol_paper_EN.md#2-the-name`,
    it: `${BLOB}/docs/protocol-paper/protocol_paper_IT.md#2-il-nome`,
  },

  /** Section 4 — the audit report, in full. Published by the auditor in their own repository (as linked from the contracts README). */
  auditReport:
    "https://github.com/zenith-security/reports/blob/main/reports/Daimon%20DAO%20-%20Zenith%20Audit%20Report.pdf",

  /** Section 4 — the frozen, audited tag. */
  repositoryTag: `${REPO}/tree/audit-final`,

  /**
   * Section 4 — the rehearsal journals. The README's Documentation section lists all of them
   * (TESTNET_RESULTS.md, TESTNET_L1_RESULTS.md, TWO_PHASE_RESULTS.md, CHAPEL_L2_RESULTS.md,
   * docs/CHAPEL_2B_RESULTS.md), so it is the one link that covers "the journals".
   */
  journals: `${BLOB}/README.md#documentation`,

  /** Section 4 — the read-only monitor's specification. */
  monitorSpec: `${BLOB}/docs/SPEC_MONITOR.md`,

  /**
   * Section 4 — "The contracts themselves". Until mainnet this is the source tree;
   * at launch it becomes the verified contract on BscScan.
   */
  contracts: `${REPO}/tree/master/src`,

  /** FAQ and footer — terms and disclaimer, v0.3. */
  terms: {
    en: `${BLOB}/docs/DISCLAIMER_TERMS_v0.3_EN.md`,
    it: `${BLOB}/docs/DISCLAIMER_TERMS_v0.3_IT.md`,
  },

  /** Footer — source and social. */
  github: "https://github.com/daimon-dao",
  x: "https://x.com/DaimonDAO",
  telegram: "https://t.me/Daimon_one",
} as const satisfies Record<string, Localized>;

export type LinkKey = keyof typeof links;

/** Resolve a possibly language-specific link for the given language. */
export function href(link: Localized, lang: Lang): string {
  return typeof link === "string" ? link : link[lang];
}

export { TODO };
