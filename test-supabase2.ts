import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pidbavwgtlwhpkkefqko.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZGJhdndndGx3aHBra2VmcWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjM4MjAsImV4cCI6MjA4NzkzOTgyMH0.G5vekPOdSie8-q4yILRSmDyDB-HQOjHlgdikPnbBQ1Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDetailed() {
  console.log('=== 詳細測試 ===\n');
  
  // 查詢 Order 表的數據
  console.log('1. Order 表數據:');
  const { data: orderData, error: orderError } = await supabase
    .from('Order')
    .select('*');
  
  if (orderData && orderData.length > 0) {
    console.log('   總記錄:', orderData.length);
    console.log('   第一條記錄:', JSON.stringify(orderData[0], null, 2));
  }
  
  // 檢查 Supplier 表
  console.log('\n2. Supplier 表數據:');
  const { data: supplierData, error: supplierError } = await supabase
    .from('Supplier')
    .select('*')
    .limit(5);
  
  if (supplierError) {
    console.log('   Supplier 表錯誤:', supplierError.code, supplierError.message);
  } else {
    console.log('   Supplier 表記錄:', supplierData?.length || 0);
    if (supplierData && supplierData.length > 0) {
      console.log('   字段:', Object.keys(supplierData[0]));
    }
  }
  
  // 嘗試關聯查詢
  console.log('\n3. 測試關聯查詢 (Order + Supplier):');
  const { data: joinData, error: joinError } = await supabase
    .from('Order')
    .select('*, Supplier(*)');
  
  if (joinError) {
    console.log('   ❌ 關聯查詢錯誤:', joinError.code, joinError.message);
  } else {
    console.log('   ✅ 關聯查詢成功');
    if (joinData && joinData.length > 0) {
      console.log('   數據:', JSON.stringify(joinData[0], null, 2));
    }
  }
  
  // 檢查外鍵關係
  console.log('\n4. 檢查所有可用的表:');
  const tables = ['Order', 'Supplier', 'Product', 'OrderItem', 'Inventory', 
                  'orders', 'suppliers', 'products', 'order_items', 'inventory'];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      if (error.code === '42P01') {
        // 表不存在 - 跳過
      } else {
        console.log(`   ${table}: 錯誤 ${error.code} - ${error.message}`);
      }
    } else {
      console.log(`   ✅ ${table}: 存在`);
    }
  }
}

testDetailed().catch(console.error);
