// WhatsApp Service using Twilio
// Configure in .env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER

interface WhatsAppConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

interface OrderMessage {
  orderNumber: string;
  supplierName: string;
  supplierPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    price: number;
  }>;
  totalAmount: number;
  notes?: string;
}

export class WhatsAppService {
  private config: WhatsAppConfig;

  constructor() {
    this.config = {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      fromNumber: process.env.TWILIO_PHONE_NUMBER || '',
    };
  }

  /**
   * Format order message for WhatsApp
   */
  formatOrderMessage(order: OrderMessage): string {
    const itemsList = order.items
      .map((item) => `• ${item.name}: ${item.quantity} ${item.unit} ($${item.price})`)
      .join('\n');

    return `🍽️ *New Order - ${order.orderNumber}*

*Supplier:* ${order.supplierName}
*Total:* $${order.totalAmount}

*Items:*
${itemsList}

${order.notes ? `*Notes:* ${order.notes}` : ''}

---
Please confirm receipt and estimated delivery time.

Thanks!
Open Purchase 🛒`;
  }

  /**
   * Send order to supplier via WhatsApp
   */
  async sendOrderToSupplier(order: OrderMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.config.accountSid || !this.config.authToken) {
      console.log('📱 WhatsApp (Demo Mode)');
      console.log(`To: ${order.supplierPhone}`);
      console.log(`Message:\n${this.formatOrderMessage(order)}`);
      return { success: true, messageId: `demo-${Date.now()}` };
    }

    try {
      const message = this.formatOrderMessage(order);
      const toNumber = `whatsapp:${order.supplierPhone}`;
      const fromNumber = `whatsapp:${this.config.fromNumber}`;

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${this.config.accountSid}:${this.config.authToken}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: toNumber,
            From: fromNumber,
            Body: message,
          }),
        }
      );

      const data = await response.json();

      if (data.sid) {
        console.log(`✅ WhatsApp sent to ${order.supplierPhone}`);
        return { success: true, messageId: data.sid };
      } else {
        return { success: false, error: data.message || 'Failed to send' };
      }
    } catch (error) {
      console.error('WhatsApp send error:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Send delivery notification
   */
  async sendDeliveryNotification(
    orderNumber: string,
    customerPhone: string,
    estimatedTime: string
  ): Promise<{ success: boolean; messageId?: string }> {
    const message = `🚚 *Order ${orderNumber} is on the way!*

Estimated arrival: ${estimatedTime}

Track your order: https://open-purchase.vercel.app/orders/${orderNumber}

Thanks for your business! 🛒`;

    console.log(`📱 Delivery Notification (Demo)`);
    console.log(`To: ${customerPhone}`);
    console.log(`Message: ${message}`);

    return { success: true, messageId: `demo-delivery-${Date.now()}` };
  }

  /**
   * Send low stock alert
   */
  async sendLowStockAlert(
    productName: string,
    currentStock: number,
    minStock: number,
    managerPhone: string
  ): Promise<{ success: boolean; messageId?: string }> {
    const message = `⚠️ *Low Stock Alert*

*Product:* ${productName}
*Current:* ${currentStock}
*Minimum:* ${minStock}

Please restock soon to avoid shortages.

🔗 View inventory: https://open-purchase.vercel.app/inventory`;

    console.log(`📱 Low Stock Alert (Demo)`);
    console.log(`To: ${managerPhone}`);
    console.log(`Message: ${message}`);

    return { success: true, messageId: `demo-alert-${Date.now()}` };
  }
}

export const whatsappService = new WhatsAppService();
