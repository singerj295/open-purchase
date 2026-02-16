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
  FileText,
  ChevronLeft,
  Menu,
  Bell,
  Search,
} from "lucide-react";
import { useTheme } from "@/lib/i18n/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutInner>{children}</DashboardLayoutInner>;
}

function DashboardLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang } = useTheme() as { lang: "en" | "zh" };
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", labelZh: "儀表板", href: "/" },
    { icon: ShoppingCart, label: "Orders", labelZh: "訂單", href: "/orders" },
    { icon: Users, label: "Suppliers", labelZh: "供應商", href: "/suppliers" },
    { icon: Calculator, label: "Recipes", labelZh: "食譜", href: "/recipes" },
    { icon: Package, label: "Inventory", labelZh: "庫存", href: "/inventory" },
    { icon: FileText, label: "Reports", labelZh: "報告", href: "/reports" },
    { icon: BarChart3, label: "Analytics", labelZh: "分析", href: "/analytics" },
    { icon: Settings, label: "Settings", labelZh: "設定", href: "/settings" },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
        style={{ 
          background: 'var(--card-bg)',
          boxShadow: '2px 0 8px var(--shadow)'
        }}
      >
        {/* Logo */}
        <div 
          className="h-16 flex items-center justify-between px-4"
          style={{ borderBottom: '1px solid rgba(128,128,128,0.1)' }}
        >
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>🍽️ Open Purchase</h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2"
            style={{ borderRadius: '8px' }}
          >
            {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '12px',
                color: 'var(--foreground)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(45, 158, 109, 0.1)';
                e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--foreground)';
              }}
            >
              <item.icon size={20} />
              {!sidebarCollapsed && (
                <span>{lang === 'zh' ? item.labelZh : item.label}</span>
              )}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className="transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '64px' : '256px' }}
      >
        {/* Header */}
        <header 
          className="h-16 flex items-center justify-between px-6 sticky top-0 z-10"
          style={{ 
            background: 'var(--card-bg)',
            boxShadow: '0 2px 8px var(--shadow)'
          }}
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2"
                size={18}
                style={{ color: 'var(--muted)' }}
              />
              <input
                type="text"
                placeholder={lang === 'zh' ? "搜尋商品、供應商、訂單..." : "Search products, suppliers, orders..."}
                className="search-input"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <button 
              className="p-2"
              style={{ borderRadius: '12px' }}
            >
              <Bell size={20} />
            </button>
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 500,
                fontSize: '14px'
              }}
            >
              OP
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '24px' }}>{children}</div>
      </main>
    </div>
  );
}
