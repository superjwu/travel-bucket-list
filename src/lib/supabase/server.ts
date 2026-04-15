import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function createServerSupabaseClient(): Promise<SupabaseClient> {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      accessToken: async () => {
        const { getToken } = await auth();
        return (await getToken()) ?? null;
      },
    }
  );
}
