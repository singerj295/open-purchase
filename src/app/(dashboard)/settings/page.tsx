"use client";

import { useState, useEffect } from "react";
import { Settings, Bell, Bot, Database, Globe, Save, User, Building } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    restaurantName: "",
    restaurantAddress: "",
    currency: "HKD",
    timezone: "Asia/Hong_Kong",
    emailNotifications: true,
    whatsappNotifications: true,
    aiEnabled: true,
    minimaxApiKey: "",
  });
  const [lang, setLang] = useState<"en" | "zh">("zh");
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load user data
    const savedUser = localStorage.getItem('open-purchase-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setSettings(prev => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          restaurantName: user.restaurantName || "",
          restaurantAddress: user.restaurantAddress || "",
        }));
      } catch (e) {}
    }
    
    const savedLang = localStorage.getItem('open-purchase-lang');
    if (savedLang === "en" || savedLang === "zh") {
      setLang(savedLang);
    }
  }, []);

  const isZh = lang === "zh";

  const handleSave = () => {
    // Save user data
    const userData = {
      id: "1",
      name: settings.name,
      email: settings.email,
      restaurantName: settings.restaurantName,
      restaurantAddress: settings.restaurantAddress,
    };
    localStorage.setItem('open-purchase-user', JSON.stringify(userData));
    
    // Save other settings
    localStorage.setItem('open-purchase-lang', lang);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!mounted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
        <div><h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>Settings</h1></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
          {isZh ? "系統設定" : "Settings"}
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: '4px' }}>
          {isZh ? "管理你的個人和餐廳資料" : "Manage your personal and restaurant information"}
        </p>
      </div>

      {/* Save Notification */}
      {saved && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#059669',
          borderRadius: '8px',
          fontSize: '14px',
        }}>
          {isZh ? "✓ 設定已儲存！" : "✓ Settings saved!"}
        </div>
      )}

      {/* Profile Settings */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid rgba(128,128,128,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <User size={20} style={{ color: 'var(--muted)' }} />
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
            {isZh ? "個人資料" : "Personal Profile"}
          </h2>
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '8px',
                color: 'var(--foreground)'
              }}>
                {isZh ? "你的名稱" : "Your Name"}
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="input"
                placeholder={isZh ? "輸入你的名稱" : "Enter your name"}
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '8px',
                color: 'var(--foreground)'
              }}>
                {isZh ? "電郵" : "Email"}
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="input"
                placeholder={isZh ? "輸入電郵" : "Enter email"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Settings */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid rgba(128,128,128,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Building size={20} style={{ color: 'var(--muted)' }} />
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
            {isZh ? "餐廳資料" : "Restaurant Information"}
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
              {isZh ? "餐廳名稱" : "Restaurant Name"}
            </label>
            <input
              type="text"
              value={settings.restaurantName}
              onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
              className="input"
              placeholder={isZh ? "輸入餐廳名稱" : "Enter restaurant name"}
            />
          </div>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              marginBottom: '8px',
              color: 'var(--foreground)'
            }}>
              {isZh ? "餐廳地址" : "Restaurant Address"}
            </label>
            <input
              type="text"
              value={settings.restaurantAddress}
              onChange={(e) => setSettings({ ...settings, restaurantAddress: e.target.value })}
              className="input"
              placeholder={isZh ? "輸入餐廳地址" : "Enter restaurant address"}
            />
          </div>
        </div>
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
                {isZh ? "語言" : "Language"}
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as "en" | "zh")}
                className="input"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
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
