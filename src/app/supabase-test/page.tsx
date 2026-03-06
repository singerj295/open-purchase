"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function SupabaseTestPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  useEffect(() => {
    testSupabase();
  }, []);

  async function testSupabase() {
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 開始測試 Supabase 連接...');

      // 測試 1：讀取訂單
      console.log('📋 測試讀取訂單...');
      const { data: ordersData, error: ordersError } = await supabase
        .from('Order')
        .select('*')
        .limit(5);

      if (ordersError) {
        console.error('❌ 讀取訂單失敗:', ordersError);
        setError('讀取訂單失敗：' + ordersError.message);
      } else {
        console.log('✅ 讀取訂單成功:', ordersData?.length || 0, '條記錄');
        setOrders(ordersData || []);
      }

      // 測試 2：讀取供應商
      console.log('🏪 測試讀取供應商...');
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('Supplier')
        .select('*')
        .limit(5);

      if (suppliersError) {
        console.error('❌ 讀取供應商失敗:', suppliersError);
      } else {
        console.log('✅ 讀取供應商成功:', suppliersData?.length || 0, '條記錄');
        setSuppliers(suppliersData || []);
      }

    } catch (err: any) {
      console.error('❌ 測試失敗:', err);
      setError('測試失敗：' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ 
      padding: '40px',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#1a1a1a'
      }}>
        Supabase 連接測試
      </h1>

      {/* 測試按鈕 */}
      <button
        onClick={testSupabase}
        disabled={loading}
        style={{
          padding: '12px 24px',
          background: loading ? '#ccc' : '#2d9e6d',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          marginBottom: '20px'
        }}
      >
        {loading ? '測試中...' : '重新測試'}
      </button>

      {/* 錯誤訊息 */}
      {error && (
        <div style={{
          padding: '20px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>❌ 錯誤</h3>
          <pre style={{ 
            fontSize: '12px', 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            {error}
          </pre>
        </div>
      )}

      {/* 測試結果 */}
      {loading && (
        <div style={{
          padding: '20px',
          background: 'white',
          borderRadius: '8px',
          color: '#757575'
        }}>
          測試中...
        </div>
      )}

      {/* 訂單數據 */}
      {!loading && orders.length > 0 && (
        <div style={{
          padding: '20px',
          background: 'white',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
            ✅ 訂單數據 ({orders.length} 條)
          </h3>
          <pre style={{ 
            fontSize: '12px', 
            background: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(orders, null, 2)}
          </pre>
        </div>
      )}

      {/* 供應商數據 */}
      {!loading && suppliers.length > 0 && (
        <div style={{
          padding: '20px',
          background: 'white',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
            ✅ 供應商數據 ({suppliers.length} 條)
          </h3>
          <pre style={{ 
            fontSize: '12px', 
            background: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(suppliers, null, 2)}
          </pre>
        </div>
      )}

      {/* 無數據 */}
      {!loading && orders.length === 0 && suppliers.length === 0 && !error && (
        <div style={{
          padding: '20px',
          background: 'white',
          borderRadius: '8px',
          color: '#757575'
        }}>
          數據庫正常連接，但係冇數據
        </div>
      )}

      {/* Console 日誌提示 */}
      <div style={{
        padding: '20px',
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '8px',
        color: '#92400e',
        fontSize: '14px'
      }}>
        <strong>💡 提示：</strong> 按 F12 打開 Console 睇詳細日誌
      </div>
    </div>
  );
}
