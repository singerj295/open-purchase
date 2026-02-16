import { NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/service';

export async function POST(request: Request) {
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
