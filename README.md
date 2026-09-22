# YPO Workshop

A small starter website for the YPO workshop, hosted on Vercel and connected to Supabase.

## What's here

- `index.html`, `styles.css`, `app.js` — a plain static site, no build step.
- `config.js` — the Supabase project URL and **publishable** key. These are public by
  design and safe to ship in the browser.

## Supabase

The site reads and writes one table, `public.workshop_notes`:

| column       | type          |
| ------------ | ------------- |
| `id`         | `uuid` (PK)   |
| `name`       | `text`        |
| `note`       | `text`        |
| `created_at` | `timestamptz` |

Row Level Security is on. Two policies allow anonymous visitors to read all notes and
insert new ones — that is deliberate for a public workshop demo. Nothing else is exposed.

## Secrets

No secret keys live in this repo. The `service_role` key and database password must never
be committed — keep them in Supabase and, if a server-side feature ever needs them, in
Vercel environment variables.

## Running locally

Any static file server works, for example:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploying

Pushing to `main` triggers a production deployment on Vercel automatically.
