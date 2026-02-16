import { NextResponse } from "next/server";

// Mock data for demo
const suppliers = [
  { id: "1", name: "Fresh Farm Co", contact: "John Smith", phone: "+852 1234 5678", email: "john@freshfarm.com", isActive: true },
  { id: "2", name: "Ocean Seafood", contact: "Mary Chan", phone: "+852 2345 6789", email: "mary@ocean.com", isActive: true },
  { id: "3", name: "Kitchen Supplies Ltd", contact: "David Wong", phone: "+852 3456 7890", email: "david@kitchen.com", isActive: true },
  { id: "4", name: "Spice World", contact: "Lisa Lau", phone: "+852 4567 8901", email: "lisa@spice.com", isActive: false },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: suppliers,
    total: suppliers.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSupplier = {
      id: String(suppliers.length + 1),
      ...body,
      isActive: true,
    };
    suppliers.push(newSupplier);
    
    return NextResponse.json({
      success: true,
      data: newSupplier,
      message: "Supplier created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create supplier" },
      { status: 400 }
    );
  }
}
