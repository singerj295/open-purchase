"use client";

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import OrderItemsForm from './OrderItemsForm';

export interface OrderItem {
  id: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName?: string;
  status: string;
  totalAmount: number;
  notes?: string;
  items?: OrderItem[];
  createdAt?: string;
}

interface OrderFormProps {
  order?: Order | null;
  onClose: () => void;
  onSave: (order: Order) => void;
}

const statusOptions = [
  { value: 'PENDING', label: '待處理', color: '#f59e0b' },
  { value: 'CONFIRMED', label: '已確認', color: '#8b5cf6' },
  { value: 'SHIPPED', label: '已發貨', color: '#3b82f6' },
  { value: 'DELIVERED', label: '已送達', color: '#4ade80' },
  { value: 'CANCELLED', label: '已取消', color: '#6b7280' },
];

// Mock data
const mockSuppliers = [
  { id: 'sup-1', name: 'Fresh Farm Co' },
  { id: 'sup-2', name: 'Ocean Seafood' },
  { id: 'sup-3', name: 'Kitchen Supplies Ltd' },
  { id: 'sup-4', name: 'Spice World' },
];

const mockProducts = [
  { id: 'prod-1', name: 'Tomatoes', price: 10 },
  { id: 'prod-2', name: 'Salmon', price: 25 },
  { id: 'prod-3', name: 'Olive Oil', price: 15 },
  { id: 'prod-4', name: 'Chicken Breast', price: 12 },
  { id: 'prod-5', name: 'Mixed Herbs', price: 8 },
];

export default function OrderForm({ order, onClose, onSave }: OrderFormProps) {
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>(mockSuppliers);
  const [products, setProducts] = useState<{ id: string; name: string; price: number }[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  
  // Initialize form data
  const getInitialFormData = (): Order => {
    const o = order || null;
    return {
      id: o?.id || '',
      orderNumber: o?.orderNumber || `ORD-${Date.now()}`,
      supplierId: o?.supplierId || '',
      supplierName: o?.supplierName || '',
      status: o?.status || 'PENDING',
      totalAmount: o?.totalAmount || 0,
      notes: o?.notes || '',
      items: o?.items || [],
    };
  };
  
  const [formData, setFormData] = useState<Order>(() => getInitialFormData());

  // Sync form data when order prop changes (for editing different orders)
  useEffect(() => {
    setFormData(getInitialFormData());
  }, [order]);

  const handleSupplierChange = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    setFormData(prev => ({
      ...prev,
      supplierId,
      supplierName: supplier?.name || '',
    }));
  };

  const handleAddItem = () => {
    const newItem: OrderItem = {
      id: `item-${Date.now()}`,
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem],
    }));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    setFormData(prev => {
      const newItems = [...(prev.items || [])];
      const item = { ...newItems[index] };
      
      if (field === 'productId') {
        const product = products.find(p => p.id === value);
        item.productId = value;
        item.productName = product?.name || '';
        item.unitPrice = product?.price || 0;
        item.totalPrice = item.quantity * item.unitPrice;
      } else if (field === 'quantity') {
        item.quantity = value;
        item.totalPrice = item.quantity * item.unitPrice;
      } else if (field === 'unitPrice') {
        item.unitPrice = value;
        item.totalPrice = item.quantity * item.unitPrice;
      } else {
        (item as any)[field] = value;
      }
      
      newItems[index] = item;
      
      // Recalculate total amount
      const totalAmount = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
      
      return {
        ...prev,
        items: newItems,
        totalAmount,
      };
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => {
      const newItems = (prev.items || []).filter((_, i) => i !== index);
      const totalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      return {
        ...prev,
        items: newItems,
        totalAmount,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Validate form
      if (!formData.supplierId) {
        alert('請選擇供應商');
        return;
      }
      
      if (!formData.items || formData.items.length === 0) {
        alert('請至少添加一個產品');
        return;
      }
      
      // Save order
      onSave(formData);
    } catch (error) {
      console.error('Error saving order:', error);
      alert('保存失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1a1a1a' }}>
            {order ? '編輯訂單' : '新增訂單'}
          </h2>
          <button
            onClick={onClose}
            style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#757575' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Order Number */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>訂單編號</label>
            <input
              type="text"
              value={formData.orderNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, orderNumber: e.target.value }))}
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

          {/* Supplier */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>供應商</label>
            <select
              value={formData.supplierId}
              onChange={(e) => handleSupplierChange(e.target.value)}
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
              <option value="">選擇供應商</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>狀態</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '14px',
                background: 'white'
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Order Items */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ color: '#374151', fontSize: '14px', fontWeight: '600' }}>訂單項目</label>
              <button
                type="button"
                onClick={handleAddItem}
                style={{
                  padding: '6px 12px',
                  background: '#2d9e6d',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={16} /> 添加產品
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {formData.items?.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                    gap: '8px',
                    alignItems: 'center'
                  }}
                >
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    style={{
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: 'white'
                    }}
                  >
                    <option value="">選擇產品</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (${product.price})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                    min="1"
                    style={{
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    style={{
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <div style={{ padding: '8px', color: '#1a1a1a', fontWeight: '600' }}>
                    ${item.totalPrice}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    style={{
                      padding: '8px',
                      background: '#ef4444',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div style={{
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#374151', fontSize: '14px', fontWeight: '600' }}>總金額</span>
            <span style={{ color: '#2d9e6d', fontSize: '24px', fontWeight: 'bold' }}>
              ${formData.totalAmount}
            </span>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>備註</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Actions */}
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
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Save size={18} />
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
