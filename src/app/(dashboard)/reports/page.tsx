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
  const { lang } = useTheme() as { lang: "en" | "zh" };
  const [selectedType, setSelectedType] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  const currentLang = lang as "en" | "zh";
  const isZh = currentLang === "zh";

  const filteredReports = mockReports.filter(
    (r) => selectedType === "all" || r.type === selectedType
  );

  const stats = [
    { 
      label: isZh ? "總訂單" : "Total Orders", 
      value: "156", 
      icon: ShoppingCart, 
      color: "#3b82f6",
    },
    { 
      label: isZh ? "總支出" : "Total Spend", 
      value: "$42,650", 
      icon: DollarSign, 
      color: "#10b981",
    },
    { 
      label: isZh ? "供應商數" : "Suppliers", 
      value: "24", 
      icon: Package, 
      color: "#8b5cf6",
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
            {isZh ? "報告" : "Reports"}
          </h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0 0' }}>
            {isZh ? "生成和分析業務報告" : "Generate and analyze business reports"}
          </p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} />
          {isZh ? "生成報告" : "Generate Report"}
        </button>
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
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="input"
          style={{ width: '180px' }}
        >
          <option value="all">{isZh ? "全部類型" : "All Types"}</option>
          <option value="orders">{isZh ? "訂單" : "Orders"}</option>
          <option value="inventory">{isZh ? "庫存" : "Inventory"}</option>
          <option value="spend">{isZh ? "支出" : "Spend"}</option>
          <option value="suppliers">{isZh ? "供應商" : "Suppliers"}</option>
        </select>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="input"
          style={{ width: '150px' }}
        >
          <option value="week">{isZh ? "本週" : "This Week"}</option>
          <option value="month">{isZh ? "本月" : "This Month"}</option>
          <option value="quarter">{isZh ? "本季" : "This Quarter"}</option>
          <option value="year">{isZh ? "本年" : "This Year"}</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="card" style={{ padding: '24px' }}>
        <table>
          <thead>
            <tr>
              <th>{isZh ? "報告名稱" : "Report Name"}</th>
              <th>{isZh ? "類型" : "Type"}</th>
              <th>{isZh ? "最後生成" : "Last Generated"}</th>
              <th>{isZh ? "格式" : "Format"}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id}>
                <td style={{ fontWeight: '500' }}>{report.name}</td>
                <td>
                  <span className="badge" style={{ background: 'rgba(45, 158, 109, 0.15)', color: 'var(--primary)' }}>
                    {report.type}
                  </span>
                </td>
                <td style={{ color: 'var(--muted)' }}>{report.lastGenerated}</td>
                <td style={{ textTransform: 'uppercase', fontSize: '12px', color: 'var(--muted)' }}>{report.format}</td>
                <td>
                  <button
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={16} />
                    {isZh ? "下載" : "Download"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
