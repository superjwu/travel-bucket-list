# Travel Bucket List

A web app for discovering countries and building a personal travel bucket list.

## Tech Stack
- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Auth:** Clerk (sign up, log in, sign out)
- **Database:** Supabase (Postgres + RLS)
- **External API:** REST Countries API (https://restcountries.com/v3.1)

## Data Model

### `bucket_list_items` (Supabase table)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, auto-generated |
| user_id | text | Clerk user ID from JWT `sub` claim |
| country_code | text | ISO alpha-3 (e.g. "USA") |
| country_name | text | Common name |
| flag_url | text | Flag SVG URL |
| region | text | Continent/region |
| notes | text | User's personal notes |
| visited | boolean | Default false |
| priority | integer | 0-5 star rating |
| travel_date | date | Planned or past travel date |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto-updated via trigger |

Unique constraint: (user_id, country_code)
RLS: All operations scoped to user_id = auth.jwt()->>'sub'

## Architecture
- Server Actions for all CRUD operations (no API routes)
- Client-side filtering of countries (all 250 fetched once, cached 24h)
- Clerk third-party auth integration with Supabase (asymmetric JWT verification)
- Next.js 16: proxy.ts instead of middleware.ts, async params in dynamic routes

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
