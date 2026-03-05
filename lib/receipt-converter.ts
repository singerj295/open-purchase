/**
 * Receipt Converter - 將掃描嘅單據轉換為訂單
 * 
 * 功能：
 * - convertReceiptToOrder: 轉換單據為訂單
 * - matchSupplier: 匹配供應商
 * - matchProduct: 匹配產品
 * - createOrder: 創建訂單
 */

import { supabase } from './supabase';

export interface ReceiptItem {
  name: string;
  quantity: number;
  unit_price: number;
}

export interface ReceiptData {
  supplier_name: string;
  date: string;
  items: ReceiptItem[];
  total_amount: number;
  confidence_score?: number;
}

export interface MatchedProduct {
  id: string;
  name: string;
  unit_price: number;
}

export interface MatchedSupplier {
  id: string;
  name: string;
}

/**
 * 匹配供應商
 * 如果找到就返回現有供應商，搵唔到就創建新供應商
 */
export async function matchSupplier(supplierName: string): Promise<MatchedSupplier> {
  // 嘗試匹配現有供應商 (模糊匹配)
  const { data: existingSuppliers } = await supabase
    .from('suppliers')
    .select('id, name')
    .ilike('name', `%${supplierName}%`)
    .limit(1);
  
  if (existingSuppliers && existingSuppliers.length > 0) {
    console.log(`✅ 找到現有供應商：${supplierName}`);
    return {
      id: existingSuppliers[0].id,
      name: existingSuppliers[0].name
    };
  }
  
  // 創建新供應商
  console.log(`🆕 創建新供應商：${supplierName}`);
  const { data: newSupplier, error } = await supabase
    .from('suppliers')
    .insert({
      name: supplierName,
      status: '活躍'
    })
    .select('id, name')
    .single();
  
  if (error) {
    throw new Error(`創建供應商失敗：${error.message}`);
  }
  
  return {
    id: newSupplier.id,
    name: newSupplier.name
  };
}

/**
 * 匹配產品
 * 如果找到就返回現有產品，搵唔到就創建新產品
 */
export async function matchProduct(productName: string, unitPrice: number): Promise<MatchedProduct> {
  // 嘗試匹配現有產品
  const { data: existingProducts } = await supabase
    .from('products')
    .select('id, name')
    .ilike('name', `%${productName}%`)
    .limit(1);
  
  if (existingProducts && existingProducts.length > 0) {
    console.log(`✅ 找到現有產品：${productName}`);
    return {
      id: existingProducts[0].id,
      name: existingProducts[0].name,
      unit_price: unitPrice
    };
  }
  
  // 創建新產品
  console.log(`🆕 創建新產品：${productName}`);
  const { data: newProduct, error } = await supabase
    .from('products')
    .insert({
      name: productName,
      unit_price: unitPrice,
      category: '一般'
    })
    .select('id, name')
    .single();
  
  if (error) {
    throw new Error(`創建產品失敗：${error.message}`);
  }
  
  return {
    id: newProduct.id,
    name: newProduct.name,
    unit_price: unitPrice
  };
}

/**
 * 創建訂單
 */
export async function createOrder(
  supplierId: string,
  orderDate: string,
  items: { product_id: string; quantity: number; unit_price: number; total_price: number }[],
  totalAmount: number
): Promise<string> {
  const orderNumber = `ORD-${Date.now()}`;
  
  // 創建訂單 (注意：Supabase 表名係 'Order' 唔係 'orders')
  const { data: order, error: orderError } = await supabase
    .from('Order')
    .insert({
      order_number: orderNumber,
      supplier_id: supplierId,
      order_date: orderDate,
      total_amount: totalAmount,
      status: 'pending'  // 使用英文狀態，同系統統一
    })
    .select('id')
    .single();
  
  if (orderError) {
    throw new Error(`創建訂單失敗：${orderError.message}`);
  }
  
  // 創建訂單項目
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.total_price
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
  
  if (itemsError) {
    throw new Error(`創建訂單項目失敗：${itemsError.message}`);
  }
  
  console.log(`✅ 訂單創建成功：${orderNumber}`);
  return orderNumber;
}

/**
 * 主函數：轉換單據為訂單
 */
export async function convertReceiptToOrder(receiptData: ReceiptData): Promise<string> {
  console.log('🔄 開始轉換單據為訂單...', receiptData);
  
  // 1. 匹配供應商
  const supplier = await matchSupplier(receiptData.supplier_name);
  
  // 2. 匹配產品
  const items: { product_id: string; quantity: number; unit_price: number; total_price: number }[] = [];
  
  for (const item of receiptData.items) {
    const product = await matchProduct(item.name, item.unit_price);
    items.push({
      product_id: product.id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price
    });
  }
  
  // 3. 創建訂單
  const orderNumber = await createOrder(
    supplier.id,
    receiptData.date,
    items,
    receiptData.total_amount
  );
  
  console.log(`✅ 轉換完成！訂單編號：${orderNumber}`);
  return orderNumber;
}

// 使用示例
/*
const receiptData: ReceiptData = {
  supplier_name: 'ABC 供應商',
  date: '2026-03-05',
  items: [
    { name: '番茄', quantity: 10, unit_price: 5 },
    { name: '雞蛋', quantity: 5, unit_price: 3 }
  ],
  total_amount: 65,
  confidence_score: 0.95
};

const orderNumber = await convertReceiptToOrder(receiptData);
console.log(`訂單編號：${orderNumber}`);
*/
