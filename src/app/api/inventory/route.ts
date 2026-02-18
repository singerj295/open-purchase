import { NextResponse } from "next/server";
import { createRateLimitedHandler } from "@/lib/rate-limit";

// Mock data for demo
const inventory = [
  { id: "1", productId: "1", quantity: 45, minStock: 20, maxStock: 100, location: "Cold Storage A" },
  { id: "2", productId: "2", quantity: 80, minStock: 30, maxStock: 150, location: "Dry Storage B" },
  { id: "3", productId: "3", quantity: 25, minStock: 10, maxStock: 50, location: "Dry Storage A" },
  { id: "4", productId: "4", quantity: 12, minStock: 15, maxStock: 60, location: "Cold Storage A" },
  { id: "5", productId: "5", quantity: 500, minStock: 200, maxStock: 1000, location: "Spice Rack" },
];

async function handleGET(request: Request) {
  return NextResponse.json({
    success: true,
    data: inventory,
    total: inventory.length,
  });
}

async function handlePOST(request: Request) {
  try {
    const body = await request.json();
    const newInventory = {
      id: String(inventory.length + 1),
      ...body,
    };
    inventory.push(newInventory);
    
    return NextResponse.json({
      success: true,
      data: newInventory,
      message: "Inventory updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update inventory" },
      { status: 400 }
    );
  }
}

export const GET = createRateLimitedHandler(handleGET);
export const POST = createRateLimitedHandler(handlePOST);
