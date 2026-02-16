"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit, Trash2, X } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  supplier: string;
  product: string;
  items: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  date: string;
}

const mockOrders: Order[] = [
  { id: "1", orderNumber: "ORD-001", supplier: "Fresh Farm Co", product: "Tomatoes", items: 12, total: 450, status: "delivered", date: "2026-02-15" },
  { id: "2", orderNumber: "ORD-002", supplier: "Ocean Seafood", product: "Salmon", items: 8, total: 890, status: "shipped", date: "2026-02-15" },
  { id: "3", orderNumber: "ORD-003", supplier: "Kitchen Supplies Ltd", product: "Olive Oil", items: 24, total: 320, status: "pending", date: "2026-02-16" },
  { id: "4", orderNumber: "ORD-004", supplier: "Fresh Farm Co", product: "Chicken Breast", items: 15, total: 560, status: "confirmed", date: "2026-02-16" },
  { id: "5", orderNumber: "ORD-005", supplier: "Spice World", product: "Mixed Herbs", items: 6, total: 180, status: "cancelled", date: "2026-02-14" },
  { id: "6", orderNumber: "ORD-006", supplier: "Ocean Seafood", product: "Sea Bass", items: 10, total: 720, status: "pending", date: "2026-02-16" },
  { id: "7", orderNumber: "ORD-007", supplier: "Fresh Farm Co", product: "Fresh Basil", items: 20, total: 380, status: "delivered", date: "2026-02-13" },
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

interface User {
  id: string;
  name: string;
  email: string;
  restaurantName: string;
  restaurantAddress: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lang, setLang] = useState<"en" | "zh">("zh");
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    supplier: "",
    product: "",
    items: "",
    total: "",
  });
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

  // Show empty state for blank users
  const effectiveOrders = isBlankUser ? [] : orders;
  const effectiveSuppliers = isBlankUser ? [] : ["Fresh Farm Co", "Ocean Seafood", "Kitchen Supplies Ltd", "Spice World"];
  const products = ["Tomatoes", "Salmon", "Olive Oil", "Chicken Breast", "Pasta", "Fresh Basil", "Mixed Herbs", "Sea Bass"];

  const handleAddOrder = () => {
    if (newOrder.supplier && newOrder.product && newOrder.items && newOrder.total) {
      const order: Order = {
        id: String(orders.length + 1),
        orderNumber: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
        supplier: newOrder.supplier,
        product: newOrder.product,
        items: parseInt(newOrder.items),
        total: parseFloat(newOrder.total),
        status: "pending",
        date: new Date().toISOString().split('T')[0],
      };
      setOrders([order, ...orders]);
      setShowModal(false);
      setNewOrder({ supplier: "", product: "", items: "", total: "" });
    }
  };

  const filteredOrders = effectiveOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.supplier.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: "Total Orders", labelZh: "總訂單", value: effectiveOrders.length, color: "#3b82f6" },
    { label: "Pending", labelZh: "待處理", value: effectiveOrders.filter((o) => o.status === "pending").length, color: "#f97316" },
    { label: "Delivered", labelZh: "已送達", value: effectiveOrders.filter((o) => o.status === "delivered").length, color: "#10b981" },
    { label: "Total Value", labelZh: "總額", value: `$${effectiveOrders.reduce((sum, o) => sum + o.total, 0)}`, color: "#8b5cf6" },
  ];

  if (!mounted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>{isZh ? "訂單管理" : "Orders"}</h1>
        </div>
      </div>
    );
  }

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
        <button
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => setShowModal(true)}
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
            {isZh ? "還沒有訂單" : "No Orders Yet"}
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
            {isZh ? "添加供應商後就可以建立訂單" : "Add suppliers to create orders"}
          </p>
          <a 
            href="/suppliers"
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
            {isZh ? "添加供應商" : "Add Supplier"}
          </a>
        </div>
      ) : (
        <>
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
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} size={18} />
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
                  <th>{isZh ? "產品" : "Product"}</th>
                  <th>{isZh ? "供應商" : "Supplier"}</th>
                  <th>{isZh ? "數量" : "Qty"}</th>
                  <th>{isZh ? "總額" : "Total"}</th>
                  <th>{isZh ? "狀態" : "Status"}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{order.orderNumber}</td>
                    <td>{order.product}</td>
                    <td>{order.supplier}</td>
                    <td>{order.items}</td>
                    <td style={{ fontWeight: '500' }}>${order.total}</td>
                    <td>
                      <span className="badge" style={{ background: statusColors[order.status].bg, color: statusColors[order.status].text }}>
                        {isZh ? statusLabels[order.status].zh : statusLabels[order.status].en}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ padding: '6px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                          <Eye size={16} />
                        </button>
                        <button style={{ padding: '6px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                          <Edit size                        </button>
={16} />
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

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
                {isZh ? "新增訂單" : "New Order"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  {isZh ? "供應商" : "Supplier"}
                </label>
                <select
                  value={newOrder.supplier}
                  onChange={(e) => setNewOrder({ ...newOrder, supplier: e.target.value })}
                  className="input"
                  style={{ width: '100%' }}
                >
                  <option value="">{isZh ? "選擇供應商" : "Select supplier"}</option>
                  {effectiveSuppliers.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  {isZh ? "產品" : "Product"}
                </label>
                <select
                  value={newOrder.product}
                  onChange={(e) => setNewOrder({ ...newOrder, product: e.target.value })}
                  className="input"
                  style={{ width: '100%' }}
                >
                  <option value="">{isZh ? "選擇產品" : "Select product"}</option>
                  {products.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  {isZh ? "項目數量" : "Number of Items"}
                </label>
                <input
                  type="number"
                  value={newOrder.items}
                  onChange={(e) => setNewOrder({ ...newOrder, items: e.target.value })}
                  className="input"
                  placeholder={isZh ? "輸入數量" : "Enter quantity"}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  {isZh ? "總額 ($)" : "Total ($)"}
                </label>
                <input
                  type="number"
                  value={newOrder.total}
                  onChange={(e) => setNewOrder({ ...newOrder, total: e.target.value })}
                  className="input"
                  placeholder={isZh ? "輸入金額" : "Enter amount"}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  {isZh ? "取消" : "Cancel"}
                </button>
                <button
                  onClick={handleAddOrder}
                  className="btn-primary"
                  style={{ flex: 1 }}
                  disabled={!newOrder.supplier || !newOrder.product || !newOrder.items || !newOrder.total}
                >
                  {isZh ? "創建訂單" : "Create Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
