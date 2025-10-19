/**
 * User Profile API
 * GET /api/user/me - Get current user profile
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser()
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' }
      }, { status: 401 })
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        plan: user.plan
      }
    })
    
  } catch (error) {
    console.error('User profile API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch user profile'
      }
    }, { status: 500 })
  }
}