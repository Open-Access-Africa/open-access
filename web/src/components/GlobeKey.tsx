import { MARKERS, caseMarker, isLaw, lawMarker, type GlobePoint } from "@/lib/globe-points";

/*
  Key for the home globe's markers. Shape tells cases from laws; colour tells
  historical from modern. The swatches copy the globe: case circles ping, law
  pins glow. The ping respects reduced-motion settings.
*/

const CASES = [
  { label: "Reparations Cases", ...MARKERS.reparationCase },
  { label: "Modern Cases", ...MARKERS.modernCase },
];

const LAWS = [
  { label: "Colonial Laws", ...MARKERS.colonialLaw },
  { label: "Modern Laws & Policies", ...MARKERS.modernLaw },
];

function CaseSwatch({
  color,
  ping,
  pingAlpha,
  still = false,
}: {
  color: string;
  ping: string;
  pingAlpha: number;
  /** Show the ping as a still halo instead of animating it. */
  still?: boolean;
}) {
  return (
    <span aria-hidden className="relative inline-flex h-3 w-3 shrink-0">
      <span
        className={`absolute rounded-full ${still ? "-inset-0.5" : "inset-0 motion-safe:animate-ping"}`}
        style={{ backgroundColor: `rgba(${ping},${pingAlpha * 0.6})` }}
      />
      <span className="relative h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
    </span>
  );
}

function LawSwatch({ color, opacity, glow, glowAlpha }: { color: string; opacity: number; glow: string; glowAlpha: number }) {
  return (
    <span aria-hidden className="inline-flex h-3 w-3 shrink-0 items-center justify-center">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color, opacity, boxShadow: `0 0 6px 3px rgba(${glow},${glowAlpha * 0.7})` }}
      />
    </span>
  );
}

/** A track's globe marker, still, for the start box buttons. */
export function TrackSwatch({ slug }: { slug: string }) {
  const p = { track: slug } as GlobePoint;
  return isLaw(p) ? <LawSwatch {...lawMarker(p)} /> : <CaseSwatch {...caseMarker(p)} still />;
}

export function GlobeKey() {
  return (
    <ul
      aria-label="Map key"
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 rounded-2xl border border-line bg-white/90 px-4 py-1.5 font-mono text-[10px] tracking-[0.12em] text-ink-soft uppercase shadow-[0_6px_18px_rgba(14,27,44,0.08)] backdrop-blur-sm sm:rounded-full sm:text-[11px]"
    >
      {CASES.map(({ label, ...style }) => (
        <li key={label} className="flex items-center gap-1.5">
          <CaseSwatch {...style} />
          {label}
        </li>
      ))}
      {LAWS.map(({ label, ...style }) => (
        <li key={label} className="flex items-center gap-1.5">
          <LawSwatch {...style} />
          {label}
        </li>
      ))}
    </ul>
  );
}
