# Research standard (for people and for Claude)

This is the standard every Open Access entry is checked against. It collects the rules from the
main README and the Airtable Resources table in one place, so the research agent and the
validator (`research/validate.mjs`) can follow them. If this file and the README disagree, the README wins
and this file should be fixed.

## Models to copy

- **Natives Land Act, No. 27 of 1913** (Colonial Laws, Published). Statute text, two official commission
  reports, two later Acts, and a reference work for context. Full NOTES and BIBLIOGRAPHY.
- **Restitution of Land Rights Act, No. 22 of 1994** (Reparations Cases). Pin-cites to sections and
  paragraphs, three primary sources: the Act, the Constitutional Court judgment, the Commission's report.

What to avoid, all seen in real submissions: author-date citations "(Smith 2012)" instead of notes;
a phone code in Country Code; opinion words such as "the abused" or "acts of redemption";
figures that disagree between fields; Wikipedia as a cited source.

## Fields (Colonial Laws)

Machine-readable version, with the exact select options: `research/tracks/colonial-laws.json`.

| Field | Rule |
|---|---|
| Law Name | Official short title, with number and year where it has one: "Natives Land Act, No. 27 of 1913" |
| Year Enacted | Whole year |
| Colonial Power / Instrument Type / Mechanism | Only the options in the Airtable form |
| Colony / Territory | Name at the time: "Gold Coast Colony", "Union of South Africa" |
| Target Community | Who the law applied to, in the law's own terms where useful, attributed |
| Summary | 2–3 sentences: what the law did, who it applied to, what changed |
| Analysis | 200+ words, explains the Mechanism, every sourced claim has a note |
| Source 1–3 | Single URLs, best primary source first; each must also appear in Source Text |
| Source Text | `NOTES` then `BIBLIOGRAPHY`, Chicago notes-bibliography |
| Country Code | ISO 3166 two-letter code(s), comma-separated, or `INT` |
| Latitude / Longitude | Only for a specific place; blank for a law with national reach |

## Sources, in order of preference

1. **Tier 1, primary.** The law itself (gazette, statute book, archive scan, official transcript),
   court judgments, official commission and parliamentary reports, treaty texts.
   Good places: national gazettes and legislation sites, LII court databases (SAFLII, GhaLII, AustLII),
   archive.org scans, national archives, Gallica, the UK Parliamentary Papers, founding-documents sites.
2. **Tier 2, scholarly.** Peer-reviewed articles and academic books, ideally open access.
3. **Tier 3, reference.** Britannica, South African History Online, Library of Congress blogs. Context only;
   never the only support for a claim.
4. **Discovery only, never cited.** Wikipedia, aggregators, AI answers. Use them to find Tier 1–2 sources.

Every entry needs at least one Tier 1 source. If none can be found online, stop and flag the lead.

## Writing

- Describe what happened, not how to feel about it. Avoid judgement words (justice, exploitation,
  suppression, oppression, harm, investigation, systematic) unless quoted and attributed.
- No causes or present-day effects without a citation.
- Use the law's own wording when describing what it requires, and attribute it ("Section 2 provided that…").
- Quote only text you have read in the source. Every quotation is listed in the draft's `Quotes` with its URL.
- No contractions.

## Citations

- Superscript note numbers after the punctuation: `…in 1913.¹`. One sequence, Summary first, never reused.
- Source Text: `NOTES` heading, numbered notes (full note first time, short note after), then
  `BIBLIOGRAPHY`, one entry per paragraph, alphabetical. Titles in `*asterisks*`.
- Cite the page, section or archive reference wherever the source has one.

## Human review (unchanged, plus one rule)

Drafts written by Claude go to Staging – Colonial Laws, never to the research tables directly. A QA
reviewer claims the draft with their signup email, opens **every** cited source and confirms each
numbered claim, then follows the normal QA checklist in the README. Only an approved draft is copied into
the research table, with the reviewer as Verified By. Automation never sets Task Status, Verified By or
Published. The full workflow is in `research/README.md`.
