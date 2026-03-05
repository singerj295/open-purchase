"use client";

import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#1a1a1a' }}>系統設定</h1>
        <p style={{ margin: 0, color: '#757575', fontSize: '14px' }}>管理系統設定同偏好設定</p>
      </div>
      <div style={{ padding: '40px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <Settings size={32} color="#757575" />
          <p style={{ color: '#757575', fontSize: '16px' }}>設定功能開發中...</p>
        </div>
      </div>
    </div>
  );
}
