import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // 匹配所有路由
        source: "/:path*",
        headers: [
          // CORS headers - 允許所有來源 (開發用)
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          // CORS  headers - 允許的方法
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE",
          },
          // CORS headers - 允許的請求頭
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
          // CORS headers - 允許攜帶憑證
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          // 安全headers - 防止 MIME 類型sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // 安全headers - XSS 保護
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // 安全headers - 防止 iframe 嵌入
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // 安全headers - 參考政策
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // 安全headers - Content Security Policy
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'",
          },
          // 安全headers - HTTP Strict Transport Security
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
