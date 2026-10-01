/*
  Chicago notes-bibliography support for archive entries.

  In Airtable, volunteers write:
  - Summary / Analysis: Unicode superscript note numbers after sourced claims,
    e.g. "...in 1913.¹" and "...overstated.¹⁰"
  - Source Text: a "NOTES" section (numbered "1. ...") followed by a
    "BIBLIOGRAPHY" section (one entry per paragraph). Titles may be wrapped in
    *asterisks* for italics.

  Older entries with free-form Source Text still work: they are returned as
  `plain` and shown as before.
*/

const SUPERSCRIPT_DIGITS: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
};

const SUPERSCRIPT_RUN = /[⁰¹²³⁴-⁹]+/g;

export type TextPart = { kind: "text"; value: string } | { kind: "note"; n: number };

/** Split text into plain runs and note references (superscript numbers). */
export function splitNoteRefs(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;
  for (const m of text.matchAll(SUPERSCRIPT_RUN)) {
    const start = m.index ?? 0;
    if (start > last) parts.push({ kind: "text", value: text.slice(last, start) });
    const n = Number([...m[0]].map((c) => SUPERSCRIPT_DIGITS[c]).join(""));
    parts.push({ kind: "note", n });
    last = start + m[0].length;
  }
  if (last < text.length) parts.push({ kind: "text", value: text.slice(last) });
  return parts;
}

/** Remove superscript note numbers, for cards and meta descriptions. */
export function stripNoteRefs(text: string): string {
  return text.replace(SUPERSCRIPT_RUN, "");
}

export type Note = { n: number; text: string };

export type ParsedSources =
  | { kind: "chicago"; notes: Note[]; bibliography: string[] }
  | { kind: "plain"; text: string };

const NOTES_HEADING = /^\s*notes\s*:?\s*$/im;
const BIB_HEADING = /^\s*bibliography\s*:?\s*$/im;
const NOTE_START = /^\s*(\d+)\.\s+/;

function paragraphs(block: string): string[] {
  return block
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

/** Parse a Source Text field into Chicago notes and bibliography. */
export function parseSources(sourceText: string): ParsedSources {
  const notesMatch = NOTES_HEADING.exec(sourceText);
  if (!notesMatch) return { kind: "plain", text: sourceText };

  const afterNotes = sourceText.slice(notesMatch.index + notesMatch[0].length);
  const bibMatch = BIB_HEADING.exec(afterNotes);
  const notesBlock = bibMatch ? afterNotes.slice(0, bibMatch.index) : afterNotes;
  const bibBlock = bibMatch ? afterNotes.slice(bibMatch.index + bibMatch[0].length) : "";

  // Notes: a new note starts at a line beginning "12. "; other lines continue it.
  const notes: Note[] = [];
  for (const line of notesBlock.split("\n")) {
    const start = NOTE_START.exec(line);
    if (start) {
      notes.push({ n: Number(start[1]), text: line.slice(start[0].length).trim() });
    } else if (line.trim() && notes.length > 0) {
      const prev = notes[notes.length - 1];
      prev.text = `${prev.text} ${line.trim()}`;
    }
  }

  if (notes.length === 0) return { kind: "plain", text: sourceText };
  return { kind: "chicago", notes, bibliography: paragraphs(bibBlock) };
}

export type InlinePart =
  | { kind: "text"; value: string }
  | { kind: "em"; value: string }
  | { kind: "link"; href: string };

const INLINE = /(\*[^*\n]+\*)|(https?:\/\/[^\s<>"]+)/g;

/** Split a note or bibliography entry into text, *italic* titles and links. */
export function splitInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    const start = m.index ?? 0;
    if (start > last) parts.push({ kind: "text", value: text.slice(last, start) });
    if (m[1]) {
      parts.push({ kind: "em", value: m[1].slice(1, -1) });
      last = start + m[0].length;
    } else {
      // Keep sentence punctuation after a URL out of the link.
      const url = m[2].replace(/[.,;:)]+$/, "");
      parts.push({ kind: "link", href: url });
      last = start + url.length;
    }
  }
  if (last < text.length) parts.push({ kind: "text", value: text.slice(last) });
  return parts;
}
