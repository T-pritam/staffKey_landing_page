import { Fragment, type CSSProperties, type ReactNode } from "react";

/**
 * Splits text into masked words for rise-in reveals, without GSAP's paid
 * SplitText. Pass a string, or an array where `{ em: "word" }` renders italic.
 * Words stay real text, so screen readers and search engines read the sentence.
 */
export type SplitPart = string | { em: string };

/** `start` offsets each word's `--i` (its index, for CSS stagger) when one headline spans several calls. */
export function SplitWords({ parts, wordClassName, start = 0 }: { parts: SplitPart | SplitPart[]; wordClassName?: string; start?: number }) {
  const list = Array.isArray(parts) ? parts : [parts];
  const words: { text: string; em: boolean }[] = [];
  for (const part of list) {
    const em = typeof part !== "string";
    const text = typeof part === "string" ? part : part.em;
    for (const w of text.split(/\s+/).filter(Boolean)) words.push({ text: w, em });
  }

  return (
    <>
      {words.map((w, i) => {
        const node: ReactNode = w.em ? <em>{w.text}</em> : w.text;
        return (
          <Fragment key={i}>
            <span className="sw-mask">
              <span className={`sw-word ${wordClassName ?? ""}`} style={{ "--i": start + i } as CSSProperties}>
                {node}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </>
  );
}
