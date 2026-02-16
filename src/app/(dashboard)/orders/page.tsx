"use client";

import { useState } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  supplier: string;
  items: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  date: string;
}

const mockOrders: Order[] = [
  { id: "1", orderNumber: "ORD-001", supplier: "Fresh Farm Co", items: 12, total: 450, status: "delivered", date: "2026-02-15" },
  { id: "2", orderNumber: "ORD-002", supplier: "Ocean Seafood", items: 8, total: 890, status: "shipped", date: "2026-02-15" },
  { id: "3", orderNumber: "ORD-003", supplier: "Kitchen Supplies Ltd", items: 24, total: 320, status: "pending", date: "2026-02-16" },
  { id: "4", orderNumber: "ORD-004", supplier: "Fresh Farm Co", items: 15, total: 560, status: "confirmed", date: "2026-02-16" },
  { id: "5", orderNumber: "ORD-005", supplier: "Spice World", items: 6, total: 180, status: "cancelled", date: "2026-02-14" },
  { id: "6", orderNumber: "ORD-006", supplier: "Ocean Seafood", items: 10, total: 720, status: "pending", date: "2026-02-16" },
  { id: "7", orderNumber: "ORD-007", supplier: "Fresh Farm Co", items: 20, total: 380, status: "delivered", date: "2026-02-13" },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "rgba(251, 191, 36, 0.15)", text: "#d97706" },
  confirmed: { bg: "rgba(139, 92, 246, 0.15)", text: "#7c3aed" },
  shipped: { bg: "rgba(59, 130, 246, 0.15)", text: "#2563eb" },
  delivered: { bg: "rgba(16, 185, 129, 0.15)", text: "#059669" },
  cancelled: { bg: "rgba(107, 114, 128, 0.15)", text: "#6b7280" },
};

const statusLabels: Record<string, { en: string; zh: string }> = {
  pending: { en: "Pending", zh: "待處理" },
  confirmed: { en: "Confirmed", zh: "已確認" },
  shipped: { en: "Shipped", zh: "已發貨" },
  delivered: { en: "Delivered", zh: "已送達" },
  cancelled: { en: "Cancelled", zh: "已取消" },
};

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lang, setLang] = useState<"en" | "zh">("zh");

  const isZh = lang === "zh";

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.supplier.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: "Total Orders", labelZh: "總訂單", value: orders.length, color: "#3b82f6" },
    { label: "Pending", labelZh: "待處理", value: orders.filter((o) => o.status === "pending").length, color: "#f97316" },
    { label: "Delivered", labelZh: "已送達", value: orders.filter((o) => o.status === "delivered").length, color: "#10b981" },
    { label: "Total Value", labelZh: "總額", value: `$${orders.reduce((sum, o) => sum + o.total, 0)}`, color: "#8b5cf6" },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
            {isZh ? "訂單管理" : "Orders"}
          </h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0 0' }}>
            {isZh ? "管理你的採購訂單" : "Manage your purchase orders"}
          </p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} />
          {isZh ? "新增訂單" : "New Order"}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>{isZh ? stat.labelZh : stat.label}</p>
                <p style={{ fontSize: '24px', fontWeight: '600', margin: '8px 0 0 0' }}>{stat.value}</p>
              </div>
              <div style={{ padding: '10px', borderRadius: '12px', background: `${stat.color}15` }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
            size={18}
          />
          <input
            type="text"
            placeholder={isZh ? "搜尋訂單..." : "Search orders..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input"
          style={{ width: '150px' }}
        >
          <option value="all">{isZh ? "全部狀態" : "All Status"}</option>
          <option value="pending">{isZh ? "待處理" : "Pending"}</option>
          <option value="confirmed">{isZh ? "已確認" : "Confirmed"}</option>
          <option value="shipped">{isZh ? "已發貨" : "Shipped"}</option>
          <option value="delivered">{isZh ? "已送達" : "Delivered"}</option>
          <option value="cancelled">{isZh ? "已取消" : "Cancelled"}</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>{isZh ? "訂單編號" : "Order #"}</th>
              <th>{isZh ? "供應商" : "Supplier"}</th>
              <th>{isZh ? "項目" : "Items"}</th>
              <th>{isZh ? "總額" : "Total"}</th>
              <th>{isZh ? "狀態" : "Status"}</th>
              <th>{isZh ? "日期" : "Date"}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{order.orderNumber}</td>
                <td>{order.supplier}</td>
                <td>{order.items}</td>
                <td style={{ fontWeight: '500' }}>${order.total}</td>
                <td>
                  <span
                    className="badge"
                    style={{ background: statusColors[order.status].bg, color: statusColors[order.status].text }}
                  >
                    {isZh ? statusLabels[order.status].zh : statusLabels[order.status].en}
                  </span>
                </td>
                <td style={{ color: 'var(--muted)' }}>{order.date}</td>
                <td>
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
    </div>
  );
}
