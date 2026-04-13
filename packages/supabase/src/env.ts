import type { SupabaseEnv } from './types'

type SupabaseEnvLike = Record<string, string | undefined>

export function getSupabaseEnv(env: SupabaseEnvLike): SupabaseEnv {
  const url = env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are missing')
  }

  return { url, anonKey }
}
