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
  Cases are circles that ping; laws are smaller pins that glow (no animation).
  - Reparations Cases and Modern Cases: green circles with a repeating ping.
  - Colonial Laws: yellow pins with a yellow glow.
  - Modern Laws and Policies: green pins with a green glow.
*/
export const MARKERS = {
  case: { color: "#1f9d55", ping: "31,157,85" },
  colonialLaw: { color: "#f2c200", glow: "255,190,0" },
  modernLaw: { color: "#1f9d55", glow: "31,157,85" },
} as const;

export type LawMarker = { color: string; glow: string };

/** Reparations Cases and Modern Cases: green pinging circles. */
export const isCase = (p: GlobePoint) => p.track === "reparations-cases" || p.track === "modern-cases";
/** Colonial Laws and Modern Laws and Policies: glowing pins. */
export const isLaw = (p: GlobePoint) => p.track === "colonial-laws" || p.track === "modern-laws";
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
