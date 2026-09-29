@AGENTS.md

## Open Access project rules

- Airtable base: **Open Access** (`appbrLESyzc7qVxYM`). Airtable is the source of truth.
- Only records with **Task Status = Published** may appear publicly. Filter on the server.
- Never expose the Volunteers table, emails, or linked people fields.
- Secrets (Airtable token, Supabase keys, Discord webhook) live in `.env.local` and Vercel env vars only.
- Call Airtable only from server code.
- Work in branches and open pull requests. Don't push to `main`.
