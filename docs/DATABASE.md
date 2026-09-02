# 🗄️ DATABASE — Lược Đồ CSDL & Triggers PL/pgSQL

> Tài liệu kỹ thuật chi tiết về cấu trúc Cơ sở dữ liệu PostgreSQL, các hàm thủ tục lưu trữ (Stored Functions), hệ thống Triggers kiểm tra nghiệp vụ và cơ chế Xóa Cascade 2 chiều của hệ thống **APEX Banking**.

---

## 📑 Mục Lục

- [1. Lược Đồ Bảng (Database Schema)](#1-lược-đồ-bảng-database-schema)
- [2. Danh Sách Stored Functions (PL/pgSQL)](#2-danh-sách-stored-functions-plpgsql)
- [3. Hệ Thống Triggers Nghiệp Vụ](#3-hệ-thống-triggers-nghiệp-vụ)
- [4. Cơ Chế Xóa Cascade 2 Chiều & Reset Mã Giới Thiệu](#4-cơ-chế-xóa-cascade-2-chiều--reset-mã-giới-thiệu)
- [5. DDL Script Khởi Tạo Hoàn Chỉnh](#5-ddl-script-khởi-tạo-hoàn-chỉnh)

---

## 1. Lược Đồ Bảng (Database Schema)

Hệ thống sử dụng bảng trung tâm `public.bank_profiles` liên kết với bảng xác thực `auth.users`:

### Bảng: `public.bank_profiles`

| Tên Cột | Kiểu Dữ Liệu | Nullable | Giá Trị Mặc Định | Mô Tả Nghiệp Vụ |
|:---|:---|:---:|:---|:---|
| `id` | `uuid` | ❌ NO | — | Khóa chính (Primary Key), trùng với `user_id`. |
| `user_id` | `uuid` | ❌ NO | — | Khóa ngoại tham chiếu `auth.users(id)`. |
| `ho_ten` | `text` | ❌ NO | — | Họ và tên đầy đủ của chủ tài khoản. |
| `cccd` | `text` | ❌ NO | — | Số CCCD định danh (12 chữ số), duy nhất. |
| `sdt` | `text` | ❌ NO | — | Số điện thoại liên hệ (10 chữ số, đầu 0). |
| `dia_chi` | `text` | ❌ NO | — | Địa chỉ thường trú theo eKYC. |
| `ma_gioi_thieu` | `text` | ❌ NO | — | Mã giới thiệu cá nhân (8 ký tự in hoa), duy nhất. |
| `ma_nguoi_gioi_thieu` | `text` | ✅ YES | `NULL` | Mã của người đã giới thiệu tài khoản này mở thẻ. |
| `created_at` | `timestamptz` | ❌ NO | `timezone('utc'::text, now())` | Thời điểm kích hoạt tài khoản. |

---

## 2. Danh Sách Stored Functions (PL/pgSQL)

### 1. `generate_referral_code() RETURNS text`
*   **Mục đích:** Tự động sinh chuỗi mã giới thiệu ngẫu nhiên gồm đúng 8 ký tự (từ tập `A-Z0-9`), kiểm tra tính duy nhất trong vòng lặp trước khi trả về.
```sql
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text AS $$
DECLARE
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer := 0;
  code_exists boolean := true;
BEGIN
  WHILE code_exists LOOP
    result := '';
    FOR i IN 1..8 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    SELECT EXISTS(SELECT 1 FROM public.bank_profiles WHERE ma_gioi_thieu = result) INTO code_exists;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### 2. `handle_new_user() RETURNS trigger`
*   **Mục đích:** Tự động kích hoạt khi có bản ghi mới được tạo trong `auth.users` (qua `signUp`), trích xuất thông tin `raw_user_meta_data` để tạo hồ sơ tương ứng trong `public.bank_profiles`.
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_ho_ten text := COALESCE(NULLIF(new.raw_user_meta_data->>'ho_ten', ''), 'Quản trị viên');
  v_cccd text := COALESCE(NULLIF(new.raw_user_meta_data->>'cccd', ''), 'ADMIN_' || substr(new.id::text, 1, 8));
  v_sdt text := COALESCE(NULLIF(new.raw_user_meta_data->>'sdt', ''), '09' || substr(replace(new.id::text, '-', ''), 1, 8));
  v_dia_chi text := COALESCE(NULLIF(new.raw_user_meta_data->>'dia_chi', ''), 'Hội sở chính');
  v_ma_nguoi_gt text := NULLIF(UPPER(TRIM(COALESCE(new.raw_user_meta_data->>'ma_nguoi_gioi_thieu', new.raw_user_meta_data->>'ma_gioi_thieu', ''))), '');
  v_my_ref_code text;
BEGIN
  IF v_ma_nguoi_gt IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.bank_profiles WHERE ma_gioi_thieu = v_ma_nguoi_gt) THEN
      v_ma_nguoi_gt := NULL;
    END IF;
  END IF;

  v_my_ref_code := public.generate_referral_code();

  INSERT INTO public.bank_profiles (id, user_id, ho_ten, cccd, sdt, dia_chi, ma_gioi_thieu, ma_nguoi_gioi_thieu)
  VALUES (new.id, new.id, v_ho_ten, v_cccd, v_sdt, v_dia_chi, v_my_ref_code, v_ma_nguoi_gt)
  ON CONFLICT (id) DO UPDATE
  SET ho_ten = CASE WHEN EXCLUDED.ho_ten <> 'Quản trị viên' THEN EXCLUDED.ho_ten ELSE public.bank_profiles.ho_ten END,
      cccd = CASE WHEN EXCLUDED.cccd NOT LIKE 'ADMIN_%' THEN EXCLUDED.cccd ELSE public.bank_profiles.cccd END,
      sdt = CASE WHEN EXCLUDED.sdt NOT LIKE '09%' THEN EXCLUDED.sdt ELSE public.bank_profiles.sdt END,
      dia_chi = CASE WHEN EXCLUDED.dia_chi <> 'Hội sở chính' THEN EXCLUDED.dia_chi ELSE public.bank_profiles.dia_chi END,
      ma_nguoi_gioi_thieu = COALESCE(public.bank_profiles.ma_nguoi_gioi_thieu, EXCLUDED.ma_nguoi_gioi_thieu);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### 3. `verify_referral_code(code text) RETURNS jsonb`
*   **Mục đích:** RPC Function cho phép Client kiểm tra tính hợp lệ của mã giới thiệu và trả về họ tên của chủ mã mà không làm lộ thông tin nhạy cảm khác.
```sql
CREATE OR REPLACE FUNCTION verify_referral_code(code text)
RETURNS jsonb AS $$
DECLARE
  v_profile RECORD;
BEGIN
  IF code IS NULL OR length(trim(code)) <> 8 THEN
    RETURN jsonb_build_object('valid', false, 'message', 'Mã giới thiệu phải gồm đúng 8 ký tự');
  END IF;

  SELECT ho_ten, ma_gioi_thieu INTO v_profile 
  FROM public.bank_profiles 
  WHERE ma_gioi_thieu = UPPER(trim(code))
  LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object('valid', true, 'owner_name', v_profile.ho_ten, 'code', v_profile.ma_gioi_thieu);
  ELSE
    RETURN jsonb_build_object('valid', false, 'message', 'Mã giới thiệu không tồn tại trên hệ thống');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### 4. `check_bank_profile_updates() RETURNS trigger`
*   **Mục đích:** Trigger kiểm soát tính toàn vẹn khi Update hồ sơ:
    1. Không cho phép sửa `ma_gioi_thieu` cá nhân.
    2. Không cho phép đổi hoặc xóa `ma_nguoi_gioi_thieu` một khi đã liên kết (ngoại trừ khi đang trong tiến trình xóa cascade hệ thống `app.deleting_user`).
    3. Chặn việc tự nhập mã giới thiệu của chính mình.
    4. Xác thực mã giới thiệu người khác phải tồn tại trước khi cho phép liên kết.
```sql
CREATE OR REPLACE FUNCTION check_bank_profile_updates()
RETURNS TRIGGER AS $$
BEGIN
  IF NULLIF(current_setting('app.deleting_user', true), '') IS NOT NULL THEN
    RETURN NEW;
  END IF;

  IF OLD.ma_gioi_thieu IS NOT NULL AND NEW.ma_gioi_thieu <> OLD.ma_gioi_thieu THEN
    RAISE EXCEPTION 'Mã giới thiệu của tài khoản là cố định và không thể thay đổi.';
  END IF;

  IF OLD.ma_nguoi_gioi_thieu IS NOT NULL AND NEW.ma_nguoi_gioi_thieu IS DISTINCT FROM OLD.ma_nguoi_gioi_thieu THEN
    RAISE EXCEPTION 'Mã người giới thiệu đã được liên kết và không thể thay đổi.';
  END IF;

  IF (OLD.ma_nguoi_gioi_thieu IS NULL OR OLD.ma_nguoi_gioi_thieu = '') AND (NEW.ma_nguoi_gioi_thieu IS NOT NULL AND NEW.ma_nguoi_gioi_thieu <> '') THEN
    NEW.ma_nguoi_gioi_thieu := UPPER(TRIM(NEW.ma_nguoi_gioi_thieu));
    
    IF NEW.ma_nguoi_gioi_thieu = NEW.ma_gioi_thieu THEN
      RAISE EXCEPTION 'Không thể tự nhập mã giới thiệu của chính mình.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.bank_profiles WHERE ma_gioi_thieu = NEW.ma_nguoi_gioi_thieu) THEN
      RAISE EXCEPTION 'Mã người giới thiệu không tồn tại trên hệ thống.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 3. Hệ Thống Triggers Nghiệp Vụ

| Tên Trigger | Bảng (Table) | Thời Điểm (Timing) | Sự Kiện (Event) | Hàm Thực Thi (Execution Function) |
|:---|:---|:---:|:---:|:---|
| `on_auth_user_created` | `auth.users` | `AFTER` | `INSERT` | `handle_new_user()` |
| `trigger_check_bank_profile_updates` | `public.bank_profiles` | `BEFORE` | `UPDATE` | `check_bank_profile_updates()` |
| `on_bank_profile_deleted` | `public.bank_profiles` | `AFTER` | `DELETE` | `handle_bank_profile_deleted()` |
| `on_auth_user_deleted` | `auth.users` | `AFTER` | `DELETE` | `handle_auth_user_deleted()` |

---

## 4. Cơ Chế Xóa Cascade 2 Chiều & Reset Mã Giới Thiệu

Khi một người dùng bị xóa khỏi hệ thống (từ phía Admin, SQL, hoặc Supabase Dashboard), hệ thống xử lý đảm bảo 3 tiêu chí:
1. **Không để lại dữ liệu rác (Orphan Records):** Xóa bản ghi ở cả `auth.users` và `public.bank_profiles`.
2. **Không làm hỏng dữ liệu người khác:** Tự động chuyển `ma_nguoi_gioi_thieu = NULL` cho các tài khoản đang dùng mã của người bị xóa.
3. **Chống lặp vô hạn (Infinite Recursion Guard):** Sử dụng cờ cục bộ trong session `set_config('app.deleting_user', user_id, true)`.

### Chi tiết Function Trigger:

```sql
-- Khi xóa bank_profiles -> Clear referral -> Xóa auth.users
CREATE OR REPLACE FUNCTION handle_bank_profile_deleted()
RETURNS TRIGGER AS $$
BEGIN
  IF current_setting('app.deleting_user', true) = OLD.user_id::text THEN
    RETURN OLD;
  END IF;

  PERFORM set_config('app.deleting_user', OLD.user_id::text, true);

  UPDATE public.bank_profiles
  SET ma_nguoi_gioi_thieu = NULL
  WHERE ma_nguoi_gioi_thieu = OLD.ma_gioi_thieu;

  DELETE FROM auth.users WHERE id = OLD.user_id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Khi xóa auth.users -> Clear referral -> Xóa bank_profiles
CREATE OR REPLACE FUNCTION handle_auth_user_deleted()
RETURNS TRIGGER AS $$
DECLARE
  v_ref_code text;
BEGIN
  IF current_setting('app.deleting_user', true) = OLD.id::text THEN
    RETURN OLD;
  END IF;

  PERFORM set_config('app.deleting_user', OLD.id::text, true);

  SELECT ma_gioi_thieu INTO v_ref_code
  FROM public.bank_profiles
  WHERE user_id = OLD.id;

  IF v_ref_code IS NOT NULL THEN
    UPDATE public.bank_profiles
    SET ma_nguoi_gioi_thieu = NULL
    WHERE ma_nguoi_gioi_thieu = v_ref_code;
  END IF;

  DELETE FROM public.bank_profiles WHERE user_id = OLD.id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. DDL Script Khởi Tạo Hoàn Chỉnh

Khi cài đặt dự án mới trên Supabase, chạy toàn bộ lệnh sau trong **SQL Editor**:

```sql
-- 1. Kích hoạt Extension pgcrypto nếu chưa có
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tạo bảng bank_profiles
CREATE TABLE IF NOT EXISTS public.bank_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ho_ten text NOT NULL,
  cccd text NOT NULL UNIQUE,
  sdt text NOT NULL UNIQUE,
  dia_chi text NOT NULL,
  ma_gioi_thieu text NOT NULL UNIQUE,
  ma_nguoi_gioi_thieu text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Bật Row Level Security
ALTER TABLE public.bank_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Thiết lập RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.bank_profiles FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own profile"
  ON public.bank_profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.bank_profiles FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.bank_profiles FOR SELECT
  TO authenticated
  USING (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text);
```
