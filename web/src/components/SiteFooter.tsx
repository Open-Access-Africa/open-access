import Link from "next/link";
import { links } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div className="space-y-3">
          <p className="font-display text-2xl font-semibold">Open Access</p>
          <p className="text-sm leading-relaxed text-white/80">
            A volunteer-run public archive mapping colonial law and the fight for redress.
          </p>
        </div>
        <nav aria-label="Footer" className="text-sm">
          <ul className="space-y-2.5">
            <li><Link href="/about" className="text-white/85 hover:text-white">About</Link></li>
            <li><Link href="/get-involved" className="text-white/85 hover:text-white">Get involved</Link></li>
            <li><Link href="/archive" className="text-white/85 hover:text-white">Archive</Link></li>
            <li><a href={links.github} className="text-white/85 hover:text-white">GitHub</a></li>
          </ul>
        </nav>
        <div className="space-y-3">
          <p className="text-sm text-white/80">Want to help build it?</p>
          <a
            href={links.volunteerForm}
            className="inline-flex min-h-11 items-center rounded-full bg-gold px-5 font-semibold text-ink hover:bg-gold/90"
          >
            Volunteer with us
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-white/70 sm:px-8">
          Open Access provides historical and educational research, not legal advice.
        </p>
      </div>
    </footer>
  );
}
