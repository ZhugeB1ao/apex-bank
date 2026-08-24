import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { getRole } from "./services/auth";
import AuthForm from "./components/AuthForm";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import type { User } from "@supabase/supabase-js";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="app-container" style={{ alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          Khởi tạo hệ thống...
        </p>
      </div>
    );
  }

  const role = user ? getRole(user) : null;

  return (
    <div className="app-container">
      {!user ? (
        <AuthForm />
      ) : role === "admin" ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}

      <footer className="app-footer">
        APEX BANKING • SECURE CORE PLATFORM v1.0
      </footer>
    </div>
  );
}

export default App;
