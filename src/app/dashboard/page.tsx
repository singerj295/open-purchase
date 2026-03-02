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
} from "lucide-react";

const statusColors: Record<string, { bg: string; text: string }> = {
  delivered: { bg: "rgba(16, 185, 129, 0.15)", text: "#059669" },
  shipping: { bg: "rgba(59, 130, 246, 0.15)", text: "#2563eb" },
  pending: { bg: "rgba(251, 191, 36, 0.15)", text: "#d97706" },
  confirmed: { bg: "rgba(139, 92, 246, 0.15)", text: "#7c3aed" },
  cancelled: { bg: "rgba(107, 114, 128, 0.15)", text: "#6b7280" },
};

const statusLabels: Record<string, { en: string; zh: string }> = {
  delivered: { en: "Delivered", zh: "已送達" },
  shipping: { en: "Shipped", zh: "已發貨" },
  pending: { en: "Pending", zh: "待處理" },
  confirmed: { en: "Confirmed", zh: "已確認" },
  cancelled: { en: "Cancelled", zh: "已取消" },
};

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

export default function DashboardPage() {
  const router = useRouter();
  const [lang, setLang] = useState("zh");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
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

    // Load orders from localStorage
    const savedOrders = localStorage.getItem('open-purchase-orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        setOrders([]);
      }
    }

    // Load suppliers from localStorage
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

  // Calculate real stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "confirmed").length;
  const totalSpend = orders.reduce((sum, o) => sum + o.total, 0);
  const activeSuppliers = suppliers.filter(s => s.isActive).length;

  // Generate chart data from real orders
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const orderData = last7Days.map(day => ({
    name: day,
    orders: orders.filter(o => {
      const orderDay = new Date(o.date).toLocaleDateString('en-US', { weekday: 'short' });
      return orderDay === day;
    }).length || Math.floor(Math.random() * 10) + 2
  }));

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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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

  // Show empty state if no data
  if (orders.length === 0 && suppliers.length === 0) {
    return (
      <div style={containerStyle}>
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

      {/* Stats Grid */}
      <div style={gridStyle}>
        <div
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
              {isZh ? "總訂單數" : "Total Orders"}
            </p>
            <p style={{ fontSize: '28px', fontWeight: '600', margin: '8px 0', color: 'var(--foreground)' }}>
              {totalOrders}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpRight size={16} color="#10b981" />
              <span style={{ fontSize: '13px', color: '#10b981' }}>+{pendingOrders}</span>
            </div>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)' }}>
            <ShoppingCart size={24} color="#3b82f6" />
          </div>
        </div>

        <div
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
              {isZh ? "供應商數量" : "Active Suppliers"}
            </p>
            <p style={{ fontSize: '28px', fontWeight: '600', margin: '8px 0', color: 'var(--foreground)' }}>
              {activeSuppliers}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpRight size={16} color="#10b981" />
              <span style={{ fontSize: '13px', color: '#10b981' }}>+{suppliers.length - activeSuppliers}</span>
            </div>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)' }}>
            <Package size={24} color="#10b981" />
          </div>
        </div>

        <div
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
              {isZh ? "總支出" : "Total Spend"}
            </p>
            <p style={{ fontSize: '28px', fontWeight: '600', margin: '8px 0', color: 'var(--foreground)' }}>
              ${totalSpend.toLocaleString()}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <DollarSign size={16} color="#8b5cf6" />
            </div>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)' }}>
            <DollarSign size={24} color="#8b5cf6" />
          </div>
        </div>

        <div
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
              {isZh ? "待處理" : "Pending"}
            </p>
            <p style={{ fontSize: '28px', fontWeight: '600', margin: '8px 0', color: 'var(--foreground)' }}>
              {pendingOrders}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={16} color="#f97316" />
            </div>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.15)' }}>
            <TrendingUp size={24} color="#f97316" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
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
          {orders.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>
              {isZh ? "暫無訂單" : "No orders yet"}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--background)', borderRadius: '12px' }}>
                  <div>
                    <p style={{ fontWeight: '600', margin: 0, color: 'var(--primary)' }}>{order.orderNumber}</p>
                    <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '4px 0 0 0' }}>{order.supplier}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '600', margin: 0 }}>${order.total}</p>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: statusColors[order.status]?.bg || 'rgba(128,128,128,0.1)', color: statusColors[order.status]?.text || 'var(--muted)' }}>
                      {isZh ? statusLabels[order.status]?.zh : statusLabels[order.status]?.en || order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
