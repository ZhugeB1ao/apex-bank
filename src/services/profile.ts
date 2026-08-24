import { supabase } from "@/lib/supabase";
import type { BankProfile, UpdateProfileData } from "@/types/bank-profile";

export async function getMyProfile(): Promise<BankProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("bank_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    throw new Error(error.message);
  }

  return data;
}

export async function getAllProfiles(): Promise<BankProfile[]> {
  const { data, error } = await supabase
    .from("bank_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function updateProfile(
  id: string,
  updates: UpdateProfileData
): Promise<BankProfile> {
  const { data, error } = await supabase
    .from("bank_profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
