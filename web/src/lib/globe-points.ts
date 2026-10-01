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
  Shown only while nothing is published yet. Each is clearly labelled as a
  sample in its tooltip, and the page says so under the globe.
  Places match leads currently being researched.
*/
export const SAMPLE_POINTS: GlobePoint[] = [
  { lat: -33.93, lng: 18.43, label: "District Six, Cape Town", sublabel: "South Africa · sample", href: "/archive", sample: true },
  { lat: -22.4, lng: 31.2, label: "Makuleke, Kruger", sublabel: "South Africa · sample", href: "/archive", sample: true },
  { lat: -1.29, lng: 36.82, label: "Nairobi", sublabel: "Kenya · sample", href: "/archive", sample: true },
  { lat: 5.6, lng: -0.19, label: "Accra", sublabel: "Ghana · sample", href: "/archive", sample: true },
  { lat: -22.56, lng: 17.08, label: "Windhoek", sublabel: "Namibia · sample", href: "/archive", sample: true },
  { lat: 36.75, lng: 3.06, label: "Algiers", sublabel: "Algeria · sample", href: "/archive", sample: true },
  { lat: 32.89, lng: 13.19, label: "Tripoli", sublabel: "Libya · sample", href: "/archive", sample: true },
];
