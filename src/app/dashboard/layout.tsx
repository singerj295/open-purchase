"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, ShoppingCart, Store, Book, Package, 
  FileText, BarChart3, Settings, ChevronLeft, ChevronRight,
  Search, User, LogOut, Moon, Sun
} from 'lucide-react';
import { ThemeProvider, useTheme } from '@/lib/ThemeContext';
import GlobalSearch from '@/components/GlobalSearch';

const menuItems = [
  { name: '儀表板', icon: LayoutDashboard, path: '/dashboard' },
  { name: '訂單', icon: ShoppingCart, path: '/dashboard/orders' },
  { name: '供應商', icon: Store, path: '/dashboard/suppliers' },
  { name: '食譜', icon: Book, path: '/dashboard/recipes' },
  { name: '庫存', icon: Package, path: '/dashboard/inventory' },
  { name: '報告', icon: FileText, path: '/dashboard/reports' },
  { name: '分析', icon: BarChart3, path: '/dashboard/analytics' },
  { name: '設定', icon: Settings, path: '/dashboard/settings' },
];

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDark, toggleTheme } = useTheme();

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: isDark ? '#111827' : '#f5f5f5',
      color: isDark ? '#f9fafb' : '#1a1a1a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      transition: 'all 0.3s ease'
    }}>
      {/* Left Sidebar */}
      <aside style={{
        width: sidebarOpen ? '260px' : '70px',
        background: isDark ? '#1f2937' : '#ffffff',
        boxShadow: isDark ? '2px 0 8px rgba(0,0,0,0.3)' : '2px 0 8px rgba(0,0,0,0.08)',
        transition: 'width 0.15s ease, background 0.3s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        borderRight: isDark ? '1px solid #374151' : 'none'
      }}>
        {/* Logo with Toggle */}
        <div style={{
          padding: '20px',
          borderBottom: isDark ? '1px solid #374151' : '1px solid #f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexShrink: 0,
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
            <ShoppingCart size={24} color="#2d9e6d" />
            {sidebarOpen && (
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d9e6d', whiteSpace: 'nowrap' }}>
                Open Purchase
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '8px 12px',
              background: isDark ? '#374151' : '#f5f5f5',
              border: 'none',
              borderRadius: '8px',
              color: isDark ? '#9ca3af' : '#757575',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#2d9e6d';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = isDark ? '#374151' : '#f5f5f5';
              e.currentTarget.style.color = isDark ? '#9ca3af' : '#757575';
            }}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: '12px', overflow: 'auto' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '4px',
                  background: isActive ? (isDark ? '#374151' : '#f5f5f5') : 'transparent',
                  color: isActive ? '#2d9e6d' : (isDark ? '#9ca3af' : '#757575'),
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = isDark ? '#374151' : '#f5f5f5';
                    e.currentTarget.style.color = '#2d9e6d';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = isDark ? '#9ca3af' : '#757575';
                  }
                }}
              >
                <Icon size={20} color={isActive ? '#2d9e6d' : (isDark ? '#9ca3af' : '#757575')} />
                {sidebarOpen && (
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <header style={{ 
          padding: '16px 24px', 
          background: isDark ? '#1f2937' : '#ffffff',
          boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* 黑夜模式切換 */}
            <button
              onClick={toggleTheme}
              style={{
                padding: '8px 12px',
                background: isDark ? '#374151' : '#f5f5f5',
                border: 'none',
                borderRadius: '12px',
                color: isDark ? '#fbbf24' : '#757575',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = isDark ? '#4b5563' : '#e5e7eb';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = isDark ? '#374151' : '#f5f5f5';
              }}
              title={isDark ? '切換到日間模式' : '切換到夜間模式'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              <span>{isDark ? '日間' : '夜間'}</span>
            </button>
            
            {/* 搜索框 */}
            <GlobalSearch isDark={isDark} />
          </div>
          
          {/* 用戶信息 + 登出 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 16px',
            background: isDark ? '#374151' : '#f5f5f5',
            borderRadius: '12px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = isDark ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.12)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            {/* 用戶頭像 */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2d9e6d 0%, #5ac8fa 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
              flexShrink: 0
            }}>
              <User size={18} />
            </div>
            
            {/* 用戶名稱 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>管理員</span>
              <span style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>demo@restaurant.com</span>
            </div>
            
            {/* 分隔線 */}
            <div style={{
              width: '1px',
              height: '24px',
              background: isDark ? '#4b5563' : '#e5e7eb',
              margin: '0 8px'
            }} />
            
            {/* 登出按鈕 */}
            <button
              onClick={() => {
                document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                localStorage.removeItem('open-purchase-user');
                window.location.href = '/auth/login';
              }}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: isDark ? '#f87171' : '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = isDark ? '#450a0a' : '#fef2f2';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <LogOut size={16} />
              <span>登出</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardContent>{children}</DashboardContent>
    </ThemeProvider>
  );
}
