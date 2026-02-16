"use client";

import { useState } from "react";
import { Settings, Bell, Bot, Database, Globe, Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: "My Restaurant",
    currency: "HKD",
    timezone: "Asia/Hong_Kong",
    emailNotifications: true,
    whatsappNotifications: true,
    aiEnabled: true,
    minimaxApiKey: "",
  });
  const [lang, setLang] = useState<"en" | "zh">("zh");

  const isZh = lang === "zh";

  const handleSave = () => {
    alert(isZh ? "設定已儲存！" : "Settings saved successfully!");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
          {isZh ? "系統設定" : "Settings"}
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: '4px' }}>
          {isZh ? "管理你的系統偏好設定" : "Manage your system preferences"}
        </p>
      </div>

      {/* General Settings */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid rgba(128,128,128,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Globe size={20} style={{ color: 'var(--muted)' }} />
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
            {isZh ? "一般設定" : "General Settings"}
          </h2>
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              marginBottom: '8px',
              color: 'var(--foreground)'
            }}>
              {isZh ? "公司名稱" : "Company Name"}
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="input"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '8px',
                color: 'var(--foreground)'
              }}>
                {isZh ? "貨幣" : "Currency"}
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="input"
              >
                <option value="HKD">HKD (Hong Kong Dollar)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="CNY">CNY (Chinese Yuan)</option>
                <option value="TWD">TWD (Taiwan Dollar)</option>
              </select>
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '8px',
                color: 'var(--foreground)'
              }}>
                {isZh ? "時區" : "Timezone"}
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="input"
              >
                <option value="Asia/Hong_Kong">Asia/Hong Kong</option>
                <option value="Asia/Shanghai">Asia/Shanghai</option>
                <option value="Asia/Taipei">Asia/Taipei</option>
                <option value="Asia/Singapore">Asia/Singapore</option>
                <option value="America/New_York">America/New York</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid rgba(128,128,128,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Bell size={20} style={{ color: 'var(--muted)' }} />
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
            {isZh ? "通知設定" : "Notifications"}
          </h2>
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              {isZh ? "電郵通知" : "Email Notifications"}
            </span>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
            />
          </label>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              {isZh ? "WhatsApp 通知" : "WhatsApp Notifications"}
            </span>
            <input
              type="checkbox"
              checked={settings.whatsappNotifications}
              onChange={(e) => setSettings({ ...settings, whatsappNotifications: e.target.checked })}
              style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
            />
          </label>
        </div>
      </div>

      {/* AI Settings */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid rgba(128,128,128,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Bot size={20} style={{ color: 'var(--muted)' }} />
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
            {isZh ? "AI 設定" : "AI Settings"}
          </h2>
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              {isZh ? "啟用 AI 分析" : "Enable AI Analysis"}
            </span>
            <input
              type="checkbox"
              checked={settings.aiEnabled}
              onChange={(e) => setSettings({ ...settings, aiEnabled: e.target.checked })}
              style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
            />
          </label>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              marginBottom: '8px',
              color: 'var(--foreground)'
            }}>
              {isZh ? "MiniMax API Key" : "MiniMax API Key"}
            </label>
            <input
              type="password"
              value={settings.minimaxApiKey}
              onChange={(e) => setSettings({ ...settings, minimaxApiKey: e.target.value })}
              className="input"
              placeholder="sk-..."
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={18} />
          {isZh ? "儲存設定" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
