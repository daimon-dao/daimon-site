/**
 * Every outbound URL on the site lives here and nowhere else.
 *
 * The copy (src/content/*.ts) refers to these by name. Fill the TODO
 * entries when the destinations exist; nothing else needs to change.
 * `TODO` renders as a harmless in-page anchor until it is replaced.
 */
const TODO = "#";

export const links = {
  /** The site itself (used for canonical / hreflang metadata). */
  site: "https://daimon.money",

  /** "Launch app" — the dApp. */
  app: "https://app.daimon.money",

  /** "Read the protocol paper" and the footer "Protocol paper" entry. */
  protocolPaper: TODO,

  /** Section 3 — "The full reading, with the code for each: protocol paper, Section 2". */
  protocolPaperSection2: TODO,

  /** Section 4 — "→ link to the report" (the audit report, in full). */
  auditReport: TODO,

  /** Section 4 — "→ link to the repository and the tag" (the frozen, audited tag). */
  repositoryTag: TODO,

  /** Section 4 — "→ link to the journals" (the rehearsal journals). */
  journals: TODO,

  /** Section 4 — "→ link to its specification" (the read-only monitor). */
  monitorSpec: TODO,

  /** Section 4 — "The contracts themselves. → link". */
  contracts: TODO,

  /** Footer — "Full terms and disclaimer" / "Terms and disclaimer". */
  terms: TODO,

  /** Footer — source and social entries. */
  github: TODO,
  x: TODO,
  telegram: TODO,
} as const;

export type LinkKey = keyof typeof links;
