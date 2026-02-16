"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  Menu,
  Bell,
  Search,
} from "lucide-react";

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: ShoppingCart, label: "Orders", href: "/orders" },
    { icon: Users, label: "Suppliers", href: "/suppliers" },
    { icon: Package, label: "Inventory", href: "/inventory" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r shadow-sm transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-emerald-600">🍽️ Open Purchase</h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
            >
              <item.icon size={20} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products, suppliers, orders..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
              OP
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <DashboardContent />
        </div>
      </main>
    </div>
  );
}

function DashboardContent() {
  const [stats] = useState([
    {
      label: "Total Orders",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Active Suppliers",
      value: "24",
      change: "+2",
      trend: "up",
      icon: Package,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Monthly Spend",
      value: "$12,450",
      change: "-5%",
      trend: "down",
      icon: Settings,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Cost Savings",
      value: "$892",
      change: "+18%",
      trend: "up",
      icon: BarChart3,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ]);

  const recentOrders = [
    { id: "ORD-001", supplier: "Fresh Farm Co", items: 12, total: "$450", status: "delivered" },
    { id: "ORD-002", supplier: "Ocean Seafood", items: 8, total: "$890", status: "shipping" },
    { id: "ORD-003", supplier: "Kitchen Supplies", items: 24, total: "$320", status: "pending" },
    { id: "ORD-004", supplier: "Fresh Farm Co", items: 15, total: "$560", status: "confirmed" },
    { id: "ORD-005", supplier: "Spice World", items: 6, total: "$180", status: "delivered" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here&apos;s your procurement overview.</p>
        </div>
        <a
          href="/suppliers"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          + New Order
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <a href="/orders" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              View All →
            </a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.items} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.status === "shipping"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "confirmed"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
