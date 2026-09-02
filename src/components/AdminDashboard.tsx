import { useState, useEffect } from "react";
import { signOut } from "../services/auth";
import { getAllProfiles } from "../services/profile";
import type { BankProfile } from "../types/bank-profile";
import Toast from "./Toast";

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState<BankProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    try {
      setLoading(true);
      const data = await getAllProfiles();
      setProfiles(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể tải danh sách tài khoản"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng xuất thất bại");
    }
  }

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Top Header */}
      <div className="top-nav">
        <div className="brand-badge">
          <span className="brand-icon">A</span>
          <span>APEX BANKING • QUẢN TRỊ VIÊN</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="user-badge">
            <span className="status-dot"></span>
            <span>Admin Portal</span>
          </div>
          <button type="button" className="btn btn-ghost" onClick={handleSignOut}>
            Đăng xuất
          </button>
        </div>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError("")} />}

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-box">
          <div className="data-label">Tổng số tài khoản đã mở</div>
          <div className="stat-num">{profiles.length}</div>
        </div>
        <div className="stat-box">
          <div className="data-label">Kết quả đang lọc</div>
          <div className="stat-num">{filtered.length}</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="fintech-card">
        <div className="fintech-card-header">
          <div>
            <h2 className="fintech-card-title">Danh sách tài khoản khách hàng</h2>
            <p className="fintech-card-desc">
              Chế độ giám sát hệ thống ngân hàng tuân thủ quy định bảo mật
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadProfiles}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Làm mới dữ liệu"}
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm nhanh theo tên, số CCCD, SĐT, địa chỉ, mã cá nhân hoặc mã người giới thiệu..."
          />
          {search && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setSearch("")}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Data Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            Đang tải dữ liệu ngân hàng...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-dim)" }}>
            Không tìm thấy tài khoản ngân hàng nào khớp với tìm kiếm.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="fintech-table">
              <thead>
                <tr>
                  <th style={{ width: "48px" }}>STT</th>
                  <th>Họ và tên</th>
                  <th>Số CCCD</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ thường trú</th>
                  <th>Mã cá nhân</th>
                  <th>Người GT</th>
                  <th>Ngày đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id}>
                    <td className="table-mono" style={{ textAlign: "center" }}>
                      {i + 1}
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.ho_ten}</td>
                    <td className="table-mono">{p.cccd}</td>
                    <td className="table-mono">{p.sdt}</td>
                    <td style={{ maxWidth: "240px" }}>{p.dia_chi}</td>
                    <td className="table-mono" style={{ fontWeight: 600, color: "var(--accent)" }}>
                      {p.ma_gioi_thieu}
                    </td>
                    <td className="table-mono">
                      {p.ma_nguoi_gioi_thieu ? (
                        <span style={{ color: "var(--text-main)" }}>{p.ma_nguoi_gioi_thieu}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="table-mono">
                      {new Date(p.created_at).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
