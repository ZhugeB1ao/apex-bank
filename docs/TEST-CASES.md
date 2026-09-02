# 📋 BẢNG TESTCASES — HỆ THỐNG APEX BANK

> Tài liệu kiểm thử toàn diện cho ứng dụng web **Apex Bank** — bao gồm Xác thực, Quản lý Hồ sơ, Hệ thống Mã giới thiệu, Đổi mật khẩu, Bảng quản trị Admin, và Database Triggers.

---

## 📑 Mục lục

| Module | Số TC |
|:---|:---:|
| [Module 1: Đăng nhập (Login)](#module-1-đăng-nhập-login) | 10 |
| [Module 2: Đăng ký tài khoản (Register)](#module-2-đăng-ký-tài-khoản-register) | 14 |
| [Module 3: User Dashboard — Xem thông tin](#module-3-user-dashboard--xem-thông-tin) | 7 |
| [Module 4: User Dashboard — Chỉnh sửa thông tin](#module-4-user-dashboard--chỉnh-sửa-thông-tin) | 10 |
| [Module 5: User Dashboard — Đổi mật khẩu](#module-5-user-dashboard--đổi-mật-khẩu) | 8 |
| [Module 6: Hệ thống Mã giới thiệu (Referral)](#module-6-hệ-thống-mã-giới-thiệu-referral) | 12 |
| [Module 7: Admin Dashboard](#module-7-admin-dashboard) | 8 |
| [Module 8: Đăng xuất (Sign Out)](#module-8-đăng-xuất-sign-out) | 4 |
| [Module 9: Database Triggers — Cascade Delete](#module-9-database-triggers--cascade-delete) | 8 |
| [Module 10: Bảo mật & RLS](#module-10-bảo-mật--rls) | 8 |
| **Tổng cộng** | **89** |

---

## Tài khoản test

| Vai trò | Email | Mật khẩu | Mã GT |
|:---|:---|:---|:---|
| **Admin** | `hieunhan.2709@gmail.com` | `@LHNhan27092005` | `R2KUJTEO` |
| **User 1** | `nguyenhoanglong.bank@gmail.com` | `Password@123` | `G1KWQN43` |
| **User 2** | `tranthithuha.fin@gmail.com` | `Password@123` | `C4HMYX0L` |
| **User 5** | `dangquocbao.tech@gmail.com` | `Password@123` | `RTDK4G69` |

---

## Module 1: Đăng nhập (Login)

| TC-ID | Tên testcase | Precondition | Bước thực hiện | Dữ liệu test | Kết quả mong đợi | Mức độ |
|:---:|:---|:---|:---|:---|:---|:---:|
| TC-01 | Đăng nhập Admin thành công | Ở trang Login | 1. Nhập email Admin<br>2. Nhập mật khẩu đúng<br>3. Nhấn "Đăng nhập ngay" | Email: `hieunhan.2709@gmail.com`<br>Pass: `@LHNhan27092005` | Chuyển sang giao diện **Admin Dashboard** với badge "Admin Portal" và bảng danh sách tài khoản | Critical |
| TC-02 | Đăng nhập User thành công | Ở trang Login | 1. Nhập email User<br>2. Nhập mật khẩu đúng<br>3. Nhấn "Đăng nhập ngay" | Email: `nguyenhoanglong.bank@gmail.com`<br>Pass: `Password@123` | Chuyển sang giao diện **User Dashboard** với badge "Khách hàng cá nhân" và thông tin hồ sơ | Critical |
| TC-03 | Đăng nhập với email sai | Ở trang Login | 1. Nhập email không tồn tại<br>2. Nhập mật khẩu bất kỳ<br>3. Nhấn "Đăng nhập ngay" | Email: `khongtontai@gmail.com`<br>Pass: `123456` | Hiển thị Toast lỗi "Invalid login credentials" | High |
| TC-04 | Đăng nhập với mật khẩu sai | Ở trang Login | 1. Nhập email đúng<br>2. Nhập mật khẩu sai<br>3. Nhấn "Đăng nhập ngay" | Email: `nguyenhoanglong.bank@gmail.com`<br>Pass: `SaiMatKhau` | Hiển thị Toast lỗi "Invalid login credentials" | High |
| TC-05 | Đăng nhập với email trống | Ở trang Login | 1. Để trống email<br>2. Nhập mật khẩu<br>3. Nhấn "Đăng nhập ngay" | Email: (trống)<br>Pass: `123456` | Hiển thị lỗi validation "Email không được để trống" | Medium |
| TC-06 | Đăng nhập với mật khẩu trống | Ở trang Login | 1. Nhập email<br>2. Để trống mật khẩu<br>3. Nhấn "Đăng nhập ngay" | Email: `test@test.com`<br>Pass: (trống) | Hiển thị lỗi validation "Mật khẩu không được để trống" | Medium |
| TC-07 | Đăng nhập với mật khẩu < 6 ký tự | Ở trang Login | 1. Nhập email<br>2. Nhập mật khẩu 5 ký tự<br>3. Nhấn "Đăng nhập ngay" | Email: `test@test.com`<br>Pass: `12345` | Hiển thị lỗi validation "Mật khẩu phải ít nhất 6 ký tự" | Medium |
| TC-08 | Chuyển tab Login ↔ Đăng ký | Ở trang Login | 1. Nhấn tab "Đăng ký tài khoản"<br>2. Nhấn tab "Đăng nhập" | — | Form chuyển đổi đúng, clear error/success message, hiện/ẩn trường đăng ký đúng | Low |
| TC-09 | Button disabled khi đang loading | Ở trang Login | 1. Nhập đúng thông tin<br>2. Nhấn "Đăng nhập ngay"<br>3. Quan sát button khi đang chờ | Email/Pass hợp lệ | Button chuyển text "Đang xử lý..." và disabled, không thể nhấn lại | Medium |
| TC-10 | Giữ session khi reload trang | Đã đăng nhập thành công | 1. Reload trình duyệt (F5) | — | Vẫn ở dashboard tương ứng (Admin/User), không bị văng ra Login | High |

---

## Module 2: Đăng ký tài khoản (Register)

| TC-ID | Tên testcase | Precondition | Bước thực hiện | Dữ liệu test | Kết quả mong đợi | Mức độ |
|:---:|:---|:---|:---|:---|:---|:---:|
| TC-11 | Đăng ký thành công (không có mã GT) | Ở tab Đăng ký | 1. Nhập đầy đủ thông tin hợp lệ<br>2. Bỏ trống mã GT<br>3. Nhấn "Hoàn tất đăng ký" | Email: `testuser.new@gmail.com`<br>Pass: `Test@123`<br>Tên: `Nguyen Van Test`<br>CCCD: `079200123456`<br>SĐT: `0912000001`<br>Địa chỉ: `123 Đường ABC, Q.1, TP.HCM` | Toast xanh "Đăng ký thành công!", form reset, chuyển về tab Login | Critical |
| TC-12 | Đăng ký thành công (có mã GT hợp lệ) | Ở tab Đăng ký | 1. Nhập đầy đủ thông tin<br>2. Nhập mã GT hợp lệ (8 ký tự, tồn tại trong hệ thống)<br>3. Nhấn "Hoàn tất đăng ký" | Mã GT: `R2KUJTEO` (của Admin) + thông tin hợp lệ | Đăng ký thành công, `ma_nguoi_gioi_thieu` trong DB = `R2KUJTEO` | Critical |
| TC-13 | Đăng ký với email đã tồn tại | Ở tab Đăng ký | 1. Nhập email đã đăng ký<br>2. Nhập đầy đủ thông tin khác<br>3. Nhấn "Hoàn tất đăng ký" | Email: `nguyenhoanglong.bank@gmail.com` | Hiển thị lỗi từ Supabase (ví dụ: "User already registered") | High |
| TC-14 | Validate: Họ tên < 2 ký tự | Ở tab Đăng ký | 1. Nhập họ tên 1 ký tự<br>2. Nhấn submit | Tên: `A` | Lỗi "Họ tên phải ít nhất 2 ký tự" | Medium |
| TC-15 | Validate: CCCD không đủ 12 số | Ở tab Đăng ký | 1. Nhập CCCD 11 chữ số<br>2. Nhấn submit | CCCD: `07920012345` (11 số) | Lỗi "CCCD phải đúng 12 chữ số" | Medium |
| TC-16 | Validate: CCCD chứa chữ cái | Ở tab Đăng ký | 1. Nhập CCCD có ký tự chữ<br>2. Nhấn submit | CCCD: `0792001234AB` | Lỗi "CCCD phải đúng 12 chữ số" | Medium |
| TC-17 | Validate: SĐT không bắt đầu bằng 0 | Ở tab Đăng ký | 1. Nhập SĐT bắt đầu bằng số khác 0<br>2. Nhấn submit | SĐT: `1912345678` | Lỗi "Số điện thoại phải gồm 10 số, bắt đầu bằng 0" | Medium |
| TC-18 | Validate: SĐT không đủ 10 số | Ở tab Đăng ký | 1. Nhập SĐT 9 chữ số<br>2. Nhấn submit | SĐT: `091234567` | Lỗi "Số điện thoại phải gồm 10 số, bắt đầu bằng 0" | Medium |
| TC-19 | Validate: Địa chỉ < 5 ký tự | Ở tab Đăng ký | 1. Nhập địa chỉ quá ngắn<br>2. Nhấn submit | Địa chỉ: `ABC` | Lỗi "Địa chỉ phải ít nhất 5 ký tự" | Medium |
| TC-20 | Validate: Mã GT không đúng 8 ký tự | Ở tab Đăng ký | 1. Nhập mã GT 5 ký tự<br>2. Nhấn submit | Mã GT: `ABCDE` | Lỗi "Mã người giới thiệu phải gồm đúng 8 ký tự" | Medium |
| TC-21 | Mã GT tự chuyển uppercase | Ở tab Đăng ký | 1. Nhập mã GT bằng chữ thường | Mã GT: `r2kujteo` | Input tự động chuyển thành `R2KUJTEO` | Low |
| TC-22 | maxLength trên các input | Ở tab Đăng ký | 1. Thử nhập quá ký tự tối đa cho CCCD (12), SĐT (10), Mã GT (8) | CCCD: `0792001234569999` | Input chỉ nhận tối đa ký tự cho phép | Low |
| TC-23 | Đăng ký với mã GT không tồn tại | Ở tab Đăng ký | 1. Nhập mã GT 8 ký tự nhưng không tồn tại<br>2. Submit | Mã GT: `ZZZZZZZZ` | Đăng ký thành công nhưng `ma_nguoi_gioi_thieu` trong DB = NULL (bị trigger bỏ qua) | Medium |
| TC-24 | Đăng ký không nhập required fields | Ở tab Đăng ký | 1. Bỏ trống tất cả<br>2. Nhấn submit | (tất cả trống) | Validation bắt lỗi trường đầu tiên trống | Medium |

---

## Module 3: User Dashboard — Xem thông tin

| TC-ID | Tên testcase | Precondition | Bước thực hiện | Dữ liệu test | Kết quả mong đợi | Mức độ |
|:---:|:---|:---|:---|:---|:---|:---:|
| TC-25 | Hiển thị đầy đủ thông tin hồ sơ | Đăng nhập User 1 | 1. Xem tab "Thông tin tài khoản" | — | Hiển thị đúng: Họ tên, CCCD, SĐT, Địa chỉ, Mã GT, Người GT, Ngày kích hoạt | Critical |
| TC-26 | Hiển thị badge "Khách hàng cá nhân" | Đăng nhập User | 1. Xem top navigation bar | — | Badge hiển thị chấm xanh + text "Khách hàng cá nhân" | Low |
| TC-27 | Hiển thị mã giới thiệu cá nhân | Đăng nhập User 1 | 1. Xem mục "Mã giới thiệu của tôi" | — | Mã `G1KWQN43` hiển thị đúng, có nút "Sao chép" | High |
| TC-28 | Sao chép mã giới thiệu | Đăng nhập User 1 | 1. Nhấn nút "Sao chép"<br>2. Dán vào notepad | — | Button chuyển "✓ Đã chép", clipboard chứa mã đúng, button revert sau 2.5s | Medium |
| TC-29 | Hiển thị người giới thiệu (đã liên kết) | Đăng nhập User 2 (có `ma_nguoi_gioi_thieu = G1KWQN43`) | 1. Xem mục "Người giới thiệu" | — | Hiển thị mã `G1KWQN43` + badge "Đã liên kết • Cố định" | High |
| TC-30 | Hiển thị box nhập mã GT (chưa liên kết) | Đăng nhập User chưa có mã người GT | 1. Xem tab "Thông tin tài khoản" | — | Hiển thị box "🎁 Nhập mã người giới thiệu" với form input và nút "Xác nhận liên kết" | High |
| TC-31 | Ẩn box nhập mã GT (đã liên kết) | Đăng nhập User đã có mã người GT | 1. Xem tab "Thông tin tài khoản" | — | Không hiển thị box nhập mã GT, chỉ hiện badge "Đã liên kết • Cố định" | Medium |

---

## Module 4: User Dashboard — Chỉnh sửa thông tin

| TC-ID | Tên testcase | Precondition | Bước thực hiện | Dữ liệu test | Kết quả mong đợi | Mức độ |
|:---:|:---|:---|:---|:---|:---|:---:|
| TC-32 | Cập nhật họ tên thành công | Đăng nhập User, tab "Chỉnh sửa" | 1. Sửa họ tên<br>2. Nhấn "Lưu thay đổi" | Tên mới: `Nguyễn Hoàng Long 2` | Toast xanh "Cập nhật thông tin tài khoản thành công!", chuyển về tab Info, tên cập nhật | Critical |
| TC-33 | Cập nhật SĐT thành công | Đăng nhập User, tab "Chỉnh sửa" | 1. Sửa SĐT<br>2. Nhấn "Lưu thay đổi" | SĐT mới: `0999888777` | Cập nhật thành công, SĐT mới hiển thị đúng | High |
| TC-34 | Cập nhật địa chỉ thành công | Đăng nhập User, tab "Chỉnh sửa" | 1. Sửa địa chỉ<br>2. Nhấn "Lưu thay đổi" | Địa chỉ: `456 Đường DEF, Q.2, TP.HCM` | Cập nhật thành công, địa chỉ mới hiển thị đúng | High |
| TC-35 | CCCD bị disabled (không thể sửa) | Đăng nhập User, tab "Chỉnh sửa" | 1. Quan sát trường CCCD | — | Input CCCD disabled, opacity giảm, cursor `not-allowed`, không nhập được | Critical |
| TC-36 | Validate: Họ tên < 2 ký tự | Tab "Chỉnh sửa" | 1. Xóa bớt để họ tên < 2 ký tự<br>2. Nhấn "Lưu" | Tên: `A` | Lỗi "Họ tên phải ít nhất 2 ký tự" | Medium |
| TC-37 | Validate: SĐT sai format | Tab "Chỉnh sửa" | 1. Nhập SĐT sai<br>2. Nhấn "Lưu" | SĐT: `123456789` | Lỗi "Số điện thoại phải 10 số, bắt đầu bằng 0" | Medium |
| TC-38 | Validate: Địa chỉ < 5 ký tự | Tab "Chỉnh sửa" | 1. Nhập địa chỉ ngắn<br>2. Nhấn "Lưu" | Địa chỉ: `AB` | Lỗi "Địa chỉ phải ít nhất 5 ký tự" | Medium |
| TC-39 | Nút "Hủy bỏ" reset form | Tab "Chỉnh sửa" | 1. Sửa tất cả trường<br>2. Nhấn "Hủy bỏ" | — | Quay về tab Info, dữ liệu gốc không thay đổi | Medium |
| TC-40 | Prefill dữ liệu khi vào tab Edit | Đăng nhập User | 1. Nhấn tab "Chỉnh sửa thông tin" | — | Các trường Họ tên, SĐT, Địa chỉ được fill sẵn từ dữ liệu hiện tại | Medium |
| TC-41 | Button loading khi đang lưu | Tab "Chỉnh sửa" | 1. Nhấn "Lưu thay đổi" | Dữ liệu hợp lệ | Button chuyển "Đang lưu thay đổi...", disabled trong khi chờ API | Low |

---

## Module 5: User Dashboard — Đổi mật khẩu

| TC-ID | Tên testcase | Precondition | Bước thực hiện | Dữ liệu test | Kết quả mong đợi | Mức độ |
|:---:|:---|:---|:---|:---|:---|:---:|
| TC-42 | Đổi mật khẩu thành công | Tab "Đổi mật khẩu" | 1. Nhập mật khẩu mới ≥ 6 ký tự<br>2. Nhập xác nhận trùng khớp<br>3. Nhấn "Cập nhật mật khẩu" | New: `NewPass@456`<br>Confirm: `NewPass@456` | Toast xanh "Đổi mật khẩu thành công!", chuyển về tab Info, form reset | Critical |
| TC-43 | Đăng nhập lại bằng mật khẩu mới | Đã đổi mật khẩu thành công (TC-42) | 1. Đăng xuất<br>2. Đăng nhập bằng mật khẩu mới | Pass: `NewPass@456` | Đăng nhập thành công | Critical |
| TC-44 | Đăng nhập bằng mật khẩu cũ thất bại | Đã đổi mật khẩu thành công (TC-42) | 1. Đăng xuất<br>2. Đăng nhập bằng mật khẩu cũ | Pass: `Password@123` | Lỗi "Invalid login credentials" | High |
| TC-45 | Validate: Mật khẩu mới < 6 ký tự | Tab "Đổi mật khẩu" | 1. Nhập mật khẩu 5 ký tự<br>2. Submit | New: `12345`<br>Confirm: `12345` | Lỗi "Mật khẩu mới phải ít nhất 6 ký tự" | Medium |
| TC-46 | Validate: Xác nhận không khớp | Tab "Đổi mật khẩu" | 1. Nhập MK mới và xác nhận khác nhau<br>2. Submit | New: `NewPass1`<br>Confirm: `NewPass2` | Lỗi "Mật khẩu xác nhận không khớp" | Medium |
| TC-47 | Nút "Hủy bỏ" reset form | Tab "Đổi mật khẩu" | 1. Nhập mật khẩu mới<br>2. Nhấn "Hủy bỏ" | — | Quay về tab Info, form password cleared | Medium |
| TC-48 | Clear form khi chuyển sang tab Password | Tab Info | 1. Chuyển sang tab "Đổi mật khẩu" | — | Cả 2 input password đều trống, error/success cleared | Low |
| TC-49 | Button loading khi đang cập nhật | Tab "Đổi mật khẩu" | 1. Submit form hợp lệ | Dữ liệu hợp lệ | Button text "Đang cập nhật...", disabled | Low |

---

## Module 6: Hệ thống Mã giới thiệu (Referral)

| TC-ID | Tên testcase | Precondition | Bước thực hiện | Dữ liệu test | Kết quả mong đợi | Mức độ |
|:---:|:---|:---|:---|:---|:---|:---:|
| TC-50 | Liên kết mã GT hợp lệ thành công | User chưa có mã người GT | 1. Nhập mã GT 8 ký tự hợp lệ<br>2. Nhấn "Xác nhận liên kết" | Mã: `R2KUJTEO` (Admin) | Toast xanh "Liên kết người giới thiệu (Lê Hiếu Nhân) thành công!", box nhập biến mất, badge "Đã liên kết • Cố định" xuất hiện | Critical |
| TC-51 | Không thể thay đổi mã GT sau khi liên kết | User đã có mã người GT | 1. Kiểm tra giao diện tab Info | — | Không có form nhập mã GT, chỉ hiển thị mã đã liên kết + badge "Cố định" | Critical |
| TC-52 | Nhập mã GT không tồn tại | User chưa có mã người GT | 1. Nhập mã 8 ký tự không tồn tại<br>2. Nhấn "Xác nhận liên kết" | Mã: `ZZZZZZZZ` | Lỗi "Mã người giới thiệu không tồn tại trên hệ thống" | High |
| TC-53 | Nhập mã GT của chính mình | User chưa có mã người GT | 1. Nhập chính mã GT cá nhân<br>2. Nhấn "Xác nhận liên kết" | User 1 nhập `G1KWQN43` (mã của chính mình) | Lỗi "Không thể tự nhập mã giới thiệu của chính mình" | High |
| TC-54 | Validate: Mã GT trống | User chưa có mã người GT | 1. Để trống input mã GT<br>2. Nhấn "Xác nhận liên kết" | Mã: (trống) | Lỗi "Vui lòng nhập mã giới thiệu của người khác" hoặc button disabled | Medium |
| TC-55 | Validate: Mã GT ≠ 8 ký tự | User chưa có mã người GT | 1. Nhập mã < 8 ký tự<br>2. Nhấn "Xác nhận liên kết" | Mã: `ABC` | Lỗi "Mã giới thiệu phải gồm đúng 8 ký tự" | Medium |
| TC-56 | Input mã GT tự chuyển uppercase | User chưa có mã người GT | 1. Nhập mã bằng chữ thường | Mã: `r2kujteo` | Input tự động hiển thị `R2KUJTEO` | Low |
| TC-57 | maxLength = 8 trên input mã GT | User chưa có mã người GT | 1. Cố nhập > 8 ký tự | Mã: `R2KUJTEO999` | Chỉ nhập được tối đa 8 ký tự | Low |
| TC-58 | DB trigger: Không thể UPDATE mã GT cá nhân | Đã có mã GT cá nhân | 1. Cố sửa `ma_gioi_thieu` qua SQL Editor | SQL: `UPDATE bank_profiles SET ma_gioi_thieu = 'NEWCODE1' WHERE ...` | DB throw exception "Mã giới thiệu của tài khoản là cố định và không thể thay đổi" | Critical |
| TC-59 | DB trigger: Không thể UPDATE mã người GT đã liên kết | Đã liên kết mã người GT | 1. Cố sửa `ma_nguoi_gioi_thieu` qua SQL Editor | SQL: `UPDATE bank_profiles SET ma_nguoi_gioi_thieu = 'NEWCODE2' WHERE ...` | DB throw exception "Mã người giới thiệu đã được liên kết và không thể thay đổi" | Critical |
| TC-60 | Verify referral code (RPC) — mã hợp lệ | — | 1. Gọi `verify_referral_code('R2KUJTEO')` | Mã: `R2KUJTEO` | Trả về `{valid: true, owner_name: "Lê Hiếu Nhân", code: "R2KUJTEO"}` | High |
| TC-61 | Verify referral code (RPC) — mã sai định dạng | — | 1. Gọi `verify_referral_code('AB')` | Mã: `AB` | Trả về `{valid: false, message: "Mã giới thiệu phải gồm đúng 8 ký tự"}` | Medium |

---

## Module 7: Admin Dashboard

| TC-ID | Tên testcase | Precondition | Bước thực hiện | Dữ liệu test | Kết quả mong đợi | Mức độ |
|:---:|:---|:---|:---|:---|:---|:---:|
| TC-62 | Hiển thị danh sách 15 tài khoản | Đăng nhập Admin | 1. Xem bảng "Danh sách tài khoản khách hàng" | — | Bảng hiển thị 15 dòng (1 Admin + 14 User) với đầy đủ cột: STT, Họ tên, CCCD, SĐT, Địa chỉ, Mã cá nhân, Người GT, Ngày ĐK | Critical |
| TC-63 | Stats bar hiển thị đúng số lượng | Đăng nhập Admin | 1. Xem Stats bar phía trên | — | "Tổng số tài khoản đã mở" = 15, "Kết quả đang lọc" = 15 | High |
| TC-64 | Tìm kiếm theo tên | Đăng nhập Admin | 1. Gõ "Nguyễn" vào ô tìm kiếm | Search: `Nguyễn` | Bảng chỉ hiện các row có tên chứa "Nguyễn", stat "Kết quả đang lọc" cập nhật | High |
| TC-65 | Tìm kiếm theo CCCD | Đăng nhập Admin | 1. Gõ "079205027909" vào ô tìm kiếm | Search: `079205027909` | Bảng chỉ hiện 1 row Admin (Lê Hiếu Nhân) | High |
| TC-66 | Tìm kiếm theo SĐT | Đăng nhập Admin | 1. Gõ "0912345678" | Search: `0912345678` | Bảng chỉ hiện 1 row (Nguyễn Hoàng Long) | Medium |
| TC-67 | Tìm kiếm theo mã GT | Đăng nhập Admin | 1. Gõ "R2KUJTEO" | Search: `R2KUJTEO` | Hiện Admin + các user có `ma_nguoi_gioi_thieu = R2KUJTEO` | Medium |
| TC-68 | Nút "Xóa bộ lọc" | Đăng nhập Admin, đã nhập tìm kiếm | 1. Nhấn "Xóa bộ lọc" | — | Ô tìm kiếm trống, bảng hiện đầy đủ 15 dòng, nút "Xóa bộ lọc" biến mất | Medium |
| TC-69 | Nút "Làm mới dữ liệu" | Đăng nhập Admin | 1. Nhấn "Làm mới dữ liệu" | — | Button text "Đang tải...", bảng reload, dữ liệu cập nhật mới nhất | Medium |

---

## Module 8: Đăng xuất (Sign Out)

| TC-ID | Tên testcase | Precondition | Bước thực hiện | Dữ liệu test | Kết quả mong đợi | Mức độ |
|:---:|:---|:---|:---|:---|:---|:---:|
| TC-70 | Đăng xuất từ User Dashboard | Đăng nhập User | 1. Nhấn "Đăng xuất" | — | Quay về trang Login, session bị xóa | Critical |
| TC-71 | Đăng xuất từ Admin Dashboard | Đăng nhập Admin | 1. Nhấn "Đăng xuất" | — | Quay về trang Login, session bị xóa | Critical |
| TC-72 | Không truy cập được Dashboard sau khi đăng xuất | Đã đăng xuất | 1. Reload trang | — | Hiển thị trang Login, không hiện Dashboard | High |
| TC-73 | Đăng nhập lại sau khi đăng xuất | Đã đăng xuất | 1. Đăng nhập lại bằng tài khoản cũ | Thông tin đăng nhập hợp lệ | Đăng nhập thành công, vào đúng Dashboard | Medium |

---

## Module 9: Database Triggers — Cascade Delete

| TC-ID | Tên testcase | Precondition | Bước thực hiện | Dữ liệu test | Kết quả mong đợi | Mức độ |
|:---:|:---|:---|:---|:---|:---|:---:|
| TC-74 | Xóa bank_profile → xóa auth.users | User test tồn tại, không ai dùng mã GT | 1. `DELETE FROM public.bank_profiles WHERE user_id = '<user_id>';` | User test không có ai tham chiếu mã GT | `bank_profiles` row bị xóa + `auth.users` row tương ứng cũng bị xóa | Critical |
| TC-75 | Xóa auth.users → xóa bank_profiles | User test tồn tại, không ai dùng mã GT | 1. `DELETE FROM auth.users WHERE id = '<user_id>';` | User test không có ai tham chiếu mã GT | `auth.users` row bị xóa + `bank_profiles` row tương ứng cũng bị xóa | Critical |
| TC-76 | Xóa user có người khác dùng mã GT (từ bank_profiles) | User A có mã GT `XXXX`, User B có `ma_nguoi_gioi_thieu = XXXX` | 1. `DELETE FROM public.bank_profiles WHERE user_id = '<user_A_id>';` | User A có referral đang được dùng | User B `ma_nguoi_gioi_thieu` → NULL, User A bị xóa hoàn toàn (cả 2 bảng) | Critical |
| TC-77 | Xóa user có người khác dùng mã GT (từ auth.users) | User A có mã GT `XXXX`, User B có `ma_nguoi_gioi_thieu = XXXX` | 1. `DELETE FROM auth.users WHERE id = '<user_A_id>';` | User A có referral đang được dùng | User B `ma_nguoi_gioi_thieu` → NULL, User A bị xóa hoàn toàn (cả 2 bảng) | Critical |
| TC-78 | Không xảy ra infinite loop | 2 user tồn tại | 1. Xóa 1 user bằng cách xóa `bank_profiles`<br>2. Xóa 1 user bằng cách xóa `auth.users` | — | Cả 2 thao tác đều hoàn thành không lỗi, không timeout, không loop | Critical |
| TC-79 | Xóa nhiều user liên tiếp | Nhiều user test | 1. Xóa 3 user liên tiếp | — | Tất cả đều xóa thành công, referral references được clear đúng | High |
| TC-80 | Xóa user có nhiều người dùng mã GT | User A có mã GT, User B + C + D đều dùng mã của A | 1. Xóa User A | — | B, C, D tất cả `ma_nguoi_gioi_thieu` → NULL, A bị xóa hoàn toàn | High |
| TC-81 | Verify sau delete: Dữ liệu sạch | Đã xóa user | 1. `SELECT * FROM auth.users WHERE id = '<deleted_id>';`<br>2. `SELECT * FROM public.bank_profiles WHERE user_id = '<deleted_id>';` | — | Cả 2 query đều trả về 0 rows | High |

---

## Module 10: Bảo mật & RLS

| TC-ID | Tên testcase | Precondition | Bước thực hiện | Dữ liệu test | Kết quả mong đợi | Mức độ |
|:---:|:---|:---|:---|:---|:---|:---:|
| TC-82 | User chỉ xem được hồ sơ của mình | Đăng nhập User 1 | 1. Gọi API lấy bank_profiles | — | Chỉ trả về 1 record (của chính mình), không xem được user khác | Critical |
| TC-83 | Admin xem được tất cả hồ sơ | Đăng nhập Admin | 1. Gọi API lấy bank_profiles (getAllProfiles) | — | Trả về tất cả 15 records | Critical |
| TC-84 | User không thể sửa hồ sơ user khác | Đăng nhập User 1 | 1. Gọi API update với id của User 2 | — | Request thất bại hoặc 0 rows updated (RLS chặn) | Critical |
| TC-85 | Anon key không đọc được bank_profiles | Không đăng nhập | 1. Gọi REST API `/rest/v1/bank_profiles` với chỉ anon key | — | Trả về mảng rỗng `[]` hoặc lỗi permission (RLS chặn) | Critical |
| TC-86 | User không thể tự sửa vai trò thành Admin | Đăng nhập User | 1. Gọi `supabase.auth.updateUser({ data: { role: 'admin' } })` | — | `user_metadata` có thể thay đổi nhưng `app_metadata.role` **không** thay đổi (role chỉ nằm trong `app_metadata`) | Critical |
| TC-87 | SECURITY DEFINER functions không callable trực tiếp | — | 1. Từ client gọi `supabase.rpc('handle_bank_profile_deleted')`<br>2. Từ client gọi `supabase.rpc('handle_auth_user_deleted')` | — | Permission denied — đã REVOKE EXECUTE | High |
| TC-88 | User chỉ insert profile cho chính mình | Đăng nhập User | 1. Gọi API insert bank_profiles với `user_id` của user khác | — | RLS chặn: `WITH CHECK` vi phạm | High |
| TC-89 | Footer hiển thị đúng | Bất kỳ trang nào | 1. Cuộn xuống cuối trang | — | Hiển thị "APEX BANKING • SECURE CORE PLATFORM v1.0" | Low |

---

## 📊 Tổng hợp theo mức độ ưu tiên

| Mức độ | Số lượng | Tỷ lệ |
|:---|:---:|:---:|
| 🔴 **Critical** | 26 | 29.2% |
| 🟠 **High** | 22 | 24.7% |
| 🟡 **Medium** | 28 | 31.5% |
| 🟢 **Low** | 13 | 14.6% |
| **Tổng** | **89** | **100%** |
