import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "error" | "success";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`alert alert-${type === "error" ? "danger" : "success"}`}
      role="alert"
    >
      <span className="alert-icon">{type === "error" ? "⚠️" : "✅"}</span>
      <span className="alert-message">{message}</span>
      <button
        type="button"
        className="alert-close-btn"
        onClick={onClose}
        aria-label="Đóng thông báo"
      >
        ×
      </button>
      <div
        className="alert-progress"
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
}
