"use client";

import { useState, useEffect } from 'react';
import { Edit, Trash2, CheckCircle, Clock, Truck, XCircle, Plus, RefreshCw } from 'lucide-react';
import OrderForm, { Order, OrderItem } from '@/components/orders/OrderForm';
import { supabase } from '@/lib/supabase';
import { useIsDark } from '@/lib/hooks/useIsDark';

// Status configuration
const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: '待處理', color: '#f59e0b', icon: Clock },
  CONFIRMED: { label: '已確認', color: '#8b5cf6', icon: CheckCircle },
  SHIPPED: { label: '已發貨', color: '#3b82f6', icon: Truck },
  DELIVERED: { label: '已送達', color: '#4ade80', icon: CheckCircle },
  CANCELLED: { label: '已取消', color: '#6b7280', icon: XCircle },
};

import { OrderErrorBoundary } from '@/components/ErrorBoundary';

function OrdersPageContent() {
  const isDark = useIsDark();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // 從 Supabase 讀取訂單 (使用大寫表名 Order)
      const { data: ordersData, error: ordersError } = await supabase
        .from('Order')
        .select('*')
        .order('createdAt', { ascending: false });

      if (ordersError) {
        console.error('Supabase 錯誤:', ordersError);
        throw new Error('無法載入訂單：' + ordersError.message);
      }

      // 轉換數據格式 (Supabase 字段係駝峰式)
      const formattedOrders: Order[] = (ordersData || []).map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        supplierId: order.supplierId,
        supplierName: order.supplierName || 'Unknown',
        status: order.status,
        totalAmount: order.totalAmount || 0,
        items: order.items || [],
        createdAt: order.createdAt
      }));

      setOrders(formattedOrders);
    } catch (err: any) {
      console.error('獲取訂單失敗:', err);
      setError('無法載入訂單：' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSaveOrder = (newOrder: Order) => {
    if (editingOrder) {
      setOrders(orders.map(o => o.id === newOrder.id ? newOrder : o));
    } else {
      setOrders([newOrder, ...orders]);
    }
    setShowForm(false);
    setEditingOrder(null);
    fetchOrders(); // 重新載入
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('Order')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.filter(o => o.id !== orderId));
      setDeleteConfirm(null);
      setError(null);
    } catch (err: any) {
      console.error('刪除訂單失敗:', err);
      setError('無法刪除訂單：' + err.message);
    }
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowForm(true);
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
            訂單管理
          </h1>
          <p style={{ margin: 0, color: isDark ? '#9ca3af' : '#757575', fontSize: '14px', transition: 'color 0.3s ease' }}>
            管理採購訂單同供應商
          </p>
        </div>
        <button
          onClick={() => {
            setEditingOrder(null);
            setShowForm(true);
          }}
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
          <Plus size={20} /> 新增訂單
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
          <p style={{ margin: '0 0 8px 0', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', transition: 'color 0.3s ease' }}>總訂單</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>{orders.length}</p>
        </div>
        <div style={{ padding: '20px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <p style={{ margin: '0 0 8px 0', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', transition: 'color 0.3s ease' }}>待處理</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{orders.filter(o => o.status === 'PENDING').length}</p>
        </div>
        <div style={{ padding: '20px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <p style={{ margin: '0 0 8px 0', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', transition: 'color 0.3s ease' }}>已送達</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#2d9e6d' }}>{orders.filter(o => o.status === 'DELIVERED').length}</p>
        </div>
        <div style={{ padding: '20px', background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
          <p style={{ margin: '0 0 8px 0', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', transition: 'color 0.3s ease' }}>總額</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6' }}>${orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}</p>
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
          transition: 'all 0.3s ease'
        }}>
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div style={{ background: isDark ? '#1f2937' : '#ffffff', borderRadius: '16px', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', transition: 'all 0.3s ease' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid ' + (isDark ? '#374151' : '#f5f5f5') }}>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>訂單編號</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>供應商</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>狀態</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>金額</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>日期</th>
              <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#9ca3af' : '#757575', fontSize: '12px', fontWeight: '600', transition: 'color 0.3s ease' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: isDark ? '#9ca3af' : '#757575' }}>
                  暫無訂單數據
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const config = statusConfig[order.status];
                const Icon = config?.icon || Clock;
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid ' + (isDark ? '#374151' : '#f5f5f5'), transition: 'border-color 0.3s ease' }}>
                    <td style={{ padding: '16px', color: '#2d9e6d', fontSize: '14px', fontWeight: '600' }}>{order.orderNumber}</td>
                    <td style={{ padding: '16px', color: isDark ? '#f9fafb' : '#1a1a1a', fontSize: '14px', fontWeight: '600', transition: 'color 0.3s ease' }}>{order.supplierName}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: (config?.color || '#6b7280') + '20',
                        color: config?.color || '#6b7280',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Icon size={14} />
                        {config?.label || order.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: isDark ? '#f9fafb' : '#1a1a1a', fontSize: '14px', fontWeight: '600', transition: 'color 0.3s ease' }}>${order.totalAmount.toLocaleString()}</td>
                    <td style={{ padding: '16px', color: isDark ? '#9ca3af' : '#757575', fontSize: '14px', transition: 'color 0.3s ease' }}>{new Date(order.createdAt!).toLocaleDateString('zh-HK')}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditOrder(order)}
                          style={{ padding: '6px 12px', background: isDark ? '#374151' : '#f5f5f5', border: 'none', borderRadius: '8px', color: isDark ? '#9ca3af' : '#757575', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', transition: 'all 0.3s ease' }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(order.id)}
                          style={{ padding: '6px 12px', background: isDark ? '#374151' : '#f5f5f5', border: 'none', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', transition: 'all 0.3s ease' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order Form Modal */}
      {showForm && (
        <OrderForm
          order={editingOrder}
          onClose={() => {
            setShowForm(false);
            setEditingOrder(null);
          }}
          onSave={handleSaveOrder}
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
            background: isDark ? '#1f2937' : 'white',
            padding: '32px',
            borderRadius: '16px',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0', color: isDark ? '#f9fafb' : '#1a1a1a', transition: 'color 0.3s ease' }}>確認刪除</h3>
            <p style={{ color: isDark ? '#9ca3af' : '#757575', margin: '0 0 24px 0', transition: 'color 0.3s ease' }}>你係咪想刪除此訂單？</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{ padding: '10px 20px', background: isDark ? '#374151' : '#f5f5f5', border: 'none', borderRadius: '12px', color: isDark ? '#9ca3af' : '#757575', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s ease' }}
              >
                取消
              </button>
              <button
                onClick={() => handleDeleteOrder(deleteConfirm)}
                style={{ padding: '10px 20px', background: '#ef4444', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s ease' }}
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

export default function OrdersPage() {
  return (
    <OrderErrorBoundary>
      <OrdersPageContent />
    </OrderErrorBoundary>
  );
}
