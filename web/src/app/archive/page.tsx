import type { Metadata } from "next";
import Link from "next/link";
import { TRACKS, entryHref, getPublishedEntries } from "@/lib/archive";
import { tracks } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Archive",
  description: "Published entries in the Open Access archive of colonial law and reparations.",
};

export default async function Archive() {
  const entries = await getPublishedEntries();

  if (entries.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold-deep">
          Coming soon
        </span>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          The archive is being built
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Our volunteers are researching and reviewing the first entries now. Published entries
          will appear here, each with its own case file and map.
        </p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tracks.map((t) => (
            <li key={t.name} className="rounded-xl border border-line bg-white px-5 py-4 font-semibold">
              {t.name}
            </li>
          ))}
        </ul>
        <Link
          href="/get-involved"
          className="mt-10 inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-white hover:bg-ink/90"
        >
          Help us build it
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-14">
      <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase sm:text-sm">Archive</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">Published entries</h1>
      <div className="mt-12 space-y-14">
        {TRACKS.map((t) => {
          const items = entries.filter((e) => e.track === t.slug);
          if (items.length === 0) return null;
          return (
            <div key={t.slug}>
              <h2 className="font-display text-2xl font-bold tracking-wide">{t.label}s</h2>
              <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((e) => (
                  <li key={e.id}>
                    <Link href={entryHref(e)} className="flex h-full flex-col gap-3 border border-line bg-white p-6 hover:border-ink">
                      <span className="flex justify-between font-mono text-xs tracking-[0.2em] text-gold-deep uppercase">
                        <span>{e.place ?? e.countryCodes.join(", ")}</span>
                        <span>{e.year}</span>
                      </span>
                      <span className="font-display text-lg leading-tight font-bold tracking-wide">{e.title}</span>
                      {e.summary && <span className="line-clamp-3 text-[15px] leading-relaxed text-ink-soft">{e.summary}</span>}
                      <span className="mt-auto pt-2 font-mono text-xs tracking-[0.14em] text-[#5a6b78] uppercase">Open case file →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
