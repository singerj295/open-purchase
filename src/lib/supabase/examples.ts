/**
 * Supabase API Client 使用示例
 * 
 * 所有操作都唔使 DATABASE_URL，直接用 API Key！
 */

import { supabaseAdmin } from '@/lib/supabase/client'

// ============================================
// 示例 1: 創建供應商
// ============================================
async function createSupplier() {
  const { data, error } = await supabaseAdmin
    .from('suppliers')
    .insert({
      name: 'Test Supplier',
      contact: 'John Doe',
      phone: '+852 1234 5678',
      email: 'john@test.com',
      address: 'Hong Kong',
      isActive: true
    })
    .select()
    .single()

  if (error) {
    console.error('❌ 創建失敗:', error.message)
    return null
  }

  console.log('✅ 創建成功:', data)
  return data
}

// ============================================
// 示例 2: 讀取供應商列表
// ============================================
async function getSuppliers() {
  const { data, error } = await supabaseAdmin
    .from('suppliers')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('❌ 讀取失敗:', error.message)
    return []
  }

  console.log('📋 供應商列表:', data)
  return data
}

// ============================================
// 示例 3: 更新供應商
// ============================================
async function updateSupplier(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from('suppliers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('❌ 更新失敗:', error.message)
    return null
  }

  console.log('✅ 更新成功:', data)
  return data
}

// ============================================
// 示例 4: 刪除供應商
// ============================================
async function deleteSupplier(id: string) {
  const { error } = await supabaseAdmin
    .from('suppliers')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('❌ 刪除失敗:', error.message)
    return false
  }

  console.log('✅ 刪除成功')
  return true
}

// ============================================
// 示例 5: 創建訂單 (包含訂單項目)
// ============================================
async function createOrder() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert({
      orderNumber: 'ORD-001',
      supplierId: 'supplier-id-here',
      status: 'PENDING',
      totalAmount: 1000.00,
      notes: 'Test order'
    })
    .select()
    .single()

  if (error) {
    console.error('❌ 創建訂單失敗:', error.message)
    return null
  }

  console.log('✅ 訂單創建成功:', data)
  return data
}

// ============================================
// 示例 6: 查詢訂單 (包含供應商資料)
// ============================================
async function getOrdersWithSuppliers() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      suppliers (
        id,
        name,
        contact
      )
    `)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('❌ 查詢失敗:', error.message)
    return []
  }

  console.log('📋 訂單列表 (包含供應商):', data)
  return data
}

// ============================================
// 示例 7: 庫存警報 (低庫存)
// ============================================
async function getLowInventory(minStock: number = 10) {
  const { data, error } = await supabaseAdmin
    .from('inventory')
    .select(`
      *,
      products (
        name,
        sku
      )
    `)
    .lte('quantity', minStock)

  if (error) {
    console.error('❌ 查詢失敗:', error.message)
    return []
  }

  console.log('⚠️ 低庫存警報:', data)
  return data
}

// ============================================
// 示例 8: 批量操作
// ============================================
async function bulkUpdateSuppliers(ids: string[], updates: any) {
  const { data, error } = await supabaseAdmin
    .from('suppliers')
    .update(updates)
    .in('id', ids)
    .select()

  if (error) {
    console.error('❌ 批量更新失敗:', error.message)
    return null
  }

  console.log('✅ 批量更新成功:', data)
  return data
}

// ============================================
// 示例 9: 搜索供應商
// ============================================
async function searchSuppliers(keyword: string) {
  const { data, error } = await supabaseAdmin
    .from('suppliers')
    .select('*')
    .or(`name.ilike.%${keyword}%,contact.ilike.%${keyword}%,email.ilike.%${keyword}%`)

  if (error) {
    console.error('❌ 搜索失敗:', error.message)
    return []
  }

  console.log('🔍 搜索結果:', data)
  return data
}

// ============================================
// 示例 10: 分頁查詢
// ============================================
async function getSuppliersPaginated(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit
  
  const { data, error, count } = await supabaseAdmin
    .from('suppliers')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('name', { ascending: true })

  if (error) {
    console.error('❌ 分頁查詢失敗:', error.message)
    return { data: [], count: 0 }
  }

  console.log('📄 分頁結果:', { data, count, page, totalPages: Math.ceil((count || 0) / limit) })
  return { data, count, page, totalPages: Math.ceil((count || 0) / limit) }
}

// ============================================
// 導出所有示例函數
// ============================================
export {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
  createOrder,
  getOrdersWithSuppliers,
  getLowInventory,
  bulkUpdateSuppliers,
  searchSuppliers,
  getSuppliersPaginated
}

// ============================================
// 使用示例 (喺 API Route 或者 Component 入面)
// ============================================
/*
// 喺 API Route 入面使用:
import { createSupplier, getSuppliers } from '@/lib/supabase/examples'

export async function POST(request: Request) {
  const body = await request.json()
  const supplier = await createSupplier(body)
  return Response.json({ data: supplier })
}

export async function GET() {
  const suppliers = await getSuppliers()
  return Response.json({ data: suppliers })
}

// 喺 React Component 入面使用:
'use client'
import { useEffect, useState } from 'react'
import { getSuppliers } from '@/lib/supabase/examples'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([])
  
  useEffect(() => {
    getSuppliers().then(setSuppliers)
  }, [])
  
  return (
    <div>
      {suppliers.map(supplier => (
        <div key={supplier.id}>{supplier.name}</div>
      ))}
    </div>
  )
}
*/
