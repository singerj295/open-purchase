import { NextResponse } from "next/server";
import { createRateLimitedHandler } from "@/lib/rate-limit";

// Mock data for demo
const products = [
  { id: "1", name: "Fresh Salmon", category: "Seafood", unit: "kg", price: 45, supplierId: "2", isActive: true },
  { id: "2", name: "Organic Tomatoes", category: "Vegetables", unit: "kg", price: 12, supplierId: "1", isActive: true },
  { id: "3", name: "Olive Oil", category: "Oils", unit: "L", price: 28, supplierId: "3", isActive: true },
  { id: "4", name: "Sea Bass", category: "Seafood", unit: "kg", price: 52, supplierId: "2", isActive: true },
  { id: "5", name: "Mixed Herbs", category: "Spices", unit: "g", price: 8, supplierId: "4", isActive: true },
];

async function handleGET(request: Request) {
  return NextResponse.json({
    success: true,
    data: products,
    total: products.length,
  });
}

async function handlePOST(request: Request) {
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

export const GET = createRateLimitedHandler(handleGET);
export const POST = createRateLimitedHandler(handlePOST);
