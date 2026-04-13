import type { SessionUser } from '@repo/supabase'

export function getMockSessionUser(): SessionUser {
  return {
    id: 'demo-user-id',
    email: 'student@iflytek.com',
  }
}
