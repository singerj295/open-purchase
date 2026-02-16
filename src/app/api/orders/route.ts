import { NextResponse } from "next/server";

// Mock data for demo
const orders = [
  { id: "1", orderNumber: "ORD-001", supplierId: "1", status: "DELIVERED", totalAmount: 450, createdAt: new Date().toISOString() },
  { id: "2", orderNumber: "ORD-002", supplierId: "2", status: "SHIPPED", totalAmount: 890, createdAt: new Date().toISOString() },
  { id: "3", orderNumber: "ORD-003", supplierId: "3", status: "PENDING", totalAmount: 320, createdAt: new Date().toISOString() },
  { id: "4", orderNumber: "ORD-004", supplierId: "1", status: "CONFIRMED", totalAmount: 560, createdAt: new Date().toISOString() },
  { id: "5", orderNumber: "ORD-005", supplierId: "4", status: "DELIVERED", totalAmount: 180, createdAt: new Date().toISOString() },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: orders,
    total: orders.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = {
      id: String(orders.length + 1),
      orderNumber: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      ...body,
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
