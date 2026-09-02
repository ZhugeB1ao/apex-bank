# 🧩 COMPONENTS — Cấu Trúc Giao Diện & Design System

> Tài liệu kỹ thuật chi tiết về hệ thống thành phần giao diện React 19 (Components), bảng màu & biến CSS Design System chuẩn Fintech, và cơ chế hoạt động của hệ thống thông báo Toast trong **APEX Banking**.

---

## 📑 Mục Lục

- [1. Cây Cấu Trúc Thành Phần (Component Hierarchy)](#1-cây-cấu-trúc-thành-phần-component-hierarchy)
- [2. Design System & Biến CSS (Tokens)](#2-design-system--biến-css-tokens)
- [3. Chi Tiết Các Component](#3-chi-tiết-các-component)
  - [3.1. `App.tsx` (Root Router)](#31-apptsx-root-router)
  - [3.2. `AuthForm.tsx` (Xác Thực & eKYC)](#32-authformtsx-xác-thực--ekyc)
  - [3.3. `UserDashboard.tsx` (Khách Hàng Cá Nhân)](#33-userdashboardtsx-khách-hàng-cá-nhân)
  - [3.4. `AdminDashboard.tsx` (Quản Trị Viên)](#34-admindashboardtsx-quản-trị-viên)
  - [3.5. `Toast.tsx` (Thông Báo Tự Tắt)](#35-toasttsx-thông-báo-tự-tắt)
- [4. Quy Chuẩn Giao Diện & Khả Năng Tiếp Cận (Accessibility)](#4-quy-chuẩn-giao-diện--khả-năng-tiếp-cận-accessibility)

---

## 1. Cây Cấu Trúc Thành Phần (Component Hierarchy)

```text
src/main.tsx
  └── src/App.tsx
        ├── [Loading UI] (Khi đang khởi tạo phiên)
        ├── [AuthForm.tsx] (Khi chưa đăng nhập)
        │     └── Toast.tsx (Thông báo lỗi / thành công)
        ├── [UserDashboard.tsx] (Khi đăng nhập với role 'user')
        │     ├── Top Nav Bar (Badge 'Khách hàng cá nhân' & Nút Đăng xuất)
        │     ├── Segmented Tabs ('Thông tin', 'Chỉnh sửa', 'Đổi mật khẩu')
        │     ├── Info Tab (Hồ sơ eKYC, Sao chép mã GT, Nhập mã người GT)
        │     ├── Edit Tab (Chỉnh sửa Tên, SĐT, Địa chỉ - Khóa CCCD)
        │     ├── Password Tab (Đổi mật khẩu)
        │     └── Toast.tsx (Auto-dismiss 3s)
        ├── [AdminDashboard.tsx] (Khi đăng nhập với role 'admin')
        │     ├── Top Nav Bar (Badge 'Admin Portal' & Nút Đăng xuất)
        │     ├── Stats Bar (Tổng số tài khoản, Kết quả đang lọc)
        │     ├── Realtime Search Filter Input
        │     ├── Fintech Data Table (15 tài khoản)
        │     └── Toast.tsx
        └── Footer ('APEX BANKING • SECURE CORE PLATFORM v1.0')
```

---

## 2. Design System & Biến CSS (Tokens)

Toàn bộ phong cách giao diện được xây dựng bằng **Vanilla CSS** trong file [src/index.css](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/src/index.css) với bảng biến CSS chuẩn:

### Bảng Tokens Màu Sắc & Typography:

| Biến CSS Token | Giá Trị Hex / HSL | Ứng Dụng |
|:---|:---|:---|
| `--bg-base` | `#080c14` | Màu nền tối chủ đạo của toàn bộ trang web. |
| `--bg-surface` | `rgba(16, 24, 40, 0.75)` | Nền Card kính mờ (Glassmorphism surface). |
| `--bg-elevated` | `rgba(26, 38, 62, 0.6)` | Nền các phần tử nổi bật, ô nhập liệu (inputs), stats. |
| `--accent` | `#38bdf8` (Sky Blue) | Màu điểm nhấn thương hiệu, nút CTA chính, mã GT. |
| `--accent-hover` | `#0ea5e9` | Trạng thái hover của nút bấm và liên kết. |
| `--success` | `#10b981` (Emerald Green) | Thông báo thành công, trạng thái kích hoạt, badge. |
| `--danger` | `#ef4444` (Coral Red) | Thông báo lỗi, validation cảnh báo. |
| `--text-main` | `#f8fafc` | Màu chữ tiêu đề và nội dung chính (Độ tương phản cao). |
| `--text-muted` | `#94a3b8` | Màu chữ phụ, mô tả tính năng. |
| `--text-dim` | `#64748b` | Màu chữ nhãn dữ liệu, ghi chú bảo mật. |
| `--border` | `rgba(255, 255, 255, 0.08)` | Đường viền vi cấu trúc (Micro-borders). |
| `--font-sans` | `'Inter', system-ui, sans-serif` | Phông chữ chính cho toàn bộ giao diện. |
| `--font-mono` | `'JetBrains Mono', monospace` | Phông chữ đơn cách cho CCCD, SĐT, Mã giới thiệu. |

---

## 3. Chi Tiết Các Component

### 3.1. `App.tsx` (Root Router)
*   **Vị trí:** [src/App.tsx](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/src/App.tsx)
*   **Trách nhiệm:** Quản lý trạng thái xác thực toàn cục, xử lý loading màn hình khởi tạo và điều hướng có điều kiện giữa `AuthForm`, `AdminDashboard` và `UserDashboard`.

---

### 3.2. `AuthForm.tsx` (Xác Thực & eKYC)
*   **Vị trí:** [src/components/AuthForm.tsx](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/src/components/AuthForm.tsx)
*   **Chức năng:**
    *   Segmented Control chuyển đổi linh hoạt giữa 2 chế độ: `login` và `register`.
    *   **Quy tắc Validation Client-side:**
        *   Email: Bắt buộc, đúng định dạng.
        *   Mật khẩu: Bắt buộc, tối thiểu 6 ký tự.
        *   Họ tên: Tối thiểu 2 ký tự.
        *   Số CCCD: Đúng 12 chữ số (`/^\d{12}$/`).
        *   Số điện thoại: Đúng 10 chữ số, bắt đầu bằng số 0 (`/^0\d{9}$/`).
        *   Địa chỉ: Tối thiểu 5 ký tự.
        *   Mã người giới thiệu: Tùy chọn, nếu có phải đúng 8 ký tự và tự động chuyển in hoa (`toUpperCase()`).

---

### 3.3. `UserDashboard.tsx` (Khách Hàng Cá Nhân)
*   **Vị trí:** [src/components/UserDashboard.tsx](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/src/components/UserDashboard.tsx)
*   **Chức năng:**
    1. **Tab "Thông tin tài khoản":**
       * Hiển thị lưới thông tin eKYC cá nhân.
       * Mục **Mã giới thiệu của tôi**: Kèm nút bấm Sao chép (Copy to Clipboard) phản hồi trạng thái `✓ Đã chép` trong 2.5s.
       * Mục **Người giới thiệu**: Nếu đã liên kết, hiển thị badge `Đã liên kết • Cố định`. Nếu chưa, hiển thị box form `🎁 Nhập mã người giới thiệu`.
    2. **Tab "Chỉnh sửa thông tin":**
       * Cho phép cập nhật: Họ tên, Số điện thoại, Địa chỉ.
       * **Trường CCCD bị vô hiệu hóa (`disabled`)** để bảo vệ tính toàn vẹn định danh.
       * Nút "Hủy bỏ" khôi phục dữ liệu ban đầu và chuyển về Tab Info.
    3. **Tab "Đổi mật khẩu":**
       * Kiểm tra mật khẩu mới $\ge$ 6 ký tự và xác nhận trùng khớp.

---

### 3.4. `AdminDashboard.tsx` (Quản Trị Viên)
*   **Vị trí:** [src/components/AdminDashboard.tsx](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/src/components/AdminDashboard.tsx)
*   **Chức năng:**
    *   **Stats Bar:** Hiển thị 2 chỉ số: `Tổng số tài khoản đã mở` (15) và `Kết quả đang lọc`.
    *   **Bộ lọc tìm kiếm thời gian thực (Live Search):**
        ```typescript
        const filtered = profiles.filter((p) => {
          if (!search.trim()) return true;
          const q = search.toLowerCase();
          return (
            p.ho_ten.toLowerCase().includes(q) ||
            p.cccd.includes(q) ||
            p.sdt.includes(q) ||
            p.dia_chi.toLowerCase().includes(q) ||
            (p.ma_gioi_thieu && p.ma_gioi_thieu.toLowerCase().includes(q)) ||
            (p.ma_nguoi_gioi_thieu && p.ma_nguoi_gioi_thieu.toLowerCase().includes(q))
          );
        });
        ```
    *   **Nút "Xóa bộ lọc"**: Hiển thị linh hoạt khi có từ khóa tìm kiếm.
    *   **Bảng Fintech Table:** Hiển thị danh sách đầy đủ với định dạng ngày giờ chuẩn `vi-VN`.

---

### 3.5. `Toast.tsx` (Thông Báo Tự Tắt)
*   **Vị trí:** [src/components/Toast.tsx](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/src/components/Toast.tsx)
*   **Chức năng:**
    *   Hiển thị thông báo dạng nổi góc màn hình (Toast Alert).
    *   Hỗ trợ 2 kiểu: `error` (đỏ) và `success` (xanh).
    *   Tự động đóng sau `duration` (mặc định 3000ms = 3 giây) qua `setTimeout`.
    *   Tích hợp thanh tiến trình hiệu ứng CSS Animation (`alert-progress`).
    *   Cung cấp nút đóng nhanh `×`.

```typescript
interface ToastProps {
  message: string;
  type: "error" | "success";
  onClose: () => void;
  duration?: number;
}
```

---

## 4. Quy Chuẩn Giao Diện & Khả Năng Tiếp Cận (Accessibility)

1. **Semantic HTML:** Sử dụng chuẩn các thẻ `<form>`, `<label htmlFor="...">`, `<input id="...">`, `<table>`, `<thead>`, `<tbody>`, `<button type="...">`.
2. **Typography Monospace:** Các chuỗi ký tự định danh (CCCD, SĐT, Mã giới thiệu, Ngày tháng) luôn áp dụng `font-family: var(--font-mono)` để các chữ số thẳng hàng tuyệt đối, chống đọc nhầm.
3. **Responsive Design:** Hệ thống bố cục linh hoạt qua CSS Grid (`grid-template-columns: repeat(auto-fit, minmax(...))`) và Flexbox, tự động căn chỉnh hoàn hảo trên cả màn hình Desktop, Tablet và Mobile.
