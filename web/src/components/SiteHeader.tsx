import Link from "next/link";
import { links } from "@/lib/site";

const nav = [
  { href: "/about", label: "About" },
  { href: "/get-involved", label: "Get involved" },
  { href: "/archive", label: "Archive" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span aria-hidden className="h-3 w-3 rounded-full bg-gold" />
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            Open Access
          </span>
        </Link>
        <nav aria-label="Main">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] font-medium">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-soft hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={links.volunteerForm}
                className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-white hover:bg-ink/90"
              >
                Volunteer
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
