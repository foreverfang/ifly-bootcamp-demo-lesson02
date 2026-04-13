import type { SessionUser } from './types'

export function isAuthenticated(user: SessionUser | null | undefined) {
  return Boolean(user?.id)
}
