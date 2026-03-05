import { OrderItem } from './OrderForm';

interface OrderItemsFormProps {
  items: OrderItem[];
  products: { id: string; name: string; price: number }[];
  onItemsChange: (items: OrderItem[]) => void;
}

export default function OrderItemsForm({ items, products, onItemsChange }: OrderItemsFormProps) {
  const handleAddItem = () => {
    const newItem: OrderItem = {
      id: `item-${Date.now()}`,
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    onItemsChange([...items, newItem]);
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
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
    onItemsChange(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  };

  const calculateTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  return (
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
          添加產品
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item, index) => (
          <div
            key={item.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
              gap: '8px',
              alignItems: 'center',
              padding: '8px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
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
              ${item.totalPrice.toFixed(2)}
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
              ×
            </button>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '12px',
        padding: '12px',
        background: '#f9fafb',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ color: '#374151', fontSize: '14px', fontWeight: '600' }}>項目總計</span>
        <span style={{ color: '#2d9e6d', fontSize: '16px', fontWeight: 'bold' }}>
          ${calculateTotalAmount().toFixed(2)}
        </span>
      </div>
    </div>
  );
}