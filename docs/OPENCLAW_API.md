# OpenClaw AI API

This API enables OpenClaw assistant AIs (Jennifer, Nicole, Eugene) to access Open Purchase data programmatically.

## Authentication

All requests require an API key in the Authorization header:

```
Authorization: Bearer oc_ai_eugene_main
```

### Available API Keys

| Key | Agent | Permissions |
|-----|-------|-------------|
| `oc_ai_jennifer_abc123` | Jennifer (Personal AI) | read:all, write:orders, write:inventory |
| `oc_ai_nicole_xyz789` | Nicole (Business AI) | read:all, write:orders, write:inventory, read:analytics |
| `oc_ai_eugene_main` | Eugene (Main) | admin |

## Endpoints

### GET /api/v1

Get dashboard overview.

```
GET /api/v1?resource=dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "agent": "Eugene (Main Assistant)",
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
Authorization: Bearer oc_ai_nicole_xyz789
```

### GET /api/v1?resource=inventory

Get inventory items.

```
GET /api/v1?resource=inventory
Authorization: Bearer oc_ai_jennifer_abc123
```

### GET /api/v1?resource=suppliers

Get suppliers list.

```
GET /api/v1?resource=suppliers
```

### GET /api/v1?resource=analytics

Get analytics data.

```
GET /api/v1?resource=analytics
Authorization: Bearer oc_ai_nicole_xyz789
```

## Actions (POST)

### Create Order

```json
POST /api/v1
Authorization: Bearer oc_ai_nicole_xyz789

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
Authorization: Bearer oc_ai_jennifer_abc123

{
  "action": "update_inventory",
  "itemId": "1",
  "quantity": 100
}
```

### Send WhatsApp

```json
POST /api/v1
Authorization: Bearer oc_ai_eugene_main

{
  "action": "send_whatsapp",
  "to": "+85212345678",
  "message": "Order confirmed!"
}
```

### AI Cost Analysis

```json
POST /api/v1
Authorization: Bearer oc_ai_nicole_xyz789

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
