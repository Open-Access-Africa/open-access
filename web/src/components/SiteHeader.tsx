import Link from "next/link";
import { GlobeMark } from "@/components/GlobeMark";

const nav = [
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-14">
        <Link href="/" className="flex items-center gap-3 text-ink">
          <GlobeMark className="h-10 w-10" />
          <span className="font-display text-lg font-extrabold tracking-[0.12em]">Open Access</span>
        </Link>
        <nav aria-label="Main">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 font-display text-sm font-semibold tracking-[0.16em] uppercase">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-soft hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/get-involved"
                className="inline-flex min-h-11 items-center border-[1.5px] border-ink px-5 text-ink hover:bg-ink hover:text-white"
              >
                Get involved
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
