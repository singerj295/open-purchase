import { NextResponse } from "next/server";
import { createRateLimitedHandler } from "@/lib/rate-limit";

// Mock data for demo
const suppliers = [
  { id: "1", name: "Fresh Farm Co", contact: "John Smith", phone: "+852 1234 5678", email: "john@freshfarm.com", isActive: true },
  { id: "2", name: "Ocean Seafood", contact: "Mary Chan", phone: "+852 2345 6789", email: "mary@ocean.com", isActive: true },
  { id: "3", name: "Kitchen Supplies Ltd", contact: "David Wong", phone: "+852 3456 7890", email: "david@kitchen.com", isActive: true },
  { id: "4", name: "Spice World", contact: "Lisa Lau", phone: "+852 4567 8901", email: "lisa@spice.com", isActive: false },
];

async function handleGET(request: Request) {
  try {
    console.log("[Suppliers GET] Fetching all suppliers");
    
    return NextResponse.json({
      success: true,
      data: suppliers,
      total: suppliers.length,
    });
  } catch (error) {
    console.error("[Suppliers GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}

async function handlePOST(request: Request) {
  try {
    const body = await request.json();
    
    // 驗證必填欄位
    if (!body.name || !body.contact) {
      console.warn("[Suppliers POST] Missing required fields:", { name: body.name, contact: body.contact });
      return NextResponse.json(
        { success: false, error: "Missing required fields: name and contact" },
        { status: 400 }
      );
    }
    
    const newSupplier = {
      id: String(suppliers.length + 1),
      ...body,
      isActive: true,
    };
    suppliers.push(newSupplier);
    
    console.log("[Suppliers POST] Created new supplier:", newSupplier.id);
    
    return NextResponse.json({
      success: true,
      data: newSupplier,
      message: "Supplier created successfully",
    });
  } catch (error) {
    console.error("[Suppliers POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create supplier" },
      { status: 400 }
    );
  }
}

export const GET = createRateLimitedHandler(handleGET);
export const POST = createRateLimitedHandler(handlePOST);
