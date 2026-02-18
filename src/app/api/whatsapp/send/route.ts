import { NextResponse } from 'next/server';
import { whatsappService } from '@/lib/whatsapp/service';
import { createRateLimitedHandler } from "@/lib/rate-limit";

async function handlePOST(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, supplierName, supplierPhone, items, totalAmount, notes } = body;

    const result = await whatsappService.sendOrderToSupplier({
      orderNumber,
      supplierName,
      supplierPhone,
      items: items || [],
      totalAmount: totalAmount || 0,
      notes,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: 'Order sent successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send WhatsApp message' },
      { status: 500 }
    );
  }
}

export const POST = createRateLimitedHandler(handlePOST);
