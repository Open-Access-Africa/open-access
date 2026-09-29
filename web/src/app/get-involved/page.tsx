import type { Metadata } from "next";
import { links, roles } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get involved",
  description: "Volunteer with Open Access as a researcher, professional, QA reviewer, data entry volunteer or developer.",
};

const join = [
  { title: "Sign up", text: "Fill in the short volunteer form and tell us which role interests you." },
  { title: "Meet us", text: "We'll set up a short onboarding call and invite you to our Discord community." },
  { title: "Start", text: "You'll receive a welcome email with your first task and a set of leads to research." },
];

export default function GetInvolved() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-16 sm:px-8 sm:pt-20">
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Volunteer with Open Access
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Everything happens remotely, in your web browser. Most volunteers give a few hours a
          week, and most roles need no prior experience.
        </p>
        <a
          href={links.volunteerForm}
          className="mt-8 inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-white hover:bg-ink/90"
        >
          Sign up to volunteer
        </a>
      </section>

      <section aria-labelledby="roles-heading" className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 id="roles-heading" className="font-display text-3xl font-semibold">
            Roles
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((r) => (
              <li key={r.name} className="flex flex-col rounded-2xl border border-line bg-paper p-7">
                <h3 className="font-display text-2xl font-semibold">{r.name}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{r.what}</p>
                <p className="mt-auto pt-5 text-sm text-muted">
                  <span className="font-semibold text-ink">You&apos;ll need: </span>
                  {r.need}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="join-heading" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 id="join-heading" className="font-display text-3xl font-semibold">
          How to join
        </h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {join.map((s, i) => (
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
