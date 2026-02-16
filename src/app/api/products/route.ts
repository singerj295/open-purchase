import { NextResponse } from "next/server";

// Mock data for demo
const products = [
  { id: "1", name: "Fresh Salmon", category: "Seafood", unit: "kg", price: 45, supplierId: "2", isActive: true },
  { id: "2", name: "Organic Tomatoes", category: "Vegetables", unit: "kg", price: 12, supplierId: "1", isActive: true },
  { id: "3", name: "Olive Oil", category: "Oils", unit: "L", price: 28, supplierId: "3", isActive: true },
  { id: "4", name: "Sea Bass", category: "Seafood", unit: "kg", price: 52, supplierId: "2", isActive: true },
  { id: "5", name: "Mixed Herbs", category: "Spices", unit: "g", price: 8, supplierId: "4", isActive: true },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: products,
    total: products.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct = {
      id: String(products.length + 1),
      ...body,
      isActive: true,
    };
    products.push(newProduct);
    
    return NextResponse.json({
      success: true,
      data: newProduct,
      message: "Product created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 400 }
    );
  }
}
