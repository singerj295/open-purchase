"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, X, Truck, Box } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  deliveryDay: string;
  moq: string;
  category: string;
  notes: string;
  isActive: boolean;
}

const mockSuppliers: Supplier[] = [
  { id: "1", name: "Fresh Farm Co", contact: "John Smith", phone: "+852 1234 5678", email: "john@freshfarm.com", address: "123 Farm Road, NT", deliveryDay: "Mon,Wed,Fri", moq: "500", category: "Vegetables", notes: "Fresh produce", isActive: true },
  { id: "2", name: "Ocean Seafood", contact: "Mary Chan", phone: "+852 2345 6789", email: "mary@ocean.com", address: "456 Aberdeen Market", deliveryDay: "Tue,Thu,Sat", moq: "300", category: "Seafood", notes: "Fresh catch daily", isActive: true },
  { id: "3", name: "Kitchen Supplies Ltd", contact: "David Wong", phone: "+852 3456 7890", email: "david@kitchen.com", address: "789 Kwai Chung", deliveryDay: "Mon,Fri", moq: "1000", category: "Dry Goods", notes: "Bulk orders", isActive: true },
  { id: "4", name: "Spice World", contact: "Lisa Lau", phone: "+852 4567 8901", email: "lisa@spice.com", address: "321 Mong Kok", deliveryDay: "Wed", moq: "200", category: "Spices", notes: "Import spices", isActive: false },
];

const categories = ["Vegetables", "Seafood", "Meat", "Dry Goods", "Spices", "Oils", "Beverages", "Equipment", "Other"];

interface User {
  id: string;
  name: string;
  email: string;
  restaurantName: string;
  restaurantAddress: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]); // Start empty for all users
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState<"en" | "zh">("zh");
  const [showModal, setShowModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
    deliveryDay: "",
    moq: "",
    category: "",
    notes: "",
  });
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("open-purchase-lang");
    if (saved === "en" || saved === "zh") {
      setLang(saved);
    }
    
    const savedUser = localStorage.getItem('open-purchase-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }

    // Load suppliers from localStorage
    const savedSuppliers = localStorage.getItem('open-purchase-suppliers');
    if (savedSuppliers) {
      try {
        setSuppliers(JSON.parse(savedSuppliers));
      } catch (e) {
        setSuppliers([]);
      }
    }

    // Listen for storage changes (when user updates from another tab/page)
    const handleStorageChange = () => {
      const savedSuppliers = localStorage.getItem('open-purchase-suppliers');
      if (savedSuppliers) {
        try {
          setSuppliers(JSON.parse(savedSuppliers));
        } catch (e) {
          setSuppliers([]);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isZh = lang === "zh";
  const isBlankUser = user?.email === "eldon@chta.one" || user?.name === "";

  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.contact && newSupplier.phone && newSupplier.email) {
      const supplier: Supplier = {
        id: String(suppliers.length + 1),
        ...newSupplier,
        isActive: true,
      };
      // Save new suppliers to variable first (to avoid stale state)
      const newSuppliers = [...suppliers, supplier];
      setSuppliers(newSuppliers);
      localStorage.setItem('open-purchase-suppliers', JSON.stringify(newSuppliers));
      setShowModal(false);
      setNewSupplier({ name: "", contact: "", phone: "", email: "", address: "", deliveryDay: "", moq: "", category: "", notes: "" });
    }
  };

  const handleDeleteSupplier = (id: string) => {
    if (confirm(isZh ? "確定刪除此供應商？" : "Delete this supplier?")) {
      const updated = suppliers.filter(s => s.id !== id);
      setSuppliers(updated);
      localStorage.setItem('open-purchase-suppliers', JSON.stringify(updated));
    }
  };

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
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
            {new Set(suppliers.map(s => s.category)).size}
          </h3>
          <p style={{ color: 'var(--muted)', marginTop: '4px' }}>{isZh ? "類別數量" : "Categories"}</p>
        </div>
      </div>

      {/* Empty State for blank users */}
      {isBlankUser ? (
        <div style={{ 
          background: 'var(--card-bg)', 
          borderRadius: '16px', 
          padding: '60px', 
          boxShadow: '0 2px 8px var(--shadow)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏪</div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
            {isZh ? "還沒有供應商" : "No Suppliers Yet"}
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
            {isZh ? "添加供應商來開始採購管理" : "Add suppliers to start managing your procurement"}
          </p>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'inline-flex',
              padding: '12px 24px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            {isZh ? "添加供應商" : "Add Supplier"}
          </button>
        </div>
        ) : (
        <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
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

            {/* Category */}
            <div style={{ marginTop: '12px' }}>
              <span className="badge" style={{ background: 'rgba(45, 158, 109, 0.15)', color: 'var(--primary)' }}>
                {supplier.category}
              </span>
            </div>

            {/* Contact Info */}
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

            {/* Delivery & MOQ */}
            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'var(--background)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' }}>
                  <Truck size={14} />{isZh ? "車期" : "Delivery"}
                </div>
                <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>{supplier.deliveryDay || "-"}</p>
              </div>
              <div style={{ padding: '12px', background: 'var(--background)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' }}>
                  <Box size={14} />{isZh ? "最低訂量" : "MOQ"}
                </div>
                <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>{supplier.moq ? `$${supplier.moq}` : "-"}</p>
              </div>
            </div>

            {/* Notes */}
            {supplier.notes && (
              <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic' }}>
                "{supplier.notes}"
              </p>
            )}

            {/* Actions */}
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button className="btn-secondary" style={{ flex: 1 }}>
                {isZh ? "聯絡" : "Contact"}
              </button>
              <button className="btn-secondary" style={{ padding: '10px' }}>
                <Edit size={18} />
              </button>
              <button className="btn-secondary" style={{ padding: '10px', color: '#ef4444' }} onClick={() => handleDeleteSupplier(supplier.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      </>)}

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
          padding: '20px',
          overflow: 'auto',
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '560px', padding: '32px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
                {isZh ? "新增供應商" : "Add Supplier"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    {isZh ? "公司名稱 *" : "Company Name *"}
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
                    {isZh ? "聯絡人 *" : "Contact Person *"}
                  </label>
                  <input
                    type="text"
                    value={newSupplier.contact}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                    className="input"
                    placeholder={isZh ? "輸入聯絡人" : "Enter contact name"}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              
              {/* Contact */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    {isZh ? "電話 *" : "Phone *"}
                  </label>
                  <input
                    type="text"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="input"
                    placeholder={isZh ? "輸入電話" : "Enter phone"}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    {isZh ? "電郵 *" : "Email *"}
                  </label>
                  <input
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    className="input"
                    placeholder={isZh ? "輸入電郵" : "Enter email"}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              
              {/* Address */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  {isZh ? "地址" : "Address"}
                </label>
                <input
                  type="text"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  className="input"
                  placeholder={isZh ? "輸入地址" : "Enter address"}
                  style={{ width: '100%' }}
                />
              </div>
              
              {/* Category & MOQ */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    {isZh ? "類別" : "Category"}
                  </label>
                  <select
                    value={newSupplier.category}
                    onChange={(e) => setNewSupplier({ ...newSupplier, category: e.target.value })}
                    className="input"
                    style={{ width: '100%' }}
                  >
                    <option value="">{isZh ? "選擇類別" : "Select category"}</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    {isZh ? "最低訂量 (MOQ)" : "Minimum Order Qty"}
                  </label>
                  <input
                    type="text"
                    value={newSupplier.moq}
                    onChange={(e) => setNewSupplier({ ...newSupplier, moq: e.target.value })}
                    className="input"
                    placeholder={isZh ? "輸入MOQ" : "Enter MOQ"}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              
              {/* Delivery */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  {isZh ? "送貨日子 (車期)" : "Delivery Days"}
                </label>
                <input
                  type="text"
                  value={newSupplier.deliveryDay}
                  onChange={(e) => setNewSupplier({ ...newSupplier, deliveryDay: e.target.value })}
                  className="input"
                  placeholder={isZh ? "如：Mon,Wed,Fri" : "e.g., Mon,Wed,Fri"}
                  style={{ width: '100%' }}
                />
              </div>
              
              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  {isZh ? "備註" : "Notes"}
                </label>
                <textarea
                  value={newSupplier.notes}
                  onChange={(e) => setNewSupplier({ ...newSupplier, notes: e.target.value })}
                  className="input"
                  placeholder={isZh ? "輸入備註" : "Enter notes"}
                  rows={3}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
              
              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>
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
