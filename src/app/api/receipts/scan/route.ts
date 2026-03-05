import { NextRequest, NextResponse } from 'next/server';
import { convertReceiptToOrder } from '@/lib/receipt-converter';
import { supabase } from '@/lib/supabase';

/**
 * POST /api/receipts/scan
 * 
 * 接收 Telegram 掃描嘅單據數據，轉換為訂單
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 解析請求數據
    const body = await request.json();
    console.log('📥 接收到掃描數據:', body);
    
    const {
      telegram_user_id,
      image_url,
      ocr_data,
      confidence_score
    } = body;
    
    // 2. 驗證數據完整性
    if (!ocr_data || !ocr_data.supplier_name || !ocr_data.items) {
      return NextResponse.json(
        { 
          success: false, 
          error: '數據不完整，需要 supplier_name 同 items' 
        },
        { status: 400 }
      );
    }
    
    // 3. 轉換單據為訂單
    console.log('🔄 開始轉換單據...');
    const orderNumber = await convertReceiptToOrder(ocr_data);
    
    // 4. 更新 receipt_scans 表
    const { error: updateError } = await supabase
      .from('receipt_scans')
      .update({
        status: 'processed',
        order_id: orderNumber // 注意：需要修改表結構添加 order_id 字段
      })
      .eq('receipt_image_url', image_url);
    
    if (updateError) {
      console.error('⚠️ 更新 receipt_scans 失敗:', updateError);
    }
    
    // 5. 返回成功結果
    return NextResponse.json({
      success: true,
      message: '單據已成功轉換為訂單',
      order_number: orderNumber,
      data: {
        supplier_name: ocr_data.supplier_name,
        total_amount: ocr_data.total_amount,
        items_count: ocr_data.items.length,
        confidence_score
      }
    });
    
  } catch (error) {
    console.error('❌ 處理失敗:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '處理失敗' 
      },
      { status: 500 }
    );
  }
}
