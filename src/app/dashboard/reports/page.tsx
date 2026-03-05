"use client";

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react';

// Mock 報表數據
const purchaseData = {
  daily: [
    { date: '3 月 1 日', amount: 2500, orders: 8 },
    { date: '3 月 2 日', amount: 3200, orders: 12 },
    { date: '3 月 3 日', amount: 2800, orders: 10 },
    { date: '3 月 4 日', amount: 3500, orders: 14 },
    { date: '3 月 5 日', amount: 4200, orders: 16 },
    { date: '3 月 6 日', amount: 3800, orders: 13 },
    { date: '3 月 7 日', amount: 4500, orders: 18 },
  ],
  weekly: [
    { week: '第 1 週', amount: 18000, orders: 65 },
    { week: '第 2 週', amount: 22000, orders: 78 },
    { week: '第 3 週', amount: 25000, orders: 85 },
    { week: '第 4 週', amount: 28000, orders: 92 },
  ],
  monthly: [
    { month: '10 月', amount: 85000, orders: 320 },
    { month: '11 月', amount: 92000, orders: 350 },
    { month: '12 月', amount: 105000, orders: 400 },
  ]
};

const supplierStats = [
  { name: 'Fresh Farm Co', amount: 15000, orders: 45, rating: 4.8 },
  { name: 'Ocean Seafood', amount: 12000, orders: 32, rating: 4.6 },
  { name: 'Kitchen Supplies', amount: 8000, orders: 28, rating: 4.5 },
  { name: 'Spice World', amount: 6000, orders: 22, rating: 4.7 },
];

const categoryStats = [
  { name: '蔬菜', amount: 18000, percentage: 30 },
  { name: '海鮮', amount: 15000, percentage: 25 },
  { name: '肉類', amount: 12000, percentage: 20 },
  { name: '調味料', amount: 9000, percentage: 15 },
  { name: '其他', amount: 6000, percentage: 10 },
];

export default function ReportsPage() {
  const [isDark, setIsDark] = useState(false);
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
  }, []);

  const currentData = purchaseData[reportType];
  const totalAmount = currentData.reduce((sum, item) => sum + item.amount, 0);
  const totalOrders = currentData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalAmount / totalOrders;

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
          報表分析
        </h1>
        <p style={{ margin: 0, color: isDark ? '#9ca3af' : '#757575', fontSize: '14px', transition: 'color 0.3s ease' }}>
          分析採購數據同趨勢
        </p>
      </div>

      {/* Report Type Selector */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => setReportType('daily')}
          style={{
            padding: '10px 20px',
            background: reportType === 'daily' ? '#2d9e6d' : (isDark ? '#374151' : '#ffffff'),
            color: reportType === 'daily' ? 'white' : (isDark ? '#9ca3af' : '#757575'),
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.15s ease'
          }}
        >
          日報表
        </button>
        <button
          onClick={() => setReportType('weekly')}
          style={{
            padding: '10px 20px',
            background: reportType === 'weekly' ? '#2d9e6d' : (isDark ? '#374151' : '#ffffff'),
            color: reportType === 'weekly' ? 'white' : (isDark ? '#9ca3af' : '#757575'),
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.15s ease'
          }}
        >
          週報表
        </button>
        <button
          onClick={() => setReportType('monthly')}
          style={{
            padding: '10px 20px',
            background: reportType === 'monthly' ? '#2d9e6d' : (isDark ? '#374151' : '#ffffff'),
            color: reportType === 'monthly' ? 'white' : (isDark ? '#9ca3af' : '#757575'),
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.15s ease'
          }}
        >
          月報表
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ padding: '24px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#5ac8fa20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} color="#5ac8fa" />
            </div>
            <span style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>採購總額</span>
          </div>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>${totalAmount.toLocaleString()}</p>
        </div>
        <div style={{ padding: '24px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#2d9e6d20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} color="#2d9e6d" />
            </div>
            <span style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>訂單總數</span>
          </div>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>{totalOrders}</p>
        </div>
        <div style={{ padding: '24px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f59e0b20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} color="#f59e0b" />
            </div>
            <span style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>平均訂單金額</span>
          </div>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>${avgOrderValue.toFixed(0)}</p>
        </div>
        <div style={{ padding: '24px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#8b5cf620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={20} color="#8b5cf6" />
            </div>
            <span style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>供應商數</span>
          </div>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>{supplierStats.length}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* 採購趨勢圖 */}
        <div style={{ background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', padding: '24px', transition: 'all 0.3s ease' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>採購趨勢</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '20px' }}>
            {currentData.map((item, index) => {
              const maxValue = Math.max(...currentData.map(d => d.amount));
              const height = (item.amount / maxValue) * 100;
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '100%',
                    height: `${height}%`,
                    background: 'linear-gradient(180deg, #2d9e6d 0%, #5ac8fa 100%)',
                    borderRadius: '8px 8px 0 0',
                    transition: 'height 0.3s ease'
                  }} />
                  <span style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#757575', textAlign: 'center', transition: 'color 0.3s ease' }}>{(item as any).date || (item as any).week || (item as any).month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 類別分析 */}
        <div style={{ background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', padding: '24px', transition: 'all 0.3s ease' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>類別分析</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {categoryStats.map((cat, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>{cat.name}</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>${cat.amount.toLocaleString()} ({cat.percentage}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: isDark ? '#374151' : '#f5f5f5', borderRadius: '4px', overflow: 'hidden', transition: 'background 0.3s ease' }}>
                  <div style={{
                    width: `${cat.percentage}%`,
                    height: '100%',
                    background: ['#2d9e6d', '#5ac8fa', '#f59e0b', '#8b5cf6', '#ec4899'][index],
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supplier Performance */}
      <div style={{ background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', padding: '24px', transition: 'all 0.3s ease' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>供應商表現</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid ' + (isDark ? '#374151' : '#f5f5f5') }}>
              <th style={{ padding: '12px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>供應商</th>
              <th style={{ padding: '12px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>採購金額</th>
              <th style={{ padding: '12px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>訂單數</th>
              <th style={{ padding: '12px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>評分</th>
            </tr>
          </thead>
          <tbody>
            {supplierStats.map((supplier, index) => (
              <tr key={index} style={{ borderBottom: '1px solid ' + (isDark ? '#374151' : '#f5f5f5'), transition: 'border-color 0.3s ease' }}>
                <td style={{ padding: '16px', color: isDark ? '#f9fafb' : '#1a1a1a', fontSize: '14px', fontWeight: '600', transition: 'color 0.3s ease' }}>{supplier.name}</td>
                <td style={{ padding: '16px', color: isDark ? '#f9fafb' : '#1a1a1a', fontSize: '14px', transition: 'color 0.3s ease' }}>${supplier.amount.toLocaleString()}</td>
                <td style={{ padding: '16px', color: isDark ? '#9ca3af' : '#757575', fontSize: '14px', transition: 'color 0.3s ease' }}>{supplier.orders}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 12px',
                    background: supplier.rating >= 4.5 ? (isDark ? '#14532d' : '#dcfce7') : supplier.rating >= 4.0 ? (isDark ? '#78350f' : '#fef3c7') : (isDark ? '#7f1d1d' : '#fee2e2'),
                    color: supplier.rating >= 4.5 ? (isDark ? '#4ade80' : '#16a34a') : supplier.rating >= 4.0 ? (isDark ? '#fbbf24' : '#d97706') : (isDark ? '#f87171' : '#dc2626'),
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    ⭐ {supplier.rating}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
