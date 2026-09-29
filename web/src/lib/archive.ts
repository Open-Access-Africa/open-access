import "server-only";
import centroids from "@/lib/country-centroids.json";

/*
  Read-only access to PUBLISHED research entries in Airtable.

  - Runs on the server only (the token never reaches the browser).
  - Only records whose Task Status is "Published" are requested.
  - Only public fields are requested: no volunteer, email or workflow fields.
  - Without AIRTABLE_TOKEN (e.g. local dev) everything returns empty and the
    site falls back to sample points and "coming soon" copy.
*/

const BASE_ID = process.env.AIRTABLE_BASE_ID ?? "appbrLESyzc7qVxYM";
const REVALIDATE_SECONDS = 300;

export type TrackSlug = "colonial-laws" | "reparations-cases" | "modern-cases" | "modern-laws";

export type Fact = { label: string; value: string };

export type Entry = {
  id: string;
  track: TrackSlug;
  trackLabel: string;
  title: string;
  year?: string;
  place?: string;
  countryCodes: string[];
  lat?: number;
  lng?: number;
  summary?: string;
  body?: string;
  bodyLabel: string;
  facts: Fact[];
  mechanisms: string[];
  sourceUrls: string[];
  sourceText?: string;
  relatedIds: string[];
};

type FieldMap = {
  title: string;
  year: string;
  place: string;
  summary: string;
  body?: string;
  bodyLabel: string;
  mechanism: string;
  sources: string[];
  sourceText: string;
  related: string[];
  countryCode: string;
  lat: string;
  lng: string;
  facts: { label: string; field: string }[];
};

type TrackConfig = { slug: TrackSlug; label: string; tableId: string; fields: FieldMap };

export const TRACKS: TrackConfig[] = [
  {
    slug: "colonial-laws",
    label: "Colonial Law",
    tableId: "tbl12VEowO9biP7y0",
    fields: {
      title: "fldwsrKEkQ3sjHDvR",
      year: "fldFq2kS1busLvz7b",
      place: "fldr8b9jkFGSUWXBg",
      summary: "fld4obKAzVnR7yCrq",
      body: "flduWpe6G76imJSaZ",
      bodyLabel: "Analysis",
      mechanism: "fldlm4dmrxJzZzqdb",
      sources: ["fldY7R8ObsBc65lsH", "fldyEITFzZcEbzx6G", "fldKFdWsT6LHFv8il"],
      sourceText: "fld1Ou6qO9MsoSFai",
      related: ["fldxIUctBDCKZDvPi", "fldiEEUgAvsacyUKr", "fldX2xfCS6uczt7J9"],
      countryCode: "fldad2WAaVAs911zD",
      lat: "fld05gOcXcdxKAeWT",
      lng: "fldmLpwWo3yf4Rrgj",
      facts: [
        { label: "Colonial power", field: "fld8YkPunjSxI2BCj" },
        { label: "Colony / territory", field: "fld78q1hAMiYalCvg" },
        { label: "Instrument", field: "fldePJ4UqwJwi6IVj" },
        { label: "Target community", field: "fldp4TEwIrMplTDaq" },
      ],
    },
  },
  {
    slug: "reparations-cases",
    label: "Reparations Case",
    tableId: "tbl0KIyJ7wZRtKYMc",
    fields: {
      title: "fldEorb1PkAvhkpgv",
      year: "fldTEKbrCK9BdAZjx",
      place: "fldHorNdDXwAOC5ks",
      summary: "fldLVpRpA2jeLPnR5",
      body: "fldFzlKAWNRpN5kXr",
      bodyLabel: "Context",
      mechanism: "fld9mGdKhHK3WoHF7",
      sources: ["fldA8FX4FLE3JJUZP", "fld7jI5HlDIY20spj", "fldjNfGPGOHpwhaC1"],
      sourceText: "fld52sQVkJUrdb9Uy",
      related: ["fldQxCSaKF5gfG0ia", "fldDOd4kCQ1ZSGYlr"],
      countryCode: "fldKZ1RFlcr0oGctO",
      lat: "fldlmyg65fAdVRAlO",
      lng: "fld4yaHss3ClB4lyC",
      facts: [
        { label: "Claimant community", field: "fldq5nYuxxO6Gwvpm" },
        { label: "Outcome", field: "fldzAgZQJ7oa6tqPz" },
        { label: "Status", field: "fldEggeGXuQ1rzwyZ" },
        { label: "Legal route", field: "fldLcr872cw5vN3RP" },
        { label: "Amount (USD)", field: "fld3vZrwCuZE0wG1F" },
        { label: "Land", field: "fldUJ3ZpwTFCeoGBM" },
      ],
    },
  },
  {
    slug: "modern-cases",
    label: "Modern Case",
    tableId: "tblkTJw0lJcprwsYY",
    fields: {
      title: "fldM55Cj2xIIGgNtF",
      year: "fldlOmn5oUpGZVoUe",
      place: "fld2WT8c9ZlDCEn9r",
      summary: "fldOKO07u8T6tFYlH",
      body: "fldC3TBWHuqoOGq5R",
      bodyLabel: "Analysis",
      mechanism: "fldiMhbB23hHJEZWn",
      sources: ["fldw6sbQfnA9S7CvP", "fldgpXxdmspN8nkEW", "fldZajZvAMMNsUZBA"],
      sourceText: "fld4x80nXECBqXPJ7",
      related: ["fldGuEUCJu0crwGum", "fldcFqfKo8Ki2uqrD", "fldZoXvfxvKc3w088"],
      countryCode: "fldh9sd62YMLxtKKZ",
      lat: "fldxGFvBnuHy1dqBr",
      lng: "fldkw5GNu0X51ojZF",
      facts: [
        { label: "Sector", field: "fldmgff8LzTsTlWGj" },
        { label: "Affected community", field: "fldf89DMStnTtm0SO" },
        { label: "Responsible party", field: "fldD3lqOGHwuJsV0U" },
        { label: "Legal action", field: "fld2n2FlDsCCJQ2eo" },
        { label: "Court / forum", field: "fld7nerIsQpdawyZL" },
        { label: "Status", field: "fld39MgLhwfIGBppm" },
        { label: "Remedy", field: "fldp0csu1GcRfbecl" },
      ],
    },
  },
  {
    slug: "modern-laws",
    label: "Modern Law or Policy",
    tableId: "tblU6fpk3jXtnY42Q",
    fields: {
      title: "fldCmVVtJfxXBegn3",
      year: "fldx4r34sHSIqob4D",
      place: "fldsNu4WWUAw7JZdn",
      summary: "fld0xun7E0i0pSrif",
      body: "fldNNyjF6dXRDyQYe",
      bodyLabel: "Analysis",
      mechanism: "fldlNxSRsDzH4xXqN",
      sources: ["fldtDkyEydUklGoyr", "fldnOVIiAH5DMnyiw", "fld9sqf9UwCm0F9XX"],
      sourceText: "fld181CQ9o3KPJXSv",
      related: ["fldWGKEfsZbJkazBy", "fldZGDtC5IcGFQWQq"],
      countryCode: "fldJCx0TJ3nXUZMzn",
      lat: "fldHLIaKshvpVId84",
      lng: "fldBymXASJFDaD4xy",
      facts: [
        { label: "Level", field: "fldImHUl4y3RyVktF" },
        { label: "Issued by", field: "fldtaGCnhdu7AdLGm" },
        { label: "Instrument", field: "fldtGcmTJPmp1wn5O" },
        { label: "Direction", field: "fldbKEUJbptwvlCWn" },
        { label: "Affected community", field: "fldHiQ8nlecBo6qij" },
        { label: "Current status", field: "fldLD9hdCYxh9irDa" },
      ],
    },
  },
];

type AirtableRecord = { id: string; fields: Record<string, unknown> };

function text(v: unknown): string | undefined {
  if (v === null || v === undefined || v === "") return undefined;
  if (Array.isArray(v)) return v.map((x) => text(x)).filter(Boolean).join(", ") || undefined;
  if (typeof v === "object") return (v as { name?: string }).name;
  return String(v);
}

function list(v: unknown): string[] {
  if (!Array.isArray(v)) return v ? [text(v)!].filter(Boolean) : [];
  return v.map((x) => text(x)).filter((x): x is string => Boolean(x));
}

function num(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function toEntry(track: TrackConfig, r: AirtableRecord): Entry {
  const f = track.fields;
  const get = (id: string) => r.fields[id];
  const countryCodes = (text(get(f.countryCode)) ?? "")
    .split(/[,\s]+/)
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);
  const facts = f.facts
    .map(({ label, field }) => {
      const raw = get(field);
      const value =
        typeof raw === "number" && label.includes("USD")
          ? `$${raw.toLocaleString("en-US")}`
          : text(raw);
      return value ? { label, value } : null;
    })
    .filter((x): x is Fact => x !== null);

  return {
    id: r.id,
    track: track.slug,
    trackLabel: track.label,
    title: text(get(f.title)) ?? "Untitled entry",
    year: text(get(f.year)),
    place: text(get(f.place)),
    countryCodes,
    lat: num(get(f.lat)),
    lng: num(get(f.lng)),
    summary: text(get(f.summary)),
    body: f.body ? text(get(f.body)) : undefined,
    bodyLabel: f.bodyLabel,
    facts,
    mechanisms: list(get(f.mechanism)),
    sourceUrls: f.sources.map((id) => text(get(id))).filter((x): x is string => Boolean(x)),
    sourceText: text(get(f.sourceText)),
    relatedIds: f.related.flatMap((id) => (Array.isArray(get(id)) ? (get(id) as string[]) : [])),
  };
}

async function fetchPublished(track: TrackConfig): Promise<Entry[]> {
  const token = process.env.AIRTABLE_TOKEN;
  if (!token) return [];

  const f = track.fields;
  const fieldIds = [
    f.title, f.year, f.place, f.summary, f.mechanism, f.sourceText, f.countryCode, f.lat, f.lng,
    ...(f.body ? [f.body] : []), ...f.sources, ...f.related, ...f.facts.map((x) => x.field),
  ];

  const entries: Entry[] = [];
  let offset: string | undefined;
  do {
    const params = new URLSearchParams({
      filterByFormula: "{Task Status}='Published'",
      returnFieldsByFieldId: "true",
      pageSize: "100",
    });
    fieldIds.forEach((id) => params.append("fields[]", id));
    if (offset) params.set("offset", offset);

    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${track.tableId}?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["airtable"] },
    });
    if (!res.ok) {
      console.error(`Airtable ${track.slug}: ${res.status}`);
      return entries;
    }
    const data = (await res.json()) as { records: AirtableRecord[]; offset?: string };
    entries.push(...data.records.map((r) => toEntry(track, r)));
    offset = data.offset;
  } while (offset);

  return entries;
}

/** Every published entry across the four tracks. */
export async function getPublishedEntries(): Promise<Entry[]> {
  const all = await Promise.all(TRACKS.map(fetchPublished));
  const entries = all.flat();
  // Only keep links to other *published* entries.
  const published = new Set(entries.map((e) => e.id));
  return entries.map((e) => ({ ...e, relatedIds: e.relatedIds.filter((id) => published.has(id)) }));
}

export async function getEntry(track: string, id: string) {
  const entries = await getPublishedEntries();
  const entry = entries.find((e) => e.track === track && e.id === id);
  if (!entry) return null;
  const related = entry.relatedIds
    .map((rid) => entries.find((e) => e.id === rid))
    .filter((e): e is Entry => Boolean(e));
  return { entry, related };
}

export function entryHref(e: Pick<Entry, "track" | "id">) {
  return `/archive/${e.track}/${e.id}`;
}

/** Exact coordinates if present, otherwise the centre of the first country code. */
export function entryLocation(e: Entry): { lat: number; lng: number; exact: boolean } | null {
  if (e.lat !== undefined && e.lng !== undefined) return { lat: e.lat, lng: e.lng, exact: true };
  const table = centroids as unknown as Record<string, [number, number]>;
  for (const code of e.countryCodes) {
    const c = table[code];
    if (c) return { lat: c[0], lng: c[1], exact: false };
  }
  return null;
}
