-- ============================================
-- Open Purchase Database Schema
-- For Supabase PostgreSQL
-- 
-- 使用方法:
-- 1. 去 https://supabase.com/dashboard/project/pidbavwgtlwhpkkefqko
-- 2. SQL Editor → New Query
-- 3. 貼上呢個 SQL
-- 4. 點擊 Run
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: Supplier
-- ============================================
CREATE TABLE IF NOT EXISTS "Supplier" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Supplier
CREATE INDEX IF NOT EXISTS idx_supplier_email ON "Supplier"(email);
CREATE INDEX IF NOT EXISTS idx_supplier_isActive ON "Supplier"(isActive);
CREATE INDEX IF NOT EXISTS idx_supplier_name ON "Supplier"(name);

-- ============================================
-- Table: Category
-- ============================================
CREATE TABLE IF NOT EXISTS "Category" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  parentId UUID REFERENCES "Category"(id),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for Category
CREATE INDEX IF NOT EXISTS idx_category_parent ON "Category"(parentId);

-- ============================================
-- Table: Product
-- ============================================
CREATE TABLE IF NOT EXISTS "Product" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  unit TEXT DEFAULT 'pcs',
  sku TEXT,
  description TEXT,
  imageUrl TEXT,
  price FLOAT DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  supplierId UUID NOT NULL REFERENCES "Supplier"(id),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Product
CREATE INDEX IF NOT EXISTS idx_product_category ON "Product"(category);
CREATE INDEX IF NOT EXISTS idx_product_isActive ON "Product"(isActive);
CREATE INDEX IF NOT EXISTS idx_product_supplierId ON "Product"(supplierId);
CREATE INDEX IF NOT EXISTS idx_product_supplierId_isActive ON "Product"(supplierId, isActive);

-- ============================================
-- Table: "Order"
-- ============================================
CREATE TABLE IF NOT EXISTS "Order" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orderNumber TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'PENDING',
  totalAmount FLOAT DEFAULT 0,
  notes TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  supplierId UUID NOT NULL REFERENCES "Supplier"(id),
  
  -- WhatsApp integration
  whatsappMessageId TEXT,
  whatsappStatus TEXT
);

-- Indexes for Order
CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"(status);
CREATE INDEX IF NOT EXISTS idx_order_createdAt ON "Order"(createdAt);
CREATE INDEX IF NOT EXISTS idx_order_supplierId ON "Order"(supplierId);
CREATE INDEX IF NOT EXISTS idx_order_supplierId_status ON "Order"(supplierId, status);
CREATE INDEX IF NOT EXISTS idx_order_status_createdAt ON "Order"(status, createdAt);
CREATE INDEX IF NOT EXISTS idx_order_whatsappStatus ON "Order"(whatsappStatus);

-- ============================================
-- Table: OrderItem
-- ============================================
CREATE TABLE IF NOT EXISTS "OrderItem" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quantity INTEGER DEFAULT 1,
  unitPrice FLOAT DEFAULT 0,
  totalPrice FLOAT DEFAULT 0,
  orderId UUID NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  productId UUID NOT NULL REFERENCES "Product"(id)
);

-- Indexes for OrderItem
CREATE INDEX IF NOT EXISTS idx_orderItem_orderId ON "OrderItem"(orderId);
CREATE INDEX IF NOT EXISTS idx_orderItem_productId ON "OrderItem"(productId);
CREATE INDEX IF NOT EXISTS idx_orderItem_orderId_productId ON "OrderItem"(orderId, productId);

-- ============================================
-- Table: Inventory
-- ============================================
CREATE TABLE IF NOT EXISTS "Inventory" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quantity INTEGER DEFAULT 0,
  minStock INTEGER DEFAULT 0,
  maxStock INTEGER DEFAULT 100,
  location TEXT,
  lastRestock TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  productId UUID UNIQUE NOT NULL REFERENCES "Product"(id)
);

-- Indexes for Inventory
CREATE INDEX IF NOT EXISTS idx_inventory_quantity ON "Inventory"(quantity);
CREATE INDEX IF NOT EXISTS idx_inventory_productId ON "Inventory"(productId);

-- ============================================
-- Table: AuditLog
-- ============================================
CREATE TABLE IF NOT EXISTS "AuditLog" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  entityType TEXT NOT NULL,
  entityId TEXT NOT NULL,
  oldValue JSONB,
  newValue JSONB,
  userId TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for AuditLog
CREATE INDEX IF NOT EXISTS idx_auditLog_entityType ON "AuditLog"(entityType);
CREATE INDEX IF NOT EXISTS idx_auditLog_entityId ON "AuditLog"(entityId);
CREATE INDEX IF NOT EXISTS idx_auditLog_createdAt ON "AuditLog"(createdAt);
CREATE INDEX IF NOT EXISTS idx_auditLog_entityType_entityId ON "AuditLog"(entityType, entityId);

-- ============================================
-- Enum: OrderStatus
-- ============================================
DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- Insert Sample Data (Optional)
-- ============================================

-- Sample Suppliers
INSERT INTO "Supplier" (name, contact, phone, email, address, isActive) VALUES
  ('Fresh Farm Co', 'John Smith', '+852 1234 5678', 'john@freshfarm.com', 'New Territories', true),
  ('Ocean Seafood', 'Mary Chan', '+852 2345 6789', 'mary@ocean.com', 'Hong Kong Island', true),
  ('Kitchen Supplies Ltd', 'David Wong', '+852 3456 7890', 'david@kitchen.com', 'Kowloon', true),
  ('Spice World', 'Lisa Lau', '+852 4567 8901', 'lisa@spice.com', 'New Territories', false)
ON CONFLICT DO NOTHING;

-- Sample Categories
INSERT INTO "Category" (name, description) VALUES
  ('Vegetables', 'Fresh vegetables'),
  ('Seafood', 'Fresh seafood'),
  ('Meat', 'Fresh meat'),
  ('Dry Goods', 'Dried goods and spices'),
  ('Beverages', 'Drinks and beverages')
ON CONFLICT DO NOTHING;

-- Sample Products
DO $$
DECLARE
  supplier_id UUID;
BEGIN
  SELECT id INTO supplier_id FROM "Supplier" WHERE name = 'Fresh Farm Co' LIMIT 1;
  
  INSERT INTO "Product" (name, category, unit, price, supplierId, isActive) VALUES
    ('Cabbage', 'Vegetables', 'kg', 15.00, supplier_id, true),
    ('Carrot', 'Vegetables', 'kg', 12.00, supplier_id, true),
    ('Potato', 'Vegetables', 'kg', 10.00, supplier_id, true)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- Row Level Security (RLS) - Optional
-- ============================================
-- Uncomment if you want to enable RLS

-- ALTER TABLE "Supplier" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Inventory" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- Example RLS Policy (allow all for now)
-- CREATE POLICY "Allow all operations" ON "Supplier"
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

-- ============================================
-- Completion Message
-- ============================================
-- 如果見到呢條訊息，代表所有表已成功創建！
-- ✅ Database schema created successfully!
