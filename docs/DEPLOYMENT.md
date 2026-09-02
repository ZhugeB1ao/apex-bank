# 🚀 DEPLOYMENT — Hướng Dẫn Đóng Gói & Triển Khai

> Hướng dẫn chi tiết về quy trình đóng gói sản phẩm (Production Build), phân tích kích thước tài nguyên tĩnh, cấu hình Single Page Application (SPA Fallback Rewrite), và các bước triển khai lên các nền tảng Static Hosting hiện đại.

---

## 📑 Mục Lục

- [1. Quy Trình Đóng Gói (Production Build)](#1-quy-trình-đóng-gói-production-build)
- [2. Phân Tích Cấu Trúc Thư Mục `dist/`](#2-phân-tích-cấu-trúc-thư-mục-dist)
- [3. Triển Khai Lên Các Nền Tảng Static Hosting](#3-triển-khai-lên-các-nền-tảng-static-hosting)
  - [3.1. Triển khai Vercel](#31-triển-khai-vercel)
  - [3.2. Triển khai Netlify](#32-triển-khai-netlify)
  - [3.3. Triển khai Cloudflare Pages](#33-triển-khai-cloudflare-pages)
  - [3.4. Triển khai Nginx Web Server](#34-triển-khai-nginx-web-server)
- [4. Cấu Hình Biến Môi Trường Production](#4-cấu-hình-biến-môi-trường-production)
- [5. Danh Sách Kiểm Tra An Toàn Trước Khi Release (Pre-flight Checklist)](#5-danh-sách-kiểm-tra-an-toàn-trước-khi-release-pre-flight-checklist)

---

## 1. Quy Trình Đóng Gói (Production Build)

Để đóng gói ứng dụng cho môi trường Production, thực thi lệnh:

```bash
npm run build
```

Quá trình này gồm 2 giai đoạn tự động:
1. **`tsc -b`**: TypeScript Compiler quét toàn bộ dự án để kiểm tra lỗi kiểu dữ liệu nghiêm ngặt, không phát sinh file JS nếu có lỗi.
2. **`vite build`**: Vite tối ưu hóa mã nguồn, nén CSS/JS (Minification & Tree-shaking), gom nhóm tài nguyên thành các static chunks trong thư mục `dist/`.

---

## 2. Phân Tích Cấu Trúc Thư Mục `dist/`

Sau khi build thành công, cấu trúc thư mục phân phối `dist/` có dạng:

```text
dist/
├── index.html                   # Entry point tĩnh (~0.49 kB / gzip: ~0.34 kB)
└── assets/
    ├── index-[hash].css         # Toàn bộ CSS Design System nén (~8.36 kB / gzip: ~2.35 kB)
    └── index-[hash].js          # Bundle React 19 + Supabase Client (~423 kB / gzip: ~119 kB)
```

> [!TIP]
> Nhờ công nghệ Tree-shaking và tối ưu hóa của Vite 8, toàn bộ kích thước tải nén qua mạng (Gzip) của toàn ứng dụng chỉ xấp xỉ **~122 kB**, đảm bảo thời gian tải trang ban đầu (First Contentful Paint) dưới **0.5 giây**.

---

## 3. Triển Khai Lên Các Nền Tảng Static Hosting

### 3.1. Triển khai Vercel
1. Kết nối repository GitHub với Vercel.
2. Thiết lập cấu hình:
   * **Framework Preset:** `Vite`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
3. Thêm file cấu hình `vercel.json` (nếu cần xử lý rewrite):
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

---

### 3.2. Triển khai Netlify
1. Kết nối repo trên Netlify Dashboard.
2. Cấu hình Build:
   * **Build command:** `npm run build`
   * **Publish directory:** `dist`
3. Tạo file `public/_redirects` để hỗ trợ SPA Routing:
   ```text
   /*    /index.html   200
   ```

---

### 3.3. Triển khai Cloudflare Pages
1. Chọn dự án trong Cloudflare Dashboard $\rightarrow$ **Pages** $\rightarrow$ **Connect to Git**.
2. Thiết lập:
   * **Framework:** `Vite`
   * **Build command:** `npm run build`
   * **Output directory:** `dist`

---

### 3.4. Triển khai Nginx Web Server

Nếu triển khai trên máy chủ Linux/VPS riêng qua Nginx:

```nginx
server {
    listen 80;
    server_name bank.yourdomain.com;

    root /var/www/apex-bank/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets lâu dài (1 năm)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 4. Cấu Hình Biến Môi Trường Production

Trên các nền tảng Hosting (Vercel / Netlify / Cloudflare), thiết lập 2 biến môi trường bắt buộc:

| Tên Biến | Giá Trị Mẫu | Mô Tả |
|:---|:---|:---|
| `VITE_SUPABASE_URL` | `https://kkuzaelcdmcegxcfoyol.supabase.co` | URL Endpoint của dự án Supabase. |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...` | Public Anonymous Key được phân quyền qua RLS. |

> [!CAUTION]
> **CẢNH BÁO BẢO MẬT:** Tuyệt đối không thêm `SUPABASE_SERVICE_ROLE_KEY` vào cấu hình Client-side Build. Khóa này có quyền vượt qua mọi chính sách RLS và chỉ được dùng trong môi trường Backend riêng tư.

---

## 5. Danh Sách Kiểm Tra An Toàn Trước Khi Release (Pre-flight Checklist)

Trước khi đưa bản build lên Production, luôn kiểm tra các hạng mục sau:

- [x] **Kiểm tra Typecheck:** `npm run build` không xuất hiện bất kỳ cảnh báo hoặc lỗi kiểu TypeScript nào.
- [x] **Kiểm tra Linter:** `npm run lint` đạt chuẩn 0 errors.
- [x] **Bảo mật RLS CSDL:** Đảm bảo tất cả 4 chính sách RLS trên bảng `bank_profiles` đã được kích hoạt `ENABLE ROW LEVEL SECURITY`.
- [x] **Triggers Cascade:** Đảm bảo 2 triggers `on_bank_profile_deleted` và `on_auth_user_deleted` đang hoạt động ổn định.
- [x] **Thu hồi quyền hàm Stored Functions:** Đã chạy `REVOKE EXECUTE` đối với các hàm `handle_bank_profile_deleted()` và `handle_auth_user_deleted()` khỏi `public`/`anon`.
- [x] **Kiểm tra Responsive:** Giao diện hiển thị chuẩn xác trên cả màn hình Desktop lớn và Mobile.
