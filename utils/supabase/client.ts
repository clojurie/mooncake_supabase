import { createBrowserClient } from '@supabase/ssr'

const options = process.env.NODE_ENV === 'development' ? {
  cookieOptions: {
    sameSite: 'none' as const,
    secure: true,
  },
} : {}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { ...options }
  )
}