"use client";

import { useState, useEffect } from "react";
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

const stats = [
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

const recentOrders = [
  { id: "ORD-001", supplier: "Fresh Farm Co", items: 12, total: "$450", status: "delivered" },
  { id: "ORD-002", supplier: "Ocean Seafood", items: 8, total: "$890", status: "shipping" },
  { id: "ORD-003", supplier: "Kitchen Supplies", items: 24, total: "$320", status: "pending" },
  { id: "ORD-004", supplier: "Fresh Farm Co", items: 15, total: "$560", status: "confirmed" },
  { id: "ORD-005", supplier: "Spice World", items: 6, total: "$180", status: "delivered" },
];

const statusLabels: Record<string, { en: string; zh: string }> = {
  delivered: { en: "Delivered", zh: "已送達" },
  shipping: { en: "Shipped", zh: "已發貨" },
  pending: { en: "Pending", zh: "待處理" },
  confirmed: { en: "Confirmed", zh: "已確認" },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  delivered: { bg: "rgba(16, 185, 129, 0.15)", text: "#059669" },
  shipping: { bg: "rgba(59, 130, 246, 0.15)", text: "#2563eb" },
  pending: { bg: "rgba(251, 191, 36, 0.15)", text: "#d97706" },
  confirmed: { bg: "rgba(139, 92, 246, 0.15)", text: "#7c3aed" },
};

export default function DashboardPage() {
  const [lang, setLang] = useState<"en" | "zh">("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("open-purchase-lang");
    if (savedLang === "en" || savedLang === "zh") {
      setLang(savedLang);
    }
  }, []);

  if (!mounted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>Dashboard</h1>
            <p style={{ color: 'var(--muted)', margin: '4px 0 0 0' }}>Welcome back</p>
          </div>
        </div>
      </div>
    );
  }

  const isZh = lang === "zh";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
            {isZh ? "儀表板" : "Dashboard"}
          </h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0 0' }}>
            {isZh ? "歡迎回來" : "Welcome back"}
          </p>
        </div>
        <button
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          {isZh ? "新增訂單" : "New Order"}
        </button>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="stat-card"
            style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}
          >
            <div>
              <p
                style={{
                  color: 'var(--muted)',
                  fontSize: '13px',
                  fontWeight: '500',
                  margin: 0,
                }}
              >
                {isZh ? stat.labelZh : stat.label}
              </p>
              <p
                style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  margin: '8px 0',
                  color: 'var(--foreground)',
                }}
              >
                {stat.value}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight size={16} color="#10b981" />
                ) : (
                  <ArrowDownRight size={16} color="#ef4444" />
                )}
                <span
                  style={{
                    fontSize: '13px',
                    color: stat.trend === 'up' ? '#10b981' : '#ef4444',
                  }}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <div
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: `${stat.color}15`,
              }}
            >
              <stat.icon size={24} color={stat.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Orders Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 20px 0' }}>
            {isZh ? '每週訂單' : 'Weekly Orders'}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={orderData}>
              <XAxis
                dataKey="name"
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
              <Bar
                dataKey="orders"
                fill="var(--primary)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spend Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 20px 0' }}>
            {isZh ? '月度支出' : 'Monthly Spend'}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={spendData}>
              <XAxis
                dataKey="name"
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
                strokeWidth={2}
                dot={{ fill: 'var(--primary)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
            {isZh ? '最近訂單' : 'Recent Orders'}
          </h3>
          <a
            href="/orders"
            style={{
              fontSize: '14px',
              color: 'var(--primary)',
              fontWeight: '500',
            }}
          >
            {isZh ? '查看全部' : 'View All'} →
          </a>
        </div>
        <table>
          <thead>
            <tr>
              <th>{isZh ? '訂單編號' : 'Order ID'}</th>
              <th>{isZh ? '供應商' : 'Supplier'}</th>
              <th>{isZh ? '項目' : 'Items'}</th>
              <th>{isZh ? '總額' : 'Total'}</th>
              <th>{isZh ? '狀態' : 'Status'}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: '500' }}>{order.id}</td>
                <td style={{ color: 'var(--muted)' }}>{order.supplier}</td>
                <td>{order.items}</td>
                <td style={{ fontWeight: '500' }}>{order.total}</td>
                <td>
                  <span
                    className="badge"
                    style={{
                      background: statusColors[order.status].bg,
                      color: statusColors[order.status].text,
                    }}
                  >
                    {isZh
                      ? statusLabels[order.status].zh
                      : statusLabels[order.status].en}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      style={{
                        padding: '6px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      style={{
                        padding: '6px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      style={{
                        padding: '6px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#ef4444',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
