# OpenClaw AI API

This API enables OpenClaw assistant AIs (Jennifer, Nicole, Eugene) to access Open Purchase data programmatically.

## ⚠️ Security Warning

**API keys must NOT be hardcoded in source code!**

Keys shown in this document are for DEMO ONLY. In production:

1. Store keys in Vercel Environment Variables
2. Never commit keys to GitHub
3. Use Supabase for key management in production

## Set API Keys in Vercel

Go to Project Settings → Environment Variables:

```
Name: OPENCLAW_API_KEYS
Value: [
  {
    "key": "oc_ai_jennifer_xxx",
    "name": "Jennifer (Personal AI)",
    "agentId": "jennifer",
    "permissions": ["read:all", "write:orders", "write:inventory"],
    "createdAt": "2026-02-01",
    "lastUsed": "2026-02-16",
    "isActive": true
  },
  {
    "key": "oc_ai_nicole_xxx",
    "name": "Nicole (Business AI)",
    "agentId": "nicole",
    "permissions": ["read:all", "write:orders", "write:inventory", "read:analytics"],
    "createdAt": "2026-02-01",
    "lastUsed": "2026-02-16",
    "isActive": true
  },
  {
    "key": "oc_ai_eugene_xxx",
    "name": "Eugene (Main Assistant)",
    "agentId": "main",
    "permissions": ["admin"],
    "createdAt": "2026-02-01",
    "lastUsed": "2026-02-16",
    "isActive": true
  }
]
```

## Authentication

All requests require an API key in the Authorization header:

```
Authorization: Bearer oc_ai_your_key_here
```

## Endpoints

### GET /api/v1

Get dashboard overview.

```
GET /api/v1?resource=dashboard
Authorization: Bearer oc_ai_your_key_here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "agent": "Your AI Agent",
    "timestamp": "2026-02-16T12:00:00Z",
    "stats": {
      "totalOrders": 156,
      "pendingOrders": 12,
      "totalSuppliers": 24,
      "lowStockItems": 3,
      "monthlySpend": 12450
    }
  }
}
```

### GET /api/v1?resource=orders

Get all orders.

```
GET /api/v1?resource=orders
Authorization: Bearer oc_ai_your_key_here
```

### GET /api/v1?resource=inventory

Get inventory items.

```
GET /api/v1?resource=inventory
Authorization: Bearer oc_ai_your_key_here
```

### GET /api/v1?resource=suppliers

Get suppliers list.

```
GET /api/v1?resource=suppliers
Authorization: Bearer oc_ai_your_key_here
```

### GET /api/v1?resource=analytics

Get analytics data.

```
GET /api/v1?resource=analytics
Authorization: Bearer oc_ai_your_key_here
```

## Actions (POST)

### Create Order

```json
POST /api/v1
Authorization: Bearer oc_ai_your_key_here

{
  "action": "create_order",
  "supplierId": "1",
  "items": [
    { "productId": "1", "quantity": 10 }
  ]
}
```

### Update Inventory

```json
POST /api/v1
Authorization: Bearer oc_ai_your_key_here

{
  "action": "update_inventory",
  "itemId": "1",
  "quantity": 100
}
```

### Send WhatsApp

```json
POST /api/v1
Authorization: Bearer oc_ai_your_key_here

{
  "action": "send_whatsapp",
  "to": "+85212345678",
  "message": "Order confirmed!"
}
```

### AI Cost Analysis

```json
POST /api/v1
Authorization: Bearer oc_ai_your_key_here

{
  "action": "analyze_cost",
  "recipe": {
    "name": "Tomato Salmon Pasta",
    "ingredients": [...]
  }
}
```

## Error Responses

```json
{
  "success": false,
  "error": "Invalid API key"
}
```

## Rate Limits

- 100 requests per minute per API key
- Burst up to 10 requests

## Production Security Checklist

- [ ] API keys stored in Vercel Environment Variables
- [ ] Keys NOT in GitHub source code
- [ ] RLS policies enabled in Supabase
- [ ] HTTPS enforced (automatic in Vercel)
- [ ] API keys rotated quarterly
- [ ] Monitoring enabled for suspicious activity

## Use Cases

### Jennifer (Personal AI)
- Check low stock alerts
- Update inventory after shopping
- Send WhatsApp to suppliers

### Nicole (Business AI)
- Analyze spending patterns
- Generate reports
- Create bulk orders

### Eugene (Main Assistant)
- Full admin access
- Coordinate between systems
- AI-powered recommendations
