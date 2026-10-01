import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseMap, type MapPoint } from "@/components/CaseMap";
import { CitedText, EntryNotes } from "@/components/Citations";
import { entryHref, entryLocation, getEntry, getPublishedEntries } from "@/lib/archive";
import { parseSources, stripNoteRefs } from "@/lib/citations";

export const revalidate = 300;

type Props = { params: Promise<{ track: string; id: string }> };

export async function generateStaticParams() {
  const entries = await getPublishedEntries();
  return entries.map((e) => ({ track: e.track, id: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track, id } = await params;
  const found = await getEntry(track, id);
  if (!found) return { title: "Not found" };
  return { title: found.entry.title, description: found.entry.summary ? stripNoteRefs(found.entry.summary).slice(0, 160) : undefined };
}

export default async function CaseFilePage({ params }: Props) {
  const { track, id } = await params;
  const found = await getEntry(track, id);
  if (!found) notFound();
  const { entry, related } = found;

  const sources = entry.sourceText ? parseSources(entry.sourceText) : null;
  const chicago = sources?.kind === "chicago" ? sources : null;
  const noteNumbers = new Set(chicago?.notes.map((n) => n.n) ?? []);
  const linked = new Set<number>();

  const mainLoc = entryLocation(entry);
  const points: MapPoint[] = [
    ...(mainLoc ? [{ ...mainLoc, label: entry.title, main: true }] : []),
    ...related.flatMap((r) => {
      const loc = entryLocation(r);
      return loc ? [{ ...loc, label: r.title }] : [];
    }),
  ];

  return (
    <div className="bg-[#081326] text-[#e6ecf2]">
      <section className="mx-auto max-w-7xl px-5 pt-12 pb-8 sm:px-8 lg:px-14">
        <nav aria-label="Breadcrumb" className="font-mono text-xs tracking-[0.3em] text-[#9fe3e0] uppercase sm:text-sm">
          <Link href="/archive" className="hover:text-white">Archive</Link> / {entry.trackLabel}
          {entry.place ? ` / ${entry.place}` : ""}
        </nav>
        <h1 className="mt-5 font-display text-4xl leading-none font-extrabold tracking-tight text-[#f4f7f8] sm:text-6xl">
          {entry.title}
          {entry.year && <span className="text-[#9fe3e0]"> {entry.year}</span>}
        </h1>
        {entry.facts.length > 0 && (
          <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {entry.facts.slice(0, 4).map((f) => (
              <div key={f.label} className="border-t border-[#2c4468] pt-3">
                <dt className="font-mono text-[11px] tracking-[0.2em] text-[#8fa0b5] uppercase">{f.label}</dt>
                <dd className="mt-1 font-display text-lg font-bold text-[#f4f7f8]">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {points.length > 0 && (
        <section aria-label="Map" className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-14">
          <div className="overflow-hidden rounded-lg border border-[#1b2a45]">
            <CaseMap points={points} />
          </div>
          {mainLoc && !mainLoc.exact && (
            <p className="mt-2 font-mono text-xs tracking-[0.14em] text-[#8fa0b5] uppercase">
              Point shows the country, not an exact place
            </p>
          )}
        </section>
      )}

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr] lg:px-14">
        <div className="space-y-10">
          {entry.summary && (
            <div>
              <h2 className="font-mono text-xs tracking-[0.3em] text-[#9fe3e0] uppercase">Summary</h2>
              <p className="mt-4 text-lg leading-relaxed whitespace-pre-line">
                <CitedText text={entry.summary} noteNumbers={noteNumbers} linked={linked} />
              </p>
            </div>
          )}
          {entry.body && (
            <div>
              <h2 className="font-mono text-xs tracking-[0.3em] text-[#9fe3e0] uppercase">{entry.bodyLabel}</h2>
              <p className="mt-4 leading-relaxed whitespace-pre-line text-[#c5d0dc]">
                <CitedText text={entry.body} noteNumbers={noteNumbers} linked={linked} />
              </p>
            </div>
          )}
          {chicago && <EntryNotes notes={chicago.notes} bibliography={chicago.bibliography} />}
        </div>
        <aside className="space-y-8">
          {entry.mechanisms.length > 0 && (
            <div>
              <h2 className="font-mono text-xs tracking-[0.3em] text-[#9fe3e0] uppercase">Mechanism of harm</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {entry.mechanisms.map((m) => (
                  <li key={m} className="rounded-full bg-[#e4f4f3] px-3 py-1 text-sm font-medium text-[#0f5a5d]">{m}</li>
                ))}
              </ul>
            </div>
          )}
          {entry.facts.length > 4 && (
            <dl className="space-y-3">
              {entry.facts.slice(4).map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-[11px] tracking-[0.2em] text-[#8fa0b5] uppercase">{f.label}</dt>
                  <dd className="mt-1">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {(entry.sourceUrls.length > 0 || sources?.kind === "plain") && (
            <div>
              <h2 className="font-mono text-xs tracking-[0.3em] text-[#9fe3e0] uppercase">Sources</h2>
              <ul className="mt-4 space-y-2 break-words text-[#c5d0dc]">
                {entry.sourceUrls.map((u) => (
                  <li key={u}><a href={u} className="underline decoration-[#2c4468] underline-offset-4 hover:text-white" rel="noopener noreferrer" target="_blank">{u}</a></li>
                ))}
              </ul>
              {sources?.kind === "plain" && (
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-[#c5d0dc]">{sources.text}</p>
              )}
            </div>
          )}
        </aside>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="linked-heading" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-14">
          <h2 id="linked-heading" className="font-mono text-xs tracking-[0.3em] text-[#9fe3e0] uppercase">Linked entries</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.id}>
                <Link href={entryHref(r)} className="flex h-full flex-col gap-2 border border-[#1f3252] bg-[#0d1a33] p-5 hover:border-[#9fe3e0]">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[#9fe3e0] uppercase">
                    {[r.trackLabel, r.year].filter(Boolean).join(" · ")}
                  </span>
                  <span className="font-display text-lg leading-tight font-bold">{r.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
