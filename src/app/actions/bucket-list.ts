"use server";

import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { BucketListItem } from "@/lib/types";

export async function addToBucketList(data: {
  country_code: string;
  country_name: string;
  flag_url: string;
  region: string;
}): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("bucket_list_items").insert({
    user_id: userId,
    country_code: data.country_code,
    country_name: data.country_name,
    flag_url: data.flag_url,
    region: data.region,
  });

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Already in your bucket list" };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/bucket-list");
  revalidatePath("/explore");
  revalidatePath(`/country/${data.country_code}`);
  return { success: true };
}

export async function updateBucketListItem(
  id: string,
  updates: {
    notes?: string | null;
    visited?: boolean;
    priority?: number;
    travel_date?: string | null;
  }
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("bucket_list_items")
    .update(updates)
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/bucket-list");
  return { success: true };
}

export async function removeBucketListItem(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("bucket_list_items")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/bucket-list");
  revalidatePath("/explore");
  return { success: true };
}

export async function getBucketList(): Promise<BucketListItem[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("bucket_list_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data as BucketListItem[];
}
