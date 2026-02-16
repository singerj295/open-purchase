"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function SignupForm() {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signup", email, password, name }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || (lang === 'zh' ? "註冊失敗" : "Signup failed"));
      }

      router.push("/login?message=check-email");
      router.refresh();
    } catch (err: any) {
      setError(err.message || (lang === 'zh' ? "註冊失敗" : "Signup failed"));
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
          <p className="text-gray-500 mt-2">{getText("Create your account", "創建您的帳戶")}</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.auth.name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                placeholder="John Smith"
                required
              />
            </div>

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
                minLength={8}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {getText("Minimum 8 characters", "最少8個字符")}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? getText("Creating account...", "創建帳戶中...") : getText("Create Account", "創建帳戶")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              {getText("Already have an account?", "已經有帳戶？")}{" "}
              <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                {t.auth.signIn}
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-gray-500">
          {getText("By creating an account, you agree to our", "創建帳戶即表示您同意我們的")}{" "}
          <a href="#" className="text-emerald-600 hover:underline">{getText("Terms of Service", "服務條款")}</a>
          {" "}{getText("and", "和")}{" "}
          <a href="#" className="text-emerald-600 hover:underline">{getText("Privacy Policy", "隱私政策")}</a>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return <SignupForm />;
}
