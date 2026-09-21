import { Inline } from "./Inline";
import { Particles } from "./Particles";
import { ProofIcon } from "./icons";
import { sections } from "@/content/sections";
import { href } from "@/links";
import type { Lang, LinkItem, SiteCopy } from "@/content/types";

/* ---------- small building blocks ---------- */

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-site px-5 sm:px-8 ${className}`}>{children}</div>;
}

const h2 = "text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl";
/** Text beside a visual: the visual gets a little less than half the row. */
const splitRow = "grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16";

/** A copy block that starts with a **bold lead.** becomes heading + text. */
function splitLead(text: string): { lead: string; rest: string } {
  const m = /^\*\*(.+?)\*\*\s*([\s\S]*)$/.exec(text);
  return m ? { lead: m[1], rest: m[2] } : { lead: "", rest: text };
}

/** The "→ link" lines from the copy, rendered as real links. */
function ArrowLink({ link, lang, className = "" }: { link: LinkItem; lang: Lang; className?: string }) {
  return (
    <p className={className}>
      <a href={href(link.href, lang)} className="link font-medium">
        <span aria-hidden="true">→ </span>
        {link.label}
      </a>
    </p>
  );
}

/* ---------- the page ---------- */

export function Site({ copy }: { copy: SiteCopy }) {
  const { opening, why, name, proofs, status, faq, footer } = copy;
  const lang = copy.lang;

  return (
    <>
      <main>
        {/* 1 · Hero: the logo, formed live by the particle engine.
            The canvas is full-bleed and sized from the viewport height so the logo
            dominates the first screen; the text block below is kept tight. */}
        <section id={sections.opening} className="relative overflow-hidden">
          <div className="relative h-[min(60svh,100vw)] min-h-[300px] w-full md:h-[calc(100svh-340px)] md:max-h-[720px] md:min-h-[400px]">
            <Particles spec={{ kind: "logo", src: "/logo-512.png" }} ring seed={7} className="h-full w-full" />
            <noscript>
              <img src="/logo-512.png" alt="" className="absolute inset-0 m-auto h-[80%] w-auto" />
            </noscript>
          </div>
          <Container>
            <div className="pb-14 pt-1 text-center md:pb-16">
              <h1 className="text-6xl font-bold tracking-tight md:text-7xl">{opening.title}</h1>
              <p className="mt-2 text-2xl font-medium text-accent-text md:text-3xl">{opening.tagline}</p>
              <p className="mx-auto mt-3 max-w-2xl text-lg text-fg/80">{opening.sub}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href={href(opening.ctaApp.href, lang)} className="btn btn-primary">
                  {opening.ctaApp.label}
                </a>
                <a href={href(opening.ctaPaper.href, lang)} className="btn btn-secondary">
                  {opening.ctaPaper.label}
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* The rules nobody can change */}
        <section aria-label={copy.ui.constants} className="border-y border-line bg-bg-deep">
          <Container className="py-12 md:py-16">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
              {copy.constants.map((c) => (
                <li key={c.label} className="text-center">
                  <p className="text-5xl font-bold leading-none text-accent-text tabular-nums md:text-6xl">
                    {c.value}
                    {c.unit && <span className="ml-1 text-2xl font-semibold md:text-3xl">{c.unit}</span>}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-fg/70">{c.label}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* The opening statement */}
        <section>
          <Container className="py-20 md:py-28">
            <p className="reveal max-w-4xl text-2xl font-medium leading-snug md:text-[2rem]">
              <Inline text={opening.lead} />
            </p>
          </Container>
        </section>

        {/* 2 · Why it exists */}
        <section id={sections.why} className="scroll-mt-20 bg-bg-deep">
          <Container className={`${splitRow} py-20 md:py-28`}>
            <div className="reveal">
              <h2 className={h2}>{why.heading}</h2>
              <div className="mt-8 space-y-5 text-fg/85">
                {why.paragraphs.map((p) => (
                  <p key={p}>
                    <Inline text={p} />
                  </p>
                ))}
              </div>
            </div>
            <figure className="reveal aspect-square w-full max-w-lg justify-self-center lg:max-w-none">
              <Particles spec={{ kind: "disperse" }} seed={11} className="h-full w-full" />
            </figure>
          </Container>
        </section>

        {/* 3 · The name is the architecture */}
        <section id={sections.name} className="scroll-mt-20">
          <Container className="py-20 md:py-28">
            <div className={splitRow}>
              <div className="reveal">
                <h2 className={h2}>{name.heading}</h2>
                <div className="mt-8 space-y-5 text-fg/85">
                  {name.intro.map((p) => (
                    <p key={p}>
                      <Inline text={p} />
                    </p>
                  ))}
                </div>
              </div>
              <figure className="reveal mx-auto aspect-[4/5] w-full max-w-sm lg:max-w-md">
                <Particles spec={{ kind: "hourglass" }} seed={23} className="h-full w-full" />
              </figure>
            </div>

            <ol className="mt-20 grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-2">
              {name.readings.map((r, i) => {
                const { lead, rest } = splitLead(r.text);
                return (
                  <li key={r.text} className="reveal min-w-0">
                    <span aria-hidden="true" className="block text-6xl font-bold leading-none text-accent-text md:text-7xl">
                      0{i + 1}
                    </span>
                    <h3 className="mt-5 text-2xl font-semibold leading-snug">{lead}</h3>
                    <p className="mt-3 text-fg/85">
                      <Inline text={rest} />
                    </p>
                    {r.code && (
                      <pre className="code-panel mt-4" tabIndex={0}>
                        <code data-language="solidity">{r.code}</code>
                      </pre>
                    )}
                  </li>
                );
              })}
            </ol>
            <ArrowLink className="mt-16 text-lg" link={name.more} lang={lang} />
          </Container>
        </section>

        {/* 4 · The proofs */}
        <section id={sections.proofs} className="scroll-mt-20 bg-bg-deep">
          <Container className="py-20 md:py-28">
            <div className={splitRow}>
              <div className="reveal">
                <h2 className={h2}>{proofs.heading}</h2>
                <p className="mt-6 text-xl text-fg/85">
                  <Inline text={proofs.intro} />
                </p>
              </div>
              <figure className="reveal aspect-[8/5] w-full max-w-lg justify-self-center lg:max-w-none">
                <Particles spec={{ kind: "grid" }} seed={5} className="h-full w-full" />
              </figure>
            </div>
            <ul className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {proofs.items.map((item) => {
                const { lead, rest } = splitLead(item.text);
                return (
                  <li key={item.text} className="card reveal flex min-w-0 flex-col">
                    <ProofIcon name={item.icon} className="text-accent-text" />
                    <h3 className="mt-5 text-xl font-semibold leading-snug">{lead}</h3>
                    <p className="mt-3 grow text-[0.95rem] text-fg/80">
                      <Inline text={rest} />
                    </p>
                    <ArrowLink className="mt-5" link={item.link} lang={lang} />
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>

        {/* 5 · Where the project stands */}
        <section id={sections.status} className="scroll-mt-20">
          <Container className="py-20 md:py-28">
            <div className={splitRow}>
              <div className="reveal">
                <h2 className={h2}>{status.heading}</h2>
                <p className="mt-6 text-xl text-fg/85">
                  <Inline text={status.note} />
                </p>
              </div>
              <figure className="reveal aspect-[8/5] w-full max-w-lg justify-self-center lg:max-w-none">
                <Particles spec={{ kind: "curve" }} seed={17} className="h-full w-full" />
              </figure>
            </div>
            <ol className="timeline mt-16">
              {status.stages.map((stage, i) => {
                const current = i === status.current;
                return (
                  <li key={stage.label} className={current ? "is-current" : undefined}>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-text">
                      {stage.label}
                      {current && <span className="sr-only"> — {copy.ui.currentStage}</span>}
                    </h3>
                    <ul className="mt-4 space-y-2 text-fg/85">
                      {stage.text.split(" · ").map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ol>
            <p className="reveal mt-20 max-w-4xl text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              <Inline text={status.closing} />
            </p>
          </Container>
        </section>

        {/* What Daimon is not */}
        <section id="faq" className="bg-bg-deep">
          <Container className="py-20 md:py-28">
            <div className="mx-auto max-w-3xl">
              <h2 className={h2}>{faq.heading}</h2>
              <div className="mt-10 border-t border-line">
                {faq.items.map((f) => (
                  <details key={f.question} className="faq border-b border-line py-5">
                    <summary className="flex cursor-pointer items-center justify-between gap-6 text-lg font-medium md:text-xl">
                      {f.question}
                      <span className="plus text-2xl leading-none text-accent-text" aria-hidden="true" />
                    </summary>
                    <p className="mt-4 max-w-2xl text-fg/85">
                      <Inline text={f.answer} />
                    </p>
                  </details>
                ))}
              </div>
              <ArrowLink className="mt-8" link={faq.terms} lang={lang} />
            </div>
          </Container>
        </section>
      </main>

      {/* 6 · Footer */}
      <footer id={sections.footer} className="border-t border-line">
        <Container className="py-14 md:py-20">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <a href={copy.path} className="flex items-center gap-3 text-fg">
              <img src="/logo-512.png" alt="" width={40} height={40} className="h-10 w-10" />
              <span className="text-2xl font-bold tracking-tight">{opening.title}</span>
            </a>
            <nav aria-label={copy.ui.footerLinks}>
              <ul className="flex flex-wrap gap-x-7 gap-y-2">
                {footer.nav.map((item) => (
                  <li key={item.label}>
                    <a href={href(item.href, lang)} className="link">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className="mt-12 text-lg">
            <Inline text={footer.official} />
          </p>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-fg/60">
            <Inline text={footer.disclaimer} />
          </p>
        </Container>
      </footer>
    </>
  );
}
