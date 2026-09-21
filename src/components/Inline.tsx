import { Fragment } from "react";

/**
 * Renders a copy string with the two inline marks used in the source
 * document: **bold** and *italic*. Nothing else is interpreted, so the
 * content files can mirror VETRINA_TESTI.md line for line.
 */
const MARKS = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

export function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(MARKS).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
