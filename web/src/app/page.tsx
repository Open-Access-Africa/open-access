import Link from "next/link";
import { building, links, roles, tracks } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <p className="mb-5 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-gold" />
          A public archive of colonial law and redress
        </p>
        <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
          Map the laws. Trace the redress.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Open Access documents the laws colonial powers used to legalize extraction,
          exploitation and cultural suppression, and the legal actions taken since to
          demand redress. Free to read, built by volunteers.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href={links.volunteerForm}
            className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-white hover:bg-ink/90"
          >
            Volunteer with us
          </a>
          <Link
            href="/about"
            className="inline-flex min-h-12 items-center rounded-full border border-ink/25 px-6 font-semibold text-ink hover:border-ink"
          >
            How it works
          </Link>
        </div>
      </section>

      {/* Four tracks */}
      <section aria-labelledby="tracks-heading" className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 id="tracks-heading" className="font-display text-3xl font-semibold sm:text-4xl">
            What we document
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Four connected tracks, so a law from 1900 can be traced to the claims it led to and
            the harms that continue today.
          </p>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tracks.map((t, i) => (
              <li key={t.name} className="rounded-2xl border border-line bg-paper p-6">
                <span className="text-sm font-semibold text-gold-deep">0{i + 1}</span>
                <h3 className="mt-2 font-display text-xl font-semibold">{t.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{t.short}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What we're building */}
      <section aria-labelledby="building-heading" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 id="building-heading" className="font-display text-3xl font-semibold sm:text-4xl">
          What we&apos;re building
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {building.map((b) => (
            <div key={b.name} className="rounded-2xl border border-line bg-white p-6">
              <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold-deep">
                {b.status}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">{b.name}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles CTA */}
      <section aria-labelledby="roles-heading" className="bg-ink text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <h2 id="roles-heading" className="font-display text-3xl font-semibold sm:text-4xl">
              We&apos;re looking for volunteers
            </h2>
            <p className="mt-4 max-w-xl text-white/85">
              Remote, in your browser, a few hours a week. No downloads and, for most roles, no
              experience needed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={links.volunteerForm}
                className="inline-flex min-h-12 items-center rounded-full bg-gold px-6 font-semibold text-ink hover:bg-gold/90"
              >
                Sign up to volunteer
              </a>
              <Link
                href="/get-involved"
                className="inline-flex min-h-12 items-center rounded-full border border-white/40 px-6 font-semibold text-white hover:border-white"
              >
                See the roles
              </Link>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {roles.map((r) => (
              <li key={r.name} className="rounded-xl bg-white/5 px-5 py-4 ring-1 ring-white/10">
                <p className="font-semibold">{r.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
