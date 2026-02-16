"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
}

const mockSuppliers: Supplier[] = [
  { id: "1", name: "Fresh Farm Co", contact: "John Smith", phone: "+852 1234 5678", email: "john@freshfarm.com", address: "123 Farm Road, NT", isActive: true },
  { id: "2", name: "Ocean Seafood", contact: "Mary Chan", phone: "+852 2345 6789", email: "mary@ocean.com", address: "456 Aberdeen Market", isActive: true },
  { id: "3", name: "Kitchen Supplies Ltd", contact: "David Wong", phone: "+852 3456 7890", email: "david@kitchen.com", address: "789 Kwai Chung", isActive: true },
  { id: "4", name: "Spice World", contact: "Lisa Lau", phone: "+852 4567 8901", email: "lisa@spice.com", address: "321 Mong Kok", isActive: false },
];

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState<"en" | "zh">("zh");

  const isZh = lang === "zh";

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm(isZh ? "確定刪除此供應商？" : "Delete this supplier?")) {
      setSuppliers(suppliers.filter((s) => s.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
            {isZh ? "供應商管理" : "Suppliers"}
          </h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0 0' }}>
            {isZh ? "管理你的供應商資料" : "Manage your supplier information"}
          </p>
        </div>
        <button
          onClick={() => alert(isZh ? "新增供應商功能即將推出" : "Add Supplier feature coming soon")}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          {isZh ? "新增供應商" : "Add Supplier"}
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <Search
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
          size={18}
        />
        <input
          type="text"
          placeholder={isZh ? "搜尋供應商..." : "Search suppliers..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="stat-card">
          <h3 style={{ fontSize: '28px', fontWeight: '600', margin: 0 }}>{suppliers.length}</h3>
          <p style={{ color: 'var(--muted)', marginTop: '4px' }}>{isZh ? "供應商總數" : "Total Suppliers"}</p>
        </div>
        <div className="stat-card">
          <h3 style={{ fontSize: '28px', fontWeight: '600', margin: 0, color: 'var(--primary)' }}>
            {suppliers.filter((s) => s.isActive).length}
          </h3>
          <p style={{ color: 'var(--muted)', marginTop: '4px' }}>{isZh ? "活躍供應商" : "Active Suppliers"}</p>
        </div>
        <div className="stat-card">
          <h3 style={{ fontSize: '28px', fontWeight: '600', margin: 0, color: 'var(--muted)' }}>
            {suppliers.filter((s) => !s.isActive).length}
          </h3>
          <p style={{ color: 'var(--muted)', marginTop: '4px' }}>{isZh ? "暫停供應商" : "Inactive Suppliers"}</p>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{supplier.name}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>{supplier.contact}</p>
              </div>
              <span
                className="badge"
                style={{
                  background: supplier.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                  color: supplier.isActive ? '#059669' : '#6b7280',
                }}
              >
                {supplier.isActive ? (isZh ? "活躍" : "Active") : (isZh ? "暫停" : "Inactive")}
              </span>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '14px' }}>
                <Phone size={14} />
                {supplier.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '14px' }}>
                <Mail size={14} />
                {supplier.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '14px' }}>
                <MapPin size={14} />
                {supplier.address}
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button className="btn-secondary" style={{ flex: 1 }}>
                {isZh ? "聯絡" : "Contact"}
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '10px' }}
              >
                <Edit size={18} />
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '10px', color: '#ef4444' }}
                onClick={() => handleDelete(supplier.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
