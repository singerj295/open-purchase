import React from 'react';
import { CSSProperties } from 'react';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  min_stock: number;
  max_stock: number;
}

export enum AlertType {
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OVERSTOCK = 'OVERSTOCK',
  NORMAL = 'NORMAL'
}

interface InventoryAlertProps {
  item: InventoryItem;
}

const InventoryAlert: React.FC<InventoryAlertProps> = ({ item }) => {
  const getAlertType = (): AlertType => {
    if (item.quantity === 0) {
      return AlertType.OUT_OF_STOCK;
    } else if (item.quantity < item.min_stock) {
      return AlertType.LOW_STOCK;
    } else if (item.quantity > item.max_stock) {
      return AlertType.OVERSTOCK;
    } else {
      return AlertType.NORMAL;
    }
  };

  const getAlertConfig = () => {
    const alertType = getAlertType();
    
    switch (alertType) {
      case AlertType.OUT_OF_STOCK:
        return {
          label: '缺貨',
          color: '#FF0000', // Red
          backgroundColor: '#FFE6E6',
        };
      case AlertType.LOW_STOCK:
        return {
          label: '庫存不足',
          color: '#FF8C00', // Dark Orange
          backgroundColor: '#FFF2E6',
        };
      case AlertType.OVERSTOCK:
        return {
          label: '庫存過剩',
          color: '#FFD700', // Gold
          backgroundColor: '#FFF8E6',
        };
      default:
        return {
          label: '正常',
          color: '#008000', // Green
          backgroundColor: '#E6F3E6',
        };
    }
  };

  const { label, color, backgroundColor } = getAlertConfig();

  // Define inline styles
  const alertContainerStyle: CSSProperties = {
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor,
    display: 'inline-block',
    border: '1px solid transparent',
    alignSelf: 'flex-start',
  };

  const alertTextStyle: CSSProperties = {
    fontSize: '12px',
    fontWeight: 'bold',
    color,
  };

  return (
    <div style={alertContainerStyle}>
      <span style={alertTextStyle}>{label}</span>
    </div>
  );
};

export default InventoryAlert;