# Open Purchase - Database Setup Guide

## Option 1: Supabase (Recommended - Free)

### Steps:

1. **Create Supabase Account**
   - Go to: https://supabase.com
   - Sign up with GitHub

2. **Create New Project**
   - Name: `open-purchase`
   - Password: Generate strong password
   - Region: Select nearest to you (e.g., Hong Kong or Singapore)

3. **Get Connection String**
   - Go to Settings → Database
   - Copy "Connection string" (looks like: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`)

4. **Update Environment Variables**
   ```bash
   # In Vercel or .env
   DATABASE_URL="postgresql://postgres:your-password@your-project.supabase.co:5432/postgres"
   ```

5. **Run Migration**
   ```bash
   npx prisma migrate dev --name init
   ```

---

## Option 2: Neon (Serverless PostgreSQL)

### Steps:

1. **Create Neon Account**
   - Go to: https://neon.tech
   - Sign up with GitHub

2. **Create New Project**
   - Name: `open-purchase`
   - Region: Select nearest

3. **Get Connection String**
   - Go to Connection Details
   - Copy "Connection string"

4. **Update Environment Variables**
   ```bash
   DATABASE_URL="postgres://user:password@ep-xxx.us-east-1.aws.neon.tech/open_purchase"
   ```

---

## Option 3: Vercel Postgres (Integrated)

### Steps:

1. **Create Vercel Postgres**
   - Go to: https://vercel.com/storage/postgres
   - Click "Create Database"
   - Select region

2. **Connect to Project**
   - Select your `open-purchase` project

3. **Get Connection String**
   - Copy from dashboard

4. **Done!** (Already connected to Vercel)

---

## After Database Connection

### 1. Update Prisma Schema (if needed)
Edit `prisma/schema.prisma` and add any new models.

### 2. Push Schema to Database
```bash
npx prisma db push
```

### 3. Seed Database (Optional)
```bash
npm run db:seed
```

### 4. Open Prisma Studio (Development)
```bash
npm run db:studio
```

---

## Environment Variables

Create `.env` file:

```env
# Database (choose one)
DATABASE_URL="postgresql://..."

# AI - MiniMax (Primary)
MINIMAX_API_KEY="sk-your-minimax-key"

# AI - Anthropic (Fallback)
ANTHROPIC_API_KEY="sk-ant-api03-..."

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Troubleshooting

### Connection Issues
- Check firewall rules
- Ensure IP whitelist includes Vercel's IPs (if using hosted database)

### Prisma Errors
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (dev only)
npx prisma migrate reset
```

### Performance
- Add database indexes to frequently queried columns
- Consider connection pooling for production
