"use client";

import { useState } from "react";
import { Download, FileText, Calendar, DollarSign, ShoppingCart, Package } from "lucide-react";
import { useTheme } from "@/lib/i18n/ThemeContext";

interface Report {
  id: string;
  name: string;
  type: "orders" | "inventory" | "spend" | "suppliers";
  lastGenerated: string;
  format: "pdf" | "csv" | "excel";
}

const mockReports: Report[] = [
  { id: "1", name: "Monthly Orders Summary", type: "orders", lastGenerated: "2026-02-01", format: "pdf" },
  { id: "2", name: "Inventory Status Report", type: "inventory", lastGenerated: "2026-02-10", format: "csv" },
  { id: "3", name: "Supplier Spend Analysis", type: "suppliers", lastGenerated: "2026-02-05", format: "excel" },
  { id: "4", name: "Cost Breakdown", type: "spend", lastGenerated: "2026-02-12", format: "pdf" },
];

export default function ReportsPage() {
  const { lang, t } = useTheme();
  const [selectedType, setSelectedType] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  const getText = (en: string, zh: string) => (lang === 'zh' ? zh : en);

  const filteredReports = mockReports.filter(
    (r) => selectedType === "all" || r.type === selectedType
  );

  const stats = [
    { 
      label: getText("Total Orders", "總訂單"), 
      value: "156", 
      icon: ShoppingCart, 
      color: "text-blue-600",
      bg: "bg-blue-100" 
    },
    { 
      label: getText("Total Spend", "總支出"), 
      value: "$42,650", 
      icon: DollarSign, 
      color: "text-emerald-600",
      bg: "bg-emerald-100" 
    },
    { 
      label: getText("Active Suppliers", "活躍供應商"), 
      value: "24", 
      icon: Package, 
      color: "text-purple-600",
      bg: "bg-purple-100" 
    },
  ];

  const reportTypes = [
    { value: "all", label: getText("All Reports", "所有報告") },
    { value: "orders", label: getText("Orders", "訂單") },
    { value: "inventory", label: getText("Inventory", "庫存") },
    { value: "spend", label: getText("Spend", "支出") },
    { value: "suppliers", label: getText("Suppliers", "供應商") },
  ];

  const dateRanges = [
    { value: "week", label: getText("Last 7 Days", "過去7天") },
    { value: "month", label: getText("Last 30 Days", "過去30天") },
    { value: "quarter", label: getText("Last Quarter", "上一季") },
    { value: "year", label: getText("This Year", "今年") },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getText("Reports", "報告")}
          </h1>
          <p className="text-gray-500">
            {getText("Generate and download reports", "生成和下載報告")}
          </p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
          <FileText size={20} />
          {getText("Create Report", "創建報告")}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getText("Report Type", "報告類型")}
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
            >
              {reportTypes.map((rt) => (
                <option key={rt.value} value={rt.value}>
                  {rt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              {getText("Date Range", "日期範圍")}
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
            >
              {dateRanges.map((dr) => (
                <option key={dr.value} value={dr.value}>
                  {dr.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2">
              <Download size={20} />
              {getText("Export All", "導出全部")}
            </button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900">
            {getText("Saved Reports", "已儲存的報告")}
          </h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {getText("Report Name", "報告名稱")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {getText("Type", "類型")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {getText("Last Generated", "上次生成")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {getText("Format", "格式")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {getText("Actions", "操作")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="text-gray-400" size={20} />
                    <span className="font-medium text-gray-900">{report.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {report.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {report.lastGenerated}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 uppercase">
                    {report.format}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-1 text-emerald-600">
                    <Download size={16} />
                    <span className="text-sm">{getText("Download", "下載")}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Reports */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="font-semibold text-gray-900 mb-4">
          {getText("Quick Reports", "快速報告")}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <FileText className="text-blue-500 mb-2" size={24} />
            <p className="font-medium text-gray-900">{getText("Daily Orders", "每日訂單")}</p>
            <p className="text-sm text-gray-500">{getText("Last 24 hours", "過去24小時")}</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <Package className="text-purple-500 mb-2" size={24} />
            <p className="font-medium text-gray-900">{getText("Stock Levels", "庫存水平")}</p>
            <p className="text-sm text-gray-500">{getText("Current status", "當前狀態")}</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <DollarSign className="text-emerald-500 mb-2" size={24} />
            <p className="font-medium text-gray-900">{getText("Spend Summary", "支出摘要")}</p>
            <p className="text-sm text-gray-500">{getText("This month", "本月")}</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <ShoppingCart className="text-orange-500 mb-2" size={24} />
            <p className="font-medium text-gray-900">{getText("Supplier Report", "供應商報告")}</p>
            <p className="text-sm text-gray-500">{getText("All suppliers", "所有供應商")}</p>
          </button>
        </div>
      </div>
    </div>
  );
}
