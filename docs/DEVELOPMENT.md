# 💻 DEVELOPMENT — Hướng Dẫn Phát Triển & Kiểm Thử

> Hướng dẫn toàn diện dành cho lập trình viên tham gia phát triển, thiết lập môi trường, thực thi kiểm thử, tuân thủ quy chuẩn mã nguồn và quy trình mở rộng tính năng mới trong **APEX Banking**.

---

## 📑 Mục Lục

- [1. Thiết Lập Môi Trường Phát Triển](#1-thiết-lập-môi-trường-phát-triển)
- [2. Danh Sách Lệnh Thực Thi (NPM Scripts)](#2-danh-sách-lệnh-thực-thi-npm-scripts)
- [3. Quy Chuẩn Mã Nguồn & TypeScript](#3-quy-chuẩn-mã-nguồn--typescript)
- [4. Quy Trình Kiểm Thử (Testing Workflow)](#4-quy-trình-kiểm-thử-testing-workflow)
- [5. Hướng Dẫn Mở Rộng Tính Năng Mới](#5-hướng-dẫn-mở-rộng-tính-năng-mới)
- [6. Kinh Nghiệm Gỡ Lỗi (Debugging Tips)](#6-kinh-nghiệm-gỡ-lỗi-debugging-tips)

---

## 1. Thiết Lập Môi Trường Phát Triển

### Yêu Cầu Cài Đặt:
*   **Node.js:** Phiên bản `18.x`, `20.x` hoặc mới hơn.
*   **Package Manager:** `npm` (mặc định) hoặc `pnpm` / `yarn`.
*   **Tài khoản Supabase:** Dự án kết nối tới Supabase Cloud hoặc Supabase Local Stack (CLI).

### Các Bước Khởi Tạo:
1. Clone mã nguồn về máy:
   ```bash
   git clone https://github.com/ZhugeB1ao/apex-bank.git
   cd apex-bank
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi tạo file `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://kkuzaelcdmcegxcfoyol.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## 2. Danh Sách Lệnh Thực Thi (NPM Scripts)

Các lệnh được định nghĩa trong [package.json](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/package.json):

```bash
# 1. Khởi chạy máy chủ phát triển cục bộ với Hot Module Replacement (HMR)
npm run dev

# 2. Kiểm tra lỗi kiểu dữ liệu TypeScript (tsc -b) và đóng gói Production (vite build)
npm run build

# 3. Quét và kiểm tra quy chuẩn mã nguồn bằng ESLint Flat Config
npm run lint

# 4. Chạy thử bản đóng gói tĩnh Production Bundle tại máy cục bộ
npm run preview
```

---

## 3. Quy Chuẩn Mã Nguồn & TypeScript

### Cấu hình Path Alias:
Dự án sử dụng bí danh `@/*` trỏ trực tiếp tới thư mục `src/*` (được cấu hình đồng bộ giữa `tsconfig.app.json` và `vite.config.ts`):
```typescript
import { supabase } from "@/lib/supabase";
import type { BankProfile } from "@/types/bank-profile";
```

### Quy tắc TypeScript & Linter:
*   **Strict Typing:** Khai báo Interface rõ ràng trong `src/types/`, không sử dụng `any` tùy tiện.
*   **No Unused Variables:** Bật các cờ `noUnusedLocals: true` và `noUnusedParameters: true`.
*   **Module Syntax:** Sử dụng cú pháp `import type` khi chỉ import kiểu dữ liệu để tối ưu kích thước bundle (`verbatimModuleSyntax: true`).
*   **Functional Components:** 100% components sử dụng React Functional Components kết hợp Hooks.

---

## 4. Quy Trình Kiểm Thử (Testing Workflow)

Dự án sở hữu bộ tài liệu kiểm thử toàn diện gồm **89 Test Cases** trên **10 Module chức năng**:

### Tài Liệu Kiểm Thử Đi Kèm:
1. [📋 test_cases.md](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/test_cases.md): Bảng đặc tả 89 Test Cases chi tiết (Mục tiêu, Tiền điều kiện, Các bước thực hiện, Dữ liệu đầu vào, Kết quả kỳ vọng và Mức độ ưu tiên).
2. [📊 test_execution_report.md](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/test_execution_report.md): Báo cáo thực thi thực tế đạt **100% (89/89 Test Cases PASSED)**.

### Thứ Tự Thực Hiện Kiểm Thử Đề Xuất Khi Sửa Đổi Code:
```text
[Module 1: Đăng nhập] ──> [Module 2: Đăng ký eKYC] ──> [Module 3 & 4: Hồ sơ & Sửa thông tin]
                                                                  ↓
[Module 8: Đăng xuất] <── [Module 10: RLS Security] <── [Module 6: Referral] & [Module 5: Đổi mật khẩu]
         ↓
[Module 7: Admin Portal] ──> [Module 9: Database Cascade Delete Triggers]
```

---

## 5. Hướng Dẫn Mở Rộng Tính Năng Mới

### Ví Dụ: Thêm Tính Năng "Chuyển Tiền / Giao Dịch Nội Bộ" (Internal Transfer)

Khi muốn bổ sung một tính năng mới vào hệ thống, lập trình viên thực hiện theo 4 bước chuẩn:

1. **Bước 1: Cập nhật Kiểu dữ liệu (`src/types/transaction.ts`)**
   ```typescript
   export interface Transaction {
     id: string;
     sender_id: string;
     receiver_id: string;
     amount: number;
     message?: string;
     created_at: string;
   }
   ```

2. **Bước 2: Viết Service Layer (`src/services/transaction.ts`)**
   ```typescript
   import { supabase } from "@/lib/supabase";
   import type { Transaction } from "@/types/transaction";

   export async function createTransfer(receiverCccd: string, amount: number, message: string) {
     const { data, error } = await supabase.rpc("transfer_money", {
       p_receiver_cccd: receiverCccd,
       p_amount: amount,
       p_message: message
     });
     if (error) throw new Error(error.message);
     return data;
   }
   ```

3. **Bước 3: Tạo Component Giao diện (`src/components/TransferModal.tsx`)**
   * Xây dựng form nhập liệu, validate số tiền, tích hợp component `Toast.tsx` để thông báo kết quả.

4. **Bước 4: Cập nhật CSDL & RLS Policies (PostgreSQL)**
   * Tạo bảng `public.transactions`.
   * Kích hoạt RLS: Người gửi và người nhận chỉ được xem giao dịch liên quan đến mình (`sender_id = auth.uid() OR receiver_id = auth.uid()`).

---

## 6. Kinh Nghiệm Gỡ Lỗi (Debugging Tips)

1. **Lỗi `Database error querying schema` khi đăng nhập:**
   * **Nguyên nhân:** Có bản ghi trong `auth.users` chứa token mang giá trị `NULL`.
   * **Khắc phục:** Chạy script update chuẩn hóa các token về chuỗi rỗng `''` trong `docs/AUTHENTICATION.md`.
2. **Không thể cập nhật trường trong `bank_profiles`:**
   * **Nguyên nhân:** Vi phạm chính sách RLS `Users can update own profile` hoặc Trigger `check_bank_profile_updates()` chặn sửa mã giới thiệu.
   * **Khắc phục:** Đảm bảo `user_id` trong request trùng với `auth.uid()` của phiên đăng nhập hiện tại và không cố tình thay đổi `ma_gioi_thieu`.
3. **Admin Dashboard không tải được danh sách:**
   * **Nguyên nhân:** Tài khoản chưa được gắn `role: "admin"` trong `auth.users.raw_app_meta_data`.
   * **Khắc phục:** Chạy hàm `SELECT promote_user_to_admin('email@gmail.com');` trong Supabase SQL Editor.
