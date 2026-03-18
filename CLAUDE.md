# RBS Entertainment — Context

**Client:** RBS Cinema
**Purpose:** Marketing/informational website for RBS Cinema. Showcases films, showtimes, and brand identity.
**Current status:** Almost done — uncommitted changes exist. Needs final polish and deployment.

---

# Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| Animation | GSAP (GreenSock) |
| Smooth scroll | Lenis |
| Forms | React Hook Form |
| Language | TypeScript |
| Styling | Tailwind CSS |

---

# Current Phase & Pending Work

**Done:**
- Core pages built
- Animations implemented with GSAP + Lenis
- Supabase integration for dynamic content

**Pending:**
- Final review of uncommitted changes — run `git status` before touching anything
- QA pass: check all pages, mobile responsiveness, animation performance
- Deployment (Vercel or client's host)
- Client sign-off

**Important:** There are uncommitted changes. Always `git status` + `git diff` first.

---

# Conventions

- GSAP animations: initialize in `useEffect`, clean up with `return () => ctx.revert()`
- Lenis: initialized globally in root layout or `providers.tsx`
- React Hook Form: use `useForm` with Zod schema validation (`zodResolver`)
- Supabase client: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server)
- Never use `useEffect` for data fetching — use Supabase server components or SWR
- Animations should respect `prefers-reduced-motion`

---

# Do Not Touch

- Client brand colors and typography — locked by client
- Supabase schema — do not run migrations without confirming with founders
- Any content that client has reviewed and approved

---

# Quick Start

```bash
cd "C:/Users/Estudiante UCU/Desktop/RBS-entretainment-WEB"
pnpm install
pnpm dev
# App runs on http://localhost:3000
# Requires .env.local with Supabase credentials
```

**Required env vars:**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
