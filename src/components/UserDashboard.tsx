import { useState, useEffect } from "react";
import { signOut, changePassword } from "../services/auth";
import { getMyProfile, updateProfile, linkReferralCode, verifyReferralCode } from "../services/profile";
import type { BankProfile } from "../types/bank-profile";
import Toast from "./Toast";

type DashboardTab = "info" | "edit" | "password";

export default function UserDashboard() {
  const [profile, setProfile] = useState<BankProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Tab State: "info" | "edit" | "password"
  const [activeTab, setActiveTab] = useState<DashboardTab>("info");

  // Edit fields
  const [editHoTen, setEditHoTen] = useState("");
  const [editSdt, setEditSdt] = useState("");
  const [editDiaChi, setEditDiaChi] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Change password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Copy referral code state
  const [copied, setCopied] = useState(false);

  // Link inviter referral code state
  const [inputInviterCode, setInputInviterCode] = useState("");
  const [linkingInviter, setLinkingInviter] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfile(data);
      if (data) {
        setEditHoTen(data.ho_ten);
        setEditSdt(data.sdt);
        setEditDiaChi(data.dia_chi);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải thông tin");
    } finally {
      setLoading(false);
    }
  }

  function handleCopyCode() {
    if (!profile?.ma_gioi_thieu) return;
    navigator.clipboard.writeText(profile.ma_gioi_thieu);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function switchToEditTab() {
    if (profile) {
      setEditHoTen(profile.ho_ten);
      setEditSdt(profile.sdt);
      setEditDiaChi(profile.dia_chi);
    }
    setActiveTab("edit");
    setError("");
    setSuccess("");
  }

  function switchToPasswordTab() {
    setNewPassword("");
    setConfirmPassword("");
    setActiveTab("password");
    setError("");
    setSuccess("");
  }

  function switchToInfoTab() {
    setActiveTab("info");
    setError("");
    setSuccess("");
  }

  async function handleLinkInviter(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setError("");
    setSuccess("");

    const code = inputInviterCode.trim().toUpperCase();
    if (!code) {
      setError("Vui lòng nhập mã giới thiệu của người khác");
      return;
    }
    if (code.length !== 8) {
      setError("Mã giới thiệu phải gồm đúng 8 ký tự");
      return;
    }
    if (code === profile.ma_gioi_thieu) {
      setError("Không thể tự nhập mã giới thiệu của chính mình");
      return;
    }

    try {
      setLinkingInviter(true);
      // Verify first
      const verifyRes = await verifyReferralCode(code);
      if (!verifyRes.valid) {
        setError(verifyRes.message || "Mã người giới thiệu không hợp lệ");
        return;
      }

      const updated = await linkReferralCode(profile.id, code);
      setProfile(updated);
      setInputInviterCode("");
      setSuccess(`Liên kết người giới thiệu (${verifyRes.owner_name || code}) thành công! Mã đã được cố định.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Liên kết mã giới thiệu thất bại");
    } finally {
      setLinkingInviter(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setError("");
    setSuccess("");

    if (!editHoTen.trim() || editHoTen.trim().length < 2) {
      setError("Họ tên phải ít nhất 2 ký tự");
      return;
    }
    if (!/^0\d{9}$/.test(editSdt)) {
      setError("Số điện thoại phải 10 số, bắt đầu bằng 0");
      return;
    }
    if (!editDiaChi.trim() || editDiaChi.trim().length < 5) {
      setError("Địa chỉ phải ít nhất 5 ký tự");
      return;
    }

    try {
      setSavingProfile(true);
      const updated = await updateProfile(profile.id, {
        ho_ten: editHoTen.trim(),
        sdt: editSdt.trim(),
        dia_chi: editDiaChi.trim(),
      });
      setProfile(updated);
      setActiveTab("info");
      setSuccess("Cập nhật thông tin tài khoản thành công!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật thất bại");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setChangingPassword(true);
      await changePassword(newPassword);
      setSuccess("Đổi mật khẩu thành công!");
      setNewPassword("");
      setConfirmPassword("");
      setActiveTab("info");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đổi mật khẩu thất bại");
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng xuất thất bại");
    }
  }

  if (loading) {
    return (
      <div className="fintech-card" style={{ textAlign: "center", padding: "60px 20px" }}>
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Đang đồng bộ dữ liệu tài khoản...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="fintech-card" style={{ textAlign: "center", padding: "40px 20px" }}>
        <h2 className="fintech-card-title" style={{ marginBottom: "12px" }}>Chưa có hồ sơ ngân hàng</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
          Hồ sơ của bạn chưa được khởi tạo. Vui lòng liên hệ quản trị viên để được hỗ trợ.
        </p>
        <button type="button" className="btn btn-secondary" onClick={handleSignOut}>
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Top Header */}
      <div className="top-nav">
        <div className="brand-badge">
          <span className="brand-icon">A</span>
          <span>APEX BANKING</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="user-badge">
            <span className="status-dot"></span>
            <span>Khách hàng cá nhân</span>
          </div>
          <button type="button" className="btn btn-ghost" onClick={handleSignOut}>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* 3-second Auto-dismiss Toasts */}
      {error && <Toast message={error} type="error" onClose={() => setError("")} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess("")} />}

      {/* Segmented Control Tabs */}
      <div className="tab-switch">
        <button
          type="button"
          className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
          onClick={switchToInfoTab}
        >
          Thông tin tài khoản
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "edit" ? "active" : ""}`}
          onClick={switchToEditTab}
        >
          Chỉnh sửa thông tin
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
          onClick={switchToPasswordTab}
        >
          Đổi mật khẩu
        </button>
      </div>

      {/* TAB 1: THÔNG TIN TÀI KHOẢN */}
      {activeTab === "info" && (
        <>
          <div className="fintech-card">
            <div className="fintech-card-header">
              <div>
                <h2 className="fintech-card-title">{profile.ho_ten}</h2>
                <p className="fintech-card-desc">Tài khoản xác thực eKYC • Đang hoạt động</p>
              </div>
            </div>

            <div className="data-grid">
              <div className="data-item">
                <div className="data-label">Số CCCD / Định danh</div>
                <div className="data-value mono">{profile.cccd}</div>
              </div>

              <div className="data-item">
                <div className="data-label">Số điện thoại liên hệ</div>
                <div className="data-value mono">{profile.sdt}</div>
              </div>

              <div className="data-item" style={{ gridColumn: "1 / -1" }}>
                <div className="data-label">Địa chỉ cư trú thường trú</div>
                <div className="data-value">{profile.dia_chi}</div>
              </div>

              {/* User's Own Referral Code */}
              <div className="data-item">
                <div className="data-label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>Mã giới thiệu của tôi</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                  <span className="data-value mono" style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--accent)" }}>
                    {profile.ma_gioi_thieu}
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={handleCopyCode}
                    title="Sao chép mã giới thiệu"
                  >
                    {copied ? "✓ Đã chép" : "Sao chép"}
                  </button>
                </div>
              </div>

              {/* Inviter Referral Code */}
              <div className="data-item">
                <div className="data-label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>Người giới thiệu</span>
                  {profile.ma_nguoi_gioi_thieu && (
                    <span className="badge-tag locked">Đã liên kết • Cố định</span>
                  )}
                </div>
                <div style={{ marginTop: "4px" }}>
                  {profile.ma_nguoi_gioi_thieu ? (
                    <span className="data-value mono" style={{ fontSize: "15px", fontWeight: 600 }}>
                      {profile.ma_nguoi_gioi_thieu}
                    </span>
                  ) : (
                    <span style={{ color: "var(--text-dim)", fontSize: "13px" }}>
                      Chưa nhập mã người giới thiệu
                    </span>
                  )}
                </div>
              </div>

              <div className="data-item" style={{ gridColumn: "1 / -1" }}>
                <div className="data-label">Ngày kích hoạt tài khoản</div>
                <div className="data-value mono">
                  {new Date(profile.created_at).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Box Nhập Mã Người Giới Thiệu (Nếu chưa có mã người giới thiệu) */}
          {!profile.ma_nguoi_gioi_thieu && (
            <div className="fintech-card referral-card">
              <div>
                <h3 className="fintech-card-title" style={{ fontSize: "15px", marginBottom: "4px" }}>
                  🎁 Nhập mã người giới thiệu
                </h3>
                <p className="fintech-card-desc">
                  Nếu bạn được người khác giới thiệu mở tài khoản, hãy nhập mã 8 ký tự của họ tại đây. Lưu ý: Mã người giới thiệu chỉ nhập 1 lần duy nhất và không thể thay đổi sau khi liên kết.
                </p>
              </div>

              <form onSubmit={handleLinkInviter} style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="text"
                  className="input-mono"
                  placeholder="VD: HO6BI70X (8 ký tự)"
                  value={inputInviterCode}
                  onChange={(e) => setInputInviterCode(e.target.value.toUpperCase())}
                  maxLength={8}
                  style={{ maxWidth: "260px" }}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={linkingInviter || !inputInviterCode.trim()}
                >
                  {linkingInviter ? "Đang xác thực..." : "Xác nhận liên kết"}
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {/* TAB 2: CHỈNH SỬA THÔNG TIN */}
      {activeTab === "edit" && (
        <div className="fintech-card">
          <div className="fintech-card-header">
            <div>
              <h2 className="fintech-card-title">Chỉnh sửa thông tin tài khoản</h2>
              <p className="fintech-card-desc">Cập nhật họ tên, số điện thoại hoặc địa chỉ cư trú của bạn.</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} style={{ marginTop: "8px" }}>
            <div className="form-group">
              <label htmlFor="editHoTen">Họ và tên</label>
              <input
                id="editHoTen"
                type="text"
                value={editHoTen}
                onChange={(e) => setEditHoTen(e.target.value)}
                placeholder="Nhập họ và tên đầy đủ"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Số CCCD (Cố định theo quy định NH)</label>
                <input
                  type="text"
                  className="input-mono"
                  value={profile.cccd}
                  disabled
                  style={{ opacity: 0.6, cursor: "not-allowed" }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="editSdt">Số điện thoại</label>
                <input
                  id="editSdt"
                  type="text"
                  className="input-mono"
                  value={editSdt}
                  onChange={(e) => setEditSdt(e.target.value)}
                  placeholder="0xxxxxxxxx"
                  required
                  maxLength={10}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="editDiaChi">Địa chỉ cư trú</label>
              <input
                id="editDiaChi"
                type="text"
                value={editDiaChi}
                onChange={(e) => setEditDiaChi(e.target.value)}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP"
                required
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                {savingProfile ? "Đang lưu thay đổi..." : "Lưu thay đổi"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditHoTen(profile.ho_ten);
                  setEditSdt(profile.sdt);
                  setEditDiaChi(profile.dia_chi);
                  switchToInfoTab();
                }}
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: ĐỔI MẬT KHẨU */}
      {activeTab === "password" && (
        <div className="fintech-card">
          <div className="fintech-card-header">
            <div>
              <h2 className="fintech-card-title">Đổi mật khẩu đăng nhập</h2>
              <p className="fintech-card-desc">
                Mật khẩu mới phải có tối thiểu 6 ký tự để đảm bảo an toàn cho tài khoản ngân hàng.
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} style={{ marginTop: "8px" }}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="newPassword">Mật khẩu mới</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận lại mật khẩu</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <button type="submit" className="btn btn-primary" disabled={changingPassword}>
                {changingPassword ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setNewPassword("");
                  setConfirmPassword("");
                  switchToInfoTab();
                }}
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
