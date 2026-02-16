"use client";

import { useState } from "react";
import { Plus, Search, AlertTriangle, CheckCircle, TrendingUp, Calendar, Download, Eye, Edit, Trash2 } from "lucide-react";
import { useTheme } from "@/lib/i18n/ThemeContext";

interface InventoryItem {
  id: string;
  product: string;
  category: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  location: string;
  lastRestock: string;
  expiryDate: string;
}

const mockInventory: InventoryItem[] = [
  { id: "1", product: "Organic Tomatoes", category: "Vegetables", quantity: 80, minStock: 30, maxStock: 150, location: "Dry Storage B", lastRestock: "2026-02-10", expiryDate: "2026-02-28" },
  { id: "2", product: "Fresh Salmon", category: "Seafood", quantity: 45, minStock: 20, maxStock: 100, location: "Cold Storage A", lastRestock: "2026-02-14", expiryDate: "2026-02-20" },
  { id: "3", product: "Olive Oil Extra Virgin", category: "Oils", quantity: 25, minStock: 10, maxStock: 50, location: "Dry Storage A", lastRestock: "2026-02-12", expiryDate: "2026-12-31" },
  { id: "4", product: "Sea Bass", category: "Seafood", quantity: 12, minStock: 15, maxStock: 60, location: "Cold Storage A", lastRestock: "2026-02-15", expiryDate: "2026-02-18" },
  { id: "5", product: "Mixed Italian Herbs", category: "Spices", quantity: 500, minStock: 200, maxStock: 1000, location: "Spice Rack", lastRestock: "2026-02-08", expiryDate: "2026-08-15" },
  { id: "6", product: "Chicken Breast", category: "Meat", quantity: 8, minStock: 25, maxStock: 80, location: "Cold Storage B", lastRestock: "2026-02-13", expiryDate: "2026-02-22" },
  { id: "7", product: "Fresh Basil", category: "Herbs", quantity: 15, minStock: 10, maxStock: 40, location: "Cold Storage A", lastRestock: "2026-02-15", expiryDate: "2026-02-19" },
];

export default function InventoryPage() {
  const { lang } = useTheme() as { lang: "en" | "zh" };
  const [inventory] = useState<InventoryItem[]>(mockInventory);
  const [search, setSearch] = useState("");
  const [expiryFilter, setExpiryFilter] = useState("all");

  const currentLang = lang as "en" | "zh";
  const isZh = currentLang === "zh";

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const daysUntilExpiry = Math.ceil(
      (new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    let matchesExpiry = true;
    if (expiryFilter === "warning") {
      matchesExpiry = daysUntilExpiry > 0 && daysUntilExpiry <= 7;
    } else if (expiryFilter === "expired") {
      matchesExpiry = daysUntilExpiry <= 0;
    } else if (expiryFilter === "ok") {
      matchesExpiry = daysUntilExpiry > 7;
    }

    return matchesSearch && matchesExpiry;
  });

  const lowStockItems = inventory.filter((i) => i.quantity <= i.minStock);
  
  const expiredItems = inventory.filter((i) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(i.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 0;
  });

  const warningItems = inventory.filter((i) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(i.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
  });

  const totalValue = inventory.reduce((sum, i) => sum + i.quantity * 10, 0);

  const stats = [
    { 
      label: isZh ? "總物品" : "Total Items", 
      value: inventory.length, 
      icon: TrendingUp, 
      color: "#3b82f6" 
    },
    { 
      label: isZh ? "低庫存" : "Low Stock", 
      value: lowStockItems.length, 
      icon: AlertTriangle, 
      color: "#ef4444" 
    },
    { 
      label: isZh ? "即將過期" : "Expiring Soon", 
      value: warningItems.length, 
      icon: Calendar, 
      color: "#f97316" 
    },
    { 
      label: isZh ? "總價值" : "Total Value", 
      value: `$${totalValue}`, 
      icon: TrendingUp, 
      color: "#8b5cf6" 
    },
  ];

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.minStock) {
      return { label: isZh ? "低" : "Low", color: "bg-red-100 text-red-700" };
    }
    if (item.quantity >= item.maxStock) {
      return { label: isZh ? "過多" : "Overstock", color: "bg-yellow-100 text-yellow-700" };
    }
    return { label: isZh ? "正常" : "Healthy", color: "bg-emerald-100 text-emerald-700" };
  };

  const getExpiryStatus = (expiryDate: string) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntilExpiry <= 0) {
      return { 
        label: isZh ? "已過期" : "Expired", 
        color: "bg-red-100 text-red-700",
      };
    }
    if (daysUntilExpiry <= 7) {
      return { 
        label: isZh ? "即將過期" : "Expiring Soon", 
        color: "bg-yellow-100 text-yellow-700",
      };
    }
    return { 
      label: isZh ? "正常" : "OK", 
      color: "bg-emerald-100 text-emerald-700",
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
            {isZh ? "庫存管理" : "Inventory"}
          </h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0 0' }}>
            {isZh ? "追蹤食材庫存和有效期限" : "Track ingredient stock levels and expiry dates"}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} />
            {isZh ? "導出" : "Export"}
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} />
            {isZh ? "新增物品" : "Add Item"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>{stat.label}</p>
                <p style={{ fontSize: '28px', fontWeight: '600', margin: '8px 0 0 0' }}>{stat.value}</p>
              </div>
              <div style={{ padding: '12px', borderRadius: '12px', background: `${stat.color}15` }}>
                <stat.icon size={24} color={stat.color} />
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
            placeholder={isZh ? "搜尋物品..." : "Search items..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={expiryFilter}
          onChange={(e) => setExpiryFilter(e.target.value)}
          className="input"
          style={{ width: '180px' }}
        >
          <option value="all">{isZh ? "全部有效期" : "All Expiry"}</option>
          <option value="ok">{isZh ? "正常" : "OK"}</option>
          <option value="warning">{isZh ? "即將過期" : "Expiring Soon"}</option>
          <option value="expired">{isZh ? "已過期" : "Expired"}</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>{isZh ? "產品" : "Product"}</th>
              <th>{isZh ? "類別" : "Category"}</th>
              <th>{isZh ? "數量" : "Quantity"}</th>
              <th>{isZh ? "狀態" : "Status"}</th>
              <th>{isZh ? "有效日期" : "Expiry Date"}</th>
              <th>{isZh ? "位置" : "Location"}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => {
              const stockStatus = getStockStatus(item);
              const expiryStatus = getExpiryStatus(item.expiryDate);
              return (
                <tr key={item.id}>
                  <td style={{ fontWeight: '500' }}>{item.product}</td>
                  <td style={{ color: 'var(--muted)' }}>{item.category}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '60px', 
                        height: '6px', 
                        background: 'var(--background)', 
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${Math.min((item.quantity / item.maxStock) * 100, 100)}%`, 
                          height: '100%', 
                          background: item.quantity <= item.minStock ? '#ef4444' : 'var(--primary)',
                          borderRadius: '3px'
                        }} />
                      </div>
                      <span>{item.quantity}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ 
                      background: stockStatus.color.includes('red') ? 'rgba(239, 68, 68, 0.15)' : 
                                  stockStatus.color.includes('yellow') ? 'rgba(251, 191, 36, 0.15)' : 
                                  'rgba(16, 185, 129, 0.15)',
                      color: stockStatus.color.includes('red') ? '#ef4444' : 
                             stockStatus.color.includes('yellow') ? '#d97706' : '#059669'
                    }}>
                      {stockStatus.label}
                    </span>
                  </td>
                  <td>
                    <span className="badge" style={{ 
                      background: expiryStatus.color.includes('red') ? 'rgba(239, 68, 68, 0.15)' : 
                                  expiryStatus.color.includes('yellow') ? 'rgba(251, 191, 36, 0.15)' : 
                                  'rgba(16, 185, 129, 0.15)',
                      color: expiryStatus.color.includes('red') ? '#ef4444' : 
                             expiryStatus.color.includes('yellow') ? '#d97706' : '#059669'
                    }}>
                      {expiryStatus.label}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{item.location}</td>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
