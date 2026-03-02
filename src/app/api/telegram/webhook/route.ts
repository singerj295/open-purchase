/**
 * Telegram Bot Service
 * 
 * 自動處理 Telegram 消息
 * 支持：圖片、文字、文件
 * 
 * 使用 Summer Bot (@Summerdatabot) 作為數據輸入 Bot
 */

// 使用 Summer Bot Token (數據輸入專責)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_SUMMER_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://your-domain.com/api/telegram/webhook'

// ============================================
// Webhook 設置 (一次性)
// ============================================

async function setWebhook() {
  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        allowed_updates: ['message', 'callback_query']
      })
    }
  )

  const result = await response.json()
  console.log('Webhook 設置:', result)
  return result.ok
}

// ============================================
// 處理消息
// ============================================

async function handleMessage(update: any) {
  const message = update.message
  
  if (!message) return

  const chatId = message.chat.id
  const text = message.text
  const photos = message.photo
  const document = message.document

  console.log('收到消息:', { chatId, text, hasPhoto: !!photos, hasDocument: !!document })

  // 1. 處理圖片
  if (photos && photos.length > 0) {
    const photo = photos[photos.length - 1] // 攞最高解析度
    await handlePhoto(chatId, photo.file_id)
    return
  }

  // 2. 處理文件
  if (document) {
    await handleDocument(chatId, document.file_id)
    return
  }

  // 3. 處理文字
  if (text) {
    await handleText(chatId, text)
    return
  }
}

// ============================================
// 處理圖片
// ============================================

async function handlePhoto(chatId: number, fileId: string) {
  try {
    // 1. 獲取文件 URL
    const fileResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`
    )
    const fileData = await fileResponse.json()
    
    if (!fileData.ok) {
      await sendMessage(chatId, '❌ 無法獲取圖片')
      return
    }

    const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileData.result.file_path}`
    
    // 2. 發送確認消息
    await sendMessage(chatId, '📷 收到收據圖片，分析中...')

    // 3. 調用 AI Vision API
    const visionResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/vision/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl: fileUrl,
        type: 'receipt',
        returnJson: true
      })
    })

    const visionResult = await visionResponse.json()

    if (visionResult.success) {
      // 4. 發送分析結果
      const data = visionResult.data
      const message = `
✅ 收據分析成功！

🏪 商店：${data.storeName || '未知'}
📅 日期：${data.date || '未知'}
💰 總金額：$${data.totalAmount || '0.00'}
📦 物品：${data.items?.length || 0} 項

已自動存檔！✅
`
      await sendMessage(chatId, message)
    } else {
      await sendMessage(chatId, `❌ 分析失敗：${visionResult.error}`)
    }
  } catch (error) {
    console.error('Handle photo error:', error)
    await sendMessage(chatId, '❌ 處理失敗，請稍後再試')
  }
}

// ============================================
// 處理文件
// ============================================

async function handleDocument(chatId: number, fileId: string) {
  await sendMessage(chatId, '📄 收到文件，目前只支持圖片分析')
}

// ============================================
// 處理文字
// ============================================

async function handleText(chatId: number, text: string) {
  // 命令處理
  if (text.startsWith('/start')) {
    await sendMessage(chatId, `
👋 歡迎使用 Open Purchase Bot！

功能:
📷 發送收據圖片 - 自動分析
📊 /status - 查看狀態
📦 /inventory - 查看庫存
📋 /orders - 查看訂單

發送收據圖片開始！
`)
    return
  }

  if (text.startsWith('/status')) {
    await sendMessage(chatId, '✅ Bot 運行正常')
    return
  }

  // 默認回覆
  await sendMessage(chatId, '請發送收據圖片進行分析 📷')
}

// ============================================
// 發送消息
// ============================================

async function sendMessage(chatId: number, text: string) {
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown'
        })
      }
    )
  } catch (error) {
    console.error('Send message error:', error)
  }
}

// ============================================
// API Route Handler
// ============================================

export async function POST(request: Request) {
  try {
    const update = await request.json()
    await handleMessage(update)
    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return new Response('Error', { status: 500 })
  }
}

// ============================================
// 設置命令 (一次性運行)
// ============================================

async function setupBotCommands() {
  const commands = [
    { command: 'start', description: '開始使用' },
    { command: 'status', description: '查看狀態' },
    { command: 'inventory', description: '查看庫存' },
    { command: 'orders', description: '查看訂單' }
  ]

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setMyCommands`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commands })
    }
  )

  const result = await response.json()
  console.log('Bot 命令設置:', result)
  return result.ok
}

// ============================================
// 導出
// ============================================

export { handlePhoto, handleDocument, handleText, sendMessage, setWebhook, setupBotCommands }
