"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  Settings,
  Calculator,
  ChevronLeft,
  Menu,
  Bell,
  Search,
} from "lucide-react";
import { LanguageProvider, useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function DashboardLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", labelZh: "儀表板", href: "/" },
    { icon: ShoppingCart, label: "Orders", labelZh: "訂單", href: "/orders" },
    { icon: Users, label: "Suppliers", labelZh: "供應商", href: "/suppliers" },
    { icon: Calculator, label: "Recipes", labelZh: "食譜", href: "/recipes" },
    { icon: Package, label: "Inventory", labelZh: "庫存", href: "/inventory" },
    { icon: BarChart3, label: "Analytics", labelZh: "分析", href: "/analytics" },
    { icon: Settings, label: "Settings", labelZh: "設定", href: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r shadow-sm transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-emerald-600">🍽️ Open Purchase</h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
            >
              <item.icon size={20} />
              {!sidebarCollapsed && <span>{lang === 'zh' ? item.labelZh : item.label}</span>}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={lang === 'zh' ? "搜尋商品、供應商、訂單..." : "Search products, suppliers, orders..."}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
              OP
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </LanguageProvider>
  );
}
