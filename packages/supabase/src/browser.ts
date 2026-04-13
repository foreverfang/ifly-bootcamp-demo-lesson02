import { getSupabaseEnv } from './env'

export function createBrowserSupabaseClient(
  env: Record<string, string | undefined>,
) {
  return {
    source: 'browser' as const,
    env: getSupabaseEnv(env),
  }
}
