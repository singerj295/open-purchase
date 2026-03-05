"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
}

interface Inventory {
  id?: string;
  product_id: string;
  quantity: number;
  min_stock: number;
  max_stock: number;
  last_restock: string | null;
}

interface InventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  inventory?: Inventory | null;
}

// Mock products
const mockProducts: Product[] = [
  { id: 'prod-1', name: 'Tomatoes', sku: 'VEG-001' },
  { id: 'prod-2', name: 'Salmon', sku: 'SEA-001' },
  { id: 'prod-3', name: 'Olive Oil', sku: 'OIL-001' },
  { id: 'prod-4', name: 'Chicken Breast', sku: 'MEA-001' },
];

export default function InventoryForm({ isOpen, onClose, onSuccess, inventory }: InventoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [formData, setFormData] = useState<Inventory>({
    product_id: "",
    quantity: 0,
    min_stock: 0,
    max_stock: 0,
    last_restock: null,
  });

  useEffect(() => {
    if (inventory) {
      setFormData(inventory);
    } else {
      setFormData({
        product_id: "",
        quantity: 0,
        min_stock: 0,
        max_stock: 0,
        last_restock: null,
      });
    }
  }, [inventory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock success - in real app would save to database
      console.log('Saving inventory:', formData);
      
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
            {inventory ? '編輯庫存' : '新增庫存'}
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
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>產品</label>
            <select
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '14px',
                background: 'white'
              }}
            >
              <option value="">選擇產品</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>數量</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              required
              min="0"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>最低庫存</label>
              <input
                type="number"
                value={formData.min_stock}
                onChange={(e) => setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })}
                required
                min="0"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>最高庫存</label>
              <input
                type="number"
                value={formData.max_stock}
                onChange={(e) => setFormData({ ...formData, max_stock: parseInt(e.target.value) || 0 })}
                required
                min="0"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>最後補貨日期</label>
            <input
              type="date"
              value={formData.last_restock ? formData.last_restock.split('T')[0] : ''}
              onChange={(e) => setFormData({ ...formData, last_restock: e.target.value ? new Date(e.target.value).toISOString() : null })}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '14px'
              }}
            />
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
