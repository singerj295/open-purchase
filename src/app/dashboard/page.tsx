"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "20px" }}>
        Dashboard
      </h1>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "20px",
        marginBottom: "30px"
      }}>
        <div style={{ 
          padding: "20px", 
          borderRadius: "12px", 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white"
        }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9 }}>供應商</h3>
          <p style={{ margin: 0, fontSize: "32px", fontWeight: "700" }}>0</p>
        </div>
        
        <div style={{ 
          padding: "20px", 
          borderRadius: "12px", 
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "white"
        }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9 }}>訂單</h3>
          <p style={{ margin: 0, fontSize: "32px", fontWeight: "700" }}>0</p>
        </div>
        
        <div style={{ 
          padding: "20px", 
          borderRadius: "12px", 
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          color: "white"
        }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9 }}>庫存</h3>
          <p style={{ margin: 0, fontSize: "32px", fontWeight: "700" }}>0</p>
        </div>
        
        <div style={{ 
          padding: "20px", 
          borderRadius: "12px", 
          background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
          color: "white"
        }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9 }}>支出</h3>
          <p style={{ margin: 0, fontSize: "32px", fontWeight: "700" }}>$0</p>
        </div>
      </div>

      <div style={{ 
        padding: "20px", 
        borderRadius: "12px", 
        background: "#f8f9fa",
        border: "1px solid #e9ecef"
      }}>
        <h2 style={{ margin: "0 0 15px 0", fontSize: "18px" }}>歡迎使用 Open Purchase</h2>
        <p style={{ margin: 0, color: "#6c757d", lineHeight: 1.6 }}>
          系統已經準備好！你可以開始使用以下功能：
        </p>
        <ul style={{ marginTop: "15px", color: "#6c757d", lineHeight: 1.8 }}>
          <li>供應商管理</li>
          <li>訂單管理</li>
          <li>庫存追蹤</li>
          <li>報表分析</li>
        </ul>
      </div>
    </div>
  );
}
