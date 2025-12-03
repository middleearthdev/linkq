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

// Subscription tier checks
export type SubscriptionTier = 'FREE' | 'STARTER' | 'PRO'

export function hasStarterOrPro(user: any): boolean {
  return user?.plan === 'STARTER' || user?.plan === 'PRO'
}

export function hasPro(user: any): boolean {
  return user?.plan === 'PRO'
}

export function canUploadCustomImages(user: any): boolean {
  // STARTER and PRO users can upload custom images
  return hasStarterOrPro(user)
}

export function canUseCustomDomain(user: any): boolean {
  // Only PRO users can use custom domains
  return hasPro(user)
}

export function canRemoveBranding(user: any): boolean {
  // Only PRO users can remove branding
  return hasPro(user)
}

export function canUseAdvancedAnalytics(user: any): boolean {
  // Only PRO users can access advanced analytics
  return hasPro(user)
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