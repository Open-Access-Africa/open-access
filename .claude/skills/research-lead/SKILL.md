---
name: research-lead
description: Research an Open Access Research Lead marked Auto OK and draft an entry for the staging table, following research/STANDARDS.md. Use when asked to research, draft or auto-draft a lead.
---

# Research a lead and draft an entry

You are drafting, not publishing. A person reviews every draft before it reaches the archive.

## Inputs

A Research Lead from Airtable (name or `rec…` id). Only work on leads where **Auto OK** is ticked
and **Lead Status** is **Open**. If either is not true, stop and say so.

## Steps

1. **Read the lead**: Notes, Country / Region, Year, the linked Research Task's description, and any
   "Start with" links. Read `research/STANDARDS.md` and the track file in `research/tracks/`.
2. **Find sources**, following the tiers in STANDARDS.md. Start from the lead's links, then search for
   the law's own text first. Use Wikipedia only to find better sources. Aim for 3–6 sources with at
   least one Tier 1. If there is no Tier 1 source online, stop and write a Draft Flag instead of a draft.
3. **Read each source** you will cite (fetch the page or PDF and read the text). For each, record
   `{ url, tier, kind, snapshot }` in `Sources`, where `snapshot` is a Wayback Machine link
   (`https://web.archive.org/web/2026/<url>`) or a note of where the text was read.
4. **Draft the fields** in the track file as a JSON object keyed by Airtable field name. Write every
   sourced claim with a superscript note number. Put each quotation, word for word, in `Quotes` with
   its URL. Anything you could not confirm goes in `Draft Flags`, not in the text.
5. **Location**: Country Code always. Latitude/Longitude only if the law is about one place; otherwise
   leave them out.
6. **Validate**: `node research/validate.mjs <draft.json>`. Fix every ✗ and re-run until it passes.
   Warnings (!) may stay, but mention them in Draft Flags.
7. **Save** the draft JSON outside the repository (drafts are data and belong in Airtable), then
   create one record in the track's staging table with the draft fields, `Source Lead`, `Sources`
   (as text), `Quotes` (as text), `Draft Flags`, and `Review Status` = `Needs review`.

## Never

- Write to the research tables, set Task Status, Verified By or Published, or change the lead.
- Cite a source you did not read, or invent a page number, section or quotation.
- Put volunteer names or emails in a draft.
