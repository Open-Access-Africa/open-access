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
  - Reparations Cases: green circles that send out a repeating ping.
  - Colonial Laws: smaller yellow pins with a soft glow (no animation).
  - Modern Cases and Modern Laws and Policies: plain magenta markers for now.
*/
export const MARKERS = {
  reparation: { color: "#1f9d55", ping: "31,157,85" },
  colonialLaw: { color: "#f2c200", glow: "255,190,0" },
  other: { color: "#ec20fd" },
} as const;

export const isReparation = (p: GlobePoint) => p.track === "reparations-cases";
export const isColonialLaw = (p: GlobePoint) => p.track === "colonial-laws";

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
