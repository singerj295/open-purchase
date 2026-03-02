/**
 * Telegram Bot Service
 * 
 * 整合 Telegram Bot 同 Open Purchase
 * 功能：
 * - 訂單通知
 * - 庫存警報
 * - 供應商消息
 * - WhatsApp 雙向同步
 */

import { supabaseAdmin } from '@/lib/supabase/client';

// ============================================
// Telegram Bot 配置
// ============================================

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

// ============================================
// Telegram API 包裝
// ============================================

class TelegramBotService {
  private botToken: string;
  private baseUrl: string;

  constructor(botToken: string) {
    this.botToken = botToken;
    this.baseUrl = `https://api.telegram.org/bot${botToken}`;
  }

  /**
   * 發送消息
   */
  async sendMessage(
    chatId: string,
    text: string,
    parseMode: 'Markdown' | 'HTML' | 'MarkdownV2' = 'Markdown'
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: parseMode
        })
      });

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Telegram sendMessage error:', error);
      return false;
    }
  }

  /**
   * 廣播消息 (多個聊天)
   */
  async broadcast(
    chatIds: string[],
    text: string,
    parseMode: 'Markdown' | 'HTML' | 'MarkdownV2' = 'Markdown'
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const chatId of chatIds) {
      const result = await this.sendMessage(chatId, text, parseMode);
      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  }

  /**
   * 發送訂單通知
   */
  async sendOrderNotification(order: any): Promise<boolean> {
    const text = `
📦 *新訂單通知*

訂單編號：\`${order.orderNumber}\`
客戶：${order.customer || 'N/A'}
金額：$${order.totalAmount?.toFixed(2) || '0.00'}
狀態：${order.status || 'PENDING'}
時間：${new Date(order.createdAt).toLocaleString('zh-HK')}

物品清單：
${order.items?.map((item: any) => `• ${item.name || 'Item'} x${item.quantity || 1}`).join('\n') || '無物品'}
`;

    return this.sendMessage(TELEGRAM_CHAT_ID, text);
  }

  /**
   * 發送庫存警報
   */
  async sendInventoryAlert(item: any): Promise<boolean> {
    const text = `
⚠️ *庫存警報*

物品：${item.product?.name || 'Unknown'}
當前庫存：${item.quantity}
安全水平：${item.minStock}
建議行動：立即補貨
`;

    return this.sendMessage(TELEGRAM_CHAT_ID, text);
  }

  /**
   * 發送供應商消息
   */
  async sendSupplierMessage(supplier: any, message: string): Promise<boolean> {
    const text = `
🏢 *供應商消息*

供應商：${supplier.name}
聯絡人：${supplier.contact || 'N/A'}

${message}
`;

    return this.sendMessage(TELEGRAM_CHAT_ID, text);
  }

  /**
   * 每日摘要
   */
  async sendDailySummary(summary: {
    orders: number;
    revenue: number;
    lowStock: number;
  }): Promise<boolean> {
    const text = `
📊 *每日摘要*

日期：${new Date().toLocaleDateString('zh-HK')}

訂單：${summary.orders} 單
營收：$${summary.revenue.toFixed(2)}
低庫存：${summary.lowStock} 項

祝工作順利！ 🚀
`;

    return this.sendMessage(TELEGRAM_CHAT_ID, text);
  }
}

// ============================================
// 全局實例
// ============================================

export const telegramBot = TELEGRAM_BOT_TOKEN
  ? new TelegramBotService(TELEGRAM_BOT_TOKEN)
  : null;

// ============================================
// 自動化通知
// ============================================

/**
 * 訂單創建時自動通知
 */
export async function notifyNewOrder(orderId: string) {
  if (!telegramBot) {
    console.warn('Telegram Bot 未配置');
    return;
  }

  try {
    const { data: order } = await supabaseAdmin
      .from('Order')
      .select(`
        *,
        OrderItem (
          quantity,
          unitPrice,
          Product (
            name
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (order) {
      // 格式化訂單物品
      const items = order.OrderItem?.map((item: any) => ({
        name: item.Product?.name || 'Item',
        quantity: item.quantity
      }));

      await telegramBot.sendOrderNotification({
        ...order,
        items
      });
    }
  } catch (error) {
    console.error('notifyNewOrder error:', error);
  }
}

/**
 * 庫存低於閾值時自動警報
 */
export async function checkLowInventory() {
  if (!telegramBot) {
    console.warn('Telegram Bot 未配置');
    return;
  }

  try {
    const { data: items } = await supabaseAdmin
      .from('Inventory')
      .select(`
        *,
        Product (
          name
        )
      `)
      .lte('quantity', 'minStock');

    if (items && items.length > 0) {
      for (const item of items) {
        await telegramBot.sendInventoryAlert(item);
      }
    }
  } catch (error) {
    console.error('checkLowInventory error:', error);
  }
}

/**
 * 發送每日摘要 (定時任務)
 */
export async function sendDailySummary() {
  if (!telegramBot) {
    return;
  }

  try {
    // 獲取今日訂單數
    const { count: ordersCount } = await supabaseAdmin
      .from('Order')
      .select('*', { count: 'exact', head: true })
      .gte('createdAt', new Date().toISOString().split('T')[0]);

    // 獲取今日營收
    const { data: orders } = await supabaseAdmin
      .from('Order')
      .select('totalAmount')
      .gte('createdAt', new Date().toISOString().split('T')[0]);

    const revenue = orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;

    // 獲取低庫存項目數
    const { count: lowStockCount } = await supabaseAdmin
      .from('Inventory')
      .select('*', { count: 'exact', head: true })
      .lte('quantity', 'minStock');

    await telegramBot.sendDailySummary({
      orders: ordersCount || 0,
      revenue,
      lowStock: lowStockCount || 0
    });
  } catch (error) {
    console.error('sendDailySummary error:', error);
  }
}

// ============================================
// Webhook Handler (可選)
// ============================================

/**
 * 處理 Telegram Webhook
 * 
 * 喺 API Route 使用：/api/telegram/webhook
 */
export async function handleTelegramWebhook(update: any) {
  console.log('Telegram Webhook:', update);

  // 處理消息
  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    // 簡單命令處理
    if (text === '/start') {
      await telegramBot?.sendMessage(
        chatId,
        '👋 歡迎使用 Open Purchase Bot!\n\n命令:\n/status - 查看狀態\n/orders - 查看訂單\n/inventory - 查看庫存'
      );
    } else if (text === '/status') {
      await telegramBot?.sendMessage(
        chatId,
        '✅ Bot 運行正常'
      );
    }
    // 可以添加更多命令...
  }

  return { ok: true };
}

// ============================================
// 使用示例 (喺 API Route 入面)
// ============================================

/*
// 訂單創建 API
export async function POST(request: Request) {
  const body = await request.json();
  
  // 創建訂單
  const { data: order } = await supabaseAdmin
    .from('Order')
    .insert(body)
    .select()
    .single();

  // 發送 Telegram 通知
  if (order) {
    await notifyNewOrder(order.id);
  }

  return Response.json({ data: order });
}

// Telegram Webhook API
export async function POST(request: Request) {
  const update = await request.json();
  const result = await handleTelegramWebhook(update);
  return Response.json(result);
}
*/
