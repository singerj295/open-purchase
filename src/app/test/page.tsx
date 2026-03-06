"use client";

export default function TestPage() {
  return (
    <div style={{ 
      padding: '40px',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#1a1a1a'
      }}>
        測試頁面
      </h1>
      
      <div style={{ 
        padding: '20px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <p style={{ fontSize: '16px', color: '#757575' }}>
          如果見到呢個頁面，代表基礎渲染正常 ✅
        </p>
        
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '20px', marginBottom: '10px' }}>
          測試步驟：
        </h2>
        
        <ol style={{ paddingLeft: '20px', color: '#757575' }}>
          <li>✅ 頁面渲染正常</li>
          <li>下一步：測試 Supabase 連接</li>
          <li>下一步：測試訂單數據讀取</li>
        </ol>
      </div>
    </div>
  );
}
