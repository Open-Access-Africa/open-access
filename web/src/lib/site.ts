// Public site content and links. No secrets or volunteer data belong here.

export const links = {
  volunteerForm: "https://airtable.com/appbrLESyzc7qVxYM/pagrn5dZfLdrbW7z0/form",
  github: "https://github.com/Open-Access-Africa/open-access",
};

export const tracks = [
  {
    name: "Colonial Laws",
    short: "Laws and other legal instruments issued under colonial rule.",
    long: "Ordinances, acts, treaties and decrees issued under colonial rule, including laws on land, labour, taxation, culture and language. Each entry records what the law did, who it applied to, and where it came from.",
  },
  {
    name: "Reparations Cases",
    short: "Settlements, rulings and programs that followed.",
    long: "Settlements, court rulings, apologies and restitution programs around the world, including the claims that were rejected.",
  },
  {
    name: "Modern Cases",
    short: "Present-day cases and the legal actions brought over them.",
    long: "Present-day cases, and the lawsuits, petitions and inquiries brought over them, with their current status.",
  },
  {
    name: "Modern Laws & Policies",
    short: "Present-day laws and policies on the same issues.",
    long: "National and international laws, regulations and resolutions that restrict rights, set protections or provide redress.",
  },
];

// Tracks in the "Where would you like to start?" box over the globe.
// slug matches the archive track, so each button can find that track's pins.
// Tints are pastel versions of each track's globe marker (MARKERS in globe-points.ts):
// background about 10% of the marker colour on white, border about 30% (Colonial Laws
// slightly stronger, since yellow reads paler).
export const trackPrompts = [
  { track: "Colonial Laws", slug: "colonial-laws", tint: "bg-[#fdf8e0] border-[#fae799]" },
  { track: "Reparations Cases", slug: "reparations-cases", tint: "bg-[#e9f5ee] border-[#bce2cc]" },
  { track: "Modern Cases", slug: "modern-cases", tint: "bg-[#e7f3fe] border-[#b6dbfd]" },
  { track: "Modern Laws & Policies", slug: "modern-laws", tint: "bg-[#fde9ff] border-[#f9bcfe]" },
];

// "Trace the Law" section on the home page: one colonial law and the records that followed it.
// Label colours are darker shades of each track's globe marker, dark enough to read as small
// text (about 5:1 contrast on white): Colonial Laws #856a00, Reparations Cases #187c43,
// Modern Cases #076eca, Modern Laws and Policies #bf02cf.
export const lawAndRecord = [
  {
    kind: "Colonial Law",
    year: "1913",
    title: "Natives Land Act",
    text: "Restricted Black South Africans to owning land in reserves covering about 7% of the country.",
    footer: "Land seizure · Racial classification",
    color: "text-[#856a00]",
  },
  {
    kind: "Reparations Case",
    year: "1994",
    title: "Restitution of Land Rights Act",
    text: "Opened land claims for people dispossessed after 19 June 1913, the day the Natives Land Act took effect.",
    footer: "Legislation · Land return",
    color: "text-[#187c43]",
  },
  {
    kind: "Modern Law",
    year: "1996",
    title: "Constitution, Section 25",
    text: "The property clause. Section 25(5) requires the state to take reasonable measures to enable citizens to gain access to land on an equitable basis.",
    footer: "Land reform · In force",
    color: "text-[#bf02cf]",
  },
];

// Role descriptions match the Roles table in the README.
export const roles = [
  { name: "Researcher", what: "Research laws and cases from assigned leads, then submit them through the forms." },
  {
    name: "Professional",
    what: "Bring expertise in law, history, archives or architecture to review legal mechanisms and reparation status.",
  },
  { name: "QA Reviewer", what: "Check submissions for accuracy, sources, and completeness before they are published." },
  { name: "Data Entry", what: "Add and check location data so entries appear on the website's maps." },
  { name: "Developer", what: "Build the Open Access website." },
];

export const building = [
  {
    name: "The Archive",
    status: "In progress",
    text: "A searchable public archive of all four tracks, with timeline and map views and export to CSV and PDF.",
  },
  {
    name: "The Volunteer Portal",
    status: "Live for volunteers",
    text: "Where volunteers find research tasks, leads and guides, and submit their work.",
  },
];
