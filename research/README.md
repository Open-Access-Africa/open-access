# Research automation

Tools for having Claude Code draft archive entries from Research Leads. Drafts go to a staging table
in Airtable, a QA reviewer claims and checks each one, and only an approved draft is copied into the
research table.

| File | What it is |
|---|---|
| `STANDARDS.md` | The research standard: fields, source tiers, writing and citation rules |
| `tracks/colonial-laws.json` | Fields and select options for Colonial Laws, plus the staging-only fields |
| `validate.mjs` | Checks a draft against the standard (no dependencies) |
| `../.claude/skills/research-lead/SKILL.md` | The Claude Code skill that researches one lead |

## Airtable tables

| Table | Holds |
|---|---|
| **Staging – Colonial Laws** | Drafts waiting for review. Same fields, types and help text as Colonial Laws, plus the staging fields below |
| **Staging – Research Leads** | Leads suggested through the lead form, waiting for review. Same fields as Research Leads, plus Enter email, Email Not Matched, Submitted By, Submitted Via and Review Status |

Staging fields:

| Field | Use |
|---|---|
| Review Status | Needs review → In review → Approved, Changes needed or Rejected |
| Submitted Via | Airtable form, Website form, or Claude skill (research-lead) |
| Drafted By | Who or what wrote a Claude draft, with the date |
| Sources, Quotes, Draft Flags | What the draft is based on and what the reviewer must check (Claude drafts) |
| Lead Under Review By | Link to the QA reviewer who claimed the record |
| Reviewer Email | The reviewer types their signup email here to claim the record |
| Review Claimed On | Date the record was claimed |
| Reviewer Not Matched | Ticked when the reviewer email matches no Active QA reviewer |

Claude drafts have no signup email, so **Enter email** and **Submitted By** stay empty and
**Submitted Via** shows where the record came from.

## Workflow for a Claude draft

1. **Mark the lead.** An admin ticks **Auto OK** on a Research Lead whose Lead Status is Open.
2. **Draft.** In Claude Code, from the repository root: `/research-lead <lead name or rec id>`.
   Claude researches the lead, validates the draft and creates a record in Staging – Colonial Laws with
   Review Status **Needs review** and Submitted Via **Claude skill (research-lead)**.
3. **Claim.** A QA reviewer enters their signup email in **Reviewer Email**. An Airtable automation matches
   it to an Active volunteer with the QA reviewer role, fills **Lead Under Review By** and **Review Claimed On**,
   and sets Review Status to **In review**. If nobody matches, it ticks **Reviewer Not Matched** for an admin
   to check.
4. **Review.** The reviewer opens every cited source, confirms each numbered claim, works through Draft Flags
   and the QA checklist in the main README, and edits the draft in staging.
5. **Decide.** Set Review Status to **Approved**, **Changes needed** (with a record comment) or **Rejected**.
6. **Copy into Colonial Laws** (approved drafts only). Create the Colonial Laws record from the staging record,
   field for field. Set **Verified By** to the reviewer in Lead Under Review By, leave Submitted By empty, and set
   Task Status to **Published**. Then, in Research Leads, set the lead's **Lead Status** to **Done** and link the
   new record in **Resulting Colonial Law**, as for any published entry.

Leads suggested through the form follow steps 3–5 in Staging – Research Leads; an approved lead is copied into
Research Leads.

Check a draft by hand at any time: `node research/validate.mjs path/to/draft.json`.
Drafts are data, so they are kept in Airtable, not in this repository.

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
