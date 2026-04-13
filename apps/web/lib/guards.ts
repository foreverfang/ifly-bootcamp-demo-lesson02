import { redirect } from 'next/navigation'

import { isAuthenticated } from '@repo/supabase'

import { getMockSessionUser } from './session'

export function requireSignedInUser() {
  const user = getMockSessionUser()

  if (!isAuthenticated(user)) {
    redirect('/sign-in')
  }

  return user
}
