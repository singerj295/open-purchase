import { NextRequest, NextResponse } from 'next/server';

// WhatsApp Supplier Portal API
// Handles incoming messages from suppliers via Twilio WhatsApp

interface OrderMessage {
  orderId: string;
  supplierPhone: string;
  action: 'accept' | 'reject' | 'confirm_price' | 'shipped' | 'delivered';
  message: string;
  timestamp: string;
}

// Mock order database
const ordersDB: Record<string, { id: string; supplier: string; supplierPhone: string; status: string; items: any[]; total: number }> = {
  'ORD-001': { id: 'ORD-001', supplier: 'Fresh Farm Co', supplierPhone: '+85212345678', status: 'pending', items: [{ name: 'Tomatoes', qty: 10, price: 5 }], total: 50 },
  'ORD-002': { id: 'ORD-002', supplier: 'Ocean Seafood', supplierPhone: '+85223456789', status: 'confirmed', items: [{ name: 'Salmon', qty: 5, price: 30 }], total: 150 },
};

// Handle incoming WhatsApp messages from suppliers
export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    
    // Twilio WhatsApp payload
    const from = body.get('From') as string; // e.g., whatsapp:+85212345678
    const messageBody = body.get('Body') as string;
    const messageSid = body.get('MessageSid') as string;

    console.log(`📱 WhatsApp received from ${from}: ${messageBody}`);

    // Parse the message
    const parsed = parseSupplierMessage(messageBody);
    
    if (!parsed) {
      // Send help message
      const response = sendHelpMessage();
      return new NextResponse(response, {
        headers: { 'Content-Type': 'text/xml' }
      });
    }

    // Find the supplier's pending order
    const order = findSupplierOrder(from);
    
    if (!order) {
      const response = sendNoOrderMessage();
      return new NextResponse(response, {
        headers: { 'Content-Type': 'text/xml' }
      });
    }

    // Process the action
    const result = await processSupplierAction(order.id, parsed.action, messageBody);

    // Send confirmation back to supplier
    const response = sendConfirmationMessage(order.id, parsed.action, result);
    return new NextResponse(response, {
      headers: { 'Content-Type': 'text/xml' }
    });

  } catch (error: any) {
    console.error('WhatsApp API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Parse supplier's message to determine action
function parseSupplierMessage(message: string): { action: string; details: string } | null {
  const lowerMsg = message.toLowerCase().trim();

  // Accept patterns
  if (lowerMsg === 'yes' || lowerMsg === 'ok' || lowerMsg === 'accept' || lowerMsg === 'confirm') {
    return { action: 'accept', details: 'Supplier accepted the order' };
  }

  // Reject patterns
  if (lowerMsg === 'no' || lowerMsg === 'reject' || lowerMsg === 'decline') {
    return { action: 'reject', details: 'Supplier rejected the order' };
  }

  // Shipped patterns
  if (lowerMsg.includes('ship') || lowerMsg.includes('send') || lowerMsg.includes('dispatch')) {
    return { action: 'shipped', details: 'Order has been shipped' };
  }

  // Delivered patterns
  if (lowerMsg.includes('deliver') || lowerMsg.includes('arrive') || lowerMsg.includes('received')) {
    return { action: 'delivered', details: 'Order has been delivered' };
  }

  // Price confirmation pattern: "price 100"
  const priceMatch = message.match(/price\s*[:=]?\s*\$?(\d+)/i);
  if (priceMatch) {
    return { action: 'confirm_price', details: `Price confirmed: $${priceMatch[1]}` };
  }

  return null;
}

// Find supplier's pending order
function findSupplierOrder(supplierPhone: string): any {
  // Normalize phone number
  const normalizedPhone = supplierPhone.replace('whatsapp:', '');
  
  return Object.values(ordersDB).find(
    (order) => order.supplierPhone === normalizedPhone && ['pending', 'confirmed'].includes(order.status)
  );
}

// Process the supplier's action
async function processSupplierAction(orderId: string, action: string, details: string): Promise<any> {
  const order = ordersDB[orderId];
  if (!order) return { success: false };

  switch (action) {
    case 'accept':
      order.status = 'confirmed';
      break;
    case 'reject':
      order.status = 'cancelled';
      break;
    case 'shipped':
      order.status = 'shipped';
      break;
    case 'delivered':
      order.status = 'delivered';
      break;
    case 'confirm_price':
      // Update price if provided
      order.total = parseInt(details.match(/\d+/)?.[0] || order.total.toString());
      order.status = 'confirmed';
      break;
  }

  return { success: true, newStatus: order.status };
}

// Send TwiML response for help
function sendHelpMessage(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>
    📦 *Open Purchase - Supplier Portal*

    Welcome! Please reply with:
    • "YES" or "ACCEPT" to confirm order
    • "NO" or "REJECT" to decline
    • "SHIPPED" when order is on the way
    • "DELIVERED" when order arrived
    • "PRICE: $XX" to confirm price

    Reply "ORD-001" for order details.
  </Message>
</Response>`;
}

// Send TwiML response when no order found
function sendNoOrderMessage(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>
    ❌ No pending orders found for this number.

    If you believe this is an error, please contact the buyer directly.
  </Message>
</Response>`;
}

// Send TwiML confirmation
function sendConfirmationMessage(orderId: string, action: string, result: any): string {
  const messages: Record<string, string> = {
    accept: `✅ Order ${orderId} has been CONFIRMED.

    Thank you! The order is now being processed.

    📋 Order Details:
    Items: See attached
    Status: Confirmed

    Reply "SHIPPED" when you dispatch the order.`,
    
    reject: `❌ Order ${orderId} has been CANCELLED.

    The buyer has been notified. If this is a mistake, please contact them directly.`,
    
    shipped: `🚚 Order ${orderId} is now in transit.

    Thank you for shipping! The buyer will be notified.

    Reply "DELIVERED" when the order arrives.`,
    
    delivered: `📦 Order ${orderId} has been DELIVERED.

    Thank you for your service! Payment will be processed soon.

    We look forward to your next order! 🙏`,
    
    confirm_price: `💰 Price updated for Order ${orderId}.

    Thank you for confirming! The order is now confirmed.

    Reply "SHIPPED" when ready to dispatch.`,
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>
    ${messages[action] || '✅ Action processed.'}
  </Message>
</Response>`;
}

// GET endpoint for testing/health check
export async function GET() {
  return NextResponse.json({
    service: 'WhatsApp Supplier Portal',
    status: 'active',
    endpoints: {
      POST: 'Receive WhatsApp messages from suppliers',
      GET: 'Health check',
    },
    actions: ['accept', 'reject', 'shipped', 'delivered', 'confirm_price'],
  });
}
