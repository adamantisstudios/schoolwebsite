# Montessori Bloom — School Management System

Next.js school website + role-based School Management System backed by **Supabase (PostgreSQL)**.

All database access goes through **Next.js API routes** using the **Supabase service role key** (never exposed to the browser). Authorization, lockouts, and an append-only **audit log** run on the server.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind
- Supabase Postgres + `@supabase/supabase-js` (service role on server)
- JWT sessions in httpOnly cookies (`jose`) + bcrypt password hashes
- Recharts (principal dashboard) + browser print/CSV exports

## 1. Supabase setup (SQL)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**.
3. Run in order:
   - [`supabase/migrations/001_schema.sql`](supabase/migrations/001_schema.sql) — tables, enums, indexes, RLS enabled with **no anon policies** (service role only).
   - [`supabase/migrations/002_seed.sql`](supabase/migrations/002_seed.sql) — demo users, classes, students, fees, products, visitors.
4. Project Settings → API: copy **Project URL**, **anon key**, and **service_role key**.

## 2. Environment

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Where used |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Server + public URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional public; app DB uses service role |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — all DB reads/writes |
| `JWT_SECRET` | ≥32 random chars |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` or your Vercel URL |

Never commit `.env.local` or the service role key.

## 3. Install & run

```bash
pnpm install
pnpm dev
```

If `npm install` fails with `ECONNRESET`, use **pnpm** instead (already configured in this project).

Open [http://localhost:3000](http://localhost:3000) · Portal: [/login](http://localhost:3000/login)

## 4. Seed credentials

Password for every seed account: **`Password123!`**

| Role | Email |
|---|---|
| Principal | `principal@montessoribloom.edu` |
| Teacher | `teacher1@montessoribloom.edu` |
| Teacher | `teacher2@montessoribloom.edu` |
| Security | `security@montessoribloom.edu` |
| Accountant | `accountant@montessoribloom.edu` |
| Parent | `parent1@example.com` |
| Parent | `parent2@example.com` |

## 5. Role capabilities

- **Teacher** — assigned classes/courses only: attendance, grades, student list, print sheets
- **Security** — visitor check-in/out, student ID lookup, print daily log
- **Parent** — own children only: attendance/grades/fees, shop + mock checkout, orders
- **Accountant** — fees, ledger, receipts, CSV export (no academics/visitors)
- **Principal** — overview charts, users, reports/print centre, audit log (read-everything)

## 6. Security model

```
Browser  →  Next.js API  →  Supabase (service_role)
              ↑
     JWT cookie + role checks
     + audit_logs for sensitive actions
```

- Service role key is **server-only** (`lib/supabase-admin.ts` throws if imported in the browser).
- RLS is enabled on all tables with **no client policies** — anon/authenticated cannot query data directly.
- Login: bcrypt verify, failed-attempt lockout, refresh token hashing, audit on success/failure/forbidden.
- Middleware protects `/dashboard/*` and `/api/*` by session + role path.

## 7. Vercel deploy

1. Push repo to GitHub.
2. Import project in Vercel.
3. Set the same env vars as `.env.example` (especially `SUPABASE_SERVICE_ROLE_KEY` and `JWT_SECRET`).
4. Deploy. Run SQL migrations once in Supabase if not already applied.

## 8. Project layout (SMS pieces)

```
supabase/migrations/   SQL schema + seed
app/api/                Auth, attendance, performance, visitors, fees, finance, shop, users, audit…
app/dashboard/          Role dashboards
app/login/              Unified portal login
lib/                    supabase-admin, auth, audit, roles, api helpers
middleware.ts           Route protection
```

Public marketing pages under `app/` (home, about, programs, admissions, shop, etc.) are unchanged and stay public.
