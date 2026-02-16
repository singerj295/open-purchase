import { NextRequest, NextResponse } from 'next/server';

// Complete WhatsApp Supplier Portal
// Supports full supplier workflow

interface OrderItem {
  productId: string
  name: string
  quantity: number
  unitPrice: number
}

interface Order {
  id: string
  orderNumber: string
  supplierId: string
  supplierPhone: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  totalAmount: number
  createdAt: string
  expectedDelivery: string
}

// Mock database
const ordersDB: Map<string, Order> = new Map()

// Message templates
const templates: Record<string, string | ((...args: any[]) => string)> = {
  orderReceived: (orderNumber: string, total: number) =>
    `📦 Order ${orderNumber} received!\n\nTotal: $${total}\n\nPlease reply:\n- "YES" to confirm\n- "NO" to decline\n- "PRICE: $XX" to update price`,

  orderConfirmed: (orderNumber: string) =>
    `✅ Order ${orderNumber} CONFIRMED!\n\nThank you! We'll proceed with payment.\n\nReply "SHIPPED" when ready to dispatch.`,

  orderShipped: (orderNumber: string, tracking?: string) =>
    `🚚 Order ${orderNumber} is on the way!\n\n${tracking ? `Tracking: ${tracking}` : 'Track your order in the portal.'}\n\nReply "DELIVERED" when received.`,

  orderDelivered: (orderNumber: string) =>
    `🎉 Order ${orderNumber} DELIVERED!\n\nThank you for your business!\n\n💰 Payment will be processed within 7 days.`,

  priceUpdated: (orderNumber: string, newPrice: number) =>
    `💰 Price updated for ${orderNumber}: $${newPrice}\n\nOrder confirmed!`,

  help: () => `📱 WhatsApp Supplier Portal\n\nCommands:\n- YES/ACCEPT - Confirm order\n- NO/REJECT - Decline\n- SHIPPED - Dispatch order\n- DELIVERED - Order received\n- PRICE: $XX - Update price\n\nNeed help? Call +852 1234 5678`,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData()
    const from = body.get('From') as string // whatsapp:+85212345678
    const message = body.get('Body') as string
    const messageSid = body.get('MessageSid') as string

    console.log(`📱 WhatsApp from ${from}: ${message}`)

    const normalizedPhone = from.replace('whatsapp:', '')
    const action = parseMessage(message)

    // Find supplier's pending order
    const order = findOrderByPhone(normalizedPhone)

    if (!order) {
      const helpMsg = templates.help()
      return twimlResponse(helpMsg)
    }

    // Process action
    const result = await processAction(order, action, message)

    // Send response
    return twimlResponse(result.message)

  } catch (error: any) {
    console.error('WhatsApp Portal Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

function parseMessage(message: string): string {
  const msg = message.toLowerCase().trim()

  if (['yes', 'ok', 'accept', 'confirm'].includes(msg)) return 'confirm'
  if (['no', 'reject', 'decline'].includes(msg)) return 'reject'
  if (msg.includes('ship') || msg.includes('dispatch')) return 'shipped'
  if (msg.includes('deliver') || msg.includes('arrive')) return 'delivered'
  if (msg.includes('price')) return 'price'
  if (msg === 'status') return 'status'
  
  return 'unknown'
}

function findOrderByPhone(phone: string): Order | null {
  for (const order of ordersDB.values()) {
    if (order.supplierPhone === phone && ['pending', 'confirmed'].includes(order.status)) {
      return order
    }
  }
  return null
}

async function processAction(order: Order, action: string, message: string): Promise<{ message: string; status: string }> {
  switch (action) {
    case 'confirm':
      order.status = 'confirmed'
      return { 
        message: templates.orderConfirmed(order.orderNumber),
        status: 'confirmed'
      }

    case 'reject':
      order.status = 'cancelled'
      return { 
        message: `Order ${order.orderNumber} has been cancelled.`,
        status: 'cancelled'
      }

    case 'shipped':
      order.status = 'shipped'
      return { 
        message: templates.orderShipped(order.orderNumber),
        status: 'shipped'
      }

    case 'delivered':
      order.status = 'delivered'
      return { 
        message: templates.orderDelivered(order.orderNumber),
        status: 'delivered'
      }

    case 'price':
      const priceMatch = message.match(/\$?(\d+)/)
      if (priceMatch) {
        order.totalAmount = parseInt(priceMatch[1])
        return {
          message: templates.priceUpdated(order.orderNumber, order.totalAmount),
          status: 'price_updated'
        }
      }
      return { message: 'Could not parse price. Try: PRICE: $100', status: 'error' }

    case 'status':
      return {
        message: `Order ${order.orderNumber}\nStatus: ${order.status}\nTotal: $${order.totalAmount}`,
        status: order.status
      }

    default:
      return { message: templates.help(), status: 'unknown' }
  }
}

function twimlResponse(message: string | ((...args: any[]) => string)): NextResponse {
  const msg = typeof message === 'function' ? message() : message
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${msg}</Message>
</Response>`

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml' }
  })
}

// GET for health check
export async function GET() {
  return NextResponse.json({
    service: 'WhatsApp Supplier Portal (Complete)',
    status: 'active',
    version: '1.0.0',
    endpoints: {
      POST: 'Receive supplier messages',
      GET: 'Health check',
    },
    features: [
      'Order confirmation',
      'Price negotiation',
      'Shipment tracking',
      'Delivery confirmation',
    ],
  })
}
