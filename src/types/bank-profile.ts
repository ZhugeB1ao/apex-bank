export interface RegisterData {
  email: string;
  password: string;
  hoTen: string;
  cccd: string;
  sdt: string;
  diaChi: string;
  maNguoiGioiThieu?: string;
}

export interface BankProfile {
  id: string;
  user_id: string;
  ho_ten: string;
  cccd: string;
  sdt: string;
  dia_chi: string;
  ma_gioi_thieu: string;
  ma_nguoi_gioi_thieu: string | null;
  created_at: string;
}

export interface UpdateProfileData {
  ho_ten?: string;
  sdt?: string;
  dia_chi?: string;
  ma_nguoi_gioi_thieu?: string | null;
}

export interface VerifyReferralResult {
  valid: boolean;
  owner_name?: string;
  code?: string;
  message?: string;
}