# Open Access – website

The public website for Open Access: Home, About, Get involved, and an Archive placeholder.
Built with Next.js (App Router), TypeScript and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where things live

| What | Where |
|---|---|
| Site copy, roles, tracks, links | `src/lib/site.ts` |
| Pages | `src/app/` (`page.tsx`, `about/`, `get-involved/`, `archive/`) |
| Header and footer | `src/components/` |
| Colours and fonts | `src/app/globals.css` (`@theme`) |

Fonts are self-hosted from npm (`@fontsource`), so builds don't depend on Google Fonts.

## Deploy (Vercel)

1. Import the GitHub repository in Vercel.
2. If this app sits in a subfolder (e.g. `web/`), set **Root Directory** to that folder.
3. Deploy. No environment variables are needed yet.

## Next steps

- Archive: read Published records from Airtable on the server (read-only token in Vercel environment variables, never in the code).
- Marketplace and login-protected Volunteer Portal (Supabase Auth).
