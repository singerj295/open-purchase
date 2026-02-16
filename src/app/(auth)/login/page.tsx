"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function LoginForm() {
  const { lang, t } = useLanguage();
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
        throw new Error(data.error || (lang === 'zh' ? "登入失敗" : "Login failed"));
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || (lang === 'zh' ? "登入失敗" : "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  const getText = (en: string, zh: string) => lang === 'zh' ? zh : en;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600">🍽️ Open Purchase</h1>
          <p className="text-gray-500 mt-2">{getText("Sign in to your account", "登入您的帳戶")}</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.auth.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.auth.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? getText("Signing in...", "登入中...") : t.auth.login}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              {getText("Don't have an account?", "還沒有帳戶？")}{" "}
              <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 font-medium">
                {t.auth.signUp}
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-sm text-emerald-700 font-medium mb-2">🎉 {getText("Demo Mode Available!", "演示模式可用！")}</p>
          <p className="text-xs text-emerald-600">
            {t.auth.email}: <code className="bg-emerald-100 px-1 rounded">demo@example.com</code>
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            {t.auth.password}: <code className="bg-emerald-100 px-1 rounded">demo123456</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <LanguageProvider>
      <LoginForm />
    </LanguageProvider>
  );
}
