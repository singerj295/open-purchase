"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  supplier: string;
  product: string;
  items: number;
  total: number;
  status: string;
  date: string;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  deliveryDay: string;
  moq: string;
  category: string;
  notes: string;
  isActive: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  restaurantName: string;
  restaurantAddress: string;
}

export default function AnalyticsPage() {
  const [lang, setLang] = useState<"en" | "zh">("zh");
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("open-purchase-lang");
    if (saved === "en" || saved === "zh") {
      setLang(saved);
    }
    
    const savedUser = localStorage.getItem('open-purchase-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }

    const savedOrders = localStorage.getItem('open-purchase-orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        setOrders([]);
      }
    }

    const savedSuppliers = localStorage.getItem('open-purchase-suppliers');
    if (savedSuppliers) {
      try {
        setSuppliers(JSON.parse(savedSuppliers));
      } catch (e) {
        setSuppliers([]);
      }
    }
  }, []);

  const isZh = lang === "zh";
  const isBlankUser = user?.email === "eldon@chta.one" || user?.name === "";

  // Calculate real metrics
  const totalSpend = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSpend / totalOrders) : 0;
  const activeSuppliers = suppliers.filter(s => s.isActive).length;

  // Calculate spend by category (using supplier categories)
  const categoryMap = new Map<string, number>();
  orders.forEach(order => {
    const supplier = suppliers.find(s => s.name === order.supplier);
    const category = supplier?.category || "Other";
    categoryMap.set(category, (categoryMap.get(category) || 0) + order.total);
  });
  
  const categoryColors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899"];
  const categoryData = Array.from(categoryMap.entries()).map(([name, value], i) => ({
    name,
    value,
    color: categoryColors[i % categoryColors.length]
  }));

  // Calculate monthly spend trend (last 6 months)
  const monthlyMap = new Map<string, number>();
  orders.forEach(order => {
    const date = new Date(order.date);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + order.total);
  });
  
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toLocaleDateString('en-US', { month: 'short' }));
  }
  
  const monthlySpend = months.map(month => ({
    month,
    spend: monthlyMap.get(month) || 0
  }));

  // Supplier performance
  const supplierPerformance = suppliers.map(supplier => {
    const supplierOrders = orders.filter(o => o.supplier === supplier.name);
    const supplierSpend = supplierOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      name: supplier.name,
      orders: supplierOrders.length,
      rating: supplier.isActive ? 4.5 : 4.0,
      spend: supplierSpend,
    };
  }).filter(s => s.orders > 0);

  if (!mounted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>{isZh ? "數據分析" : "Analytics"}</h1>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (orders.length === 0 && suppliers.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
            {isZh ? "數據分析" : "Analytics"}
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: '4px' }}>
            {isZh ? "追蹤你的採購表現" : "Track your procurement performance"}
          </p>
        </div>

        <div style={{ 
          background: 'var(--card-bg)', 
          borderRadius: '16px', 
          padding: '60px', 
          boxShadow: '0 2px 8px var(--shadow)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
            {isZh ? "還沒有數據" : "No Data Yet"}
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
            {isZh ? "建立訂單後就會顯示分析數據" : "Analytics will appear after you create orders"}
          </p>
          <a 
            href="/orders"
            style={{
              display: 'inline-flex',
              padding: '12px 24px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            {isZh ? "建立訂單" : "Create Order"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
          {isZh ? "數據分析" : "Analytics"}
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: '4px' }}>
          {isZh ? "追蹤你的採購表現" : "Track your procurement performance"}
        </p>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>{isZh ? "總支出" : "Total Spend"}</p>
              <p style={{ fontSize: '28px', fontWeight: '600', margin: '8px 0 0 0' }}>${totalSpend.toLocaleString()}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                <TrendingUp size={16} color="#10b981" />
                <span style={{ fontSize: '13px', color: '#10b981' }}>+{orders.length} {isZh ? "筆訂單" : "orders"}</span>
              </div>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)' }}>
              <DollarSign size={24} color="#10b981" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>{isZh ? "總訂單" : "Total Orders"}</p>
              <p style={{ fontSize: '28px', fontWeight: '600', margin: '8px 0 0 0' }}>{totalOrders}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                <ShoppingCart size={16} color="#3b82f6" />
                <span style={{ fontSize: '13px', color: '#3b82f6' }}>{isZh ? "已完成" : "completed"}</span>
              </div>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)' }}>
              <ShoppingCart size={24} color="#3b82f6" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>{isZh ? "平均訂單價值" : "Avg Order Value"}</p>
              <p style={{ fontSize: '28px', fontWeight: '600', margin: '8px 0 0 0' }}>${avgOrderValue}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                <TrendingDown size={16} color="#ef4444" />
              </div>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)' }}>
              <DollarSign size={24} color="#ef4444" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>{isZh ? "活躍供應商" : "Active Suppliers"}</p>
              <p style={{ fontSize: '28px', fontWeight: '600', margin: '8px 0 0 0' }}>{activeSuppliers}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                <Users size={16} color="#8b5cf6" />
                <span style={{ fontSize: '13px', color: '#8b5cf6' }}>/ {suppliers.length}</span>
              </div>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)' }}>
              <Users size={24} color="#8b5cf6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Monthly Spend */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 20px 0' }}>
            {isZh ? "月度支出趨勢" : "Monthly Spend Trend"}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlySpend}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'var(--muted)', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'var(--muted)', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--card-bg)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px var(--shadow)',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spend']}
              />
              <Bar dataKey="spend" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 20px 0' }}>
            {isZh ? "支出分類" : "Spend by Category"}
          </h3>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--card-bg)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px var(--shadow)',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spend']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
                {categoryData.map((item) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: item.color }} />
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '80px 0' }}>
              {isZh ? "添加供應商分類以查看" : "Add supplier categories to view"}
            </p>
          )}
        </div>
      </div>

      {/* Supplier Performance Table */}
      {supplierPerformance.length > 0 && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 20px 0' }}>
            {isZh ? "供應商表現" : "Supplier Performance"}
          </h3>
          <table>
            <thead>
              <tr>
                <th>{isZh ? "供應商" : "Supplier"}</th>
                <th>{isZh ? "訂單數" : "Orders"}</th>
                <th>{isZh ? "評分" : "Rating"}</th>
                <th>{isZh ? "支出" : "Spend"}</th>
              </tr>
            </thead>
            <tbody>
              {supplierPerformance.map((supplier) => (
                <tr key={supplier.name}>
                  <td style={{ fontWeight: '500' }}>{supplier.name}</td>
                  <td>{supplier.orders}</td>
                  <td>
                    <span style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#059669',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}>
                      {supplier.rating} ★
                    </span>
                  </td>
                  <td style={{ fontWeight: '500' }}>${supplier.spend.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
