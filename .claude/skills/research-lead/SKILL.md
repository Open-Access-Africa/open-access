---
name: research-lead
description: Research an Open Access Research Lead marked Auto OK and draft an entry into the Staging – Colonial Laws table, following research/STANDARDS.md. Use when asked to research, draft or auto-draft a lead.
---

# Research a lead and draft an entry

You are drafting, not publishing. A QA reviewer claims and checks every draft before it reaches the archive.

## Inputs

A Research Lead from Airtable (name or `rec…` id). Only work on leads where **Auto OK** is ticked
and **Lead Status** is **Open**. If either is not true, stop and say so.

## Steps

1. **Read the lead**: Notes, Country / Region, Year, the linked Research Task's description, and any
   "Start with" links. Read `research/STANDARDS.md` and the track file in `research/tracks/`.
2. **Find sources**, following the tiers in STANDARDS.md. Start from the lead's links, then search for
   the law's own text first. Use Wikipedia only to find better sources. Aim for 3–6 sources with at
   least one Tier 1. If there is no Tier 1 source online, stop and report the lead instead of drafting.
3. **Read each source** you will cite (fetch the page or PDF and read the text). For each, record
   `{ url, tier, kind, snapshot }` in `Sources`, where `snapshot` is a Wayback Machine link
   (`https://web.archive.org/web/2026/<url>`) or a note of where the text was read.
4. **Draft the fields** in the track file as a JSON object keyed by Airtable field name. Colonial Power
   and Instrument Type take one option from the track file; Mechanism takes a list of options. Write every
   sourced claim with a superscript note number. Put each quotation, word for word, in `Quotes` with
   its URL. Anything you could not confirm goes in `Draft Flags`, not in the text.
5. **Location**: Country Code always. Latitude/Longitude only if the law is about one place; otherwise
   leave them out.
6. **Validate**: `node research/validate.mjs <draft.json>`. Fix every ✗ and re-run until it passes.
   Warnings (!) may stay, but mention them in Draft Flags.
7. **Save** the draft JSON outside the repository (drafts are data and belong in Airtable), then
   create one record in **Staging – Colonial Laws** with:
   - the draft fields, using the same select options as Colonial Laws;
   - **Source Lead** linked to the lead;
   - **Sources** and **Quotes** as text, and **Draft Flags**;
   - **Submitted Via** = `Claude skill (research-lead)` and **Drafted By** = `Claude (research-lead)`
     with the date;
   - **Review Status** = `Needs review`.

   Leave **Enter email**, **Submitted By**, **Verified By** and the reviewer fields empty: Claude has no
   signup email, and a person fills the reviewer fields when they claim the draft.

## After you finish

Report the staging record and its Draft Flags. Do not change the lead: a reviewer sets Lead Status and
the Resulting Colonial Law link when the draft is approved and copied into Colonial Laws
(see `research/README.md`).

## Never

- Write to the research tables (Colonial Laws and the other tracks), set Task Status, Verified By or
  Published, or change the lead.
- Fill Enter email, Submitted By or any reviewer field.
- Cite a source you did not read, or invent a page number, section or quotation.
- Put volunteer names or emails in a draft.
