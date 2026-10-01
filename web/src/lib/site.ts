// Public site content and links. No secrets or volunteer data belong here.

export const links = {
  volunteerForm: "https://airtable.com/appbrLESyzc7qVxYM/pagrn5dZfLdrbW7z0/form",
  github: "https://github.com/Open-Access-Africa/open-access",
};

export const tracks = [
  {
    name: "Colonial Laws",
    short: "The legal instruments colonial powers used to make extraction legal.",
    long: "Ordinances, acts, treaties and decrees that legalized land seizure, forced labour, taxation and cultural suppression. We record what each law did, who it harmed, and where it came from.",
  },
  {
    name: "Reparations Cases",
    short: "What justice has looked like since.",
    long: "Settlements, court rulings, apologies and restitution programs around the world, including the claims that were rejected.",
  },
  {
    name: "Modern Cases",
    short: "Harms happening today, and who is being held accountable.",
    long: "Present-day harms, and the lawsuits, petitions and inquiries that seek accountability for them.",
  },
  {
    name: "Modern Laws & Policies",
    short: "Laws today that enable harm or demand redress.",
    long: "National and international laws, regulations and resolutions that either enable exploitation or demand redress for it.",
  },
];

// Starting points shown beside the globe on the home page.
export const trackPrompts = [
  { track: "Colonial Laws", {/* prompt: "Which laws took land in Southern Africa?", */} tint: "bg-[#f1f4e3] border-[#dce3be]" },
  { track: "Reparations Cases", {/* prompt: "Where has redress been paid or refused?", */} tint: "bg-[#f9e3ea] border-[#eec5d2]" },
  { track: "Modern Cases", {/*prompt: "Which harms are happening today?", */} tint: "bg-[#e7edfb] border-[#c9d5f2]" },
  { track: "Modern Laws & Policies", {/*prompt: "Which laws demand redress now?", */} tint: "bg-[#fbf3df] border-[#eeddb2]" },
];

// "Law & Record" section on the home page: one colonial law and the records that followed it.
export const lawAndRecord = [
  {
    kind: "Colonial Law",
    year: "1913",
    title: "Natives Land Act",
    text: "Restricted Black South Africans to owning land in reserves covering about 7% of the country.",
    footer: "Land seizure · Racial classification",
    color: "text-[#156e72]",
  },
  {
    kind: "Reparations Case",
    year: "1994",
    title: "Restitution of Land Rights Act",
    text: "Opened land claims for people dispossessed after 19 June 1913, the day the Natives Land Act took effect.",
    footer: "Legislation · Land return",
    color: "text-[#a0405e]",
  },
  {
    kind: "Modern Law",
    year: "1996",
    title: "Constitution, Section 25",
    text: "The property clause that commits the state to land reform and equitable access to land.",
    footer: "Demands redress · In force",
    color: "text-[#3456a8]",
  },
];

// Role descriptions match the Roles table in the README.
export const roles = [
  { name: "Researcher", what: "Research laws and cases from assigned leads, then submit them through the forms." },
  {
    name: "Professional",
    what: "Bring your expertise in law, history, archives or architecture to make the archive credible, advising on legal mechanisms and reparation status.",
  },
  { name: "QA Reviewer", what: "Check submissions for accuracy, sources, and completeness before they are published." },
  { name: "Data Entry", what: "Build the Apprenticeship Marketplace by collecting listings from organizations." },
  { name: "Developer", what: "Build the Open Access website." },
];

export const building = [
  {
    name: "The Archive",
    status: "In progress",
    text: "A free, searchable public archive of all four tracks, with timeline and map views and export to CSV and PDF.",
  },
  {
    name: "The Apprenticeship Marketplace",
    status: "In progress",
    text: "A directory of apprenticeships that preserve craft and heritage knowledge, from weaving to repair trades.",
  },
  {
    name: "The Volunteer Portal",
    status: "Live for volunteers",
    text: "Where volunteers find research tasks, leads and guides, and submit their work.",
  },
];
