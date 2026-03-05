"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, AlertTriangle } from 'lucide-react';

// Mock 分析數據
const costTrendData = [
  { month: '7 月', cost: 65000, budget: 70000 },
  { month: '8 月', cost: 68000, budget: 70000 },
  { month: '9 月', cost: 72000, budget: 75000 },
  { month: '10 月', cost: 78000, budget: 80000 },
  { month: '11 月', cost: 82000, budget: 85000 },
  { month: '12 月', cost: 88000, budget: 90000 },
];

const inventoryMetrics = {
  turnoverRate: 12.5,
  daysOnHand: 29,
  stockoutRate: 2.3,
  wasteRate: 1.8,
};

const supplierComparison = [
  { name: 'Fresh Farm Co', price: 100, quality: 95, delivery: 92 },
  { name: 'Ocean Seafood', price: 85, quality: 90, delivery: 88 },
  { name: 'Kitchen Supplies', price: 92, quality: 88, delivery: 95 },
];

const alerts = [
  { type: 'warning', message: '3 項食材庫存低於安全水平', time: '2 小時前' },
  { type: 'info', message: '本月採購成本比上月增加 8%', time: '5 小時前' },
  { type: 'success', message: '供應商準時率達到 95%', time: '1 天前' },
];

export default function AnalyticsPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
  }, []);

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
          數據分析
        </h1>
        <p style={{ margin: 0, color: isDark ? '#9ca3af' : '#757575', fontSize: '14px', transition: 'color 0.3s ease' }}>
          深入分析業務數據
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ padding: '24px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#2d9e6d20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} color="#2d9e6d" />
            </div>
            <span style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>庫存周轉率</span>
          </div>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>{inventoryMetrics.turnoverRate}x</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#16a34a' }}>↑ 比上月 +1.2</p>
        </div>
        <div style={{ padding: '24px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#5ac8fa20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} color="#5ac8fa" />
            </div>
            <span style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>庫存天數</span>
          </div>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>{inventoryMetrics.daysOnHand} 天</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#16a34a' }}>↓ 比上月 -3 天</p>
        </div>
        <div style={{ padding: '24px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f59e0b20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} color="#f59e0b" />
            </div>
            <span style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>缺貨率</span>
          </div>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>{inventoryMetrics.stockoutRate}%</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#16a34a' }}>↓ 比上月 -0.5%</p>
        </div>
        <div style={{ padding: '24px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ef444420', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingDown size={20} color="#ef4444" />
            </div>
            <span style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>浪費率</span>
          </div>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>{inventoryMetrics.wasteRate}%</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#16a34a' }}>↓ 比上月 -0.3%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* 成本趨勢 */}
        <div style={{ background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', padding: '24px', transition: 'all 0.3s ease' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>成本趨勢分析</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '16px', paddingBottom: '20px' }}>
            {costTrendData.map((item, index) => {
              const maxBudget = Math.max(...costTrendData.map(d => d.budget));
              const costHeight = (item.cost / maxBudget) * 100;
              const budgetHeight = (item.budget / maxBudget) * 100;
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', gap: '4px', alignItems: 'flex-end' }}>
                    <div style={{
                      width: '20px',
                      height: `${costHeight}%`,
                      background: 'linear-gradient(180deg, #2d9e6d 0%, #5ac8fa 100%)',
                      borderRadius: '4px 4px 0 0'
                    }} />
                    <div style={{
                      width: '20px',
                      height: `${budgetHeight}%`,
                      background: 'linear-gradient(180deg, #f59e0b 0%, #ef4444 100%)',
                      opacity: 0.5,
                      borderRadius: '4px 4px 0 0'
                    }} />
                  </div>
                  <span style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#757575' }}>{item.month}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', background: 'linear-gradient(180deg, #2d9e6d 0%, #5ac8fa 100%)', borderRadius: '4px' }} />
              <span style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>實際成本</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', background: 'linear-gradient(180deg, #f59e0b 0%, #ef4444 100%)', opacity: 0.5, borderRadius: '4px' }} />
              <span style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>預算</span>
            </div>
          </div>
        </div>

        {/* 供應商比較雷達圖 */}
        <div style={{ background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', padding: '24px', transition: 'all 0.3s ease' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>供應商綜合比較</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {supplierComparison.map((supplier, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>{supplier.name}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>價格</span>
                      <span style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>{supplier.price}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: isDark ? '#374151' : '#f5f5f5', borderRadius: '3px', overflow: 'hidden', transition: 'background 0.3s ease' }}>
                      <div style={{ width: `${supplier.price}%`, height: '100%', background: '#2d9e6d', borderRadius: '3px' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>品質</span>
                      <span style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>{supplier.quality}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: isDark ? '#374151' : '#f5f5f5', borderRadius: '3px', overflow: 'hidden', transition: 'background 0.3s ease' }}>
                      <div style={{ width: `${supplier.quality}%`, height: '100%', background: '#5ac8fa', borderRadius: '3px' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>交貨</span>
                      <span style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>{supplier.delivery}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: isDark ? '#374151' : '#f5f5f5', borderRadius: '3px', overflow: 'hidden', transition: 'background 0.3s ease' }}>
                      <div style={{ width: `${supplier.delivery}%`, height: '100%', background: '#f59e0b', borderRadius: '3px' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div style={{ background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', padding: '24px', transition: 'all 0.3s ease' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>智能提示</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alerts.map((alert, index) => (
            <div
              key={index}
              style={{
                padding: '16px',
                background: alert.type === 'warning' ? (isDark ? '#78350f' : '#fffbeb') : alert.type === 'success' ? (isDark ? '#14532d' : '#f0fdf4') : (isDark ? '#1e3a5f' : '#eff6ff'),
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease'
              }}
            >
              {alert.type === 'warning' ? (
                <AlertTriangle size={20} color={isDark ? '#fbbf24' : '#d97706'} />
              ) : alert.type === 'success' ? (
                <TrendingUp size={20} color={isDark ? '#4ade80' : '#16a34a'} />
              ) : (
                <DollarSign size={20} color={isDark ? '#60a5fa' : '#2563eb'} />
              )}
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '14px', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>{alert.message}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: isDark ? '#9ca3af' : '#757575', transition: 'color 0.3s ease' }}>{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
