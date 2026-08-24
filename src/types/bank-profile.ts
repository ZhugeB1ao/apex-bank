export interface RegisterData {
  email: string;
  password: string;
  hoTen: string;
  cccd: string;
  sdt: string;
  diaChi: string;
  maGioiThieu?: string;
}

export interface BankProfile {
  id: string;
  user_id: string;
  ho_ten: string;
  cccd: string;
  sdt: string;
  dia_chi: string;
  ma_gioi_thieu: string | null;
  created_at: string;
}

export interface UpdateProfileData {
  ho_ten?: string;
  sdt?: string;
  dia_chi?: string;
  ma_gioi_thieu?: string | null;
}