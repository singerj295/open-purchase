"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Edit, Trash2, AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import InventoryForm from "@/components/inventory/InventoryForm";

interface InventoryItem {
  id: string;
  product_id: string;
  quantity: number;
  min_stock: number;
  max_stock: number;
  last_restock: string | null;
  created_at: string;
  updated_at: string;
  products?: {
    name: string;
    sku: string;
    category: string;
    unit: string;
  };
}

type AlertStatus = "normal" | "low" | "excess" | "out";

// Mock data for demo
const mockInventory: InventoryItem[] = [
  { id: '1', product_id: 'prod-1', quantity: 150, min_stock: 50, max_stock: 200, last_restock: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), products: { name: 'Tomatoes', sku: 'VEG-001', category: 'Vegetables', unit: 'kg' } },
  { id: '2', product_id: 'prod-2', quantity: 25, min_stock: 30, max_stock: 100, last_restock: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), products: { name: 'Salmon', sku: 'SEA-001', category: 'Seafood', unit: 'kg' } },
  { id: '3', product_id: 'prod-3', quantity: 0, min_stock: 10, max_stock: 50, last_restock: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), products: { name: 'Olive Oil', sku: 'OIL-001', category: 'Oils', unit: 'L' } },
  { id: '4', product_id: 'prod-4', quantity: 80, min_stock: 40, max_stock: 60, last_restock: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), products: { name: 'Chicken Breast', sku: 'MEA-001', category: 'Meat', unit: 'kg' } },
];

function getAlertStatus(quantity: number, minStock: number, maxStock: number): AlertStatus {
  if (quantity === 0) return "out";
  if (quantity < minStock) return "low";
  if (quantity > maxStock && maxStock > 0) return "excess";
  return "normal";
}

function getAlertConfig(status: AlertStatus) {
  switch (status) {
    case "out":
      return { color: "#dc2626", bg: "#fef2f2", icon: XCircle, text: "缺貨" };
    case "low":
      return { color: "#f59e0b", bg: "#fffbeb", icon: AlertTriangle, text: "庫存不足" };
    case "excess":
      return { color: "#8b5cf6", bg: "#f5f3ff", icon: AlertTriangle, text: "庫存過剩" };
    default:
      return { color: "#22c55e", bg: "#f0fdf4", icon: CheckCircle, text: "正常" };
  }
}

export default function InventoryPage() {
  const [isDark, setIsDark] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
  }, []);

  // Fetch inventory (using mock data)
  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setInventory(mockInventory);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("無法載入庫存資料");
      setInventory(mockInventory); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle create/edit success
  const handleSuccess = () => {
    fetchInventory();
    setEditingItem(null);
  };

  // Handle edit click
  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    setInventory(inventory.filter(i => i.id !== id));
    setDeleteConfirm(null);
  };

  // Calculate stats
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(i => i.quantity < i.min_stock && i.min_stock > 0).length;
  const outOfStockItems = inventory.filter(i => i.quantity === 0).length;
  const excessItems = inventory.filter(i => i.max_stock > 0 && i.quantity > i.max_stock).length;

  if (loading) {
    return (
      <div style={{ background: isDark ? '#111827' : '#f5f5f5', minHeight: '100vh', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: isDark ? '#9ca3af' : '#757575', fontSize: '16px' }}>載入中...</div>
      </div>
    );
  }

  return (
    <div style={{ background: isDark ? '#111827' : '#f5f5f5', minHeight: '100vh', padding: '24px', transition: 'all 0.3s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>
            庫存管理
          </h1>
          <p style={{ margin: 0, color: isDark ? '#9ca3af' : '#757575', fontSize: '14px', transition: 'color 0.3s ease' }}>
            實時監控庫存狀態同警報
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={fetchInventory}
            style={{
              padding: '12px 20px',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              color: '#374151',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={18} /> 刷新
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
            style={{
              padding: '12px 20px',
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
            <Plus size={18} /> 新增庫存
          </button>
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
            onClick={fetchInventory}
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

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ padding: '20px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <p style={{ margin: '0 0 8px 0', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', transition: 'color 0.3s ease' }}>總項目</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>{totalItems}</p>
        </div>
        <div style={{ padding: '20px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <p style={{ margin: '0 0 8px 0', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', transition: 'color 0.3s ease' }}>庫存不足</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{lowStockItems}</p>
        </div>
        <div style={{ padding: '20px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <p style={{ margin: '0 0 8px 0', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', transition: 'color 0.3s ease' }}>缺貨</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#dc2626' }}>{outOfStockItems}</p>
        </div>
        <div style={{ padding: '20px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <p style={{ margin: '0 0 8px 0', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', transition: 'color 0.3s ease' }}>庫存過剩</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6' }}>{excessItems}</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div style={{ background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', transition: 'all 0.3s ease' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid ' + (isDark ? '#374151' : '#f5f5f5') }}>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>產品名稱</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>SKU</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>類別</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>數量</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>單位</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>狀態</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => {
              const alertStatus = getAlertStatus(item.quantity, item.min_stock, item.max_stock);
              const config = getAlertConfig(alertStatus);
              const Icon = config.icon;
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid ' + (isDark ? '#374151' : '#f5f5f5'), transition: 'border-color 0.3s ease' }}>
                  <td style={{ padding: '16px', color: isDark ? '#f9fafb' : '#1a1a1a', fontSize: '14px', fontWeight: '600', transition: 'color 0.3s ease' }}>{item.products?.name || 'Unknown'}</td>
                  <td style={{ padding: '16px', color: isDark ? '#9ca3af' : '#757575', fontSize: '14px', transition: 'color 0.3s ease' }}>{item.products?.sku || '-'}</td>
                  <td style={{ padding: '16px', color: isDark ? '#9ca3af' : '#757575', fontSize: '14px', transition: 'color 0.3s ease' }}>{item.products?.category || '-'}</td>
                  <td style={{ padding: '16px', color: isDark ? '#f9fafb' : '#1a1a1a', fontSize: '14px', fontWeight: '600', transition: 'color 0.3s ease' }}>{item.quantity}</td>
                  <td style={{ padding: '16px', color: isDark ? '#9ca3af' : '#757575', fontSize: '14px', transition: 'color 0.3s ease' }}>{item.products?.unit || '-'}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      background: config.color + '20',
                      color: config.color,
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Icon size={14} />
                      {config.text}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{ padding: '6px 12px', background: '#f5f5f5', border: 'none', borderRadius: '8px', color: '#757575', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center' }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        style={{ padding: '6px 12px', background: '#f5f5f5', border: 'none', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Inventory Form Modal */}
      {isFormOpen && (
        <InventoryForm
          isOpen={isFormOpen}
          inventory={editingItem}
          onClose={() => {
            setIsFormOpen(false);
            setEditingItem(null);
          }}
          onSuccess={handleSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
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
            <p style={{ color: '#757575', margin: '0 0 24px 0' }}>你係咪想刪除此庫存項目？</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{ padding: '10px 20px', background: '#f5f5f5', border: 'none', borderRadius: '12px', color: '#757575', cursor: 'pointer', fontWeight: '600' }}
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
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
