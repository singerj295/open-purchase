"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Search,
  LogOut,
  User,
  Building,
} from "lucide-react";
import { useTheme } from "@/lib/i18n/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";

interface User {
  id: string;
  name: string;
  email: string;
  restaurantName: string;
  restaurantAddress: string;
}

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
  const router = useRouter();
  const theme = useTheme();
  const { lang } = theme as { lang: "en" | "zh" };
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setMounted(true);
    // Read user from localStorage synchronously on mount
    const savedUser = localStorage.getItem('open-purchase-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('open-purchase-user');
      }
    }
  }, []);

  // Auth check - redirect to login if not authenticated (only on client, after mount)
  useEffect(() => {
    if (mounted && !user) {
      // Check one more time
      const savedUser = localStorage.getItem('open-purchase-user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    }
  }, [mounted, user, router]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show loading state
  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--background)'
      }}>
        <p style={{ color: 'var(--muted)' }}>載入中...</p>
      </div>
    );
  }

  // Show loading while checking auth
  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--background)'
      }}>
        <p style={{ color: 'var(--muted)' }}>正在驗證...</p>
      </div>
    );
  }

  const isZh = lang === "zh";

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

  const handleLogout = () => {
    localStorage.removeItem('open-purchase-user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
        style={{ 
          background: 'var(--card-bg)',
          boxShadow: '2px 0 8px var(--shadow)',
          zIndex: 50,
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
            style={{ 
              padding: '8px', 
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
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
                textDecoration: 'none',
                transition: 'all 0.2s ease',
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
                <span>{isZh ? item.labelZh : item.label}</span>
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
          className="h-16 flex items-center justify-between px-6 sticky top-0 z-40"
          style={{ 
            background: 'var(--card-bg)',
            boxShadow: '0 2px 8px var(--shadow)',
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
                placeholder={isZh ? "搜尋..." : "Search..."}
                className="search-input"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            
            {/* User Menu */}
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                OP
              </button>
              
              {showUserMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    width: '240px',
                    background: 'var(--card-bg)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px var(--shadow)',
                    overflow: 'hidden',
                    zIndex: 100,
                  }}
                >
                  {/* User Info */}
                  <div style={{ padding: '16px', borderBottom: '1px solid rgba(128,128,128,0.1)' }}>
                    <p style={{ fontWeight: '600', margin: 0 }}>{user?.name || "User"}</p>
                    <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '4px 0 0 0' }}>{user?.email || ""}</p>
                  </div>
                  
                  {/* Menu Items */}
                  <div style={{ padding: '8px' }}>
                    <a
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        color: 'var(--foreground)',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(128,128,128,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <User size={18} />
                      <span>{isZh ? "個人資料" : "Profile"}</span>
                    </a>
                    
                    <a
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        color: 'var(--foreground)',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(128,128,128,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <Building size={18} />
                      <span>{isZh ? "餐廳資料" : "Restaurant"}</span>
                    </a>
                    
                    <div style={{ height: '1px', background: 'rgba(128,128,128,0.1)', margin: '8px 0' }} />
                    
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        color: '#ef4444',
                        background: 'transparent',
                        border: 'none',
                        width: '100%',
                        cursor: 'pointer',
                        fontSize: '14px',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <LogOut size={18} />
                      <span>{isZh ? "登出" : "Logout"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '24px' }}>{children}</div>
      </main>
    </div>
  );
}
