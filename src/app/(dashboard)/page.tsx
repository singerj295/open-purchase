"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

const statusColors: Record<string, { bg: string; text: string }> = {
  delivered: { bg: "rgba(16, 185, 129, 0.15)", text: "#059669" },
  shipping: { bg: "rgba(59, 130, 246, 0.15)", text: "#2563eb" },
  pending: { bg: "rgba(251, 191, 36, 0.15)", text: "#d97706" },
  confirmed: { bg: "rgba(139, 92, 246, 0.15)", text: "#7c3aed" },
};

const statusLabels: Record<string, { en: string; zh: string }> = {
  delivered: { en: "Delivered", zh: "已送達" },
  shipping: { en: "Shipped", zh: "已發貨" },
  pending: { en: "Pending", zh: "待處理" },
  confirmed: { en: "Confirmed", zh: "已確認" },
};

interface User {
  id: string;
  name: string;
  email: string;
  restaurantName: string;
  restaurantAddress: string;
}

interface Order {
  id: string;
  supplier: string;
  items: number;
  total: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [lang, setLang] = useState("zh");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("open-purchase-lang");
    if (saved === "en" || saved === "zh") {
      setLang(saved);
    }
    
    // Check if user has data
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

  // Demo data for non-blank users
  const stats = isBlankUser ? [] : [
    {
      label: "Total Orders",
      labelZh: "總訂單數",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: ShoppingCart,
      color: "#3b82f6",
    },
    {
      label: "Active Suppliers",
      labelZh: "供應商數量",
      value: "24",
      change: "+2",
      trend: "up",
      icon: Package,
      color: "#10b981",
    },
    {
      label: "Monthly Spend",
      labelZh: "月度支出",
      value: "$12,450",
      change: "-5%",
      trend: "down",
      icon: DollarSign,
      color: "#8b5cf6",
    },
    {
      label: "Cost Savings",
      labelZh: "成本節省",
      value: "$892",
      change: "+18%",
      trend: "up",
      icon: TrendingUp,
      color: "#f97316",
    },
  ];

  const orderData = [
    { name: "Mon", orders: 12 },
    { name: "Tue", orders: 19 },
    { name: "Wed", orders: 15 },
    { name: "Thu", orders: 22 },
    { name: "Fri", orders: 18 },
    { name: "Sat", orders: 25 },
    { name: "Sun", orders: 8 },
  ];

  const spendData = [
    { name: "Week 1", spend: 2800 },
    { name: "Week 2", spend: 3200 },
    { name: "Week 3", spend: 2900 },
    { name: "Week 4", spend: 3550 },
  ];

  const recentOrders: Order[] = isBlankUser ? [] : [
    { id: "ORD-001", supplier: "Fresh Farm Co", items: 12, total: "$450", status: "delivered" },
    { id: "ORD-002", supplier: "Ocean Seafood", items: 8, total: "$890", status: "shipping" },
    { id: "ORD-003", supplier: "Kitchen Supplies", items: 24, total: "$320", status: "pending" },
    { id: "ORD-004", supplier: "Fresh Farm Co", items: 15, total: "$560", status: "confirmed" },
    { id: "ORD-005", supplier: "Spice World", items: 6, total: "$180", status: "delivered" },
  ];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    color: 'var(--muted)',
    marginTop: '4px',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
  };

  const chartGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
  };

  if (!mounted) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Dashboard</h1>
            <p style={subtitleStyle}>Welcome back</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Welcome */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>{isZh ? "儀表板" : "Dashboard"}</h1>
          <p style={subtitleStyle}>{isZh ? "歡迎回來" : "Welcome back"}</p>
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
          onClick={() => router.push('/orders')}
        >
          <Plus size={18} />
          {isZh ? "新增訂單" : "New Order"}
        </button>
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
            {isZh ? "開始設置你的餐廳" : "Start Setting Up Your Restaurant"}
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
            {isZh ? "添加供應商和建立訂單來開始追蹤採購" : "Add suppliers and create orders to start tracking your procurement"}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              style={{
                padding: '12px 24px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
              onClick={() => router.push('/suppliers')}
            >
              {isZh ? "添加供應商" : "Add Supplier"}
            </button>
            <button
              style={{
                padding: '12px 24px',
                background: 'var(--card-bg)',
                color: 'var(--foreground)',
                border: '1px solid rgba(128,128,128,0.2)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
              onClick={() => router.push('/settings')}
            >
              {isZh ? "餐廳設定" : "Restaurant Settings"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div style={gridStyle}>
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'var(--card-bg)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px var(--shadow)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: '500', margin: 0 }}>
                    {isZh ? stat.labelZh : stat.label}
                  </p>
                  <p style={{ fontSize: '28px', fontWeight: '600', margin: '8px 0', color: 'var(--foreground)' }}>
                    {stat.value}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight size={16} color="#10b981" />
                    ) : (
                      <ArrowDownRight size={16} color="#ef4444" />
                    )}
                    <span style={{ fontSize: '13px', color: stat.trend === 'up' ? '#10b981' : '#ef4444' }}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '12px', borderRadius: '12px', background: `${stat.color}15` }}>
                  <stat.icon size={24} color={stat.color} />
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={chartGridStyle}>
            {/* Orders Chart */}
            <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px var(--shadow)', border: 'none' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 20px 0' }}>
                {isZh ? '每週訂單' : 'Weekly Orders'}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={orderData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--card-bg)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px var(--shadow)' }} />
                  <Bar dataKey="orders" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Spend Chart */}
            <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px var(--shadow)', border: 'none' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 20px 0' }}>
                {isZh ? '月度支出' : 'Monthly Spend'}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={spendData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--card-bg)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px var(--shadow)' }} />
                  <Line type="monotone" dataKey="spend" stroke="var(--primary)" strokeWidth={2} dot={{ fill: 'var(--primary)', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders */}
          <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px var(--shadow)', border: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                {isZh ? '最近訂單' : 'Recent Orders'}
              </h3>
              <a href="/orders" style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '500', textDecoration: 'none' }}>
                {isZh ? '查看全部' : 'View All'} →
              </a>
            </div>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                    {isZh ? '訂單編號' : 'Order ID'}
                  </th>
                  <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                    {isZh ? '供應商' : 'Supplier'}
                  </th>
                  <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                    {isZh ? '項目' : 'Items'}
                  </th>
                  <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                    {isZh ? '總額' : 'Total'}
                  </th>
                  <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                    {isZh ? '狀態' : 'Status'}
                  </th>
                  <th style={{ width: '100px' }}></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid rgba(128,128,128,0.1)' }}>
                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--primary)' }}>{order.id}</td>
                    <td style={{ padding: '16px', color: 'var(--muted)' }}>{order.supplier}</td>
                    <td style={{ padding: '16px' }}>{order.items}</td>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{order.total}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: statusColors[order.status].bg, color: statusColors[order.status].text }}>
                        {isZh ? statusLabels[order.status].zh : statusLabels[order.status].en}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ padding: '6px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                          <Eye size={16} />
                        </button>
                        <button style={{ padding: '6px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                          <Edit size={16} />
                        </button>
                        <button style={{ padding: '6px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
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
