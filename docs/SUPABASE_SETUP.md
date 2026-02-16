# Supabase Setup Guide for Open Purchase

This guide walks you through setting up Supabase as the database and authentication provider for Open Purchase.

## Prerequisites

- A Google account (for Supabase)
- Access to Vercel project settings (for environment variables)

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in with Google
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `open-purchase` (or your preferred name)
   - **Database Password**: Generate a strong password and save it!
   - **Region**: Select `Asia Pacific (Singapore)` for Hong Kong
4. Click **"Create new project"**
5. Wait 1-2 minutes for the project to initialize

## Step 2: Get API Credentials

After the project is created:

1. Go to **Project Settings** → **API**
2. Copy these values for your `.env.local`:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR...`

## Step 3: Set Up Database Schema

### Option A: Using SQL Editor (Recommended)

1. Go to **SQL Editor** in Supabase dashboard
2. Copy the content from `prisma/schema.supabase.sql`
3. Click **"Run"** to execute the SQL

### Option B: Using Supabase Dashboard

Create the tables manually:

1. Go to **Table Editor**
2. Create tables in this order:
   - `organizations`
   - `users`
   - `suppliers`
   - `categories`
   - `products`
   - `inventory`
   - `orders`
   - `order_items`

## Step 4: Configure Authentication

### Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. (Optional) Disable "Confirm email" for faster testing

### Configure Row Level Security (RLS)

Run this SQL in the SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for users to see their organization's data
CREATE POLICY "Users can view their organization data" 
ON organizations FOR SELECT 
USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = id));

CREATE POLICY "Users can view their organization's suppliers" 
ON suppliers FOR SELECT 
USING (auth.uid() IN (SELECT id FROM users WHERE organization_id = suppliers.organization_id));
```

## Step 5: Configure Environment Variables

Create or update `.env.local` in your project root:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Optional: Keep old DATABASE_URL for fallback
# DATABASE_URL="postgresql://..."
```

## Step 6: Update Vercel Environment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Open Purchase project
3. Go to **Settings** → **Environment Variables**
4. Add the Supabase variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **"Save"** and redeploy

## Step 7: Test the Connection

1. Run the development server:
   ```bash
   npm run dev
   ```
2. Visit `http://localhost:3000/login`
3. Try to sign up with a test email
4. Check Supabase Dashboard → **Authentication** → **Users**
5. You should see the new user

## Troubleshooting

### "Failed to fetch" errors

- Check that your Supabase URL is correct (no trailing slash)
- Ensure RLS policies don't block read access
- Try disabling RLS temporarily for testing

### Authentication not working

- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check that Email provider is enabled
- Clear browser localStorage and cookies

### Build errors on Vercel

- Add environment variables in Vercel settings
- Redeploy after adding variables
- Check Vercel build logs for specific errors

## Security Best Practices

1. **Never expose `SUPABASE_SERVICE_ROLE_KEY`** in client-side code
2. **Use RLS policies** to protect data at the database level
3. **Enable 2FA** on your Supabase account
4. **Regularly rotate** your API keys if needed

## Next Steps

- Set up WhatsApp integration with Twilio
- Configure AI providers (MiniMax, Claude)
- Enable email notifications

---

## Quick Reference

| Setting | Value |
|---------|-------|
| Supabase URL | `https://xxxxx.supabase.co` |
| Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| Service Role Key | Keep secret! |
| Region | Singapore (ap-southeast-1) |

For issues, check the [Supabase Documentation](https://supabase.com/docs) or open an issue on GitHub.
