import { NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/service';
import { createRateLimitedHandler } from "@/lib/rate-limit";

async function handlePOST(request: Request) {
  try {
    const body = await request.json();
    const { orders, inventory, suppliers } = body;

    const insights = await aiService.analyzeCosts({
      orders: orders || [],
      inventory: inventory || [],
      suppliers: suppliers || [],
    });

    return NextResponse.json({
      success: true,
      data: insights,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI analyze error:', error);
    return NextResponse.json(
      { success: false, error: 'Analysis failed' },
      { status: 500 }
    );
  }
}

export const POST = createRateLimitedHandler(handlePOST, { sensitiveEndpoint: true });
