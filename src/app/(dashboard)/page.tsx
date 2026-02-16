"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { ArrowUpRight, ArrowDownRight, Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { useTheme } from "@/lib/i18n/ThemeContext";

const stats = [
  {
    label: "Total Orders",
    labelZh: "總訂單數",
    value: "156",
    change: "+12%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    label: "Active Suppliers",
    labelZh: "供應商數量",
    value: "24",
    change: "+2",
    trend: "up",
    icon: Package,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    label: "Monthly Spend",
    labelZh: "月度支出",
    value: "$12,450",
    change: "-5%",
    trend: "down",
    icon: DollarSign,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    label: "Cost Savings",
    labelZh: "成本節省",
    value: "$892",
    change: "+18%",
    trend: "up",
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
];

const orderData = [
  { name: "Mon", orders: 12 },
  { name: "Tue", orders: 19 },
  { name: "Wed", orders: 15 },
  { name: "Thu", orders: 22 },
  { name: "Fri", orders: 18 },
  { name: "Sat", orders: 25 },
  { name: "Sun", orders: 8 },
];

const spendData = [
  { name: "Week 1", spend: 2800 },
  { name: "Week 2", spend: 3200 },
  { name: "Week 3", spend: 2900 },
  { name: "Week 4", spend: 3550 },
];

const recentOrders = [
  { id: "ORD-001", supplier: "Fresh Farm Co", items: 12, total: "$450", status: "delivered" },
  { id: "ORD-002", supplier: "Ocean Seafood", items: 8, total: "$890", status: "shipping" },
  { id: "ORD-003", supplier: "Kitchen Supplies", items: 24, total: "$320", status: "pending" },
  { id: "ORD-004", supplier: "Fresh Farm Co", items: 15, total: "$560", status: "confirmed" },
  { id: "ORD-005", supplier: "Spice World", items: 6, total: "$180", status: "delivered" },
];

const statusLabels: Record<string, { en: string; zh: string }> = {
  delivered: { en: "Delivered", zh: "已送達" },
  shipping: { en: "Shipped", zh: "已發貨" },
  pending: { en: "Pending", zh: "待處理" },
  confirmed: { en: "Confirmed", zh: "已確認" },
};

export default function DashboardPage() {
  const { lang, t } = useTheme();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.dashboard.title}</h1>
          <p className="text-gray-500">{t.dashboard.subtitle}</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          + {t.dashboard.newOrder}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
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
                {stat.trend === "up" ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-500 text-sm">{lang === 'zh' ? stat.labelZh : stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {lang === 'zh' ? '本週訂單' : 'Orders This Week'}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spend Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {lang === 'zh' ? '月度支出' : 'Monthly Spend'}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={spendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="spend"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{t.dashboard.recentOrders}</h3>
            <a href="/orders" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              {lang === 'zh' ? '查看全部 →' : 'View All →'}
            </a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {lang === 'zh' ? '訂單編號' : 'Order ID'}
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
                    {order.items} {lang === 'zh' ? '項' : 'items'}
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
                      {statusLabels[order.status]?.[lang] || order.status}
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
