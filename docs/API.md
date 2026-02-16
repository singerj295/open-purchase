# API Documentation

## Authentication

### POST /api/auth

Authentication endpoint for login/signup.

**Request:**
```json
{
  "action": "signin|signup|signout|session",
  "email": "user@example.com",
  "password": "password123",
  "name": "Full Name"
}
```

**Response:**
```json
{
  "success": true,
  "data": { "user": {...}, "session": {...} }
}
```

## Orders

### GET /api/orders

Get all orders (mock data).

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

### POST /api/orders

Create new order.

## Suppliers

### GET /api/suppliers

Get all suppliers (mock data).

### POST /api/suppliers

Create new supplier.

## Products

### GET /api/products

Get all products.

### POST /api/products

Create new product.

## Inventory

### GET /api/inventory

Get inventory items with stock levels.

## WhatsApp

### POST /api/whatsapp/send

Send WhatsApp message via Twilio.

**Request:**
```json
{
  "to": "+85212345678",
  "message": "Your order is ready!"
}
```

### POST /api/whatsapp/supplier

Receive WhatsApp messages from suppliers.

Supports:
- "YES" / "ACCEPT" - Confirm order
- "NO" / "REJECT" - Decline order
- "SHIPPED" - Order dispatched
- "DELIVERED" - Order arrived
- "PRICE: $XX" - Confirm price

## AI

### POST /api/ai/analyze

AI cost analysis using MiniMax (primary) or Claude (fallback).

**Request:**
```json
{
  "type": "cost_analysis",
  "data": {...}
}
```
