/**
 * AI Vision Analysis API Route
 * 
 * 用 Qwen3.5-Plus (OpenClaw 內置) 分析圖片
 * 
 * 功能:
 * - 收據 OCR 識別
 * - 貨品圖片識別
 * - 價格識別
 * - 一般圖片描述
 * 
 * 使用示例:
 * ```typescript
 * const response = await fetch('/api/ai/vision/analyze', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     imageUrl: 'https://example.com/receipt.jpg',
 *     type: 'receipt',
 *     prompt: '提取收據信息'
 *   })
 * })
 * 
 * const result = await response.json()
 * console.log('分析結果:', result.data)
 * ```
 */

import { NextResponse } from 'next/server'

// ============================================
// 配置
// ============================================

// Qwen3.5-Plus 模型 ID (OpenClaw 內置)
const QWEN_MODEL = 'bailian/qwen3.5-plus'

// 超時設定 (秒)
const TIMEOUT_SECONDS = 120

// ============================================
// Prompt 模板
// ============================================

const PROMPTS = {
  // 收據 OCR
  receipt: `
請呢幅收據圖片中提取以下信息，用 JSON 格式返回：

{
  "storeName": "商店名稱",
  "date": "日期 (YYYY-MM-DD)",
  "totalAmount": 總金額 (數字),
  "items": [
    {
      "name": "商品名稱",
      "quantity": 數量,
      "price": 單價
    }
  ],
  "paymentMethod": "支付方式 (如果有)"
}

如果某啲信息搵唔到，就用 null。
只返回 JSON，唔使其他文字。
`,

  // 貨品識別
  product: `
請識別呢幅圖片中嘅商品，用 JSON 格式返回：

{
  "name": "商品名稱",
  "brand": "品牌 (如果有)",
  "category": "分類 (蔬菜/肉類/海鮮/乾貨/飲料/其他)",
  "confidence": 信心度 (0.0-1.0),
  "description": "商品描述"
}

只返回 JSON，唔使其他文字。
`,

  // 價格識別
  price: `
請呢幅圖片中提取所有價格信息，用 JSON 格式返回：

{
  "prices": [
    {
      "amount": 金額 (數字),
      "currency": "幣種 (HKD/USD/CNY 等)",
      "description": "價格描述"
    }
  ],
  "totalAmount": 總金額 (如果有)
}

只返回 JSON，唔使其他文字。
`,

  // 一般描述
  general: `
請詳細描述呢幅圖片，包括：
1. 圖片入面有咩
2. 顏色、形狀、大小
3. 場景/環境
4. 任何文字信息

用廣東話回答。
`
}

// ============================================
// 調用 Qwen3.5-Plus (直接 API 調用)
// ============================================

/**
 * 調用 Qwen3.5-Plus 分析圖片
 * 
 * 直接調用 DashScope API
 * 唔使依賴 OpenClaw
 */
async function callQwenVision(
  imageUrl: string,
  prompt: string
): Promise<string> {
  const API_KEY = process.env.DASHSCOPE_API_KEY
  
  if (!API_KEY) {
    throw new Error('DASHSCOPE_API_KEY 未設置')
  }

  const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'qwen3.5-plus',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: prompt }
          ]
        }
      ],
      max_tokens: 2048
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'API 請求失敗')
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// ============================================
// API Route Handler
// ============================================

export async function POST(request: Request) {
  try {
    // 1. 解析請求
    const body = await request.json()
    const { imageUrl, type = 'general', prompt, returnJson = false } = body

    // 2. 驗證參數
    if (!imageUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: '缺少 imageUrl 參數',
          example: {
            imageUrl: 'https://example.com/image.jpg',
            type: 'receipt | product | price | general',
            prompt: '自定義提示 (可選)',
            returnJson: true // 是否強制返回 JSON
          }
        },
        { status: 400 }
      )
    }

    // 3. 選擇 Prompt
    const selectedPrompt = PROMPTS[type as keyof typeof PROMPTS] || prompt || PROMPTS.general

    // 4. 如果需要 JSON 格式，添加提示
    const finalPrompt = returnJson 
      ? `${selectedPrompt}\n\n只返回 JSON，唔使其他文字。`
      : selectedPrompt

    // 5. 調用 Qwen3.5-Plus
    console.log('🤖 調用 Qwen3.5-Plus...')
    console.log('   圖片 URL:', imageUrl)
    console.log('   類型:', type)
    console.log('   Prompt:', finalPrompt.substring(0, 100) + '...')

    const result = await callQwenVision(imageUrl, finalPrompt)

    // 6. 解析結果 (如果需要 JSON)
    let parsedData: any = null
    if (returnJson || type === 'receipt' || type === 'product' || type === 'price') {
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0])
        }
      } catch (error) {
        console.error('Parse JSON error:', error)
        // 如果解析失敗，返回原始結果
      }
    }

    // 7. 返回結果
    return NextResponse.json({
      success: true,
      data: parsedData || result,
      rawContent: result,
      model: QWEN_MODEL,
      type,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Vision analysis error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '未知錯誤',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// ============================================
// GET Handler (API 文檔)
// ============================================

export async function GET() {
  return NextResponse.json({
    name: 'AI Vision Analysis API',
    version: '1.0.0',
    description: '用 Qwen3.5-Plus 分析圖片',
    endpoints: {
      POST: {
        url: '/api/ai/vision/analyze',
        description: '分析圖片',
        parameters: {
          imageUrl: { type: 'string', required: true, description: '圖片 URL' },
          type: { type: 'string', required: false, enum: ['receipt', 'product', 'price', 'general'], default: 'general' },
          prompt: { type: 'string', required: false, description: '自定義提示' },
          returnJson: { type: 'boolean', required: false, default: false, description: '是否強制返回 JSON' }
        },
        examples: {
          receipt: {
            imageUrl: 'https://example.com/receipt.jpg',
            type: 'receipt',
            returnJson: true
          },
          product: {
            imageUrl: 'https://example.com/product.jpg',
            type: 'product',
            returnJson: true
          },
          general: {
            imageUrl: 'https://example.com/image.jpg',
            type: 'general',
            prompt: '請詳細描述呢幅圖'
          }
        }
      }
    },
    responses: {
      success: {
        success: true,
        data: '分析結果 (JSON 或者文本)',
        rawContent: '原始內容',
        model: 'bailian/qwen3.5-plus',
        type: '類型',
        timestamp: '時間戳'
      },
      error: {
        success: false,
        error: '錯誤信息',
        timestamp: '時間戳'
      }
    }
  })
}
