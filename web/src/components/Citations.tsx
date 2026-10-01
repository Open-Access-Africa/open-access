import type { ReactNode } from "react";
import { splitInline, splitNoteRefs, type Note } from "@/lib/citations";

/*
  Renders Chicago notes-bibliography citations on an entry page:
  - <CitedText> turns superscript note numbers in the Summary / Analysis into
    linked superscripts that jump to the matching note.
  - <EntryNotes> lists the numbered notes, each linking back to the text, and
    the bibliography.
*/

const noteId = (n: number) => `note-${n}`;
const refId = (n: number) => `ref-${n}`;

/** Summary or Analysis text with linked note numbers. */
export function CitedText({
  text,
  noteNumbers,
  linked,
}: {
  text: string;
  /** Note numbers that exist in the Notes list. */
  noteNumbers: Set<number>;
  /** Shared across the Summary and Analysis so each back-link target is unique. */
  linked: Set<number>;
}) {
  return (
    <>
      {splitNoteRefs(text).map((part, i) => {
        if (part.kind === "text") return part.value;
        if (!noteNumbers.has(part.n)) {
          return <sup key={i}>{part.n}</sup>;
        }
        const first = !linked.has(part.n);
        linked.add(part.n);
        return (
          <sup key={i} id={first ? refId(part.n) : undefined} className="ml-px scroll-mt-24">
            <a
              href={`#${noteId(part.n)}`}
              aria-label={`Note ${part.n}`}
              className="font-mono font-semibold text-[#9fe3e0] no-underline hover:text-white"
            >
              {part.n}
            </a>
          </sup>
        );
      })}
    </>
  );
}

function Inline({ text }: { text: string }): ReactNode {
  return splitInline(text).map((part, i) => {
    if (part.kind === "text") return part.value;
    if (part.kind === "em") return <em key={i}>{part.value}</em>;
    return (
      <a
        key={i}
        href={part.href}
        rel="noopener noreferrer"
        target="_blank"
        className="break-all underline decoration-[#2c4468] underline-offset-4 hover:text-white"
      >
        {part.href}
      </a>
    );
  });
}

/** Numbered notes and bibliography, shown below the Analysis. */
export function EntryNotes({ notes, bibliography }: { notes: Note[]; bibliography: string[] }) {
  return (
    <div className="space-y-10 border-t border-[#1f3252] pt-10">
      <div>
        <h2 id="notes-heading" className="font-mono text-xs tracking-[0.3em] text-[#9fe3e0] uppercase">
          Notes
        </h2>
        <ol aria-labelledby="notes-heading" className="mt-4 space-y-3 text-sm leading-relaxed text-[#c5d0dc]">
          {notes.map((note) => (
            <li key={note.n} id={noteId(note.n)} className="flex scroll-mt-24 gap-3 target:text-white">
              <span className="w-6 shrink-0 text-right font-mono text-[#8fa0b5]">{note.n}.</span>
              <span className="min-w-0">
                <Inline text={note.text} />{" "}
                <a
                  href={`#${refId(note.n)}`}
                  aria-label={`Back to text for note ${note.n}`}
                  className="text-[#9fe3e0] no-underline hover:text-white"
                >
                  ↩
                </a>
              </span>
            </li>
          ))}
        </ol>
      </div>
      {bibliography.length > 0 && (
        <div>
          <h2 id="bibliography-heading" className="font-mono text-xs tracking-[0.3em] text-[#9fe3e0] uppercase">
            Bibliography
          </h2>
          <ul aria-labelledby="bibliography-heading" className="mt-4 space-y-3 text-sm leading-relaxed text-[#c5d0dc]">
            {bibliography.map((entry) => (
              <li key={entry} className="pl-6 -indent-6">
                <Inline text={entry} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
