import Link from "next/link";
import { GlobeMark } from "@/components/GlobeMark";
import { links } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-14">
        <div className="space-y-3">
          <p className="flex items-center gap-3">
            <GlobeMark src ="/logo-light.png" className="h-10 w-10" />
            <span className="font-display text-lg font-extrabold tracking-[0.12em]">Open Access</span>
          </p>
          <p className="text-sm leading-relaxed text-white/80">
            A volunteer-run public archive of colonial law and reparations.
          </p>
        </div>
        <nav aria-label="Footer" className="font-mono text-sm uppercase tracking-[0.14em]">
          <ul className="space-y-2.5">
            <li><Link href="/archive" className="text-white/85 hover:text-white">Archive</Link></li>
            <li><Link href="/about" className="text-white/85 hover:text-white">About</Link></li>
            <li><Link href="/get-involved" className="text-white/85 hover:text-white">Get involved</Link></li>
            <li><a href={links.github} className="text-white/85 hover:text-white">GitHub</a></li>
          </ul>
        </nav>
        <div className="space-y-3">
          <p className="text-sm text-white/80">Want to help build it?</p>
          <a
            href={links.volunteerForm}
            className="inline-flex min-h-11 items-center bg-gold px-5 font-display text-sm font-bold tracking-[0.14em] text-ink uppercase hover:bg-gold/90"
          >
            Volunteer with us
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-white/70 sm:px-8 lg:px-14">
          Open Access provides historical and educational research, not legal advice.
        </p>
      </div>
    </footer>
  );
}
