# Setup checklist (Montessori Bloom SMS)

## A. Supabase (once)

1. Create project at https://supabase.com
2. SQL Editor → paste & run `supabase/migrations/001_schema.sql`
3. SQL Editor → paste & run `supabase/migrations/002_seed.sql`
4. Optional: run `003_verify.sql` to confirm row counts
5. Settings → API → copy:
   - Project URL
   - `anon` key
   - `service_role` key (secret)

## B. Local env

1. Edit `.env.local` (already created from example):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET` (already has a placeholder ≥32 chars — change for production)

## C. Install & run

**Recommended (pnpm — more reliable on unstable networks):**

```bash
pnpm install
pnpm dev
```

Or npm:

```bash
npm install --legacy-peer-deps
npm run dev
```

Or Windows helper:

```powershell
.\scripts\install.ps1
```

Open http://localhost:3000/login

## D. Vercel

1. Import repo
2. Add the same env vars (Production + Preview)
3. Deploy
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain

## Seed logins

Password: `Password123!`

- principal@montessoribloom.edu
- teacher1@montessoribloom.edu / teacher2@montessoribloom.edu
- security@montessoribloom.edu
- accountant@montessoribloom.edu
- parent1@example.com / parent2@example.com

## If passwords don't verify

pgcrypto `crypt()` hashes are usually bcrypt-compatible. If login fails:

```bash
node scripts/hash-password.mjs Password123!
```

Then update hashes in Supabase using `004_reset_seed_passwords.sql` with the printed hash.
