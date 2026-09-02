import { supabase } from "@/lib/supabase";
import type { BankProfile, UpdateProfileData, VerifyReferralResult } from "@/types/bank-profile";

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

export async function verifyReferralCode(code: string): Promise<VerifyReferralResult> {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, message: "Vui lòng nhập mã giới thiệu" };
  }
  if (cleanCode.length !== 8) {
    return { valid: false, message: "Mã giới thiệu phải gồm đúng 8 ký tự" };
  }

  const { data, error } = await supabase.rpc("verify_referral_code", { code: cleanCode });
  if (error) {
    throw new Error(error.message);
  }

  return data as VerifyReferralResult;
}

export async function linkReferralCode(id: string, code: string): Promise<BankProfile> {
  const cleanCode = code.trim().toUpperCase();
  return updateProfile(id, { ma_nguoi_gioi_thieu: cleanCode });
}
