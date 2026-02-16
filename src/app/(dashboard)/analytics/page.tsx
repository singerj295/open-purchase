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
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users } from "lucide-react";

const monthlySpend = [
  { month: "Jan", spend: 8500 },
  { month: "Feb", spend: 9200 },
  { month: "Mar", spend: 7800 },
  { month: "Apr", spend: 10500 },
  { month: "May", spend: 11200 },
  { month: "Jun", spend: 12450 },
];

const categoryData = [
  { name: "Seafood", value: 3500, color: "#3b82f6" },
  { name: "Vegetables", value: 2800, color: "#10b981" },
  { name: "Meat", value: 2200, color: "#f59e0b" },
  { name: "Dry Goods", value: 1800, color: "#8b5cf6" },
  { name: "Spices", value: 950, color: "#ef4444" },
];

const supplierPerformance = [
  { name: "Fresh Farm Co", orders: 45, rating: 4.8, spend: 4500 },
  { name: "Ocean Seafood", orders: 32, rating: 4.5, spend: 6200 },
  { name: "Kitchen Supplies", orders: 28, rating: 4.2, spend: 2800 },
  { name: "Spice World", orders: 15, rating: 4.6, spend: 950 },
];

const weeklyOrders = [
  { day: "Mon", orders: 12 },
  { day: "Tue", orders: 18 },
  { day: "Wed", orders: 15 },
  { day: "Thu", orders: 22 },
  { day: "Fri", orders: 28 },
  { day: "Sat", orders: 8 },
  { day: "Sun", orders: 5 },
];

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
  }, []);

  const isZh = lang === "zh";
  const isBlankUser = user?.email === "eldon@chta.one" || user?.name === "";

  const metrics = isBlankUser ? [] : [
    {
      label: isZh ? "總支出" : "Total Spend",
      value: "$42,650",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "#10b981",
    },
    {
      label: isZh ? "總訂單" : "Total Orders",
      value: "156",
      change: "+8%",
      trend: "up",
      icon: ShoppingCart,
      color: "#3b82f6",
    },
    {
      label: isZh ? "平均訂單價值" : "Avg Order Value",
      value: "$273",
      change: "-3%",
      trend: "down",
      icon: TrendingDown,
      color: "#ef4444",
    },
    {
      label: isZh ? "活躍供應商" : "Active Suppliers",
      value: "24",
      change: "+2",
      trend: "up",
      icon: Users,
      color: "#8b5cf6",
    },
  ];

  if (!mounted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>{isZh ? "數據分析" : "Analytics"}</h1>
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

      {/* Empty State for blank users */}
      {isBlankUser ? (
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
      ) : (
        <>
          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {metrics.map((metric, index) => (
              <div key={index} className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>{metric.label}</p>
                    <p style={{ fontSize: '28px', fontWeight: '600', margin: '8px 0 0 0' }}>{metric.value}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                      {metric.trend === 'up' ? (
                        <TrendingUp size={16} color="#10b981" />
                      ) : (
                        <TrendingDown size={16} color="#ef4444" />
                      )}
                      <span style={{ 
                        fontSize: '13px', 
                        color: metric.trend === 'up' ? '#10b981' : '#ef4444' 
                      }}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '12px', background: `${metric.color}15` }}>
                    <metric.icon size={24} color={metric.color} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            {/* Monthly Spend */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 20px 0' }}>
                {isZh ? "月度支出趨勢" : "Monthly Spend Trend"}
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlySpend}>
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
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spend" 
                    stroke="var(--primary)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--primary)', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Breakdown */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 20px 0' }}>
                {isZh ? "支出分類" : "Spend by Category"}
              </h3>
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
            </div>
          </div>

          {/* Supplier Performance Table */}
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
        </>
      )}
    </div>
  );
}
