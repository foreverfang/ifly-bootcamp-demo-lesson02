import { getSupabaseEnv } from './env'

export function createServerSupabaseClient() {
  const processEnv = (
    globalThis as typeof globalThis & {
      process?: { env: Record<string, string | undefined> }
    }
  ).process?.env

  if (!processEnv) {
    throw new Error('Supabase environment variables are missing')
  }

  return {
    source: 'server' as const,
    env: getSupabaseEnv(processEnv),
  }
}
