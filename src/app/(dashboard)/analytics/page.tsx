"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users } from "lucide-react";

const monthlySpend = [
  { month: "Jan", spend: 8500 },
  { month: "Feb", spend: 9200 },
  { month: "Mar", spend: 7800 },
  { month: "Apr", spend: 10500 },
  { month: "May", spend: 11200 },
  { month: "Jun", spend: 12450 },
];

const categoryData = [
  { name: "Seafood", value: 3500, color: "#3b82f6" },
  { name: "Vegetables", value: 2800, color: "#10b981" },
  { name: "Meat", value: 2200, color: "#f59e0b" },
  { name: "Dry Goods", value: 1800, color: "#8b5cf6" },
  { name: "Spices", value: 950, color: "#ef4444" },
];

const supplierPerformance = [
  { name: "Fresh Farm Co", orders: 45, rating: 4.8, spend: 4500 },
  { name: "Ocean Seafood", orders: 32, rating: 4.5, spend: 6200 },
  { name: "Kitchen Supplies", orders: 28, rating: 4.2, spend: 2800 },
  { name: "Spice World", orders: 15, rating: 4.6, spend: 950 },
];

const weeklyOrders = [
  { day: "Mon", orders: 12 },
  { day: "Tue", orders: 18 },
  { day: "Wed", orders: 15 },
  { day: "Thu", orders: 22 },
  { day: "Fri", orders: 28 },
  { day: "Sat", orders: 8 },
  { day: "Sun", orders: 5 },
];

export default function AnalyticsPage() {
  const metrics = [
    {
      label: "Total Spend",
      value: "$42,650",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Total Orders",
      value: "156",
      change: "+8%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Avg Order Value",
      value: "$273",
      change: "-3%",
      trend: "down",
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      label: "Active Suppliers",
      value: "24",
      change: "+2",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500">Track your procurement performance</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${metric.bg}`}>
                <metric.icon className={metric.color} size={24} />
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  metric.trend === "up" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {metric.change}
                {metric.trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
              <p className="text-gray-500 text-sm">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spend Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySpend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line type="monotone" dataKey="spend" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Orders */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-sm text-gray-600">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Supplier Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier Performance</h3>
          <div className="space-y-4">
            {supplierPerformance.map((supplier) => (
              <div key={supplier.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                  <p className="text-sm text-gray-500">{supplier.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${supplier.spend.toLocaleString()}</p>
                  <p className="text-sm text-emerald-600">★ {supplier.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
