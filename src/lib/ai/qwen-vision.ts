/**
 * Qwen3.5-Plus Vision Service
 * 
 * AI 視覺識別服務
 * 功能：
 * - 收據 OCR 識別
 * - 貨品圖片識別
 * - 價格識別
 * - 自動入庫
 */

import axios from 'axios';

// ============================================
// 配置
// ============================================

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || '';
const QWEN_MODEL = 'qwen3.5-plus';
const QWEN_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

// ============================================
// Qwen Vision Analyzer
// ============================================

interface VisionAnalysisResult {
  success: boolean;
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ReceiptData {
  storeName?: string;
  date?: string;
  totalAmount?: number;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface ProductData {
  name?: string;
  brand?: string;
  category?: string;
  confidence?: number;
}

class QwenVisionService {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.model = QWEN_MODEL;
    this.baseUrl = QWEN_BASE_URL;
  }

  /**
   * 分析圖片 (Base64)
   */
  async analyzeImageBase64(
    base64Image: string,
    prompt: string = '詳細描述呢幅圖'
  ): Promise<VisionAnalysisResult> {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'image_url', image_url: { url: base64Image } },
                { type: 'text', text: prompt }
              ]
            }
          ],
          max_tokens: 2048,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data;
      return {
        success: true,
        content: data.choices[0].message.content,
        model: this.model,
        usage: data.usage
      };
    } catch (error) {
      console.error('Qwen Vision API Error:', error);
      return {
        success: false,
        content: '',
        model: this.model
      };
    }
  }

  /**
   * 分析圖片 (URL)
   */
  async analyzeImageUrl(
    imageUrl: string,
    prompt: string = '詳細描述呢幅圖'
  ): Promise<VisionAnalysisResult> {
    return this.analyzeImageBase64(imageUrl, prompt);
  }

  /**
   * 收據 OCR 識別
   */
  async analyzeReceipt(imageUrl: string): Promise<ReceiptData | null> {
    const prompt = `
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
  ]
}

如果某啲信息搵唔到，就用 null。
`;

    const result = await this.analyzeImageUrl(imageUrl, prompt);

    if (!result.success) {
      return null;
    }

    try {
      // 提取 JSON
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Parse receipt JSON error:', error);
    }

    return null;
  }

  /**
   * 貨品圖片識別
   */
  async analyzeProduct(imageUrl: string): Promise<ProductData | null> {
    const prompt = `
請識別呢幅圖片中嘅商品，用 JSON 格式返回：

{
  "name": "商品名稱",
  "brand": "品牌 (如果有)",
  "category": "分類 (蔬菜/肉類/海鮮/乾貨/飲料/其他)",
  "confidence": 信心度 (0.0-1.0)
}
`;

    const result = await this.analyzeImageUrl(imageUrl, prompt);

    if (!result.success) {
      return null;
    }

    try {
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Parse product JSON error:', error);
    }

    return null;
  }

  /**
   * 價格識別
   */
  async extractPrice(imageUrl: string): Promise<number | null> {
    const prompt = `
請呢幅圖片中提取價格信息。

只返回數字 (例如：123.45)，唔使其他文字。
如果搵唔到價格，就返回 null。
`;

    const result = await this.analyzeImageUrl(imageUrl, prompt);

    if (!result.success) {
      return null;
    }

    try {
      const priceMatch = result.content.match(/(\d+\.?\d*)/);
      if (priceMatch) {
        return parseFloat(priceMatch[1]);
      }
    } catch (error) {
      console.error('Parse price error:', error);
    }

    return null;
  }

  /**
   * 自動入庫 (收據 → 數據庫)
   */
  async autoImportFromReceipt(
    imageUrl: string,
    supplierId: string
  ): Promise<{ success: boolean; message: string }> {
    // 1. 分析收據
    const receiptData = await this.analyzeReceipt(imageUrl);

    if (!receiptData) {
      return { success: false, message: '無法識別收據' };
    }

    // 2. 創建訂單
    const totalAmount = receiptData.totalAmount || 0;
    const items = receiptData.items || [];

    // 注意：呢度需要實際調用 Supabase API
    // 示例代碼：
    /*
    const { data: order, error } = await supabaseAdmin
      .from('Order')
      .insert({
        orderNumber: `ORD-${Date.now()}`,
        supplierId,
        status: 'CONFIRMED',
        totalAmount,
        notes: '自動從收據導入'
      })
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    // 3. 創建訂單項目
    for (const item of items) {
      // 查找或創建產品
      let product = await findOrCreateProduct(item.name, supplierId);
      
      await supabaseAdmin
        .from('OrderItem')
        .insert({
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.quantity * item.price
        });
    }
    */

    return {
      success: true,
      message: `成功識別 ${items.length} 項商品，總金額 $${totalAmount}`
    };
  }
}

// ============================================
// 全局實例
// ============================================

export const qwenVision = DASHSCOPE_API_KEY
  ? new QwenVisionService(DASHSCOPE_API_KEY)
  : null;

// ============================================
// API Route Handler
// ============================================

/**
 * 處理視覺識別請求
 * 
 * 喺 API Route 使用：/api/ai/vision/analyze
 */
export async function handleVisionAnalysis(request: Request) {
  if (!qwenVision) {
    return Response.json(
      { success: false, error: 'AI Vision Service 未配置' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { imageUrl, type = 'general', prompt } = body;

    if (!imageUrl) {
      return Response.json(
        { success: false, error: '缺少 imageUrl 參數' },
        { status: 400 }
      );
    }

    let result;
    switch (type) {
      case 'receipt':
        result = await qwenVision.analyzeReceipt(imageUrl);
        break;
      case 'product':
        result = await qwenVision.analyzeProduct(imageUrl);
        break;
      case 'price':
        result = await qwenVision.extractPrice(imageUrl);
        break;
      default:
        result = await qwenVision.analyzeImageUrl(imageUrl, prompt);
    }

    return Response.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Vision analysis error:', error);
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : '未知錯誤' },
      { status: 500 }
    );
  }
}

// ============================================
// 使用示例
// ============================================

/*
// 示例 1: 分析收據
import { qwenVision } from '@/lib/ai/qwen-vision';

const receipt = await qwenVision?.analyzeReceipt('https://example.com/receipt.jpg');
console.log('收據數據:', receipt);

// 示例 2: 識別貨品
const product = await qwenVision?.analyzeProduct('https://example.com/product.jpg');
console.log('貨品數據:', product);

// 示例 3: API Route
// /api/ai/vision/analyze
export async function POST(request: Request) {
  return handleVisionAnalysis(request);
}

// 示例 4: 自動入庫
const result = await qwenVision?.autoImportFromReceipt(
  'https://example.com/receipt.jpg',
  'supplier-id'
);
console.log('入庫結果:', result);
*/

// ============================================
// 環境變量配置
// ============================================

/*
喺 .env 添加:

# Qwen3.5-Plus (阿里雲 DashScope)
DASHSCOPE_API_KEY="your-api-key-here"

申請 API Key:
1. 去 https://dashscope.console.aliyun.com/
2. 註冊/登入阿里雲帳號
3. 創建 API Key
4. 複製到 .env
*/

export { QwenVisionService };
export type { VisionAnalysisResult, ReceiptData, ProductData };
