import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pidbavwgtlwhpkkefqko.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZGJhdndndGx3aHBra2VmcWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjM4MjAsImV4cCI6MjA4NzkzOTgyMH0.G5vekPOdSie8-q4yILRSmDyDB-HQOjHlgdikPnbBQ1Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('=== 測試 Supabase 連接 ===\n');
  
  // 測試 orders 表
  console.log('1. 測試 orders 表:');
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .limit(5);
  
  if (ordersError) {
    console.log('❌ orders 表錯誤:', ordersError.code, ordersError.message);
  } else {
    console.log('✅ orders 表存在，記錄數:', orders?.length || 0);
    if (orders && orders.length > 0) {
      console.log('   字段:', Object.keys(orders[0]));
      console.log('   示例數據:', JSON.stringify(orders[0], null, 2));
    }
  }
  
  // 測試 Order 表 (大寫)
  console.log('\n2. 測試 Order 表:');
  const { data: orderUpper, error: orderUpperError } = await supabase
    .from('Order')
    .select('*')
    .limit(5);
  
  if (orderUpperError) {
    console.log('❌ Order 表錯誤:', orderUpperError.code, orderUpperError.message);
  } else {
    console.log('✅ Order 表存在，記錄數:', orderUpper?.length || 0);
    if (orderUpper && orderUpper.length > 0) {
      console.log('   字段:', Object.keys(orderUpper[0]));
    }
  }
  
  // 測試 suppliers 表
  console.log('\n3. 測試 suppliers 表:');
  const { data: suppliers, error: suppliersError } = await supabase
    .from('suppliers')
    .select('*')
    .limit(5);
  
  if (suppliersError) {
    console.log('❌ suppliers 表錯誤:', suppliersError.code, suppliersError.message);
  } else {
    console.log('✅ suppliers 表存在，記錄數:', suppliers?.length || 0);
    if (suppliers && suppliers.length > 0) {
      console.log('   字段:', Object.keys(suppliers[0]));
    }
  }
  
  // 測試 products 表
  console.log('\n4. 測試 products 表:');
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .limit(5);
  
  if (productsError) {
    console.log('❌ products 表錯誤:', productsError.code, productsError.message);
  } else {
    console.log('✅ products 表存在，記錄數:', products?.length || 0);
    if (products && products.length > 0) {
      console.log('   字段:', Object.keys(products[0]));
    }
  }
  
  // 測試 order_items 表
  console.log('\n5. 測試 order_items 表:');
  const { data: orderItems, error: orderItemsError } = await supabase
    .from('order_items')
    .select('*')
    .limit(5);
  
  if (orderItemsError) {
    console.log('❌ order_items 表錯誤:', orderItemsError.code, orderItemsError.message);
  } else {
    console.log('✅ order_items 表存在，記錄數:', orderItems?.length || 0);
    if (orderItems && orderItems.length > 0) {
      console.log('   字段:', Object.keys(orderItems[0]));
    }
  }
}

testConnection().catch(console.error);
