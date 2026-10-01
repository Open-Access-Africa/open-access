import Link from "next/link";
import { HomeGlobe } from "@/components/HomeGlobe";
import { entryHref, entryLocation, getPublishedEntries } from "@/lib/archive";
import { SAMPLE_POINTS, type GlobePoint } from "@/lib/globe-points";
import { lawAndRecord, links, roles, tracks, trackPrompts } from "@/lib/site";

// Re-read published entries from Airtable at most every 5 minutes.
export const revalidate = 300;

export default async function Home() {
  const entries = await getPublishedEntries();
  const livePoints: GlobePoint[] = entries.flatMap((e) => {
    const loc = entryLocation(e);
    return loc
      ? [{ ...loc, label: e.title, sublabel: [e.trackLabel, e.year].filter(Boolean).join(" · "), href: entryHref(e) }]
      : [];
  });
  const usingSamples = livePoints.length === 0;
  const points = usingSamples ? SAMPLE_POINTS : livePoints;
  return (
    <>
      {/* Title area */}
      <section className="mx-auto flex max-w-7xl flex-col items-center gap-7 px-5 pb-14 pt-16 text-center sm:px-8 sm:pt-20 lg:px-14">
        <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase sm:text-sm">
          Archive / Colonial Law / Reparations
        </p>
        {/* remove Main Heading
        <h1 className="font-display text-5xl leading-none font-extrabold tracking-tight sm:text-7xl lg:text-[80px]">
          <span className="block">Counter mapping strategies</span>
          <span className="block text-teal">Trace the laws</span>
        </h1>
        */}
        <ul className="flex flex-wrap justify-center gap-3">
          {tracks.map((t) => (
            <li key={t.name}>
              <Link
                href="/archive"
                className="inline-flex min-h-11 items-center border border-[#b9cdd2] bg-white px-4 font-mono text-xs tracking-[0.2em] uppercase hover:border-ink"
              >
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Interactive globe: published entries, or labelled sample points until the first are published */}
      <section
        aria-labelledby="globe-heading"
        className="bg-[radial-gradient(ellipse_at_40%_50%,#e3f1f2_0%,#edf4f5_45%,#f4f7f8_75%)]"
      >
        <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_380px] lg:px-14 lg:py-16">
          <figure className="m-0">
            <HomeGlobe points={points} />
            <figcaption className="mt-3 text-center font-mono text-xs tracking-[0.2em] text-[#5a6b78] uppercase">
              {usingSamples
                ? "Sample points shown until the first entries are published"
                : `${livePoints.length} published ${livePoints.length === 1 ? "entry" : "entries"} · drag to rotate · click a point`}
            </figcaption>
          </figure>
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-white/90 p-7 text-center shadow-[0_12px_40px_rgba(14,27,44,0.10)]">
            <span aria-hidden className="flex h-13 w-13 items-center justify-center rounded-full bg-[#d5e6e8]">
              <span className="h-4.5 w-4.5 rounded-full bg-ink" />
            </span>
            <h2 id="globe-heading" className="text-2xl font-semibold">
              Where would you like to start?
            </h2>
            {/*remove sentence
            <p className="text-[15px] leading-relaxed text-muted">
              Every point is a law, case or policy in the archive. Start from one of the four tracks.
            </p>
            */}
            <ul className="mt-1 flex w-full flex-col gap-2.5 text-left">
              {trackPrompts.map((p) => (
                <li key={p.track}>
                  <Link
                    href="/archive"
                    className={`flex justify-between gap-3 rounded-2xl border px-4 py-3.5 text-[15px] leading-snug hover:border-ink ${p.tint}`}
                  >
                    <span>
                      <strong className="font-semibold">{p.track}</strong>
                      <br />
                      {p.prompt}
                    </span>
                    <span aria-hidden>↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Law & Record */}
      <section aria-labelledby="record-heading" className="border-t border-line bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-14 lg:py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-2.5">
              <p className="font-mono text-xs tracking-[0.3em] text-gold-deep uppercase sm:text-sm">
                Case file · South Africa
              </p>
              <h2 id="record-heading" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                Law &amp; Record
              </h2>
            </div>
            <p className="max-w-md leading-relaxed text-muted">
              Every entry links forward and back: from the law that caused a harm, to the claims and
              remedies that followed.
            </p>
          </div>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {lawAndRecord.map((r, i) => (
              <li key={r.title} className="flex flex-col gap-3.5 border border-line bg-[#f7fafa] p-7">
                <p className={`flex justify-between font-mono text-xs tracking-[0.2em] uppercase ${r.color}`}>
                  <span>0{i + 1} · {r.kind}</span>
                  <span>{r.year}</span>
                </p>
                <h3 className="font-display text-xl leading-tight font-bold tracking-wide">{r.title}</h3>
                <p className="text-[15px] leading-relaxed text-ink-soft">{r.text}</p>
                <p className="mt-auto pt-2 font-mono text-xs tracking-[0.14em] text-[#5a6b78] uppercase">{r.footer}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Join the investigation */}
      <section aria-labelledby="join-heading" className="bg-navy text-[#f4f7f8]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:px-14">
          <div className="flex flex-col items-start gap-5">
            <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase sm:text-sm">Recruiting · Remote</p>
            <h2 id="join-heading" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Join the investigation
            </h2>
            {/* remove sentence 
            <p className="max-w-md text-lg leading-relaxed text-[#c5d0d8]">
              A few hours a week, in your browser. Most roles need no prior experience.
            </p>
            */}
            <a
              href={links.volunteerForm}
              className="mt-2 inline-flex min-h-12 items-center bg-gold px-7 font-display text-sm font-bold tracking-[0.16em] text-ink uppercase hover:bg-gold/90"
            >
              Volunteer with us
            </a>
          </div>
          <ul className="border-t border-[#2a3a4e]">
            {roles.map((r, i) => (
              <li key={r.name} className="border-b border-[#2a3a4e]">
                <Link href="/get-involved" className="flex items-center justify-between py-4.5 text-[#f4f7f8] hover:text-gold">
                  <span className="font-display text-lg font-bold tracking-wider">{r.name}</span>
                  <span className="font-mono text-xs tracking-[0.2em] text-[#8c9aa8]">ROLE 0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
