import { NextResponse } from "next/server";
import { createRateLimitedHandler } from "@/lib/rate-limit";
import { supabase } from "@/lib/supabase";

// GET - 讀取所有供應商
async function handleGET(request: Request) {
  try {
    console.log("[Suppliers GET] Fetching all suppliers");
    
    const { data: suppliers, error } = await supabase
      .from('Supplier')
      .select('*')
      .order('createdat', { ascending: false });

    if (error) {
      console.error('[Suppliers GET] Error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 });
    }

    // 轉換字段名為前端期望的格式
    const formattedSuppliers = (suppliers || []).map(s => ({
      id: s.id,
      name: s.name,
      contact: s.contact,
      phone: s.phone,
      email: s.email,
      address: s.address,
      notes: s.notes,
      isActive: s.isactive,
      createdAt: s.createdat,
      updatedAt: s.updatedat,
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedSuppliers,
      total: formattedSuppliers.length,
    });
  } catch (error) {
    console.error("[Suppliers GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}

// POST - 創建新供應商
async function handlePOST(request: Request) {
  try {
    const body = await request.json();
    
    // 驗證必填欄位
    if (!body.name) {
      console.warn("[Suppliers POST] Missing required field: name");
      return NextResponse.json(
        { success: false, error: "Missing required field: name" },
        { status: 400 }
      );
    }
    
    // 創建供應商 - 使用 Supplier 表的字段名格式
    const newSupplier = {
      name: body.name,
      contact: body.contact || '',
      phone: body.phone || '',
      email: body.email || '',
      address: body.address || '',
      notes: body.notes || '',
      isactive: true,
    };

    const { data: supplier, error } = await supabase
      .from('Supplier')
      .insert(newSupplier)
      .select()
      .single();

    if (error) {
      console.error('[Suppliers POST] Error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 });
    }
    
    console.log("[Suppliers POST] Created new supplier:", supplier.id);
    
    return NextResponse.json({
      success: true,
      data: {
        id: supplier.id,
        name: supplier.name,
        contact: supplier.contact,
        phone: supplier.phone,
        email: supplier.email,
        isActive: supplier.isactive,
      },
      message: "Supplier created successfully",
    });
  } catch (error) {
    console.error("[Suppliers POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create supplier" },
      { status: 500 }
    );
  }
}

export const GET = createRateLimitedHandler(handleGET);
export const POST = createRateLimitedHandler(handlePOST);