import { NextResponse } from "next/server";
import { createRateLimitedHandler } from "@/lib/rate-limit";
import { supabase } from "@/lib/supabase";

// GET - 讀取所有訂單
async function handleGET() {
  try {
    const { data: orders, error } = await supabase
      .from('Order')
      .select(`
        *,
        Supplier (
          id,
          name,
          contact,
          phone,
          email
        )
      `)
      .order('createdat', { ascending: false });

    if (error) {
      console.error('讀取訂單失敗:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 });
    }

    // 轉換字段名為前端期望的格式
    const formattedOrders = (orders || []).map(order => ({
      id: order.id,
      orderNumber: order.ordernumber,
      supplierId: order.supplierid,
      supplierName: order.Supplier?.name || '未知供應商',
      status: order.status,
      totalAmount: order.totalamount,
      notes: order.notes,
      createdAt: order.createdat,
      updatedAt: order.updatedat,
      whatsappStatus: order.whatsappstatus,
    }));

    return NextResponse.json({
      success: true,
      data: formattedOrders,
      total: formattedOrders.length,
    });
  } catch (error) {
    console.error('讀取訂單失敗:', error);
    return NextResponse.json({
      success: false,
      error: '無法讀取訂單',
    }, { status: 500 });
  }
}

// POST - 創建新訂單
async function handlePOST(request: Request) {
  try {
    const body = await request.json();
    
    const { supplierId, supplierName, status, totalAmount, items, notes } = body;
    
    if (!supplierId) {
      return NextResponse.json({
        success: false,
        error: '供應商 ID 為必填',
      }, { status: 400 });
    }

    // 生成訂單編號
    const orderNumber = `PO-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Date.now().toString().slice(-6)}`;

    // 創建訂單 - 使用 Order 表的字段名格式
    const newOrder = {
      ordernumber: orderNumber,
      supplierid: supplierId,
      status: status || 'PENDING',
      totalamount: totalAmount || 0,
      notes: notes || '',
      whatsappstatus: 'not_sent',
    };

    const { data: order, error: orderError } = await supabase
      .from('Order')
      .insert(newOrder)
      .select()
      .single();

    if (orderError) {
      console.error('創建訂單失敗:', orderError);
      return NextResponse.json({
        success: false,
        error: orderError.message,
      }, { status: 500 });
    }

    // 創建訂單項目
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        orderid: order.id,
        productid: item.productId,
        productname: item.productName || '',
        quantity: item.quantity,
        unitprice: item.unitPrice,
        totalprice: item.totalPrice || (item.quantity * item.unitPrice),
      }));

      const { error: itemsError } = await supabase
        .from('OrderItem')
        .insert(orderItems);

      if (itemsError) {
        console.error('創建訂單項目失敗:', itemsError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: order.ordernumber,
        status: order.status,
      },
    });
  } catch (error) {
    console.error('創建訂單失敗:', error);
    return NextResponse.json({
      success: false,
      error: '無法創建訂單',
    }, { status: 500 });
  }
}

// DELETE - 刪除訂單
async function handleDELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: '訂單 ID 為必填',
      }, { status: 400 });
    }

    const { error } = await supabase
      .from('Order')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('刪除訂單失敗:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('刪除訂單失敗:', error);
    return NextResponse.json({
      success: false,
      error: '無法刪除訂單',
    }, { status: 500 });
  }
}

// 使用 rate limit handler
export const GET = createRateLimitedHandler(handleGET);
export const POST = createRateLimitedHandler(handlePOST);
export const DELETE = createRateLimitedHandler(handleDELETE);