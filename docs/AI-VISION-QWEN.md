# INT-002 (更新): AI 視覺識別 - Qwen3.5-Plus

## 架構設計 (更新)

### 原架構 (MiniMax)
```
用戶請求 → MiniMax MCP (understand_image) → MiniMax Vision API → 返回結果
```

### 新架構 (Qwen3.5-Plus)
```
用戶請求 → Qwen3.5-Plus API (自帶視覺) → 返回結果
```

### 架構變更要點

| 組件 | 原方案 (MiniMax) | 新方案 (Qwen3.5-Plus) |
|------|-----------------|----------------------|
| **模型** | MiniMax-M2.1 + Vision API | Qwen3.5-Plus (內建視覺) |
| **API Endpoint** | `https://api.minimax.chat/v1/text/chatcompletion_v2` | `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions` |
| **視覺能力** | 需要額外 Vision API | 自帶 (多模態) |
| **上下文** | 標準 | 1M tokens |
| **中文支援** | 良好 | 優秀 (原生) |
| **成本** | 中等 | 性價比高 |

### 整合流程

1. **檢測用戶請求**：識別視覺識別需求 (分析圖片、描述內容、OCR 等)
2. **準備圖片**：支援本地路徑或 URL
3. **調用 Qwen3.5-Plus**：使用多模態 API
4. **返回結果**：結構化輸出分析結果

---

## 代碼示例 (更新)

### Python 實現 (推薦)

```python
# qwen_vision_analyzer.py
import os
import base64
import requests
from typing import Optional, Dict, Any

class QwenVisionAnalyzer:
    """Qwen3.5-Plus 視覺識別分析器"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("DASHSCOPE_API_KEY")
        self.api_url = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
        self.model = "qwen3.5-plus"
        
        if not self.api_key:
            raise ValueError("DASHSCOPE_API_KEY not found")
    
    def analyze_image(self, image_path: str, prompt: str = "詳細描述呢幅圖") -> Dict[str, Any]:
        """
        分析本地圖片
        
        Args:
            image_path: 圖片本地路徑
            prompt: 分析提示 (預設：詳細描述)
        
        Returns:
            分析結果字典
        """
        # 編碼圖片為 Base64
        with open(image_path, "rb") as f:
            image_data = base64.b64encode(f.read()).decode("utf-8")
        
        # 檢測 MIME 類型
        mime_type = self._detect_mime_type(image_path)
        image_url = f"data:{mime_type};base64,{image_data}"
        
        return self._call_api(image_url, prompt)
    
    def analyze_image_url(self, image_url: str, prompt: str = "詳細描述呢幅圖") -> Dict[str, Any]:
        """
        分析網絡圖片 URL
        
        Args:
            image_url: 圖片 URL
            prompt: 分析提示
        
        Returns:
            分析結果字典
        """
        return self._call_api(image_url, prompt)
    
    def _detect_mime_type(self, path: str) -> str:
        """檢測圖片 MIME 類型"""
        ext = os.path.splitext(path)[1].lower()
        mime_map = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
        }
        return mime_map.get(ext, 'image/jpeg')
    
    def _call_api(self, image_url: str, prompt: str) -> Dict[str, Any]:
        """調用 Qwen3.5-Plus API"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "image_url", "image_url": {"url": image_url}},
                        {"type": "text", "text": prompt}
                    ]
                }
            ],
            "max_tokens": 2048,
            "temperature": 0.7
        }
        
        response = requests.post(self.api_url, headers=headers, json=payload)
        response.raise_for_status()
        
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        
        return {
            "success": True,
            "content": content,
            "model": self.model,
            "usage": data.get("usage", {})
        }


# 使用示例
if __name__ == "__main__":
    analyzer = QwenVisionAnalyzer()
    
    # 分析本地圖片
    result = analyzer.analyze_image(
        image_path="/path/to/image.jpg",
        prompt="呢幅圖入面有咩？幫我詳細描述"
    )
    print(result["content"])
    
    # 分析網絡圖片
    result = analyzer.analyze_image_url(
        image_url="https://example.com/image.jpg",
        prompt="提取圖中所有文字"
    )
    print(result["content"])
```

### TypeScript 實現 (Open Purchase 整合)

```typescript
// src/lib/ai/qwen-vision.ts
import axios from 'axios';

interface QwenVisionConfig {
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

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

export class QwenVisionService {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(config: QwenVisionConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'qwen3.5-plus';
    this.baseUrl = config.baseUrl || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
  }

  /**
   * 分析圖片 (支援本地路徑或 URL)
   */
  async analyzeImage(
    imageUrl: string,
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
                { type: 'image_url', image_url: { url: imageUrl } },
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
      throw new Error(`視覺識別失敗：${error instanceof Error ? error.message : '未知錯誤'}`);
    }
  }

  /**
   * OCR 文字提取
   */
  async extractText(imageUrl: string): Promise<string> {
    const result = await this.analyzeImage(
      imageUrl,
      '請提取圖中所有可見文字，保持原有格式'
    );
    return result.content;
  }

  /**
   * 圖片內容分類
   */
  async classifyImage(imageUrl: string): Promise<{ category: string; confidence: number }> {
    const result = await this.analyzeImage(
      imageUrl,
      '請將呢幅圖分類到以下類別之一：產品圖、文件、場景、人像、圖表、其他。返回 JSON: {"category": "...", "confidence": 0.0-1.0}'
    );
    
    try {
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Fallback
    }
    
    return { category: '其他', confidence: 0.5 };
  }
}

// 使用示例
export const qwenVision = new QwenVisionService({
  apiKey: process.env.DASHSCOPE_API_KEY || ''
});
```

### API Route 整合 (Open Purchase)

```typescript
// src/app/api/ai/vision/route.ts
import { NextResponse } from 'next/server';
import { qwenVision } from '@/lib/ai/qwen-vision';
import { createRateLimitedHandler } from "@/lib/rate-limit";

async function handlePOST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, prompt = '詳細描述呢幅圖' } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: '缺少 imageUrl 參數' },
        { status: 400 }
      );
    }

    const result = await qwenVision.analyzeImage(imageUrl, prompt);

    return NextResponse.json({
      success: true,
      data: result.content,
      model: result.model,
      usage: result.usage,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Vision error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '視覺識別失敗' 
      },
      { status: 500 }
    );
  }
}

export const POST = createRateLimitedHandler(handlePOST, { sensitiveEndpoint: true });
```

---

## 與 MiniMax 比較

### 點解揀 Qwen3.5-Plus？

| 比較維度 | MiniMax-M2.1 | Qwen3.5-Plus | 優勢 |
|---------|-------------|--------------|------|
| **視覺識別** | 需要額外 Vision API | ✅ 自帶多模態 | 更簡單，少依賴 |
| **中文能力** | 良好 | ✅ 優秀 (阿里生態) | 更自然，更準確 |
| **上下文長度** | 標準 (~32K) | ✅ 1M tokens | 可處理超長文檔 |
| **性價比** | 中等 | ✅ 高 | 成本更低 |
| **API 複雜度** | 需要 MCP + Vision | ✅ 單一 API | 代碼更簡潔 |
| **響應速度** | 快 | 快 | 持平 |
| **準確度** | 良好 | ✅ 優秀 (2026 SOTA) | 更新模型 |

### 遷移成本

**低** - 只需：
1. 申請 DashScope API Key (阿里雲)
2. 替換 API Endpoint 同 Model 名稱
3. 調整請求格式 (多模態消息結構)

### 推薦使用場景

✅ **適合 Qwen3.5-Plus**：
- 中文環境視覺識別
- 需要大上下文 (文檔分析 + 圖片)
- 成本敏感項目
- OCR 文字提取
- 複雜場景理解

⚠️ **保留 MiniMax**：
- 已有 MiniMax 生態整合
- 需要特定 MiniMax 功能

### 下一步行動

1. [ ] 申請 DashScope API Key (阿里雲)
2. [ ] 測試 Qwen3.5-Plus 視覺 API
3. [ ] 更新 Open Purchase `src/lib/ai/service.ts`
4. [ ] 添加 `src/lib/ai/qwen-vision.ts`
5. [ ] 創建 API Route `/api/ai/vision`
6. [ ] 更新文檔同環境變數配置

---

**文件更新**: INT-002 - AI 視覺識別架構
**日期**: 2026-03-01
**負責人**: AIEnabler (Nicole)
