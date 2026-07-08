# Sobha Academy & SKECT Helpdesk

A shared employee ticketing system for two organizations — **Sobha Academy**
and **SKECT**. Employees submit tickets with no account required; a small
admin team logs in to view, filter, and resolve tickets from both
organizations in one dashboard.

## How it works

- **`/submit`** — public form, no login. Employee picks their organization,
  fills in the issue, and gets a reference number (e.g. `SO-260708-C3FO` /
  `SK-260708-QRN7`).
- **`/status`** — public lookup by reference + email, no login. Shows status
  and any updates left by admins.
- **`/admin`** — login required. Lists every ticket from both organizations
  with tabs/filters by organization, status, priority, and free-text search.
  Clicking a ticket lets an admin change status/priority and leave an update
  note (visible to the employee on the `/status` page).

Organizations are plain string values (`SOBHA_ACADEMY`, `SKECT`) defined in
[`src/lib/constants.ts`](src/lib/constants.ts) — add a third organization
there (and its `ORG_PREFIX` for reference numbers) if you ever need one.

## Tech stack

Next.js 16 (App Router) + TypeScript + Tailwind CSS, Prisma ORM, Auth.js
(NextAuth v5) for admin login. Data lives in Postgres (Neon's free tier) —
the same database is used for local development and production, so there's
no schema drift to worry about.

## Local development

```bash
npm install
```

Create a `.env` file (see `.env.example`) with:

```
DATABASE_URL="<your neon connection string>"
AUTH_SECRET="<any random string for local dev>"
```

Then:

```bash
npm run db:push     # syncs the schema to your database
npm run db:seed     # creates the default admin (see below)
npm run dev          # http://localhost:3000
```

The default admin login is `admin` / `ChangeMe123!`. Override before
seeding by setting `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` /
`SEED_ADMIN_NAME` env vars. **Change the password after first login** by
re-running the seed with a new `SEED_ADMIN_PASSWORD`.

To add more admins, run the seed script again with different
`SEED_ADMIN_USERNAME` values, or insert directly into the `Admin` table.

## Deploying for free (Vercel + Neon)

This gets you a live URL with a real Postgres database, both on free
tiers.

### 1. Create a free Postgres database (Neon)

1. Go to [neon.com](https://neon.com) and sign up (free tier).
2. Create a new project. Copy the connection string it gives you — it
   looks like `postgresql://user:password@host/dbname?sslmode=require`.

(Supabase's free Postgres works the same way if you prefer it.)

### 2. Push the schema and seed the first admin

```bash
# in your shell, not committed anywhere:
$env:DATABASE_URL="<your neon connection string>"   # PowerShell
npx prisma db push
$env:SEED_ADMIN_PASSWORD="<a real password>"; npm run db:seed
```

### 3. Push this project to GitHub

```bash
git init
git add .
git commit -m "Initial helpdesk app"
gh repo create --source=. --private --push
```

### 4. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (free tier), then
   "Add New Project" → import the GitHub repo you just created.
2. In the project's Environment Variables, add:
   - `DATABASE_URL` — the same Neon connection string from step 1
   - `AUTH_SECRET` — a random secret, generate one with
     `openssl rand -base64 32`
3. Deploy. Vercel runs `npm run build` (which runs `prisma generate` via
   the `postinstall` script) automatically.

Your helpdesk is now live at the `*.vercel.app` URL Vercel gives you —
share `/submit` and `/status` with employees, and `/admin` with support
staff.

### Updating later

Any `git push` to the connected branch redeploys automatically. If you
change `prisma/schema.prisma`, run `npx prisma db push` (with
`DATABASE_URL` pointed at the production database) so the live database
matches the schema.
