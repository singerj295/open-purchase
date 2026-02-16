# Deployment Guide

## Vercel Deployment

### 1. Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import `singerj295/open-purchase`
4. Vercel auto-detects Next.js

### 2. Environment Variables

Add these in Vercel Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
MINIMAX_API_KEY=sk-cp-...
ANTHROPIC_API_KEY=sk-ant-api03-...
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=whatsapp:+1234567890
```

### 3. Deploy

```
# Automatic (push to main)
git push origin main

# Manual
vercel --prod
```

### 4. Custom Domain (Optional)

1. Go to Vercel Project Settings → Domains
2. Add `open-purchase.vercel.app` or custom domain
3. DNS settings automatically configured

## Local Development

```bash
git clone https://github.com/singerj295/open-purchase.git
cd open-purchase
npm install
npm run dev
```

Visit `http://localhost:3000`

## Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run build`
- Clear .next cache: `rm -rf .next`

### API Not Working
- Verify environment variables are set
- Check Vercel Function logs

### SSL/HTTPS
- Vercel provides SSL automatically
- No action needed
