# 🏛️ APEX BANKING — Nền Tảng Ngân Hàng Số & Định Danh eKYC

> Hệ thống ứng dụng web ngân hàng số mô phỏng lõi Core Banking, quản lý định danh khách hàng (eKYC), phân quyền Quản trị viên / Khách hàng (RBAC), và mạng lưới mã giới thiệu (Referral Network) đa cấp với cơ chế đồng bộ CSDL thời gian thực.

---

## 📑 Mục Lục

- [1. Giới Thiệu Dự Án](#-1-giới-thiệu-dự-án)
- [2. Tính Năng Nổi Bật](#-2-tính-năng-nổi-bật)
- [3. Công Nghệ Sử Dụng](#-3-công-nghệ-sử-dụng)
- [4. Cấu Trúc Thư Mục](#-4-cấu-trúc-thư-mục)
- [5. Hướng Dẫn Cài Đặt & Khởi Chạy](#-5-hướng-dẫn-cài-đặt--khởi-chạy)
- [6. Tài Khoản Test Mẫu](#-6-tài-khoản-test-mẫu)
- [7. Hệ Thống Tài Liệu Kỹ Thuật (Docs)](#-7-hệ-thống-tài-liệu-kỹ-thuật-docs)
- [8. Giấy Phép (License)](#-8-giấy-phép-license)

---

## 🌟 1. Giới Thiệu Dự Án

**APEX Banking** là nền tảng ngân hàng trực tuyến hiện đại được thiết kế theo phong cách giao diện Fintech cao cấp (Dark Mode, Glassmorphism, Micro-animations). Hệ thống cung cấp giải pháp toàn diện cho:
- **Khách hàng cá nhân**: Mở tài khoản trực tuyến qua định danh eKYC, quản lý thông tin bảo mật, đổi mật khẩu và tham gia mạng lưới tiếp thị liên kết qua mã giới thiệu cá nhân.
- **Quản trị viên (Admin Portal)**: Giám sát toàn bộ danh sách tài khoản khách hàng, thống kê số liệu theo thời gian thực và tìm kiếm nâng cao đa tiêu chí.

---

## 🚀 2. Tính Năng Nổi Bật

### 🔐 Xác thực & Phân quyền (Authentication & RBAC)
- Đăng nhập bảo mật với Supabase Auth (GoTrue).
- Phân quyền động dựa trên JWT Claim `app_metadata.role` (tự động điều hướng vào Admin Portal hoặc User Dashboard).
- Tự động lưu và đồng bộ phiên làm việc qua `onAuthStateChange`.

### 📝 Mở tài khoản eKYC & Ràng buộc định danh
- Đăng ký tài khoản trực tuyến kèm kiểm tra định dạng: CCCD (12 số), Số điện thoại (10 số, đầu 0), Họ tên và Địa chỉ thường trú.
- Cố định trường CCCD trên giao diện người dùng sau khi kích hoạt tài khoản.

### 🎁 Mạng lưới Mã giới thiệu (Referral System)
- Mỗi tài khoản khi tạo thành công được hệ thống cấp tự động một mã giới thiệu duy nhất gồm **8 ký tự in hoa**.
- Cho phép người dùng liên kết mã người giới thiệu (hệ thống tự động xác thực sự tồn tại của mã, ngăn chặn tự giới thiệu chính mình, và cố định mã vĩnh viễn sau khi liên kết).

### 🛡️ Triggers Database & Bảo mật RLS
- **Chính sách Row Level Security (RLS)**: Ngăn chặn truy cập trái phép, chỉ cho phép User đọc/sửa hồ sơ của chính mình và Admin đọc toàn bộ hồ sơ.
- **Trigger Cascade Delete 2 chiều**: Khi xóa tài khoản từ `public.bank_profiles` hoặc `auth.users`, hệ thống tự động:
  1. Chuyển `ma_nguoi_gioi_thieu = NULL` cho tất cả các user đang liên kết với mã của người bị xóa.
  2. Xóa bản ghi tương ứng ở bảng còn lại.
  3. Sử dụng cơ chế cờ giao dịch `app.deleting_user` để ngăn chặn vòng lặp đệ quy vô hạn.

---

## 🛠️ 3. Công Nghệ Sử Dụng

| Tầng | Công nghệ | Phiên bản | Ghi chú |
|:---|:---|:---:|:---|
| **Frontend Core** | [React](https://react.dev/) | `^19.2.8` | Single Page Application (SPA) |
| **Build Tool** | [Vite](https://vitejs.dev/) | `^8.2.0` | Hot Module Replacement (HMR) cực nhanh |
| **Ngôn ngữ** | [TypeScript](https://www.typescriptlang.org/) | `~6.0.2` | Định kiểu tĩnh chặt chẽ |
| **Styling** | Vanilla CSS | — | Design System chuẩn Fintech, không phụ thuộc framework UI |
| **Backend & Auth** | [Supabase](https://supabase.com/) | `@supabase/supabase-js ^2.112.3` | PostgreSQL 15+, Supabase Auth, PostgREST API |
| **Code Quality** | ESLint | `^10.8.0` | Cấu hình Flat Config với `typescript-eslint` |

---

## 📁 4. Cấu Trúc Thư Mục

```text
apex-bank/
├── .env.example              # Mẫu cấu hình biến môi trường Supabase
├── .env.local                # Biến môi trường cục bộ (không commit)
├── ACCOUNTS.md               # Danh sách 15 tài khoản & mật khẩu mẫu
├── index.html                # Điểm vào HTML chính của ứng dụng
├── package.json              # Khai báo dependencies & scripts
├── tsconfig.json             # Cấu hình TypeScript
├── vite.config.ts            # Cấu hình Vite & path aliases (@/*)
├── docs/                     # Toàn bộ tài liệu kiến trúc kỹ thuật
│   ├── PROJECT-MAP.md        # Bản đồ ánh xạ luồng tương tác
│   ├── ARCHITECTURE.md       # Kiến trúc SPA, RBAC & RLS
│   ├── DATABASE.md           # Lược đồ CSDL, Triggers & DDL
│   ├── AUTHENTICATION.md     # Cơ chế xác thực & eKYC Flow
│   ├── COMPONENTS.md         # Chi tiết UI Components & CSS Tokens
│   ├── DEVELOPMENT.md        # Hướng dẫn phát triển & Testing
│   └── DEPLOYMENT.md         # Hướng dẫn Build & Deploy Static
└── src/
    ├── main.tsx              # Điểm khởi động React 19 Root
    ├── App.tsx               # State-driven Router & Auth listener
    ├── index.css             # Design System Tokens & Global Styles
    ├── components/
    │   ├── AuthForm.tsx      # Form Đăng nhập & Đăng ký eKYC
    │   ├── UserDashboard.tsx # Bảng điều khiển Khách hàng cá nhân
    │   ├── AdminDashboard.tsx# Bảng quản trị & Tìm kiếm khách hàng
    │   └── Toast.tsx         # Component thông báo Toast tự tắt
    ├── services/
    │   ├── auth.ts           # Dịch vụ xác thực Supabase Auth
    │   └── profile.ts        # Dịch vụ truy vấn & cập nhật hồ sơ
    ├── lib/
    │   └── supabase.ts       # Khởi tạo Supabase Client Singleton
    └── types/
        └── bank-profile.ts   # Khai báo TypeScript Interfaces
```

---

## ⚙️ 5. Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu tiên quyết
- **Node.js**: Phiên bản `18.x` hoặc `20.x+`
- **npm** hoặc **pnpm / yarn**

### Bước 1: Clone mã nguồn
```bash
git clone https://github.com/ZhugeB1ao/apex-bank.git
cd apex-bank
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình biến môi trường
Tạo file `.env.local` tại thư mục gốc dựa trên file `.env.example`:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Bước 4: Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Truy cập trình duyệt tại: `http://localhost:5173/` (hoặc cổng được Vite phân bổ).

### Bước 5: Đóng gói sản phẩm (Production Build)
```bash
npm run build
npm run preview
```

---

## 👥 6. Tài Khoản Test Mẫu

Hệ thống được khởi tạo sẵn **15 tài khoản** (1 Quản trị viên + 14 Khách hàng).

| Vai trò | Email đăng nhập | Mật khẩu | Họ và tên | Mã cá nhân |
|:---|:---|:---:|:---|:---:|
| 👑 **Quản trị viên** | `hieunhan.2709@gmail.com` | `@LHNhan27092005` | **Lê Hiếu Nhân** | `R2KUJTEO` |
| 👤 **Khách hàng 1** | `nguyenhoanglong.bank@gmail.com` | `Password@123` | **Nguyễn Hoàng Long** | `G1KWQN43` |
| 👤 **Khách hàng 2** | `tranthithuha.fin@gmail.com` | `Password@123` | **Trần Thị Thu Hà** | `C4HMYX0L` |
| 👤 **Khách hàng 5** | `dangquocbao.tech@gmail.com` | `Password@123` | **Đặng Quốc Bảo** | `RTDK4G69` |

> 📌 *Xem danh sách và sơ đồ mạng lưới giới thiệu đầy đủ của toàn bộ 15 tài khoản tại tài liệu [ACCOUNTS.md](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/ACCOUNTS.md).*

---

## 📚 7. Hệ Thống Tài Liệu Kỹ Thuật (Docs)

Để hiểu sâu về kiến trúc, cơ sở dữ liệu và cách mở rộng mã nguồn, vui lòng tham khảo các tài liệu chuyên sâu:

1. [🗺️ PROJECT-MAP.md](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/docs/PROJECT-MAP.md): Bản đồ ánh xạ trực quan từ Giao diện $\rightarrow$ Component $\rightarrow$ Service $\rightarrow$ Supabase API $\rightarrow$ Database.
2. [🏗️ ARCHITECTURE.md](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/docs/ARCHITECTURE.md): Kiến trúc Single Page Application, phân quyền Role-Based (RBAC) & Row Level Security (RLS).
3. [🗄️ DATABASE.md](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/docs/DATABASE.md): Lược đồ CSDL PostgreSQL, Stored Functions, Triggers Cascade Delete & Ràng buộc bất biến.
4. [🔑 AUTHENTICATION.md](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/docs/AUTHENTICATION.md): Cơ chế xác thực GoTrue, xử lý JWT Claims, eKYC Data Flow & Xử lý lỗi Schema Tokens.
5. [🧩 COMPONENTS.md](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/docs/COMPONENTS.md): Chi tiết các Component React, Design System Tokens, CSS Architecture & Toast System.
6. [💻 DEVELOPMENT.md](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/docs/DEVELOPMENT.md): Hướng dẫn thiết lập môi trường, quy chuẩn TypeScript, ESLint & Hướng dẫn mở rộng tính năng.
7. [🚀 DEPLOYMENT.md](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/docs/DEPLOYMENT.md): Hướng dẫn đóng gói Production Bundle và triển khai Static Hosting (Vercel, Netlify, Cloudflare).
8. [📋 TEST-CASES.md](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/docs/TEST-CASES.md): Bảng 89 Test Cases kiểm thử toàn diện trên 10 Module chức năng.
9. [📊 TEST-REPORT.md](file:///Users/gbao/Code/Frontend/NextJS/apex-bank/docs/TEST-REPORT.md): Báo cáo kết quả kiểm thử thực tế đạt 100% (89/89 Test Cases PASSED).

---

## 📄 8. Giấy Phép (License)

Dự án được phân phối phục vụ mục đích nghiên cứu và phát triển phần mềm ngân hàng số an toàn. Bản quyền © 2026 APEX Banking Core Platform.
