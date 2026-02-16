"use client";

import { useState } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

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

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-purple-100 text-purple-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<string, { en: string; zh: string }> = {
  pending: { en: "Pending", zh: "待處理" },
  confirmed: { en: "Confirmed", zh: "已確認" },
  shipped: { en: "Shipped", zh: "已發貨" },
  delivered: { en: "Delivered", zh: "已送達" },
  cancelled: { en: "Cancelled", zh: "已取消" },
};

export default function OrdersPage() {
  const { lang, t } = useLanguage();
  const [orders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.supplier.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: "Total Orders", labelZh: "總訂單", value: orders.length },
    { label: "Pending", labelZh: "待處理", value: orders.filter((o) => o.status === "pending").length },
    { label: "Delivered", labelZh: "已送達", value: orders.filter((o) => o.status === "delivered").length },
    { label: "Total Value", labelZh: "總額", value: `$${orders.reduce((sum, o) => sum + o.total, 0)}` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.orders.title}</h1>
          <p className="text-gray-500">{t.orders.subtitle}</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
          <Plus size={20} />
          {t.orders.newOrder}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border">
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{lang === 'zh' ? stat.labelZh : stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t.common.search + "..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">{t.common.filter}</option>
          <option value="pending">{t.orders.pending}</option>
          <option value="confirmed">{t.orders.confirmed}</option>
          <option value="shipped">{t.orders.shipped}</option>
          <option value="delivered">{t.orders.delivered}</option>
          <option value="cancelled">{t.orders.cancelled}</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.orders.orderNumber}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.orders.supplier}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.orders.items}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.orders.total}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.orders.status}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.orders.date}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.orders.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.supplier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.items}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]?.[lang] || order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-red-500">
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
