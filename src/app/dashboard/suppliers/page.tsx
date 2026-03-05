"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, Edit, Trash2, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import SupplierForm from "@/components/suppliers/SupplierForm";


interface Supplier {
  id: string;
  supplier_number: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

// Mock data for demo
const mockSuppliers: Supplier[] = [
  { id: '1', supplier_number: 'SUP-001', name: 'Fresh Farm Co', contact: 'John Smith', phone: '+852 1234 5678', email: 'john@freshfarm.com', status: '活躍' },
  { id: '2', supplier_number: 'SUP-002', name: 'Ocean Seafood', contact: 'Mary Chan', phone: '+852 2345 6789', email: 'mary@ocean.com', status: '活躍' },
  { id: '3', supplier_number: 'SUP-003', name: 'Kitchen Supplies Ltd', contact: 'David Wong', phone: '+852 3456 7890', email: 'david@kitchen.com', status: '待審核' },
  { id: '4', supplier_number: 'SUP-004', name: 'Spice World', contact: 'Lisa Lau', phone: '+852 4567 8901', email: 'lisa@spice.com', status: '活躍' },
];

export default function SuppliersPage() {
  const [isDark, setIsDark] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
  }, []);

  // Fetch suppliers (using mock data)
  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use mock data as fallback
      await new Promise(resolve => setTimeout(resolve, 500));
      setSuppliers(mockSuppliers);
    } catch (err: any) {
      console.error("Error fetching suppliers:", err);
      setError("無法載入供應商資料");
      setSuppliers(mockSuppliers); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSaveSupplier = () => {
    // Mock save - in real app would receive supplier data
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? editingSupplier : s));
    } else {
      setSuppliers([...suppliers, { ...editingSupplier!, id: String(Date.now()) }]);
    }
    setIsFormOpen(false);
    setEditingSupplier(null);
  };

  const handleDeleteSupplier = async (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    setDeletingId(null);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '活躍': return <CheckCircle size={14} />;
      case '待審核': return <Clock size={14} />;
      default: return <XCircle size={14} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '活躍': return '#4ade80';
      case '待審核': return '#f59e0b';
      default: return '#ef4444';
    }
  };

  if (loading) {
    return (
      <div style={{ background: isDark ? '#111827' : '#f5f5f5', minHeight: '100vh', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: isDark ? '#9ca3af' : '#757575', fontSize: '16px' }}>載入中...</div>
      </div>
    );
  }

  return (
    <div style={{ background: isDark ? '#111827' : '#f5f5f5', minHeight: '100vh', padding: '24px', transition: 'all 0.3s ease' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>
            供應商管理
          </h1>
          <p style={{ margin: 0, color: isDark ? '#9ca3af' : '#757575', fontSize: '14px', transition: 'color 0.3s ease' }}>
            管理供應商資料同聯絡方式
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          style={{
            padding: '12px 24px',
            background: '#2d9e6d',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={20} /> 新增供應商
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ padding: '20px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <p style={{ margin: '0 0 8px 0', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', transition: 'color 0.3s ease' }}>總供應商</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>{suppliers.length}</p>
        </div>
        <div style={{ padding: '20px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <p style={{ margin: '0 0 8px 0', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', transition: 'color 0.3s ease' }}>活躍</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#2d9e6d' }}>{suppliers.filter(s => s.status === '活躍').length}</p>
        </div>
        <div style={{ padding: '20px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <p style={{ margin: '0 0 8px 0', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', transition: 'color 0.3s ease' }}>待審核</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{suppliers.filter(s => s.status === '待審核').length}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '16px',
          background: isDark ? '#450a0a' : '#fef2f2',
          border: '1px solid ' + (isDark ? '#7f1d1d' : '#fecaca'),
          borderRadius: '12px',
          color: '#f87171',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease'
        }}>
          <span>{error}</span>
          <button
            onClick={fetchSuppliers}
            style={{
              padding: '6px 12px',
              background: '#dc2626',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RefreshCw size={14} /> 重試
          </button>
        </div>
      )}

      {/* Suppliers Table */}
      <div style={{ background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', transition: 'all 0.3s ease' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid ' + (isDark ? '#374151' : '#f5f5f5') }}>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>供應商編號</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>名稱</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>聯絡人</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>電話</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>電郵</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>狀態</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} style={{ borderBottom: '1px solid ' + (isDark ? '#374151' : '#f5f5f5'), transition: 'border-color 0.3s ease' }}>
                <td style={{ padding: '16px', color: '#2d9e6d', fontSize: '14px', fontWeight: '600' }}>{supplier.supplier_number}</td>
                <td style={{ padding: '16px', color: isDark ? '#f9fafb' : '#1a1a1a', fontSize: '14px', fontWeight: '600', transition: 'color 0.3s ease' }}>{supplier.name}</td>
                <td style={{ padding: '16px', color: isDark ? '#9ca3af' : '#757575', fontSize: '14px', transition: 'color 0.3s ease' }}>{supplier.contact}</td>
                <td style={{ padding: '16px', color: isDark ? '#9ca3af' : '#757575', fontSize: '14px', transition: 'color 0.3s ease' }}>{supplier.phone}</td>
                <td style={{ padding: '16px', color: isDark ? '#9ca3af' : '#757575', fontSize: '14px', transition: 'color 0.3s ease' }}>{supplier.email}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 12px',
                    background: getStatusColor(supplier.status) + '20',
                    color: getStatusColor(supplier.status),
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {getStatusIcon(supplier.status)}
                    {supplier.status}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditSupplier(supplier)}
                      style={{ padding: '6px 12px', background: '#f5f5f5', border: 'none', borderRadius: '8px', color: '#757575', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center' }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingId(supplier.id)}
                      style={{ padding: '6px 12px', background: '#f5f5f5', border: 'none', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Supplier Form Modal */}
      {isFormOpen && (
        <SupplierForm
          isOpen={isFormOpen}
          supplier={editingSupplier}
          onClose={() => {
            setIsFormOpen(false);
            setEditingSupplier(null);
          }}
          onSuccess={handleSaveSupplier}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
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
            maxWidth: '400px',
            width: '100%'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#1a1a1a' }}>確認刪除</h3>
            <p style={{ color: '#757575', margin: '0 0 24px 0' }}>你係咪想刪除此供應商？</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeletingId(null)}
                style={{ padding: '10px 20px', background: '#f5f5f5', border: 'none', borderRadius: '12px', color: '#757575', cursor: 'pointer', fontWeight: '600' }}
              >
                取消
              </button>
              <button
                onClick={() => handleDeleteSupplier(deletingId)}
                style={{ padding: '10px 20px', background: '#ef4444', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', fontWeight: '600' }}
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
