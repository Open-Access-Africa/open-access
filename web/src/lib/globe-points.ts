export type GlobePoint = {
  lat: number;
  lng: number;
  label: string;
  sublabel: string;
  href: string;
  /** Archive track the entry belongs to, e.g. "colonial-laws". Sample points have none. */
  track?: string;
  sample?: boolean;
};

/*
  How each track is drawn on the home globe.
  Shape tells cases from laws; colour tells historical from modern.
  - Cases are flat circles that send out a repeating ping:
      Reparations Cases green, Modern Cases blue.
  - Laws are smaller pins with a steady glow (no animation):
      Colonial Laws yellow, Modern Laws and Policies magenta.
  The two modern colours come from the site palette (#0B87F7, #EC20FD) and are
  softened with opacity so they sit with the pastel globe.
*/
export type CaseMarker = { color: string; ping: string; pingAlpha: number };
export type LawMarker = { color: string; opacity: number; glow: string; glowAlpha: number };

export const MARKERS = {
  reparationCase: { color: "#1f9d55", ping: "31,157,85", pingAlpha: 0.9 },
  modernCase: { color: "rgba(11,135,247,0.75)", ping: "11,135,247", pingAlpha: 0.7 },
  colonialLaw: { color: "#f2c200", opacity: 1, glow: "255,190,0", glowAlpha: 0.95 },
  modernLaw: { color: "#ec20fd", opacity: 0.8, glow: "236,32,253", glowAlpha: 0.55 },
} satisfies Record<string, CaseMarker | LawMarker>;

/** Colonial Laws and Modern Laws and Policies: glowing pins. Everything else is a pinging circle. */
export const isLaw = (p: GlobePoint) => p.track === "colonial-laws" || p.track === "modern-laws";
export const caseMarker = (p: GlobePoint): CaseMarker =>
  p.track === "modern-cases" ? MARKERS.modernCase : MARKERS.reparationCase;
export const lawMarker = (p: GlobePoint): LawMarker =>
  p.track === "modern-laws" ? MARKERS.modernLaw : MARKERS.colonialLaw;

/*
  Shown only while nothing is published yet. Each is clearly labelled as a
  sample in its tooltip, and the page says so under the globe.
  Places match leads currently being researched.
*/
export const SAMPLE_POINTS: GlobePoint[] = [
  { lat: -33.93, lng: 18.43, label: "District Six, Cape Town", sublabel: "South Africa · sample", href: "/archive", track: "reparations-cases", sample: true },
  { lat: -22.4, lng: 31.2, label: "Makuleke, Kruger", sublabel: "South Africa · sample", href: "/archive", track: "reparations-cases", sample: true },
  { lat: -1.29, lng: 36.82, label: "Nairobi", sublabel: "Kenya · sample", href: "/archive", track: "reparations-cases", sample: true },
  { lat: 5.6, lng: -0.19, label: "Accra", sublabel: "Ghana · sample", href: "/archive", track: "colonial-laws", sample: true },
  { lat: -22.56, lng: 17.08, label: "Windhoek", sublabel: "Namibia · sample", href: "/archive", track: "reparations-cases", sample: true },
  { lat: 36.75, lng: 3.06, label: "Algiers", sublabel: "Algeria · sample", href: "/archive", track: "colonial-laws", sample: true },
  { lat: 32.89, lng: 13.19, label: "Tripoli", sublabel: "Libya · sample", href: "/archive", track: "colonial-laws", sample: true },
];
