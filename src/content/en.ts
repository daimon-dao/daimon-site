// English copy — the reference version.
// Source: docs/VETRINA_TESTI.md in the contracts repo, "EN — the page". Verbatim.
import { links } from "@/links";
import { sections } from "./sections";
import type { SiteCopy } from "./types";

export const en: SiteCopy = {
  lang: "en",
  path: "/",
  meta: {
    description:
      "A protocol nobody owns. It does not promise returns. It guarantees rules.",
  },
  ui: { sections: "Sections", language: "Language", footerLinks: "Footer links" },
  nav: [
    { label: "Why it exists", href: `#${sections.why}` },
    { label: "The name is the architecture", href: `#${sections.name}` },
    { label: "The proofs", href: `#${sections.proofs}` },
    { label: "Where the project stands", href: `#${sections.status}` },
  ],

  opening: {
    title: "Daimon",
    tagline: "A protocol nobody owns.",
    paragraphs: [
      "It has no owner, no administrator, and no minting function. Fees flow to the people who hold and stake. Every parameter can be changed only by a public vote followed by seven days in the open — by anyone, including the people who built it, or by no one at all.",
      "It does not promise returns. It guarantees rules.",
    ],
    ctaApp: { label: "Launch app", href: links.app },
    ctaPaper: { label: "Read the protocol paper", href: links.protocolPaper },
  },

  why: {
    label: "2 · Why it exists",
    heading: "The problem was never the asset",
    paragraphs: [
      "Most tokens are deployed with an owner: an account that can change fees, freeze transfers, withdraw funds, in many cases mint. Those powers are not hidden — they are written in the contract, visible to anyone who reads it. The question is what stands between those powers and their misuse, and in almost every case the answer is the owner's intentions. Nothing else.",
      "That is not a criticism of anyone's honesty. It is an observation about structure. A system whose safety depends on the continued good faith of a single private key is not a safe system — it is a bet on a person. And a bet that pays out reliably for two years is still a bet.",
      "The pattern is not unique to crypto. Decisions that determine the value of ordinary people's savings are taken by institutions that do not consult those affected and explain themselves afterwards. Inflation is the clearest example: not a natural phenomenon, but a decision taken by a small number of people, whose effect is to reduce the value of savings held by everyone else.",
      "There is a form of dissent that consists of demanding that those in charge behave differently. There is another that consists of building something that does not require them to. This project is the second kind.",
    ],
  },

  name: {
    label: "3 · The name is the architecture",
    heading: "The name is the architecture",
    intro: [
      "In ancient Greece the *daimon* was not a demon. It was a guiding spirit that dwelt between gods and mortals — neither above humanity nor beneath it, but alongside. The word comes from a verb meaning *to divide, to apportion a share*.",
      "This protocol was not built and then named. The concept produced the project, and where the two ever conflicted during development, the concept won. Four readings, four mechanisms:",
    ],
    readings: [
      {
        text: "**It apportions rather than accumulates.** Fees redistribute to holders, rewards flow to those who lock, supply is burned rather than hoarded. Nothing is set aside for anyone.",
      },
      {
        text: "**Socrates — a restraint, not a command.** His *daimonion* never told him what to do; it only stopped him. The timelock has no opinion about the proposal passing through it: its entire contribution is a refusal conditioned on time.",
        code: "if (block.timestamp < op.readyTimestamp) revert TooEarly();",
      },
      {
        text: "**Plato — the guide is chosen before the question arises.** Voting power is measured at the last block sealed before a proposal was created. Influence bought afterwards, even in the same block, counts for nothing.",
      },
      {
        text: "**Heraclitus — twice.** *Character is destiny*: there is no authority above the protocol, only one role, held by a contract that executes what the community already decided. And *everything flows*: a handful of constraints can never change — no mint, a floor of 21 billion, a fee ceiling, a mandatory delay — precisely so that everything else can. The fees can move because a ceiling exists that cannot.",
      },
    ],
    more: {
      label: "The full reading, with the code for each: protocol paper, Section 2",
      href: links.protocolPaperSection2,
    },
  },

  proofs: {
    label: "4 · The proofs",
    heading: "Don't trust this page",
    intro: "Everything above is either true on chain or it isn't. Here is how to check:",
    items: [
      {
        text: "**Independently audited — the full report is public.** 37 findings: one critical, one high, seven medium, twelve low, sixteen informational. Twenty-nine fixed in the code, eight accepted with written reasoning — including the eight, and the reasoning.",
        link: { label: "The report", href: links.auditReport },
      },
      {
        text: "**Contracts frozen, 180 tests.** The code that will be deployed is byte-identical to the audited tag. The test suite runs on every commit, and the diff against that tag is verified empty before anything is published.",
        link: { label: "The repository and the tag", href: links.repositoryTag },
      },
      {
        text: "**Rehearsed before being launched.** Thirty-one scenarios on a local fork, then a full deployment on a public test chain — including a complete governance cycle in real time: proposed, voted, queued, seven real days of waiting, executed. Every transaction recorded in a public journal, deviations included.",
        link: { label: "The journals", href: links.journals },
      },
      {
        text: "**A monitor that watches and cannot touch.** Read-only, no private keys, on a server of its own. It reports the protocol's state every six hours and raises an alarm when something changes that should not.",
        link: { label: "Its specification", href: links.monitorSpec },
      },
      {
        text: "**The contracts themselves.** Read them, or read what others found in them.",
        link: { label: "The contracts", href: links.contracts },
      },
    ],
  },

  status: {
    label: "5 · Where the project stands",
    heading: "Where it stands",
    lines: [
      "**Done** — external audit concluded and published · contracts frozen · two full rehearsals, the second on a public chain · the guardian created: two signatures out of three, purely negative powers, expiring 36 months after launch",
      "**Now** — the final rehearsal of the launch procedure itself",
      "**Next** — mainnet · the treasury begins to accumulate, by vote · service modules, each audited independently before deployment",
    ],
    note: "No dates. Every step depends on a public vote and the seven days that precede it.",
    closing: "**The destination is not fixed. The method is.**",
  },

  footer: {
    notText:
      "**What Daimon is not.** Not an investment product, and it promises no returns: a shrinking supply does not mechanically increase value. Nobody can change the rules against you, and nobody can intervene to help you either — no support desk can reverse a transaction or recover a lost key. The code has been audited; it is not perfect.",
    notLink: { label: "Full terms and disclaimer", href: links.terms },
    nav: [
      { label: "Protocol paper", href: links.protocolPaper },
      { label: "GitHub", href: links.github },
      { label: "X", href: links.x },
      { label: "Telegram", href: links.telegram },
      { label: "Terms and disclaimer", href: links.terms },
    ],
    official:
      "**The only official address is daimon.money. The app lives at app.daimon.money. Anything else is not us.**",
    disclaimer:
      'Daimon is experimental open-source software provided "as is", without warranties. Nothing here is an offer, a solicitation, or financial advice. You interact directly with immutable contracts on a public blockchain, at your own risk. Digital assets can lose all value. Where this page and the deployed code disagree, the code is the only authority.',
  },
};
