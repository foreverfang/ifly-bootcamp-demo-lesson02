import { createClient } from '@supabase/supabase-js'

import { getSupabaseEnv } from './env'

export function createBrowserSupabaseClient(
  env: Record<string, string | undefined>,
) {
  const { url, anonKey } = getSupabaseEnv(env)

  return createClient(url, anonKey)
}
