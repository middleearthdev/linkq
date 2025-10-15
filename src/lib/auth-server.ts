/**
 * Server-side Auth Utilities
 * Helper functions for server-side authentication with Better Auth
 */

import { auth } from './auth'
import { headers } from 'next/headers'

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    if (!session) {
      return null
    }

    return session.user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

export async function getCurrentSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    return session
  } catch (error) {
    console.error('Error getting current session:', error)
    return null
  }
}