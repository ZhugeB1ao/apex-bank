import { useState, useEffect } from "react";
import { signOut, changePassword } from "../services/auth";
import { getMyProfile, updateProfile } from "../services/profile";
import type { BankProfile } from "../types/bank-profile";

export default function UserDashboard() {
  const [profile, setProfile] = useState<BankProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editHoTen, setEditHoTen] = useState("");
  const [editSdt, setEditSdt] = useState("");
  const [editDiaChi, setEditDiaChi] = useState("");
  const [editMaGioiThieu, setEditMaGioiThieu] = useState("");

  // Change password
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        setEditMaGioiThieu(data.ma_gioi_thieu || "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải thông tin");
    } finally {
      setLoading(false);
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
      const updated = await updateProfile(profile.id, {
        ho_ten: editHoTen.trim(),
        sdt: editSdt.trim(),
        dia_chi: editDiaChi.trim(),
        ma_gioi_thieu: editMaGioiThieu.trim() || null,
      });
      setProfile(updated);
      setEditing(false);
      setSuccess("Cập nhật thông tin tài khoản thành công!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật thất bại");
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
      await changePassword(newPassword);
      setSuccess("Đổi mật khẩu thành công!");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đổi mật khẩu thất bại");
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

      {error && (
        <div className="alert alert-danger">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>✅</span>
          <span>{success}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="fintech-card">
        <div className="fintech-card-header">
          <div>
            <h2 className="fintech-card-title">{profile.ho_ten}</h2>
            <p className="fintech-card-desc">Tài khoản xác thực eKYC • Đang hoạt động</p>
          </div>
          {!editing && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditing(true)}
              >
                Chỉnh sửa thông tin
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                {showPasswordForm ? "Đóng đổi mật khẩu" : "Đổi mật khẩu"}
              </button>
            </div>
          )}
        </div>

        {!editing ? (
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

            <div className="data-item">
              <div className="data-label">Mã giới thiệu</div>
              <div className="data-value mono">{profile.ma_gioi_thieu || "—"}</div>
            </div>

            <div className="data-item">
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
        ) : (
          <form onSubmit={handleUpdate} style={{ marginTop: "16px" }}>
            <div className="form-group">
              <label htmlFor="editHoTen">Họ và tên</label>
              <input
                id="editHoTen"
                type="text"
                value={editHoTen}
                onChange={(e) => setEditHoTen(e.target.value)}
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
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="editMaGioiThieu">Mã giới thiệu</label>
              <input
                id="editMaGioiThieu"
                type="text"
                className="input-mono"
                value={editMaGioiThieu}
                onChange={(e) => setEditMaGioiThieu(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <button type="submit" className="btn btn-primary">
                Lưu thay đổi
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditing(false);
                  setEditHoTen(profile.ho_ten);
                  setEditSdt(profile.sdt);
                  setEditDiaChi(profile.dia_chi);
                  setEditMaGioiThieu(profile.ma_gioi_thieu || "");
                }}
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Change Password Card */}
      {showPasswordForm && !editing && (
        <div className="fintech-card">
          <h3 className="fintech-card-title" style={{ fontSize: "16px", marginBottom: "6px" }}>
            Đổi mật khẩu đăng nhập
          </h3>
          <p className="fintech-card-desc" style={{ marginBottom: "20px" }}>
            Mật khẩu mới phải có tối thiểu 6 ký tự để đảm bảo an toàn.
          </p>

          <form onSubmit={handleChangePassword}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="newPassword">Mật khẩu mới</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
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
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button type="submit" className="btn btn-primary">
                Cập nhật mật khẩu
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setShowPasswordForm(false);
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                Đóng
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
