import { NextRequest, NextResponse } from 'next/server';
import { createRateLimitedHandler } from '@/lib/rate-limit';

// OpenClaw AI API Key System
// Enables OpenClaw assistant AIs to access Open Purchase data
// API keys should be stored in environment variables, NOT in source code!

interface APIKey {
  key: string;
  name: string;
  agentId: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string;
  isActive: boolean;
}

// Get API key from environment variable
// Format: JSON array of API keys
// Example: [{"key":"oc_ai_xxx","name":"Jennifer","agentId":"jennifer",...}]
function getAPIKeysFromEnv(): Record<string, APIKey> {
  const envKeys = process.env.OPENCLAW_API_KEYS;
  
  if (!envKeys) {
    // Return empty - will require Supabase lookup
    console.warn('⚠️ OPENCLAW_API_KEYS not set. Using empty keys DB.');
    return {};
  }
  
  try {
    const keys = JSON.parse(envKeys);
    const keysDB: Record<string, APIKey> = {};
    for (const key of keys) {
      keysDB[key.key] = key;
    }
    return keysDB;
  } catch (e) {
    console.error('Failed to parse OPENCLAW_API_KEYS:', e);
    return {};
  }
}

// Mock API keys - FOR DEMO ONLY!
// In production, use: export OPENCLAW_API_KEYS='[{"key":"...","name":"...","agentId":"...","permissions":[...],"createdAt":"...","lastUsed":"...","isActive":true}]'
// These keys should be stored in Vercel Environment Variables, NOT in source code!

// Validate API Key
function validateAPIKey(request: NextRequest): { valid: boolean; key?: APIKey; error?: string } {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid Authorization header' };
  }
  
  const apiKey = authHeader.replace('Bearer ', '');
  
  // Get keys from environment (secure) or fallback to demo (insecure)
  const apiKeysDB = getAPIKeysFromEnv();
  const keyData = apiKeysDB[apiKey];
  
  if (!keyData) {
    // In demo mode without env keys, reject all requests
    if (Object.keys(apiKeysDB).length === 0) {
      return { 
        valid: false, 
        error: 'API not configured. Set OPENCLAW_API_KEYS environment variable in Vercel.' 
      };
    }
    return { valid: false, error: 'Invalid API key' };
  }
  
  if (!keyData.isActive) {
    return { valid: false, error: 'API key is inactive' };
  }
  
  return { valid: true, key: keyData };
}

// Check permission
function hasPermission(key: APIKey, required: string): boolean {
  if (key.permissions.includes('admin')) return true;
  return key.permissions.includes(required);
}

export async function GET(request: NextRequest) {
  try {
    const { valid, key, error } = validateAPIKey(request);
    
    if (!valid) {
      return NextResponse.json(
        { success: false, error },
        { status: 401 }
      );
    }
    
    // Get query params
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource') || 'dashboard';
    
    // Route to appropriate handler
    switch (resource) {
      case 'orders':
        return handleOrdersGET(key!);
      case 'inventory':
        return handleInventoryGET(key!);
      case 'suppliers':
        return handleSuppliersGET(key!);
      case 'analytics':
        return handleAnalyticsGET(key!);
      case 'dashboard':
      default:
        return handleDashboardGET(key!);
    }
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { valid, key, error } = validateAPIKey(request);
    
    if (!valid) {
      return NextResponse.json(
        { success: false, error },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { action } = body;
    
    switch (action) {
      case 'create_order':
        return handleCreateOrder(key!, body);
      case 'update_inventory':
        return handleUpdateInventory(key!, body);
      case 'send_whatsapp':
        return handleSendWhatsApp(key!, body);
      case 'analyze_cost':
        return handleAnalyzeCost(key!, body);
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Handler functions
function handleDashboardGET(key: APIKey) {
  return NextResponse.json({
    success: true,
    data: {
      agent: key.name,
      timestamp: new Date().toISOString(),
      stats: {
        totalOrders: 156,
        pendingOrders: 12,
        totalSuppliers: 24,
        lowStockItems: 3,
        monthlySpend: 12450,
      }
    }
  });
}

function handleOrdersGET(key: APIKey) {
  if (!hasPermission(key, 'read:orders')) {
    return NextResponse.json(
      { success: false, error: 'Insufficient permissions' },
      { status: 403 }
    );
  }
  
  return NextResponse.json({
    success: true,
    data: {
      orders: [
        { id: 'ORD-001', supplier: 'Fresh Farm Co', status: 'pending', total: 450 },
        { id: 'ORD-002', supplier: 'Ocean Seafood', status: 'confirmed', total: 890 },
      ]
    }
  });
}

function handleInventoryGET(key: APIKey) {
  if (!hasPermission(key, 'read:inventory')) {
    return NextResponse.json(
      { success: false, error: 'Insufficient permissions' },
      { status: 403 }
    );
  }
  
  return NextResponse.json({
    success: true,
    data: {
      items: [
        { id: '1', name: 'Tomatoes', quantity: 80, minStock: 30 },
        { id: '2', name: 'Salmon', quantity: 45, minStock: 20 },
      ]
    }
  });
}

function handleSuppliersGET(key: APIKey) {
  return NextResponse.json({
    success: true,
    data: {
      suppliers: [
        { id: '1', name: 'Fresh Farm Co', contact: 'John', phone: '+85212345678' },
        { id: '2', name: 'Ocean Seafood', contact: 'Mary', phone: '+85223456789' },
      ]
    }
  });
}

function handleAnalyticsGET(key: APIKey) {
  if (!hasPermission(key, 'read:analytics')) {
    return NextResponse.json(
      { success: false, error: 'Insufficient permissions' },
      { status: 403 }
    );
  }
  
  return NextResponse.json({
    success: true,
    data: {
      monthlySpend: [8500, 9200, 7800, 10500, 11200, 12450],
      topSuppliers: ['Fresh Farm Co', 'Ocean Seafood'],
      costSavings: 892,
    }
  });
}

function handleCreateOrder(key: APIKey, body: any) {
  if (!hasPermission(key, 'write:orders')) {
    return NextResponse.json(
      { success: false, error: 'Insufficient permissions' },
      { status: 403 }
    );
  }
  
  return NextResponse.json({
    success: true,
    data: {
      orderId: `ORD-${Date.now()}`,
      agent: key.name,
      status: 'pending',
      message: 'Order created successfully'
    }
  });
}

function handleUpdateInventory(key: APIKey, body: any) {
  if (!hasPermission(key, 'write:inventory')) {
    return NextResponse.json(
      { success: false, error: 'Insufficient permissions' },
      { status: 403 }
    );
  }
  
  return NextResponse.json({
    success: true,
    data: {
      itemId: body.itemId,
      newQuantity: body.quantity,
      message: 'Inventory updated successfully'
    }
  });
}

function handleSendWhatsApp(key: APIKey, body: any) {
  return NextResponse.json({
    success: true,
    data: {
      messageId: `WA-${Date.now()}`,
      to: body.to,
      status: 'sent',
      agent: key.name,
    }
  });
}

function handleAnalyzeCost(key: APIKey, body: any) {
  return NextResponse.json({
    success: true,
    data: {
      analysis: 'AI cost analysis complete',
      suggestedPrice: body.suggestedPrice || 88,
      profitMargin: body.profitMargin || 48.5,
      recommendations: [
        'Consider bulk ordering for items with high volume',
        'Review supplier pricing for seafood items',
      ],
      agent: key.name,
    }
  });
}
