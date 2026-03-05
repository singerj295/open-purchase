"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'supplier' | 'order' | 'inventory' | 'recipe';
  name: string;
  description?: string;
  path: string;
}

interface GlobalSearchProps {
  isDark: boolean;
}

export default function GlobalSearch({ isDark }: GlobalSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  // Mock 數據
  const mockSuppliers = [
    { id: '1', name: 'Fresh Farm Co', contact: 'John Smith' },
    { id: '2', name: 'Ocean Seafood', contact: 'Mary Chan' },
    { id: '3', name: 'Kitchen Supplies Ltd', contact: 'David Wong' },
    { id: '4', name: 'Spice World', contact: 'Lisa Lau' },
  ];

  const mockOrders = [
    { id: '1', orderNumber: 'ORD-001', supplierName: 'Fresh Farm Co', totalAmount: 450 },
    { id: '2', orderNumber: 'ORD-002', supplierName: 'Ocean Seafood', totalAmount: 890 },
    { id: '3', orderNumber: 'ORD-003', supplierName: 'Kitchen Supplies Ltd', totalAmount: 320 },
  ];

  const mockInventory = [
    { id: '1', name: 'Tomatoes', sku: 'VEG-001', quantity: 150 },
    { id: '2', name: 'Salmon', sku: 'SEA-001', quantity: 25 },
    { id: '3', name: 'Olive Oil', sku: 'OIL-001', quantity: 80 },
  ];

  const mockRecipes = [
    { id: '1', name: '番茄炒蛋', category: '中式' },
    { id: '2', name: '凱撒沙律', category: '西式' },
    { id: '3', name: '紅酒燴牛肉', category: '西式' },
  ];

  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const newResults: SearchResult[] = [];

    // 搜尋供應商
    mockSuppliers.forEach(supplier => {
      if (supplier.name.toLowerCase().includes(term) || supplier.contact.toLowerCase().includes(term)) {
        newResults.push({
          id: `supplier-${supplier.id}`,
          type: 'supplier',
          name: supplier.name,
          description: `聯絡人：${supplier.contact}`,
          path: '/dashboard/suppliers'
        });
      }
    });

    // 搜尋訂單
    mockOrders.forEach(order => {
      if (order.orderNumber.toLowerCase().includes(term) || order.supplierName.toLowerCase().includes(term)) {
        newResults.push({
          id: `order-${order.id}`,
          type: 'order',
          name: order.orderNumber,
          description: `${order.supplierName} - $${order.totalAmount}`,
          path: '/dashboard/orders'
        });
      }
    });

    // 搜尋庫存
    mockInventory.forEach(item => {
      if (item.name.toLowerCase().includes(term) || item.sku.toLowerCase().includes(term)) {
        newResults.push({
          id: `inventory-${item.id}`,
          type: 'inventory',
          name: item.name,
          description: `SKU: ${item.sku} - 庫存：${item.quantity}`,
          path: '/dashboard/inventory'
        });
      }
    });

    // 搜尋食譜
    mockRecipes.forEach(recipe => {
      if (recipe.name.toLowerCase().includes(term) || recipe.category.toLowerCase().includes(term)) {
        newResults.push({
          id: `recipe-${recipe.id}`,
          type: 'recipe',
          name: recipe.name,
          description: `類別：${recipe.category}`,
          path: '/dashboard/recipes'
        });
      }
    });

    setResults(newResults.slice(0, 8)); // 最多顯示 8 個結果
  }, [searchTerm]);

  const handleSelectResult = (path: string) => {
    router.push(path);
    setShowResults(false);
    setSearchTerm('');
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'supplier': return '🏪';
      case 'order': return '📦';
      case 'inventory': return '📊';
      case 'recipe': return '📖';
    }
  };

  return (
    <div style={{ position: 'relative', width: '300px' }}>
      <div style={{
        position: 'relative'
      }}>
        <input
          type="text"
          placeholder="搜尋供應商、訂單、庫存、食譜..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          style={{
            width: '100%',
            padding: '10px 40px 10px 40px',
            background: isDark ? '#374151' : '#f5f5f5',
            border: 'none',
            borderRadius: '12px',
            color: isDark ? '#f9fafb' : '#1a1a1a',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.15s ease',
            boxShadow: showResults && searchTerm ? (isDark ? '0 0 0 2px #2d9e6d' : '0 0 0 2px #2d9e6d') : 'none'
          }}
        />
        <Search 
          size={18} 
          color={isDark ? '#9ca3af' : '#757575'} 
          style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)' 
          }} 
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setResults([]);
              setShowResults(false);
            }}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} color={isDark ? '#9ca3af' : '#757575'} />
          </button>
        )}
      </div>

      {/* 搜尋結果下拉選單 */}
      {showResults && searchTerm && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          background: isDark ? '#1f2937' : '#ffffff',
          borderRadius: '12px',
          boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.12)',
          zIndex: 1000,
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          {results.length === 0 ? (
            <div style={{
              padding: '16px',
              color: isDark ? '#9ca3af' : '#757575',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              找不到符合的結果
            </div>
          ) : (
            results.map((result) => (
              <div
                key={result.id}
                onClick={() => handleSelectResult(result.path)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid ' + (isDark ? '#374151' : '#f5f5f5'),
                  transition: 'background 0.15s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = isDark ? '#374151' : '#f5f5f5';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px' }}>{getTypeIcon(result.type)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: isDark ? '#f9fafb' : '#1a1a1a',
                      marginBottom: '4px'
                    }}>
                      {result.name}
                    </div>
                    {result.description && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: isDark ? '#9ca3af' : '#757575' 
                      }}>
                        {result.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
