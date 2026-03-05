"use client";

import { useTheme } from '@/lib/ThemeContext';
import { Package, ShoppingCart, BarChart3, FileText, Plus, Store, TrendingUp, Book, Users, Smartphone, Brain } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: '總訂單', value: '7', color: '#5ac8fa', icon: ShoppingCart },
  { label: '待處理', value: '2', color: '#f59e0b', icon: Package },
  { label: '已送達', value: '2', color: '#2d9e6d', icon: TrendingUp },
  { label: '總額', value: '$3,500', color: '#8b5cf6', icon: BarChart3 },
];

const quickActions = [
  { name: '新增供應商', icon: Plus, path: '/dashboard/suppliers', color: '#2d9e6d' },
  { name: '新增訂單', icon: ShoppingCart, path: '/dashboard/orders', color: '#5ac8fa' },
  { name: '查看庫存', icon: Package, path: '/dashboard/inventory', color: '#f59e0b' },
  { name: '查看報告', icon: FileText, path: '/dashboard/reports', color: '#8b5cf6' },
  { name: '食譜管理', icon: Book, path: '/dashboard/recipes', color: '#ec4899' },
  { name: '用戶管理', icon: Users, path: '/auth/login', color: '#14b8a6' },
];

const features = [
  { 
    name: '供應商管理', 
    description: '管理供應商資料同聯絡方式',
    icon: Store,
    color: '#2d9e6d'
  },
  { 
    name: '訂單管理', 
    description: '追蹤同管理所有採購訂單',
    icon: ShoppingCart,
    color: '#5ac8fa'
  },
  { 
    name: '庫存追蹤', 
    description: '實時監控庫存狀態',
    icon: Package,
    color: '#f59e0b'
  },
  { 
    name: '報表分析', 
    description: '分析採購數據同趨勢',
    icon: BarChart3,
    color: '#8b5cf6'
  },
  { 
    name: '食譜管理', 
    description: '管理餐廳食譜同配方',
    icon: Book,
    color: '#ec4899'
  },
  { 
    name: '移動端優化', 
    description: '隨時隨地訪問系統',
    icon: Smartphone,
    color: '#14b8a6'
  },
];

export default function DashboardPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ 
      background: isDark ? '#111827' : '#f5f5f5', 
      minHeight: '100vh', 
      padding: '24px',
      transition: 'all 0.3s ease'
    }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>
          歡迎使用 Open Purchase
        </h1>
        <p style={{ margin: 0, color: isDark ? '#9ca3af' : '#757575', fontSize: '14px', transition: 'color 0.3s ease' }}>
          管理你的採購訂單同供應商
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              style={{
                padding: '24px',
                background: isDark ? '#1f2937' : '#ffffff',
                borderRadius: '16px',
                boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <div>
                <p style={{ margin: '0 0 8px 0', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', transition: 'color 0.3s ease' }}>{stat.label}</p>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>{stat.value}</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: stat.color + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={24} color={stat.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>
          快速操作
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.path} style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '16px 24px',
                  background: action.color,
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
                >
                  <Icon size={20} /> {action.name}
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Features */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>
          主要功能
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                style={{
                  padding: '24px',
                  background: isDark ? '#1f2937' : '#ffffff',
                  borderRadius: '16px',
                  boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: feature.color + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Icon size={24} color={feature.color} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>
                  {feature.name}
                </h3>
                <p style={{ margin: 0, color: isDark ? '#9ca3af' : '#757575', fontSize: '14px', transition: 'color 0.3s ease' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
