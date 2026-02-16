"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signin", email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "登入失敗");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "登入失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Theme/Language Switcher */}
      <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
        <ThemeSwitcher />
      </div>
      
      <div style={{ maxWidth: '400px', width: '100%' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary)', margin: 0 }}>🍽️ Open Purchase</h1>
          <p style={{ color: 'var(--muted)', marginTop: '8px' }}>登入你的帳戶</p>
        </div>

        {/* Login Form */}
        <div className="card" style={{ padding: '32px' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div style={{ 
                padding: '12px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                borderRadius: '8px' 
              }}>
                <p style={{ color: '#ef4444', fontSize: '14px', margin: 0 }}>{error}</p>
              </div>
            )}

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '8px',
                color: 'var(--foreground)'
              }}>
                電子郵件
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="輸入你的電子郵件"
                required
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '8px',
                color: 'var(--foreground)'
              }}>
                密碼
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="輸入你的密碼"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "登入中..." : "登入"}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--muted)', fontSize: '14px' }}>
            還沒有帳戶？{" "}
            <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: '500' }}>
              註冊
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
