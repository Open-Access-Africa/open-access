# Research automation

Tools for having Claude Code draft archive entries from Research Leads. Drafts go to a staging
table in Airtable and are reviewed by a person before anything reaches the research tables.

| File | What it is |
|---|---|
| `STANDARDS.md` | The research standard: fields, source tiers, writing and citation rules |
| `tracks/colonial-laws.json` | Fields and select options for the Colonial Laws track |
| `validate.mjs` | Checks a draft against the standard (no dependencies) |
| `../.claude/skills/research-lead/SKILL.md` | The Claude Code skill that researches one lead |

## Run it

1. In Airtable, tick **Auto OK** on the lead (Lead Status must be Open).
2. In Claude Code, from the repository root: `/research-lead <lead name or rec id>`.
3. Check a draft by hand at any time: `node research/validate.mjs path/to/draft.json`.

Drafts are data, so they are saved outside this repository and loaded into the staging table.

## What the validator checks

Required fields and select options; Summary 2–3 sentences; Analysis 200+ words; note numbers run
1, 2, 3… across Summary then Analysis and match the NOTES list; a BIBLIOGRAPHY with 2+ sources;
Source 1–3 are single URLs and appear in Source Text; no Wikipedia or similar as a cited source;
at least one Tier 1 source; judgement words outside quotations; contractions; ISO country codes;
latitude/longitude in range and near the listed country; every long quotation listed for checking.

It does not check whether a claim is true or a citation says what the draft says it does. That is the
reviewer's job, and the pilot showed why: one draft had the wrong word in a sentence that passed every check.

## Pilot (November 2026)

Five Colonial Laws leads were drafted: Bond of 1844, Poll Tax Ordinance 1852, Code Noir, the Queensland
Aboriginals Protection Act 1897 and the Laws of Burgos. Lessons:

- Research needs a browser or fetch tool that can read PDFs and search; the cloud container's network
  could not reach most source sites, so research ran through a browser on a volunteer's computer.
- The best primary sources were compilations already online: Hertslet's treaty collection on archive.org
  (Gold Coast), parliamentary and commission reports (Australia, France).
- Most remaining gaps are page numbers and scholarly books not available online. These are listed as
  Draft Flags rather than guessed.
