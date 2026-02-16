"use client";

import { useState } from "react";
import { Plus, Search, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

interface InventoryItem {
  id: string;
  product: string;
  category: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  location: string;
  lastRestock: string;
}

const mockInventory: InventoryItem[] = [
  { id: "1", product: "Organic Tomatoes", category: "Vegetables", quantity: 80, minStock: 30, maxStock: 150, location: "Dry Storage B", lastRestock: "2026-02-10" },
  { id: "2", product: "Fresh Salmon", category: "Seafood", quantity: 45, minStock: 20, maxStock: 100, location: "Cold Storage A", lastRestock: "2026-02-14" },
  { id: "3", product: "Olive Oil Extra Virgin", category: "Oils", quantity: 25, minStock: 10, maxStock: 50, location: "Dry Storage A", lastRestock: "2026-02-12" },
  { id: "4", product: "Sea Bass", category: "Seafood", quantity: 12, minStock: 15, maxStock: 60, location: "Cold Storage A", lastRestock: "2026-02-15" },
  { id: "5", product: "Mixed Italian Herbs", category: "Spices", quantity: 500, minStock: 200, maxStock: 1000, location: "Spice Rack", lastRestock: "2026-02-08" },
  { id: "6", product: "Chicken Breast", category: "Meat", quantity: 8, minStock: 25, maxStock: 80, location: "Cold Storage B", lastRestock: "2026-02-13" },
  { id: "7", product: "Fresh Basil", category: "Herbs", quantity: 15, minStock: 10, maxStock: 40, location: "Cold Storage A", lastRestock: "2026-02-15" },
];

export default function InventoryPage() {
  const [inventory] = useState<InventoryItem[]>(mockInventory);
  const [search, setSearch] = useState("");

  const filteredInventory = inventory.filter(
    (item) =>
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockItems = inventory.filter((i) => i.quantity <= i.minStock);
  const totalValue = inventory.reduce((sum, i) => sum + i.quantity * 10, 0); // Mock calculation

  const stats = [
    { label: "Total Items", value: inventory.length, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Low Stock Alerts", value: lowStockItems.length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
    { label: "Healthy Stock", value: inventory.length - lowStockItems.length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Total Value", value: `$${totalValue}`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.minStock) return { label: "Low", color: "bg-red-100 text-red-700" };
    if (item.quantity >= item.maxStock) return { label: "Overstock", color: "bg-yellow-100 text-yellow-700" };
    return { label: "Healthy", color: "bg-emerald-100 text-emerald-700" };
  };

  const getStockPercentage = (item: InventoryItem) => Math.min((item.quantity / item.maxStock) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500">Monitor and manage your stock levels</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
          <Plus size={20} />
          Add Item
        </button>
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
                <p className="text-gray-500 text-sm">{stat.label}</p>
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
            Low Stock Alert - {lowStockItems.length} items need restocking
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

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((item) => {
          const status = getStockStatus(item);
          const percentage = getStockPercentage(item);
          return (
            <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.product}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Stock Level</span>
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
                <span>Min: {item.minStock}</span>
                <span>Location: {item.location}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
