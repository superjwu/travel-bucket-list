# Setup Guide

## 1. Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create an account or sign in
2. Create a new application (name: "Travel Bucket List")
3. Enable sign-in methods: Email + Google (recommended)
4. Copy your keys from the Clerk dashboard:
   - **Publishable Key** (`pk_test_...`)
   - **Secret Key** (`sk_test_...`)
5. Paste them into `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
   CLERK_SECRET_KEY=sk_test_YOUR_KEY
   ```

## 2. Supabase Setup

The Supabase project is already created (ref: `gkdjubxdcludmiuvqsnt`).

1. Get your Supabase anon key from the [Supabase dashboard](https://supabase.com/dashboard/project/gkdjubxdcludmiuvqsnt/settings/api)
2. Add it to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://gkdjubxdcludmiuvqsnt.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 3. Connect Clerk + Supabase

### In Clerk Dashboard:
1. Go to **Configure** > **Integrations** > **Supabase** (or visit https://dashboard.clerk.com/setup/supabase)
2. Follow the prompts to enable the Supabase integration
3. This automatically adds the `role: "authenticated"` claim to Clerk session tokens

### In Supabase Dashboard:
1. Go to **Authentication** > **Third-Party Auth** (or visit https://supabase.com/dashboard/project/gkdjubxdcludmiuvqsnt/auth/third-party)
2. Click **Add Provider** > **Clerk**
3. Enter your Clerk domain (e.g., `your-app.clerk.accounts.dev` — found in Clerk dashboard under API Keys)
4. Save the configuration

## 4. Run the App

```bash
npm run dev
```

Visit http://localhost:3000

## 5. Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` to Vercel project settings
4. In Clerk dashboard, add the Vercel production URL to allowed redirect URLs
