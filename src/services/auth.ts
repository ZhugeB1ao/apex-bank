import { supabase } from "@/lib/supabase";
import type { RegisterData } from "@/types/bank-profile";

export async function signUp(data: RegisterData) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        ho_ten: data.hoTen,
        cccd: data.cccd,
        sdt: data.sdt,
        dia_chi: data.diaChi,
        ma_nguoi_gioi_thieu: data.maNguoiGioiThieu ? data.maNguoiGioiThieu.trim().toUpperCase() : null,
      },
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error("Không thể tạo tài khoản");
  }

  return authData;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function changePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export function getRole(user: { app_metadata?: Record<string, unknown> }): "admin" | "user" {
  return user.app_metadata?.role === "admin" ? "admin" : "user";
}
