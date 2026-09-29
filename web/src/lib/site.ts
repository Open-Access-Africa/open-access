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
    short: "What justice has looked like since, delivered or refused.",
    long: "Settlements, court rulings, apologies and restitution programmes around the world, including the claims that were rejected. We record the remedy, the legal route and its status.",
  },
  {
    name: "Modern Cases",
    short: "Harms happening today, and who is being held accountable.",
    long: "Present-day harms, from extraction to platform labour, and the lawsuits, petitions and inquiries that seek accountability for them.",
  },
  {
    name: "Modern Laws & Policies",
    short: "Laws today that enable harm or demand redress.",
    long: "National and international laws, regulations and resolutions that either enable exploitation or demand redress for it.",
  },
];

// Starting points shown beside the globe on the home page.
export const trackPrompts = [
  { track: "Colonial Laws", prompt: "Which laws took land in Southern Africa?", tint: "bg-[#f1f4e3] border-[#dce3be]" },
  { track: "Reparations Cases", prompt: "Where has redress been paid or refused?", tint: "bg-[#f9e3ea] border-[#eec5d2]" },
  { track: "Modern Cases", prompt: "Which harms are happening today?", tint: "bg-[#e7edfb] border-[#c9d5f2]" },
  { track: "Modern Laws & Policies", prompt: "Which laws demand redress now?", tint: "bg-[#fbf3df] border-[#eeddb2]" },
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

export const roles = [
  {
    name: "Researcher",
    what: "Research laws and cases from our leads and write them up through simple online forms.",
    need: "Curiosity and care with sources. No experience needed.",
  },
  {
    name: "Professional",
    what: "Research like a researcher and bring expertise in law, history, archives or architecture to keep entries accurate.",
    need: "A professional or academic background in a related field.",
  },
  {
    name: "QA Reviewer",
    what: "Check submissions for accuracy, sources and completeness before they go public.",
    need: "An eye for detail. An Airtable account.",
  },
  {
    name: "Data Entry",
    what: "Build the Apprenticeship Marketplace by collecting listings from organizations.",
    need: "Comfort reaching out to organizations.",
  },
  {
    name: "Developer",
    what: "Build this website: the public Archive, the Marketplace and the Volunteer Portal.",
    need: "Next.js, TypeScript and Git.",
  },
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
