"use client";

import { useState } from "react";
import { Settings, Bell, Bot, Database, Globe, Save } from "lucide-react";
import { useTheme } from "@/lib/i18n/ThemeContext";

export default function SettingsPage() {
  const { lang, t } = useTheme();
  const [settings, setSettings] = useState({
    companyName: "My Restaurant",
    currency: "HKD",
    timezone: "Asia/Hong_Kong",
    emailNotifications: true,
    whatsappNotifications: true,
    aiEnabled: true,
    minimaxApiKey: "",
  });

  const handleSave = () => {
    alert(lang === 'zh' ? "設定已儲存！" : "Settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t.settings.title}</h1>
        <p className="text-gray-500">{t.settings.subtitle}</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b flex items-center gap-3">
          <Globe className="text-gray-400" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">{t.settings.general}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.settings.companyName}
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.settings.currency}
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
              >
                <option value="HKD">HKD (Hong Kong Dollar)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="CNY">CNY (Chinese Yuan)</option>
                <option value="TWD">TWD (Taiwan Dollar)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.settings.timezone}
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
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

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b flex items-center gap-3">
          <Bell className="text-gray-400" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">{t.settings.notifications}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{t.settings.emailNotifications}</h3>
              <p className="text-sm text-gray-500">
                {lang === 'zh' ? '通過電郵接收訂單更新' : 'Receive order updates via email'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{t.settings.whatsappNotifications}</h3>
              <p className="text-sm text-gray-500">
                {lang === 'zh' ? '通過 WhatsApp 接收訂單更新' : 'Receive order updates via WhatsApp'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.whatsappNotifications}
                onChange={(e) => setSettings({ ...settings, whatsappNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* AI Settings */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b flex items-center gap-3">
          <Bot className="text-gray-400" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">{t.settings.aiSettings}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{t.settings.enableAI}</h3>
              <p className="text-sm text-gray-500">
                {lang === 'zh' ? '使用 AI 進行成本分析和推薦' : 'Use AI for cost analysis and recommendations'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.aiEnabled}
                onChange={(e) => setSettings({ ...settings, aiEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.settings.minimaxApiKey}
            </label>
            <input
              type="password"
              placeholder="sk-..."
              value={settings.minimaxApiKey}
              onChange={(e) => setSettings({ ...settings, minimaxApiKey: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">
              {lang === 'zh' ? '從 console.minimax.chat 獲取 API 金鑰' : 'Get your API key from console.minimax.chat'}
            </p>
          </div>
        </div>
      </div>

      {/* Database Status */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b flex items-center gap-3">
          <Database className="text-gray-400" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">{t.settings.database}</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <h3 className="font-medium text-yellow-700">{t.settings.demoMode}</h3>
                  <p className="text-sm text-yellow-600">
                    {lang === 'zh' ? '使用模擬數據。連接真實數據庫以用於生產環境。' : 'Using mock data. Connect a real database for production.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <a href="https://github.com/singerj295/open-purchase/blob/main/DATABASE.md" target="_blank" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              {lang === 'zh' ? '查看數據庫設置指南 →' : 'View Database Setup Guide →'}
            </a>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="text-center text-sm text-gray-500">
        <p>Open Purchase v0.1.0</p>
        <p>Built with Next.js, TypeScript, Tailwind CSS</p>
        <p className="mt-2">
          <a href="https://github.com/singerj295/open-purchase" target="_blank" className="text-emerald-600 hover:underline">
            GitHub Repository
          </a>
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
        >
          <Save size={18} />
          {t.common.save}
        </button>
      </div>
    </div>
  );
}
