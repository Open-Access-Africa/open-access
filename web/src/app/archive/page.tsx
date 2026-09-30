import type { Metadata } from "next";
import Link from "next/link";
import { tracks } from "@/lib/site";

export const metadata: Metadata = {
  title: "Archive",
  description: "The Open Access archive is being built. Here's what it will include.",
};

export default function Archive() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold-deep">
        Coming soon
      </span>
      <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
        The archive is being built
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
        Our volunteers are researching and reviewing the first entries now. When the archive
        opens, you&apos;ll be able to search and filter every published entry, explore them on a
        timeline and a map, and export what you find.
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
