/**
 * Supabase Client Configuration
 * 
 * Usage:
 * - Server-side: Use service role key for admin operations
 * - Client-side: Use anon key for public operations (with RLS)
 */

import { createClient } from '@supabase/supabase-js'

// Configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://pidbavwgtlwhpkkefqko.supabase.co'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseServiceRoleKey) {
  console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not found in environment variables')
}

/**
 * Server-side Supabase Client
 * 
 * Use this for:
 * - Admin operations
 * - Bypassing Row Level Security (RLS)
 * - Server-side API routes
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

/**
 * Client-side Supabase Client (for browser)
 * 
 * Use this for:
 * - Browser-based operations
 * - Respects Row Level Security (RLS)
 * - User authentication
 * 
 * Note: You need to add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env
 */
export const supabase = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
)

// Export types
export type { SupabaseClient } from '@supabase/supabase-js'
