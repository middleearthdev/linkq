/**
 * Auth utilities for role-based access control
 */

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { cache } from 'react'
import { redirect } from 'next/navigation'

// Cache untuk menghindari multiple DB calls dalam satu request
export const getCurrentUser = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await import('next/headers').then(h => h.headers())
    })
    
    if (!session?.user?.id) return null
    
    // Always fetch fresh user data from DB untuk security
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        isAdmin: true,
        emailVerified: true,
        plan: true,
        createdAt: true,
      }
    })
    
    return user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
})

// Permission checks
export function isAdmin(user: any): boolean {
  return user?.isAdmin === true
}

export function canAccessAdmin(user: any): boolean {
  return isAdmin(user)
}

// Server-side guards
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/auth/login')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (!user.isAdmin) {
    redirect('/dashboard') // Redirect ke user dashboard jika bukan admin
  }
  return user
}

// API route helpers
export async function getSessionUser() {
  try {
    const session = await auth.api.getSession({
      headers: await import('next/headers').then(h => h.headers())
    })
    
    if (!session?.user?.id) return null
    
    return await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        plan: true,
      }
    })
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}