import { useState } from "react";
import { signIn, signUp } from "../services/auth";
import type { RegisterData } from "../types/bank-profile";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register extra fields
  const [hoTen, setHoTen] = useState("");
  const [cccd, setCccd] = useState("");
  const [sdt, setSdt] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [maGioiThieu, setMaGioiThieu] = useState("");

  function validate(): string | null {
    if (!email.trim()) return "Email không được để trống";
    if (!password.trim()) return "Mật khẩu không được để trống";
    if (password.length < 6) return "Mật khẩu phải ít nhất 6 ký tự";

    if (mode === "register") {
      if (!hoTen.trim() || hoTen.trim().length < 2)
        return "Họ tên phải ít nhất 2 ký tự";
      if (!/^\d{12}$/.test(cccd)) return "CCCD phải đúng 12 chữ số";
      if (!/^0\d{9}$/.test(sdt)) return "Số điện thoại phải gồm 10 số, bắt đầu bằng 0";
      if (!diaChi.trim() || diaChi.trim().length < 5)
        return "Địa chỉ phải ít nhất 5 ký tự";
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        const data: RegisterData = {
          email,
          password,
          hoTen: hoTen.trim(),
          cccd: cccd.trim(),
          sdt: sdt.trim(),
          diaChi: diaChi.trim(),
          maGioiThieu: maGioiThieu.trim() || undefined,
        };
        await signUp(data);
        setSuccess(
          "Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ."
        );
        resetForm();
        setMode("login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEmail("");
    setPassword("");
    setHoTen("");
    setCccd("");
    setSdt("");
    setDiaChi("");
    setMaGioiThieu("");
  }

  function switchMode(newMode: "login" | "register") {
    setMode(newMode);
    setError("");
    setSuccess("");
  }

  return (
    <div className="auth-wrapper">
      <div className="fintech-card">
        {/* Card Header with Brand Logo */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span className="brand-icon">A</span>
            <span style={{ fontWeight: 700, fontSize: "16px", letterSpacing: "-0.02em" }}>APEX CORE</span>
          </div>
          <h1 className="fintech-card-title">
            {mode === "login" ? "Đăng nhập hệ thống" : "Mở tài khoản ngân hàng"}
          </h1>
          <p className="fintech-card-desc">
            {mode === "login"
              ? "Truy cập tài khoản ngân hàng trực tuyến bảo mật"
              : "Đăng ký tài khoản trực tuyến chỉ trong vài phút"}
          </p>
        </div>

        {/* Segmented Tab Switch */}
        <div className="tab-switch">
          <button
            type="button"
            className={`tab-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className={`tab-btn ${mode === "register" ? "active" : ""}`}
            onClick={() => switchMode("register")}
          >
            Đăng ký tài khoản
          </button>
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="ten@vi-du.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {mode === "register" && (
            <>
              <div className="form-group">
                <label htmlFor="hoTen">Họ và tên</label>
                <input
                  id="hoTen"
                  type="text"
                  placeholder="NGUYEN VAN A"
                  value={hoTen}
                  onChange={(e) => setHoTen(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cccd">Số CCCD (12 số)</label>
                  <input
                    id="cccd"
                    type="text"
                    className="input-mono"
                    placeholder="012345678901"
                    value={cccd}
                    onChange={(e) => setCccd(e.target.value)}
                    required
                    maxLength={12}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sdt">Số điện thoại (10 số)</label>
                  <input
                    id="sdt"
                    type="text"
                    className="input-mono"
                    placeholder="0912345678"
                    value={sdt}
                    onChange={(e) => setSdt(e.target.value)}
                    required
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="diaChi">Địa chỉ cư trú</label>
                <input
                  id="diaChi"
                  type="text"
                  placeholder="Số nhà, Phường/Xã, Quận/Huyện, Tỉnh/TP"
                  value={diaChi}
                  onChange={(e) => setDiaChi(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="maGioiThieu">Mã giới thiệu (không bắt buộc)</label>
                <input
                  id="maGioiThieu"
                  type="text"
                  className="input-mono"
                  placeholder="APEX-9988"
                  value={maGioiThieu}
                  onChange={(e) => setMaGioiThieu(e.target.value)}
                />
              </div>
            </>
          )}

          <div style={{ marginTop: "24px" }}>
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading
                ? "Đang xử lý..."
                : mode === "login"
                  ? "Đăng nhập ngay"
                  : "Hoàn tất đăng ký"}
            </button>
          </div>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "12px", color: "var(--text-dim)" }}>
          <span>🔒 Mã hóa chuẩn ngân hàng 256-bit • Bảo mật tuyệt đối</span>
        </div>
      </div>
    </div>
  );
}
