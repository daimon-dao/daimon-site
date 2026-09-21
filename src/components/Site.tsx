import { Inline } from "./Inline";
import { sections } from "@/content/sections";
import type { LinkItem, SiteCopy } from "@/content/types";

/* ---------- small building blocks ---------- */

function Section({
  id,
  label,
  heading,
  children,
}: {
  id: string;
  label: string;
  heading: string;
  children: React.ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-6 border-t border-gold/25 py-12 md:py-16">
      <p className="text-sm text-gold">{label}</p>
      <h2 id={headingId} className="mt-2 text-2xl font-semibold leading-tight tracking-tight md:text-[1.75rem]">
        {heading}
      </h2>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

/** The "→ link" lines from the copy, rendered as real links. */
function ArrowLink({ link }: { link: LinkItem }) {
  return (
    <p>
      <a href={link.href}>
        <span aria-hidden="true">→ </span>
        <em>{link.label}</em>
      </a>
    </p>
  );
}

/* ---------- the page ---------- */

export function Site({ copy }: { copy: SiteCopy }) {
  const { opening, why, name, proofs, status, footer } = copy;

  return (
    <>
      <main>
        {/* 1 · Opening */}
        <section id={sections.opening} aria-labelledby="opening-heading" className="py-12 md:py-20">
          <h1 id="opening-heading" className="text-5xl font-semibold tracking-tight md:text-6xl">
            {opening.title}
          </h1>
          <p className="mt-3 text-2xl font-medium text-gold md:text-[1.75rem]">{opening.tagline}</p>
          <div className="mt-8 space-y-5">
            {opening.paragraphs.map((p) => (
              <p key={p}>
                <Inline text={p} />
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={opening.ctaApp.href} className="btn btn-primary">
              {opening.ctaApp.label}
            </a>
            <a href={opening.ctaPaper.href} className="btn btn-secondary">
              {opening.ctaPaper.label}
            </a>
          </div>
          <figure className="mt-10 empty:hidden">
            {/* Room for a visual: one still image or diagram of the shape of the
                protocol (holders · stakers · timelock · governor). Intentionally empty. */}
          </figure>
        </section>

        {/* 2 · Why it exists */}
        <Section id={sections.why} label={why.label} heading={why.heading}>
          {why.paragraphs.map((p) => (
            <p key={p}>
              <Inline text={p} />
            </p>
          ))}
        </Section>

        {/* 3 · The name is the architecture */}
        <Section id={sections.name} label={name.label} heading={name.heading}>
          {name.intro.map((p) => (
            <p key={p}>
              <Inline text={p} />
            </p>
          ))}
          <ol className="space-y-6 pt-1">
            {name.readings.map((r) => (
              <li key={r.text}>
                <p>
                  <Inline text={r.text} />
                </p>
                {r.code && (
                  <pre className="code-panel mt-3" tabIndex={0}>
                    <code data-language="solidity">{r.code}</code>
                  </pre>
                )}
              </li>
            ))}
          </ol>
          <figure className="empty:hidden">
            {/* Room for a visual: the four readings as a compact table or one diagram
                (apportion · restraint · snapshot · invariants). Intentionally empty. */}
          </figure>
          <ArrowLink link={name.more} />
        </Section>

        {/* 4 · The proofs */}
        <Section id={sections.proofs} label={proofs.label} heading={proofs.heading}>
          <p>
            <Inline text={proofs.intro} />
          </p>
          <ul className="space-y-6 pt-1">
            {proofs.items.map((item) => (
              <li key={item.text} className="space-y-1">
                <p>
                  <Inline text={item.text} />
                </p>
                <ArrowLink link={item.link} />
              </li>
            ))}
          </ul>
        </Section>

        {/* 5 · Where the project stands */}
        <Section id={sections.status} label={status.label} heading={status.heading}>
          {status.lines.map((line) => (
            <p key={line}>
              <Inline text={line} />
            </p>
          ))}
          <p>
            <Inline text={status.note} />
          </p>
          <p className="pt-1">
            <Inline text={status.closing} />
          </p>
          <figure className="empty:hidden">
            {/* Room for a visual: a dated photograph or scan of a milestone (an audit
                cover page, a journal entry). Never a chart or a timeline. Intentionally empty. */}
          </figure>
        </Section>
      </main>

      {/* 6 · Footer */}
      <footer id={sections.footer} className="border-t border-gold/25 py-12 text-[0.9375rem] md:py-16">
        <div className="space-y-5">
          <p>
            <Inline text={footer.notText} />
          </p>
          <ArrowLink link={footer.notLink} />
        </div>

        <nav aria-label={copy.ui.footerLinks} className="mt-10">
          <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {footer.nav.map((item, i) => (
              <li key={item.label} className="flex items-center gap-x-2">
                {i > 0 && <span aria-hidden="true">·</span>}
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-10">
          <Inline text={footer.official} />
        </p>

        <p className="mt-6 text-sm leading-relaxed text-cream/75">
          <Inline text={footer.disclaimer} />
        </p>
      </footer>
    </>
  );
}
