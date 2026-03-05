-- ====================================
-- Open Purchase AI - Supabase 表結構
-- ====================================
-- 創建日期：2026-03-05
-- 描述：AI 功能所需嘅數據表
-- ====================================

-- 啟用 UUID 擴展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- 1. AI 報告表 (ai_reports)
-- ====================================
CREATE TABLE IF NOT EXISTS ai_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type TEXT NOT NULL CHECK (report_type IN ('periodic', 'receipt', 'inventory')),
    report_data JSONB,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_run_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_by TEXT NOT NULL DEFAULT 'summer_agent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 2. 單據掃描記錄表 (receipt_scans)
-- ====================================
CREATE TABLE IF NOT EXISTS receipt_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_image_url TEXT,
    ocr_data JSONB,
    extracted_data JSONB,
    order_id UUID REFERENCES orders(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
    confidence_score DECIMAL(5,4), -- 例如 0.9567 表示 95.67% 置信度
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT -- Telegram user ID
);

-- ====================================
-- 3. 更新時間觸發器
-- ====================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 為 ai_reports 添加更新時間觸發器
CREATE TRIGGER update_ai_reports_updated_at 
    BEFORE UPDATE ON ai_reports 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 為 receipt_scans 添加更新時間觸發器
CREATE TRIGGER update_receipt_scans_updated_at 
    BEFORE UPDATE ON receipt_scans 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- 4. 索引優化
-- ====================================

-- ai_reports 表的索引
CREATE INDEX IF NOT EXISTS idx_ai_reports_report_type ON ai_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_ai_reports_status ON ai_reports(status);
CREATE INDEX IF NOT EXISTS idx_ai_reports_generated_at ON ai_reports(generated_at);
CREATE INDEX IF NOT EXISTS idx_ai_reports_next_run_at ON ai_reports(next_run_at);
CREATE INDEX IF NOT EXISTS idx_ai_reports_created_by ON ai_reports(created_by);
CREATE INDEX IF NOT EXISTS idx_ai_reports_created_at ON ai_reports(created_at);

-- receipt_scans 表的索引
CREATE INDEX IF NOT EXISTS idx_receipt_scans_order_id ON receipt_scans(order_id);
CREATE INDEX IF NOT EXISTS idx_receipt_scans_status ON receipt_scans(status);
CREATE INDEX IF NOT EXISTS idx_receipt_scans_confidence_score ON receipt_scans(confidence_score);
CREATE INDEX IF NOT EXISTS idx_receipt_scans_created_at ON receipt_scans(created_at);
CREATE INDEX IF NOT EXISTS idx_receipt_scans_created_by ON receipt_scans(created_by);

-- 複合索引以優化常見查詢
CREATE INDEX IF NOT EXISTS idx_ai_reports_type_status ON ai_reports(report_type, status);
CREATE INDEX IF NOT EXISTS idx_receipt_scans_status_created_at ON receipt_scans(status, created_at);

-- ====================================
-- 5. 註釋
-- ====================================
COMMENT ON TABLE ai_reports IS 'AI 生成嘅報告，包括定期分析、單據分析、庫存分析';
COMMENT ON TABLE receipt_scans IS '單據掃描記錄，包括 OCR 識別結果同提取嘅數據';
COMMENT ON COLUMN receipt_scans.confidence_score IS 'AI 識別置信度，範圍 0-1，例如 0.9567 表示 95.67%';
