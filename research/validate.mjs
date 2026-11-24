#!/usr/bin/env node
// Validate a research draft (JSON) against the Open Access standard for its track.
//
//   node research/validate.mjs <draft.json> [more drafts...]
//
// A draft is a JSON object whose keys are Airtable field names (see research/tracks/*.json),
// plus the staging-only keys "Track", "Source Lead", "Sources", "Quotes" and "Draft Flags".
// Exit code 0 when every draft passes, 1 otherwise. Warnings never fail a draft.
//
// Offline checks only. Link and quote checks against live pages are done by the agent while
// it researches (it records a snapshot per source), and by the human reviewer.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const centroids = JSON.parse(readFileSync(join(here, "../web/src/lib/country-centroids.json"), "utf8"));
const ISO = new Set(Object.keys(centroids));

const TRACK_FILES = { "Colonial Laws": "colonial-laws.json" };

// Judgement words the README asks entries to avoid unless quoted or attributed.
const BANNED = ["justice", "injustice", "exploitation", "exploited", "exploit", "suppression", "oppression", "oppressive", "harm", "harmful", "investigation", "systematic", "brutal", "atrocity", "atrocities", "notorious", "infamous"];

// Sources that may be used to find material but never cited.
const NOT_CITABLE = [/wikipedia\.org/i, /wikiwand\./i, /quora\./i, /reddit\./i, /chatgpt|openai\.com/i];

const SUP = { "⁰": 0, "¹": 1, "²": 2, "³": 3, "⁴": 4, "⁵": 5, "⁶": 6, "⁷": 7, "⁸": 8, "⁹": 9 };
const SUP_RUN = /[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g;

const noteRefs = (text) => [...text.matchAll(SUP_RUN)].map((m) => Number([...m[0]].map((c) => SUP[c]).join("")));
const words = (text) => text.replace(SUP_RUN, "").split(/\s+/).filter(Boolean).length;
const sentences = (text) =>
  text
    .replace(SUP_RUN, "")
    .replace(/\b(No|no|s|ss|para|paras|c|ca|vol|Vol|ed|eds|St|Mr|Dr|cf|e\.g|i\.e|U\.S|U\.K)\./g, "$1")
    .replace(/\b([A-Z])\./g, "$1") // initials such as "H. W. Hill"
    .split(/(?<=[.!?])\s+(?=[A-Z"“(])/)
    .filter((s) => s.trim().length > 0).length;
const stripQuotes = (text) =>
  text
    .replace(/[“"][^”"]*[”"]/g, " ")
    // Institutional names that contain a judgement word are fine.
    .replace(/\bjustices? of the peace\b|\b(ministry|department|court|minister) of justice\b|\bcourt of justice\b/gi, " ");

function parseSourceText(st) {
  const n = /^\s*NOTES\s*$/m.exec(st);
  const b = /^\s*BIBLIOGRAPHY\s*$/m.exec(st);
  if (!n || !b || b.index < n.index) return null;
  const notesBlock = st.slice(n.index + n[0].length, b.index);
  const bib = st
    .slice(b.index + b[0].length)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const notes = [];
  for (const line of notesBlock.split("\n")) {
    const m = /^\s*(\d+)\.\s+(.*)$/.exec(line);
    if (m) notes.push({ n: Number(m[1]), text: m[2] });
    else if (line.trim() && notes.length) notes[notes.length - 1].text += " " + line.trim();
  }
  return { notes, bib };
}

function validate(draft) {
  const errors = [];
  const warnings = [];
  const trackName = draft.Track ?? "Colonial Laws";
  const spec = JSON.parse(readFileSync(join(here, "tracks", TRACK_FILES[trackName]), "utf8"));

  // Required fields, types and choices.
  for (const [name, f] of Object.entries(spec.fields)) {
    const v = draft[name];
    const empty = v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
    if (empty) {
      if (f.required) errors.push(`${name}: required`);
      continue;
    }
    if (f.type === "choice" && !f.choices.includes(v)) errors.push(`${name}: "${v}" is not an option (${f.choices.join(", ")})`);
    if (f.type === "multi") {
      if (!Array.isArray(v)) errors.push(`${name}: must be a list`);
      else for (const x of v) if (!f.choices.includes(x)) errors.push(`${name}: "${x}" is not an option`);
    }
    if (f.type === "year" && !(Number.isInteger(v) && v > 1000 && v <= new Date().getFullYear())) errors.push(`${name}: must be a whole year`);
    if (f.type === "url") {
      if (!/^https?:\/\/\S+$/.test(v)) errors.push(`${name}: must be a single URL`);
      if (NOT_CITABLE.some((r) => r.test(v))) errors.push(`${name}: ${v} is a discovery source and may not be cited`);
    }
    if (f.type === "countryCodes") {
      for (const c of String(v).split(",").map((s) => s.trim())) if (c !== "INT" && !ISO.has(c)) errors.push(`${name}: "${c}" is not an ISO 3166 two-letter code or INT`);
    }
    if (f.type === "lat" && !(typeof v === "number" && v >= -90 && v <= 90)) errors.push(`${name}: must be a number between -90 and 90`);
    if (f.type === "lng" && !(typeof v === "number" && v >= -180 && v <= 180)) errors.push(`${name}: must be a number between -180 and 180`);
    if (f.sentences) {
      const s = sentences(v);
      if (s < f.sentences[0] || s > f.sentences[1]) errors.push(`${name}: ${s} sentences, needs ${f.sentences[0]}–${f.sentences[1]}`);
    }
    if (f.minWords && words(v) < f.minWords) errors.push(`${name}: ${words(v)} words, needs ${f.minWords}+`);
  }

  if ((draft.Mechanism ?? []).includes("Other") && !draft["Other Description"]) errors.push("Other Description: required when Mechanism includes Other");

  // Latitude and longitude come together, and land near the country.
  const hasLat = typeof draft.Latitude === "number";
  const hasLng = typeof draft.Longitude === "number";
  if (hasLat !== hasLng) errors.push("Latitude/Longitude: fill both or neither");
  if (hasLat && hasLng && draft["Country Code"]) {
    const codes = String(draft["Country Code"]).split(",").map((s) => s.trim()).filter((c) => centroids[c]);
    const near = codes.some((c) => Math.abs(centroids[c][0] - draft.Latitude) < 20 && Math.abs(centroids[c][1] - draft.Longitude) < 25);
    if (codes.length && !near) errors.push("Latitude/Longitude: point is far from every listed country (swapped, or missing a minus sign?)");
  }

  // Factual language: banned words outside quotations.
  for (const name of ["Summary", "Analysis"]) {
    const text = stripQuotes(draft[name] ?? "").toLowerCase();
    for (const w of BANNED) if (new RegExp(`\\b${w}\\b`).test(text)) errors.push(`${name}: avoid "${w}" unless quoted or attributed`);
    if (/\b(it's|don't|isn't|wasn't|can't|won't|didn't|doesn't|aren't|weren't|they're|we're|you're)\b/i.test(draft[name] ?? "")) errors.push(`${name}: write out contractions`);
  }

  // Chicago notes: one sequence across the note fields, Summary first, no reuse, every note present.
  const refs = spec.noteFieldsInOrder.flatMap((name) => noteRefs(draft[name] ?? ""));
  if (refs.length === 0) errors.push("Notes: no superscript note numbers in the text");
  refs.forEach((n, i) => {
    if (n !== i + 1) errors.push(`Notes: reference ${i + 1} in the text is numbered ${n} (numbers must run 1, 2, 3… in order, never reused)`);
  });
  const parsed = parseSourceText(draft["Source Text"] ?? "");
  if (!parsed) errors.push('Source Text: needs a "NOTES" heading followed by a "BIBLIOGRAPHY" heading');
  else {
    const nums = parsed.notes.map((x) => x.n);
    if (nums.length !== refs.length) errors.push(`Source Text: ${nums.length} notes for ${refs.length} references in the text`);
    nums.forEach((n, i) => n !== i + 1 && errors.push(`Source Text: note ${i + 1} is numbered ${n}`));
    if (parsed.bib.length < 2) errors.push("Source Text: bibliography needs 2 or more sources");
    const sortKey = (s) => s.replace(/^[*"“]+/, "").replace(/^(the|a|an|le|la|les|el|los|las)\s+/i, "").toLowerCase();
    const sorted = [...parsed.bib].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
    if (parsed.bib.some((b, i) => b !== sorted[i])) warnings.push("Source Text: bibliography is not in alphabetical order");
    if (new Set(parsed.bib).size !== parsed.bib.length) errors.push("Source Text: a bibliography entry appears twice");
    for (const src of ["Source 1", "Source 2", "Source 3"]) {
      const u = draft[src];
      if (u && !draft["Source Text"].includes(u)) errors.push(`${src}: ${u} is not cited in Source Text`);
    }
    if (NOT_CITABLE.some((r) => r.test(draft["Source Text"]))) errors.push("Source Text: cites a discovery-only source (e.g. Wikipedia)");
  }

  // Staging metadata the reviewer relies on.
  if (!/^rec[A-Za-z0-9]{14}$/.test(draft["Source Lead"] ?? "")) errors.push("Source Lead: Airtable record id (rec…) required");
  const sources = draft.Sources ?? [];
  if (!sources.some((s) => s.tier === 1)) errors.push("Sources: at least one Tier 1 (primary) source is required");
  for (const s of sources) if (!s.snapshot) warnings.push(`Sources: no snapshot or archive link recorded for ${s.url}`);
  for (const q of draft.Quotes ?? []) if (!q.url) errors.push(`Quotes: "${q.text.slice(0, 40)}…" has no source URL`);
  const quoted = [...`${draft.Summary ?? ""} ${draft.Analysis ?? ""}`.matchAll(/[“"]([^”"]+)[”"]/g)].map((m) => m[1]).filter((q) => q.length >= 25);
  for (const q of quoted) if (!(draft.Quotes ?? []).some((x) => x.text.includes(q.slice(0, 25)))) errors.push(`Quotes: "${q.slice(0, 40)}…" is not listed in Quotes for checking`);

  return { errors, warnings };
}

let failed = 0;
for (const path of process.argv.slice(2)) {
  const draft = JSON.parse(readFileSync(path, "utf8"));
  const { errors, warnings } = validate(draft);
  const title = draft["Law Name"] ?? path;
  console.log(`\n${errors.length ? "FAIL" : "PASS"}  ${title}`);
  for (const e of errors) console.log(`  ✗ ${e}`);
  for (const w of warnings) console.log(`  ! ${w}`);
  if (errors.length) failed++;
}
process.exit(failed ? 1 : 0);
