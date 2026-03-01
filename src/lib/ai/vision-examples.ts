/**
 * AI Vision API 使用示例
 * 
 * 呢個文件展示點樣調用 /api/ai/vision/analyze API
 */

// ============================================
// 示例 1: 收據 OCR 識別
// ============================================

async function analyzeReceipt() {
  const response = await fetch('/api/ai/vision/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageUrl: 'https://example.com/receipt.jpg',
      type: 'receipt',
      returnJson: true // 強制返回 JSON
    })
  })

  const result = await response.json()
  
  if (result.success) {
    console.log('✅ 收據分析成功！')
    console.log('商店:', result.data.storeName)
    console.log('日期:', result.data.date)
    console.log('總金額:', result.data.totalAmount)
    console.log('物品:', result.data.items)
  } else {
    console.error('❌ 分析失敗:', result.error)
  }
}

// ============================================
// 示例 2: 貨品圖片識別
// ============================================

async function analyzeProduct() {
  const response = await fetch('/api/ai/vision/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageUrl: 'https://example.com/product.jpg',
      type: 'product',
      returnJson: true
    })
  })

  const result = await response.json()
  
  if (result.success) {
    console.log('✅ 貨品識別成功！')
    console.log('名稱:', result.data.name)
    console.log('品牌:', result.data.brand)
    console.log('分類:', result.data.category)
    console.log('信心度:', result.data.confidence)
  } else {
    console.error('❌ 識別失敗:', result.error)
  }
}

// ============================================
// 示例 3: 價格識別
// ============================================

async function analyzePrice() {
  const response = await fetch('/api/ai/vision/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageUrl: 'https://example.com/price-tag.jpg',
      type: 'price',
      returnJson: true
    })
  })

  const result = await response.json()
  
  if (result.success) {
    console.log('✅ 價格識別成功！')
    console.log('價格列表:', result.data.prices)
    console.log('總金額:', result.data.totalAmount)
  } else {
    console.error('❌ 識別失敗:', result.error)
  }
}

// ============================================
// 示例 4: 一般圖片描述
// ============================================

async function describeImage() {
  const response = await fetch('/api/ai/vision/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageUrl: 'https://example.com/image.jpg',
      type: 'general',
      prompt: '請詳細描述呢幅圖，用廣東話'
    })
  })

  const result = await response.json()
  
  if (result.success) {
    console.log('✅ 圖片描述成功！')
    console.log(result.data)
  } else {
    console.error('❌ 分析失敗:', result.error)
  }
}

// ============================================
// 示例 5: 批量分析
// ============================================

async function analyzeMultipleImages(imageUrls: string[]) {
  const results = await Promise.all(
    imageUrls.map(async (imageUrl) => {
      const response = await fetch('/api/ai/vision/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          type: 'product',
          returnJson: true
        })
      })
      return response.json()
    })
  )

  console.log('✅ 批量分析完成！')
  results.forEach((result, index) => {
    if (result.success) {
      console.log(`圖片 ${index + 1}:`, result.data.name)
    } else {
      console.error(`圖片 ${index + 1} 失敗:`, result.error)
    }
  })
}

// ============================================
// 示例 6: 錯誤處理
// ============================================

async function analyzeWithRetry(imageUrl: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('/api/ai/vision/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          type: 'general'
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error)
      }

      return result.data
    } catch (error) {
      console.error(`嘗試 ${i + 1}/${maxRetries} 失敗:`, error)
      
      if (i === maxRetries - 1) {
        throw error
      }
      
      // 等待 1 秒後重試
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}

// ============================================
// React Component 示例
// ============================================

/*
import React, { useState } from 'react'

export default function ImageAnalyzer() {
  const [imageUrl, setImageUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyzeImage = async () => {
    if (!imageUrl) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/vision/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          type: 'general'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="輸入圖片 URL"
      />
      <button onClick={analyzeImage} disabled={loading}>
        {loading ? '分析中...' : '分析圖片'}
      </button>

      {error && <div style={{ color: 'red' }}>錯誤：{error}</div>}
      
      {result && (
        <div>
          <h3>分析結果:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
*/

// ============================================
// 導出所有示例函數
// ============================================

export {
  analyzeReceipt,
  analyzeProduct,
  analyzePrice,
  describeImage,
  analyzeMultipleImages,
  analyzeWithRetry
}
