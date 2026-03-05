"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Supplier {
  id?: string;
  supplier_number: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  status: string;
}

interface SupplierFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supplier?: Supplier | null;
}

export default function SupplierForm({ isOpen, onClose, onSuccess, supplier }: SupplierFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Supplier>({
    supplier_number: "",
    name: "",
    contact: "",
    phone: "",
    email: "",
    status: "活躍",
  });

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    } else {
      setFormData({
        supplier_number: "",
        name: "",
        contact: "",
        phone: "",
        email: "",
        status: "活躍",
      });
    }
  }, [supplier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 模擬保存
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('保存供應商:', formData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "保存失敗");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
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
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '32px',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1a1a1a' }}>
            {supplier ? '編輯供應商' : '新增供應商'}
          </h2>
          <button
            onClick={onClose}
            style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#757575' }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>供應商編號</label>
            <input
              type="text"
              value={formData.supplier_number}
              onChange={(e) => setFormData({ ...formData, supplier_number: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>名稱</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>聯絡人</label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>電話</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>電郵</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>狀態</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '14px',
                background: 'white'
              }}
            >
              <option value="活躍">活躍</option>
              <option value="待審核">待審核</option>
              <option value="停用">停用</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '12px 24px',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '12px',
                color: '#757575',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                opacity: loading ? 0.6 : 1
              }}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                background: '#2d9e6d',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
