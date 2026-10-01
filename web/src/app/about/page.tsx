import type { Metadata } from "next";
import { tracks } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "What Open Access documents and how the research works.",
};

const steps = [
  {
    title: "Leads",
    text: "Each piece of research starts as a lead: a specific law, case or policy, with notes and starting sources.",
  },
  {
    title: "Research",
    text: "A volunteer researches the lead using at least two sources, such as academic articles, court or government records, archives or news reports, and writes a summary and analysis.",
  },
  {
    title: "Review",
    text: "A QA reviewer checks the sources, facts and write-up before anything is published.",
  },
  {
    title: "Publish",
    text: "Approved entries join the public archive, linked to related laws and cases across all four tracks.",
  },
];

export default function About() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-16 sm:px-8 sm:pt-20">
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          About Open Access
        </h1>
        <div className="mt-7 max-w-3xl space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>
            Colonial governments issued ordinances, acts and treaties that set rules on land,
            labour, taxation, culture and language. Some of these laws were later the subject of
            court cases, settlements and new legislation.
          </p>
          <p>
            Open Access collects these records in one free, public archive. Each entry links a law
            to the later cases and laws connected to it, so students, researchers, advocates and
            communities can follow the record over time.
          </p>
        </div>
      </section>

      <section aria-labelledby="tracks-heading" className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 id="tracks-heading" className="font-display text-3xl font-semibold">
            The four tracks
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {tracks.map((t, i) => (
              <article key={t.name} className="rounded-2xl border border-line bg-paper p-7">
                <span className="text-sm font-semibold text-gold-deep">0{i + 1}</span>
                <h3 className="mt-2 font-display text-2xl font-semibold">{t.name}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{t.long}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 id="how-heading" className="font-display text-3xl font-semibold">
          How the research works
        </h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-line bg-white p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-semibold text-ink">
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

    </>
  );
}
