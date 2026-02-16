"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, X } from "lucide-react";

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
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState<"en" | "zh">("zh");
  const [showModal, setShowModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
  });

  const isZh = lang === "zh";

  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.contact && newSupplier.phone && newSupplier.email) {
      const supplier: Supplier = {
        id: String(suppliers.length + 1),
        ...newSupplier,
        isActive: true,
      };
      setSuppliers([...suppliers, supplier]);
      setShowModal(false);
      setNewSupplier({ name: "", contact: "", phone: "", email: "", address: "" });
    }
  };

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase())
  );

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
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          {isZh ? "新增供應商" : "Add Supplier"}
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} size={18} />
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
              <span className="badge" style={{
                background: supplier.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                color: supplier.isActive ? '#059669' : '#6b7280',
              }}>
                {supplier.isActive ? (isZh ? "活躍" : "Active") : (isZh ? "暫停" : "Inactive")}
              </span>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '14px' }}>
                <Phone size={14} />{supplier.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '14px' }}>
                <Mail size={14} />{supplier.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '14px' }}>
                <MapPin size={14} />{supplier.address}
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button className="btn-secondary" style={{ flex: 1 }}>
                {isZh ? "聯絡" : "Contact"}
              </button>
              <button className="btn-secondary" style={{ padding: '10px' }}>
                <Edit size={18} />
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '10px', color: '#ef4444' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
                {isZh ? "新增供應商" : "Add Supplier"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  {isZh ? "公司名稱" : "Company Name"}
                </label>
                <input
                  type="text"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="input"
                  placeholder={isZh ? "輸入公司名稱" : "Enter company name"}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  {isZh ? "聯絡人" : "Contact Person"}
                </label>
                <input
                  type="text"
                  value={newSupplier.contact}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                  className="input"
                  placeholder={isZh ? "輸入聯絡人姓名" : "Enter contact name"}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  {isZh ? "電話" : "Phone"}
                </label>
                <input
                  type="text"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  className="input"
                  placeholder={isZh ? "輸入電話號碼" : "Enter phone number"}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  {isZh ? "電郵" : "Email"}
                </label>
                <input
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  className="input"
                  placeholder={isZh ? "輸入電郵地址" : "Enter email address"}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  {isZh ? "地址" : "Address"}
                </label>
                <input
                  type="text"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  className="input"
                  placeholder={isZh ? "輸入公司地址" : "Enter company address"}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  {isZh ? "取消" : "Cancel"}
                </button>
                <button
                  onClick={handleAddSupplier}
                  className="btn-primary"
                  style={{ flex: 1 }}
                  disabled={!newSupplier.name || !newSupplier.contact || !newSupplier.phone || !newSupplier.email}
                >
                  {isZh ? "創建供應商" : "Create Supplier"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
