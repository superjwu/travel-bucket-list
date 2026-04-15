# Project Questions

## 1. Trace a request: a user searches, saves, and views it on their profile. What systems are involved?

**Step 1 — Search (Explore Page):**
- The **Next.js server** (App Router, server component) calls the **REST Countries API** (`restcountries.com/v3.1`) to fetch all 250 countries. This response is cached for 24 hours via Next.js `revalidate`.
- Simultaneously, the server calls the **US State Department API** (`cadataapi.state.gov`) for safety advisories and the **Pexels API** for travel photos of the top 50 destinations.
- The server also calls **Clerk** (`auth()`) to check if the user is signed in, and if so, queries **Supabase** to get their already-saved country codes.
- All this data is passed to a **React client component** (`ExploreClient.tsx`) which handles search filtering, region filtering, and sorting entirely in the browser — no additional API calls needed.

**Step 2 — Save (Add to Bucket List):**
- The user clicks "Add to Bucket List" on a country detail page. This triggers a **Next.js Server Action** (`addToBucketList` in `src/app/actions/bucket-list.ts`).
- The Server Action calls **Clerk** (`auth()`) to verify the user's identity and get their user ID.
- It then creates an authenticated **Supabase client** using the Clerk session token. The Supabase client sends an `INSERT` to the `bucket_list_items` table in **Supabase Postgres**.
- **Supabase Row Level Security (RLS)** verifies that the `user_id` in the insert matches the `sub` claim in the Clerk JWT. If it doesn't match, the insert is rejected at the database level.
- The Server Action calls `revalidatePath` to tell Next.js to refresh the cached page data.

**Step 3 — View on Profile (Bucket List Page):**
- The user navigates to `/bucket-list`. The **Clerk proxy middleware** (`src/proxy.ts`) checks the request — since this is a protected route, it redirects unauthenticated users to `/sign-in`.
- The **Next.js server component** calls **Clerk** for auth, then queries **Supabase** with `SELECT * FROM bucket_list_items` — RLS automatically filters to only the current user's rows.
- The data is passed to a **React client component** (`BucketListClient.tsx`) which renders the cards with filtering (All/Visited/Want) and sorting.

**Systems involved in total:**
1. **Next.js** (App Router) — server-side rendering, server actions, caching, routing
2. **Clerk** — authentication, session management, JWT token issuance
3. **Supabase** (Postgres) — data storage, Row Level Security, JWT verification
4. **REST Countries API** — country data (name, flag, population, etc.)
5. **Pexels API** — travel photography
6. **US State Department API** — safety advisories
7. **Teleport API** — cost of living scores
8. **Browser** — client-side filtering, search, UI interactions

---

## 2. Why should your app call the external API from the server (API route) instead of directly from the browser?

1. **API key security:** The Pexels API key (`PEXELS_API_KEY`) and other secrets are stored in environment variables on the server. If we called Pexels directly from the browser, the API key would be exposed in the network tab of DevTools. Anyone could steal it and use our quota. By calling from the server, the key never reaches the client.

2. **Rate limit management:** The Pexels free tier allows 200 requests/hour. If 100 users each trigger 5 requests from their browsers, that's 500 requests — over the limit. By calling from the server with `next: { revalidate: 86400 }`, the server fetches once, caches the result for 24 hours, and serves it to all users. One API call serves thousands of page views.

3. **CORS restrictions:** Many APIs (like the US State Department API) don't set `Access-Control-Allow-Origin` headers for browser requests. The browser would block these calls with a CORS error. Server-side calls have no CORS restrictions since they're server-to-server.

4. **Performance:** The server is typically closer to the API servers (both in data centers) than the user's browser. Server-side fetching + streaming via React Suspense means the user sees the page layout instantly while data loads progressively. If we fetched from the browser, the user would see a blank page until all JavaScript loaded, executed, and the API responded.

5. **Data transformation:** We can filter, combine, and transform data on the server before sending it to the client. For example, we merge data from REST Countries + Pexels + State Dept into a single props object, reducing the payload the browser needs to handle.

---

## 3. A classmate signs up on your app. What data does Clerk store vs. what does Supabase store? How are they connected?

### What Clerk stores:
- **User identity:** email address, password hash (or OAuth provider link for Google sign-in), profile picture, display name
- **Session data:** active sessions, session tokens, last sign-in time, device info
- **Authentication state:** MFA settings, email verification status, sign-in methods
- **User ID:** a unique identifier like `user_2xK9abc123` (the `sub` claim in JWTs)

Clerk does NOT store any travel/bucket list data. It only handles "who is this person?"

### What Supabase stores:
- **Bucket list items:** the `bucket_list_items` table with:
  - `user_id` (text) — the Clerk user ID
  - `country_code`, `country_name`, `flag_url`, `region` — what country was saved
  - `notes`, `visited`, `priority`, `travel_date` — user's personal data about the country
  - `created_at`, `updated_at` — timestamps

Supabase does NOT store passwords, emails, or authentication data. It only handles "what has this person saved?"

### How they're connected:
1. **Clerk issues JWTs:** When a user signs in, Clerk creates a session token (JWT) containing the user's ID (`sub` claim) and a `role: "authenticated"` claim.
2. **Supabase verifies Clerk JWTs:** Supabase is configured with Clerk as a third-party auth provider. When our app sends a request to Supabase, it includes the Clerk JWT in the `Authorization` header. Supabase verifies the JWT signature using Clerk's public keys (via OIDC discovery).
3. **RLS uses the JWT:** Supabase Row Level Security policies extract `auth.jwt()->>'sub'` from the verified token and compare it to the `user_id` column. This ensures users can only read/write their own data.

The connection is **stateless** — Supabase never calls Clerk directly. It just trusts the cryptographically signed JWT that Clerk issued.

---

## 4. Ask Claude (with MCP) to describe your database. Paste the response. Does it match your mental model?

### MCP Response (via `mcp__supabase__list_tables` with verbose=true):

```json
{
  "tables": [
    {
      "name": "public.bucket_list_items",
      "rls_enabled": true,
      "rows": 2,
      "columns": [
        { "name": "id", "data_type": "uuid", "default_value": "gen_random_uuid()" },
        { "name": "user_id", "data_type": "text" },
        { "name": "country_code", "data_type": "text" },
        { "name": "country_name", "data_type": "text" },
        { "name": "flag_url", "data_type": "text", "nullable": true },
        { "name": "region", "data_type": "text", "nullable": true },
        { "name": "notes", "data_type": "text", "nullable": true },
        { "name": "visited", "data_type": "boolean", "default_value": "false" },
        { "name": "priority", "data_type": "integer", "default_value": "0", "check": "priority >= 0 AND priority <= 5" },
        { "name": "travel_date", "data_type": "date", "nullable": true },
        { "name": "created_at", "data_type": "timestamp with time zone", "default_value": "now()" },
        { "name": "updated_at", "data_type": "timestamp with time zone", "default_value": "now()" }
      ],
      "primary_keys": ["id"]
    }
  ]
}
```

### Does it match my mental model?

**Yes, it matches exactly.** The database has a single table `bucket_list_items` with:

- **RLS enabled** — confirmed, which means all queries are scoped to the authenticated user
- **12 columns** matching our `BucketListItem` TypeScript interface in `src/lib/types.ts`
- **`user_id` as text** (not UUID) — correct, because Clerk user IDs are strings like `user_2xK9abc123`
- **`priority` with a CHECK constraint** (0-5) — enforced at the database level, not just in the UI
- **`visited` defaults to false** — new saves start as "Want to Visit"
- **`id` auto-generated as UUID** — no need to generate IDs in application code
- **`updated_at` with `now()` default** — plus we have a trigger (`set_updated_at`) that auto-updates this on every row change
- **2 rows** — matching the test data from signing up and saving countries

The only thing the MCP response doesn't show is the **unique constraint on `(user_id, country_code)`** which prevents duplicate saves, and the **4 RLS policies** (select, insert, update, delete) — but those exist in the migration we applied earlier.
