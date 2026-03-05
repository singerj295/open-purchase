"use client";

import { useState } from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Eldon account - blank data
    if (email === "eldon@chta.one" && password === "0000") {
      const user = {
        id: "2",
        name: "Eldon",
        email: email,
        restaurantName: "My Restaurant",
        restaurantAddress: "Hong Kong",
      };
      localStorage.setItem('open-purchase-user', JSON.stringify(user));
      // Set session cookie for middleware
      document.cookie = 'session=true; path=/; max-age=86400';
      window.location.href = "/dashboard";
      return;
    }

    // Demo mode - direct login without API
    if (email === "demo@restaurant.com" && password === "demo") {
      const user = {
        id: "1",
        name: "Restaurant Owner",
        email: email,
        restaurantName: "My Restaurant",
        restaurantAddress: "123 Food Street, Hong Kong",
      };
      localStorage.setItem('open-purchase-user', JSON.stringify(user));
      // Set session cookie for middleware
      document.cookie = 'session=true; path=/; max-age=86400';
      // Use window.location for full page reload to ensure auth state is fresh
      window.location.href = "/dashboard";
      return;
    }

    // Real API login
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

      // Save user to localStorage
      const user = {
        id: data.data?.user?.id || "1",
        name: data.data?.user?.name || email.split('@')[0],
        email: email,
        restaurantName: "My Restaurant",
        restaurantAddress: "123 Food Street, Hong Kong",
      };
      localStorage.setItem('open-purchase-user', JSON.stringify(user));

      // Set session cookie for middleware
      document.cookie = 'session=true; path=/; max-age=86400';

      // Use window.location for full page reload
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "登入失敗");
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@restaurant.com");
    setPassword("demo");
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--background)'
    }}>
      {/* Theme/Language Switcher */}
      <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
        <ThemeSwitcher />
      </div>
      
      <div style={{ maxWidth: '400px', width: '100%', padding: '20px' }}>
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

          {/* Demo Login Button */}
          <div style={{ 
            marginTop: '20px', 
            paddingTop: '20px', 
            borderTop: '1px solid rgba(128,128,128,0.1)' 
          }}>
            <p style={{ 
              textAlign: 'center', 
              color: 'var(--muted)', 
              fontSize: '13px', 
              marginBottom: '12px' 
            }}>
              或者
            </p>
            <button
              onClick={handleDemoLogin}
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              🔐 試用 Demo 帳戶
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--muted)', fontSize: '14px' }}>
            還沒有帳戶？{" "}
            <span style={{ color: 'var(--primary)', fontWeight: '500', cursor: 'pointer' }}>
              註冊
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
