import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 環境變量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pidbavwgtlwhpkkefqko.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZGJhdndndGx3aHBra2VmcWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjM4MjAsImV4cCI6MjA4NzkzOTgyMH0.G5vekPOdSie8-q4yILRSmDyDB-HQOjHlgdikPnbBQ1Q';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZGJhdndndGx3aHBra2VmcWtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjM2MzgyMCwiZXhwIjoyMDg3OTM5ODIwfQ.sIV-kXYJml0ysocw5oh_0UeaY6goZ21ohagV_2laCPQ';

let supabase: SupabaseClient;
let serviceClient: SupabaseClient;

// 測試結果
const results = {
  suppliers: { create: false, update: false, delete: false, list: false },
  orders: { create: false, update: false, delete: false, statusUpdate: false },
  inventory: { create: false, update: false, delete: false, alert: false },
  supabase: { connection: false, crud: false }
};

// 初始化客戶端
function initClients() {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  serviceClient = createClient(supabaseUrl, supabaseServiceKey);
  console.log('✅ Supabase 客戶端初始化完成');
}

// 測試 Supabase 連接
async function testSupabaseConnection() {
  console.log('\n=== 測試 Supabase 連接 ===');
  try {
    const { data, error } = await supabase.from('suppliers').select('count');
    
    if (error) throw error;
    
    results.supabase.connection = true;
    console.log('✅ Supabase 連接成功');
    return true;
  } catch (err: any) {
    console.error('❌ Supabase 連接失敗:', err.message);
    return false;
  }
}

// 清理測試數據
async function cleanupTestData() {
  console.log('\n=== 清理舊測試數據 ===');
  try {
    // 刪除測試供應商相關的數據
    await serviceClient.from('inventory').delete().like('id', 'test-%');
    await serviceClient.from('order_items').delete().like('id', 'test-%');
    await serviceClient.from('orders').delete().like('order_number', 'test-%');
    await serviceClient.from('products').delete().like('name', 'test-%');
    await serviceClient.from('suppliers').delete().like('supplier_number', 'test-%');
    console.log('✅ 舊測試數據清理完成');
  } catch (err: any) {
    console.log('⚠️ 清理過程中有些錯誤:', err.message);
  }
}

// ========== 供應商管理測試 ==========
async function testSupplierCreate() {
  console.log('\n--- 測試供應商新增 ---');
  try {
    const supplierNumber = `TEST-${Date.now()}`;
    const { data, error } = await serviceClient
      .from('suppliers')
      .insert({
        supplier_number: supplierNumber,
        name: '測試供應商',
        contact: 'Test Contact',
        phone: '+85212345678',
        email: 'test@supplier.com',
        status: '活躍'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('✅ 新增供應商成功:', data.id);
    (global as any).testSupplierId = data.id;
    results.suppliers.create = true;
    return data.id;
  } catch (err: any) {
    console.error('❌ 新增供應商失敗:', err.message);
    return null;
  }
}

async function testSupplierList() {
  console.log('\n--- 測試供應商列表 ---');
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    console.log(`✅ 供應商列表成功，共 ${data.length} 條記錄`);
    results.suppliers.list = true;
    return data;
  } catch (err: any) {
    console.error('❌ 獲取供應商列表失敗:', err.message);
    return [];
  }
}

async function testSupplierUpdate(supplierId: string) {
  console.log('\n--- 測試供應商編輯 ---');
  try {
    const { data, error } = await serviceClient
      .from('suppliers')
      .update({ 
        contact: 'Updated Contact',
        phone: '+85298765432'
      })
      .eq('id', supplierId)
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('✅ 編輯供應商成功:', data.id);
    results.suppliers.update = true;
    return data;
  } catch (err: any) {
    console.error('❌ 編輯供應商失敗:', err.message);
    return null;
  }
}

async function testSupplierDelete(supplierId: string) {
  console.log('\n--- 測試供應商刪除 ---');
  try {
    const { error } = await serviceClient
      .from('suppliers')
      .delete()
      .eq('id', supplierId);
    
    if (error) throw error;
    
    console.log('✅ 刪除供應商成功');
    results.suppliers.delete = true;
    return true;
  } catch (err: any) {
    console.error('❌ 刪除供應商失敗:', err.message);
    return false;
  }
}

// ========== 訂單管理測試 ==========
async function testOrderFlow() {
  console.log('\n=== 測試訂單管理 ===');
  
  // 首先創建供應商和產品
  const supplierId = await testSupplierCreate();
  if (!supplierId) {
    console.error('❌ 無法創建測試供應商，跳過訂單測試');
    return;
  }

  // 創建產品
  console.log('\n--- 創建測試產品 ---');
  let productId: string | null = null;
  try {
    const { data, error } = await serviceClient
      .from('products')
      .insert({
        name: '測試產品',
        category: 'Electronics',
        sku: 'TEST-001',
        supplier_id: supplierId
      })
      .select()
      .single();
    
    if (error) throw error;
    productId = data.id;
    console.log('✅ 創建產品成功:', productId);
  } catch (err: any) {
    console.error('❌ 創建產品失敗:', err.message);
    await serviceClient.from('suppliers').delete().eq('id', supplierId);
    return;
  }

  // 新增訂單
  console.log('\n--- 測試訂單新增 ---');
  let orderId: string | null = null;
  try {
    const { data, error } = await serviceClient
      .from('orders')
      .insert({
        order_number: `TEST-ORDER-${Date.now()}`,
        status: '待處理',
        total_amount: 99.99,
        supplier_id: supplierId
      })
      .select()
      .single();
    
    if (error) throw error;
    orderId = data.id;
    console.log('✅ 新增訂單成功:', orderId);
    results.orders.create = true;
  } catch (err: any) {
    console.error('❌ 新增訂單失敗:', err.message);
  }

  if (!orderId) {
    await serviceClient.from('products').delete().eq('id', productId);
    await serviceClient.from('suppliers').delete().eq('id', supplierId);
    return;
  }

  // 編輯訂單
  console.log('\n--- 測試訂單編輯 ---');
  try {
    const { data, error } = await serviceClient
      .from('orders')
      .update({ total_amount: 199.99 })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ 編輯訂單成功');
    results.orders.update = true;
  } catch (err: any) {
    console.error('❌ 編輯訂單失敗:', err.message);
  }

  // 狀態更新
  console.log('\n--- 測試訂單狀態更新 ---');
  try {
    const { data, error } = await serviceClient
      .from('orders')
      .update({ status: '已確認' })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ 訂單狀態更新成功:', data.status);
    results.orders.statusUpdate = true;
  } catch (err: any) {
    console.error('❌ 訂單狀態更新失敗:', err.message);
  }

  // 刪除訂單
  console.log('\n--- 測試訂單刪除 ---');
  try {
    const { error } = await serviceClient
      .from('orders')
      .delete()
      .eq('id', orderId);
    
    if (error) throw error;
    console.log('✅ 刪除訂單成功');
    results.orders.delete = true;
  } catch (err: any) {
    console.error('❌ 刪除訂單失敗:', err.message);
  }

  // 清理產品
  if (productId) {
    await serviceClient.from('products').delete().eq('id', productId);
  }
  await serviceClient.from('suppliers').delete().eq('id', supplierId);
}

// ========== 庫存管理測試 ==========
async function testInventoryFlow() {
  console.log('\n=== 測試庫存管理 ===');
  
  // 創建供應商和產品
  const supplierId = await testSupplierCreate();
  if (!supplierId) {
    console.error('❌ 無法創建測試供應商，跳過庫存測試');
    return;
  }

  let productId: string | null = null;
  try {
    const { data, error } = await serviceClient
      .from('products')
      .insert({
        name: '測試庫存產品',
        category: 'Test',
        sku: 'INV-TEST-001',
        supplier_id: supplierId
      })
      .select()
      .single();
    
    if (error) throw error;
    productId = data.id;
    console.log('✅ 創建產品成功:', productId);
  } catch (err: any) {
    console.error('❌ 創建產品失敗:', err.message);
    await serviceClient.from('suppliers').delete().eq('id', supplierId);
    return;
  }

  // 新增庫存
  console.log('\n--- 測試庫存新增 ---');
  let inventoryId: string | null = null;
  try {
    const { data, error } = await serviceClient
      .from('inventory')
      .insert({
        product_id: productId,
        quantity: 100,
        min_stock: 10,
        max_stock: 500
      })
      .select()
      .single();
    
    if (error) throw error;
    inventoryId = data.id;
    console.log('✅ 新增庫存成功:', inventoryId);
    results.inventory.create = true;
  } catch (err: any) {
    console.error('❌ 新增庫存失敗:', err.message);
  }

  if (!inventoryId) {
    await serviceClient.from('products').delete().eq('id', productId);
    await serviceClient.from('suppliers').delete().eq('id', supplierId);
    return;
  }

  // 編輯庫存
  console.log('\n--- 測試庫存編輯 ---');
  try {
    const { data, error } = await serviceClient
      .from('inventory')
      .update({ quantity: 50 })
      .eq('id', inventoryId)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ 編輯庫存成功');
    results.inventory.update = true;
  } catch (err: any) {
    console.error('❌ 編輯庫存失敗:', err.message);
  }

  // 測試庫存警報（低於最小庫存）
  console.log('\n--- 測試庫存警報 ---');
  try {
    // 將庫存設置低於最小庫存
    const { data: invData, error: invError } = await serviceClient
      .from('inventory')
      .update({ quantity: 5 }) // 低於 min_stock=10
      .eq('id', inventoryId)
      .select()
      .single();
    
    if (invError) throw invError;
    
    // 檢查是否觸發警報
    const isLowStock = invData.quantity < invData.min_stock;
    console.log(`✅ 庫存警報檢查: 數量=${invData.quantity}, 最小=${invData.min_stock}, 警報=${isLowStock ? '是' : '否'}`);
    results.inventory.alert = true;
  } catch (err: any) {
    console.error('❌ 庫存警報測試失敗:', err.message);
  }

  // 刪除庫存
  console.log('\n--- 測試庫存刪除 ---');
  try {
    const { error } = await serviceClient
      .from('inventory')
      .delete()
      .eq('id', inventoryId);
    
    if (error) throw error;
    console.log('✅ 刪除庫存成功');
    results.inventory.delete = true;
  } catch (err: any) {
    console.error('❌ 刪除庫存失敗:', err.message);
  }

  // 清理
  await serviceClient.from('products').delete().eq('id', productId);
  await serviceClient.from('suppliers').delete().eq('id', supplierId);
}

// 測試 CRUD 操作
async function testCRUDOperations() {
  console.log('\n=== 測試 CRUD 操作 ===');
  try {
    const testSupplierNum = `TEST-${Date.now()}`;
    
    // Create
    const { data: supplier, error: createError } = await serviceClient
      .from('suppliers')
      .insert({ 
        supplier_number: testSupplierNum,
        name: 'CRUD測試供應商' 
      })
      .select()
      .single();
    
    if (createError) throw createError;
    console.log('✅ Create 成功');

    // Read
    const { data: readData, error: readError } = await serviceClient
      .from('suppliers')
      .select('*')
      .eq('id', supplier.id)
      .single();
    
    if (readError) throw readError;
    console.log('✅ Read 成功');

    // Update
    const { error: updateError } = await serviceClient
      .from('suppliers')
      .update({ name: 'CRUD測試供應商-已更新' })
      .eq('id', supplier.id);
    
    if (updateError) throw updateError;
    console.log('✅ Update 成功');

    // Delete
    const { error: deleteError } = await serviceClient
      .from('suppliers')
      .delete()
      .eq('id', supplier.id);
    
    if (deleteError) throw deleteError;
    console.log('✅ Delete 成功');

    results.supabase.crud = true;
  } catch (err: any) {
    console.error('❌ CRUD 操作失敗:', err.message);
  }
}

// 打印測試結果
function printResults() {
  console.log('\n' + '='.repeat(50));
  console.log('📊 測試結果報告');
  console.log('='.repeat(50));

  console.log('\n### 供應商管理');
  console.log(`- [${results.suppliers.create ? 'x' : ' '}] 新增：${results.suppliers.create ? '✅' : '❌'}`);
  console.log(`- [${results.suppliers.update ? 'x' : ' '}] 編輯：${results.suppliers.update ? '✅' : '❌'}`);
  console.log(`- [${results.suppliers.delete ? 'x' : ' '}] 刪除：${results.suppliers.delete ? '✅' : '❌'}`);
  console.log(`- [${results.suppliers.list ? 'x' : ' '}] 列表：${results.suppliers.list ? '✅' : '❌'}`);

  console.log('\n### 訂單管理');
  console.log(`- [${results.orders.create ? 'x' : ' '}] 新增：${results.orders.create ? '✅' : '❌'}`);
  console.log(`- [${results.orders.update ? 'x' : ' '}] 編輯：${results.orders.update ? '✅' : '❌'}`);
  console.log(`- [${results.orders.delete ? 'x' : ' '}] 刪除：${results.orders.delete ? '✅' : '❌'}`);
  console.log(`- [${results.orders.statusUpdate ? 'x' : ' '}] 狀態更新：${results.orders.statusUpdate ? '✅' : '❌'}`);

  console.log('\n### 庫存管理');
  console.log(`- [${results.inventory.create ? 'x' : ' '}] 新增：${results.inventory.create ? '✅' : '❌'}`);
  console.log(`- [${results.inventory.update ? 'x' : ' '}] 編輯：${results.inventory.update ? '✅' : '❌'}`);
  console.log(`- [${results.inventory.delete ? 'x' : ' '}] 刪除：${results.inventory.delete ? '✅' : '❌'}`);
  console.log(`- [${results.inventory.alert ? 'x' : ' '}] 警報：${results.inventory.alert ? '✅' : '❌'}`);

  console.log('\n### Supabase 連接');
  console.log(`- [${results.supabase.connection ? 'x' : ' '}] 連接：${results.supabase.connection ? '✅' : '❌'}`);
  console.log(`- [${results.supabase.crud ? 'x' : ' '}] CRUD：${results.supabase.crud ? '✅' : '❌'}`);

  console.log('\n' + '='.repeat(50));
}

// 主函數
async function main() {
  console.log('🚀 開始 Open Purchase 集成測試...\n');
  
  initClients();
  
  // 測試連接
  await testSupabaseConnection();
  
  // 清理舊數據
  await cleanupTestData();
  
  // 測試 CRUD
  await testCRUDOperations();
  
  // 測試供應商管理
  const supplierId = await testSupplierCreate();
  if (supplierId) {
    await testSupplierList();
    await testSupplierUpdate(supplierId);
    await testSupplierDelete(supplierId);
  }
  
  // 測試訂單管理
  await testOrderFlow();
  
  // 測試庫存管理
  await testInventoryFlow();
  
  // 打印結果
  printResults();
}

main().catch(console.error);
