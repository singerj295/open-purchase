"use client";

import { useState } from "react";
import { Plus, Search, AlertTriangle, CheckCircle, TrendingUp, Calendar, Download } from "lucide-react";
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
  const { lang, t } = useTheme();
  const [inventory] = useState<InventoryItem[]>(mockInventory);
  const [search, setSearch] = useState("");
  const [expiryFilter, setExpiryFilter] = useState("all");


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
      label: "Total Items", 
      labelZh: "總物品", 
      value: inventory.length, 
      icon: TrendingUp, 
      color: "text-blue-600", 
      bg: "bg-blue-100" 
    },
    { 
      label: "Low Stock", 
      labelZh: "低庫存", 
      value: lowStockItems.length, 
      icon: AlertTriangle, 
      color: "text-red-600", 
      bg: "bg-red-100" 
    },
    { 
      label: "Expiring Soon", 
      labelZh: "即將過期", 
      value: warningItems.length, 
      icon: Calendar, 
      color: "text-yellow-600", 
      bg: "bg-yellow-100" 
    },
    { 
      label: "Total Value", 
      labelZh: "總價值", 
      value: `$${totalValue}`, 
      icon: TrendingUp, 
      color: "text-purple-600", 
      bg: "bg-purple-100" 
    },
  ];

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.minStock) return { label: t.$1), color: "bg-red-100 text-red-700" };
    if (item.quantity >= item.maxStock) return { label: t.$1), color: "bg-yellow-100 text-yellow-700" };
    return { label: t.$1), color: "bg-emerald-100 text-emerald-700" };
  };

  const getExpiryStatus = (expiryDate: string) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntilExpiry <= 0) {
      return { 
        label: t.$1), 
        color: "bg-red-100 text-red-700",
        days: t.$1)
      };
    }
    if (daysUntilExpiry <= 7) {
      return { 
        label: t.$1), 
        color: "bg-yellow-100 text-yellow-700",
        days: `${daysUntilExpiry}${t.$1)}`
      };
    }
    return { 
      label: t.$1), 
      color: "bg-emerald-100 text-emerald-700",
      days: `${daysUntilExpiry}${t.$1)}`
    };
  };

  const getStockPercentage = (item: InventoryItem) => Math.min((item.quantity / item.maxStock) * 100, 100);

  const handleExport = () => {
    alert(t.$1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.inventory.title}</h1>
          <p className="text-gray-500">{t.inventory.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download size={20} />
            {t.$1)}
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
            <Plus size={20} />
            {t.$1)}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-500 text-sm">{lang === 'zh' ? stat.labelZh : stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-semibold text-red-700 flex items-center gap-2">
            <AlertTriangle size={20} />
            {t.$1)}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {lowStockItems.map((item) => (
              <span key={item.id} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                {item.product}: {item.quantity}/{item.minStock}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Expiry Alert */}
      {(expiredItems.length > 0 || warningItems.length > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-700 flex items-center gap-2">
            <Calendar size={20} />
            {t.$1)}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {expiredItems.map((item) => (
              <span key={item.id} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
                ❌ {item.product} - {t.$1)}
              </span>
            ))}
            {warningItems.map((item) => {
              const daysUntilExpiry = Math.ceil(
                (new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              return (
                <span key={item.id} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center gap-1">
                  ⚠️ {item.product} - {daysUntilExpiry}{t.$1)}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t.$1)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
          />
        </div>
        <select
          value={expiryFilter}
          onChange={(e) => setExpiryFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
        >
          <option value="all">{t.$1)}</option>
          <option value="ok">{t.$1)}</option>
          <option value="warning">{t.$1)}</option>
          <option value="expired">{t.$1)}</option>
        </select>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((item) => {
          const status = getStockStatus(item);
          const expiry = getExpiryStatus(item.expiryDate);
          const percentage = getStockPercentage(item);
          
          return (
            <div key={item.id} className={`bg-white rounded-xl p-6 shadow-sm border ${expiredItems.find(e => e.id === item.id) ? 'border-red-300' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.product}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${expiry.color}`}>
                    {expiry.days}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">{t.inventory.quantity}</span>
                  <span className="font-medium">{item.quantity}/{item.maxStock}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      percentage > 80 ? "bg-yellow-500" : percentage > 50 ? "bg-emerald-500" : "bg-red-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between text-sm text-gray-500">
                <span>{t.$1)} {item.minStock}</span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {item.expiryDate}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {t.$1)}
        </div>
      )}
    </div>
  );
}
