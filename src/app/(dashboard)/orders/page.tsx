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

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-purple-100 text-purple-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function OrdersPage() {
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
    { label: "Total Orders", value: orders.length },
    { label: "Pending", value: orders.filter((o) => o.status === "pending").length },
    { label: "Delivered", value: orders.filter((o) => o.status === "delivered").length },
    { label: "Total Value", value: `$${orders.reduce((sum, o) => sum + o.total, 0)}` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">Manage your purchase orders</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
          <Plus size={20} />
          New Order
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border">
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-emerald-600">{order.orderNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{order.supplier}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{order.items} items</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${order.total}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                      <Trash2 size={18} />
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
