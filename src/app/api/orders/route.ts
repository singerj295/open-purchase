import { NextResponse } from "next/server";
import { createRateLimitedHandler } from "@/lib/rate-limit";
import { z } from "zod";

// Zod validation schema for order data
const orderSchema = z.object({
  supplierId: z.string().min(1, "供應商 ID 為必填項"),
  items: z.array(z.object({
    productId: z.string().min(1, "商品 ID 為必填項"),
    quantity: z.number().int().positive("數量必須為正整數"),
    unitPrice: z.number().nonnegative("單價必須為非負數"),
  })).min(1, "至少需要一個商品"),
  notes: z.string().optional(),
});

// Validate order input
function validateOrder(data: unknown) {
  const result = orderSchema.safeParse(data);
  if (!result.success) {
    // Zod 4: error.message contains JSON string of errors
    const errorData = JSON.parse(result.error.message);
    const errors = Array.isArray(errorData) ? errorData : [];
    return {
      valid: false,
      errors: errors.map((err: any) => ({
        field: err.path?.join(".") || "",
        message: err.message,
      })),
    };
  }
  return { valid: true, data: result.data };
}

// Mock data for demo
const orders = [
  { id: "1", orderNumber: "ORD-001", supplierId: "1", status: "DELIVERED", totalAmount: 450, createdAt: new Date().toISOString() },
  { id: "2", orderNumber: "ORD-002", supplierId: "2", status: "SHIPPED", totalAmount: 890, createdAt: new Date().toISOString() },
  { id: "3", orderNumber: "ORD-003", supplierId: "3", status: "PENDING", totalAmount: 320, createdAt: new Date().toISOString() },
  { id: "4", orderNumber: "ORD-004", supplierId: "1", status: "CONFIRMED", totalAmount: 560, createdAt: new Date().toISOString() },
  { id: "5", orderNumber: "ORD-005", supplierId: "4", status: "DELIVERED", totalAmount: 180, createdAt: new Date().toISOString() },
];

async function handleGET(request: Request) {
  return NextResponse.json({
    success: true,
    data: orders,
    total: orders.length,
  });
}

async function handlePOST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateOrder(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: "驗證失敗", details: validation.errors },
        { status: 400 }
      );
    }

    // TypeScript doesn't know validation.data exists here, so we need to cast it
    const validatedData = validation.data!;
    const totalAmount = validatedData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice, 
      0
    );
    
    const newOrder = {
      id: String(orders.length + 1),
      orderNumber: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      supplierId: validatedData.supplierId,
      items: validatedData.items,
      totalAmount,
      notes: validatedData.notes || "",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    
    return NextResponse.json({
      success: true,
      data: newOrder,
      message: "Order created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 400 }
    );
  }
}

export const GET = createRateLimitedHandler(handleGET);
export const POST = createRateLimitedHandler(handlePOST);
