import { NextResponse } from 'next/server'

/**
 * Summer Bot - Telegram Webhook
 * 
 * 專責數據輸入：
 * - 📷 收據圖片 OCR 識別
 * - 📦 貨品圖片識別
 * - 💰 價格識別
 * - 📝 自動存入數據庫
 */

// Telegram Bot Token
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

// ============================================
// GET Handler (Telegram Webhook 測試用)
// ============================================

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Summer Bot Webhook 正常運作',
    bot: 'Summerdatabot',
    username: '@Summerdatabot',
    features: [
      '📷 收據圖片 OCR 識別',
      '📦 貨品圖片識別',
      '💰 價格識別',
      '📝 自動存入數據庫'
    ]
  })
}

// ============================================
// POST Handler (處理 Telegram 消息)
// ============================================

export async function POST(request: Request) {
  try {
    const update = await request.json()
    const message = update.message
    
    if (!message) {
      return NextResponse.json({ ok: true })
    }

    const chatId = message.chat.id
    const text = message.text
    const photos = message.photo

    console.log('📱 收到消息:', { chatId, hasText: !!text, hasPhotos: !!photos })

    // 1. 處理圖片 (收據/貨品)
    if (photos && photos.length > 0) {
      await handlePhoto(chatId, photos[photos.length - 1].file_id)
      return NextResponse.json({ ok: true })
    }

    // 2. 處理文字命令
    if (text) {
      await handleText(chatId, text)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ Webhook Error:', error)
    return NextResponse.json({ ok: true }) // Telegram 需要 200 OK
  }
}

// ============================================
// 處理圖片
// ============================================

async function handlePhoto(chatId: number, fileId: string) {
  try {
    // 1. 發送確認消息
    await sendMessage(chatId, '📷 收到圖片，分析中...')

    // 2. 獲取文件 URL
    const fileUrl = await getFileUrl(fileId)
    
    // 3. 調用 AI Vision API 分析
    const analysis = await analyzeImage(fileUrl)
    
    // 4. 發送分析結果
    if (analysis.success) {
      await sendMessage(chatId, formatAnalysisResult(analysis.data))
    } else {
      await sendMessage(chatId, `❌ 分析失敗：${analysis.error}`)
    }
  } catch (error) {
    console.error('❌ Handle photo error:', error)
    await sendMessage(chatId, '❌ 處理失敗，請稍後再試')
  }
}

// ============================================
// 處理文字命令
// ============================================

async function handleText(chatId: number, text: string) {
  const command = text.toLowerCase()

  if (command === '/start') {
    await sendMessage(chatId, `
👋 歡迎使用 Summer Bot！

功能:
📷 發送收據圖片 - 自動 OCR 識別
📦 發送貨品圖片 - 自動識別
📊 /status - 查看狀態
❓ /help - 幫助

發送圖片開始！
`)
    return
  }

  if (command === '/status') {
    await sendMessage(chatId, '✅ Summer Bot 運行正常')
    return
  }

  if (command === '/help') {
    await sendMessage(chatId, `
📖 Summer Bot 使用說明

1️⃣ 發送收據圖片
   - 自動 OCR 識別
   - 提取商店、日期、金額
   - 自動存入數據庫

2️⃣ 發送貨品圖片
   - 自動識別貨品
   - 提取名稱、分類
   - 自動更新庫存

3️⃣ 命令
   - /start - 開始使用
   - /status - 查看狀態
   - /help - 幫助

有任何問題請聯絡管理員！
`)
    return
  }

  // 默認回覆
  await sendMessage(chatId, '請發送圖片進行分析 📷\n\n或輸入 /help 查看說明')
}

// ============================================
// 輔助函數
// ============================================

/**
 * 獲取 Telegram 文件 URL
 */
async function getFileUrl(fileId: string): Promise<string> {
  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`
  )
  const data = await response.json()
  
  if (!data.ok) {
    throw new Error('無法獲取文件')
  }

  return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${data.result.file_path}`
}

/**
 * 調用 AI Vision API 分析圖片
 */
async function analyzeImage(imageUrl: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/vision/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl,
        type: 'receipt',
        returnJson: true
      })
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('❌ Analyze image error:', error)
    return { success: false, error: error instanceof Error ? error.message : '未知錯誤' }
  }
}

/**
 * 格式化分析結果
 */
function formatAnalysisResult(data: any): string {
  if (!data) return '❌ 無數據'

  return `
✅ 分析成功！

🏪 商店：${data.storeName || '未知'}
📅 日期：${data.date || '未知'}
💰 總金額：$${data.totalAmount || '0.00'}
📦 物品：${data.items?.length || 0} 項

已自動存檔！✅
`.trim()
}

/**
 * 發送 Telegram 消息
 */
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
    console.error('❌ Send message error:', error)
  }
}
