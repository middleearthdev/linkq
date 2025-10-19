/**
 * Admin Users API
 * GET /api/admin/users - List and manage users
 * PATCH /api/admin/users/[id] - Update user (plan, status, etc)
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth-utils'
import { withRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { z } from 'zod'

async function getAdminUsers(request: NextRequest) {
  try {
    // Security: Check admin access
    const user = await getSessionUser()
    
    if (!user?.isAdmin) {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }, { status: 403 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const plan = searchParams.get('plan') || 'all'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause for filtering
    const where: any = {}
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (plan && plan !== 'all') {
      where.plan = plan
    }

    // Build orderBy clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Performance: Parallel queries
    const [users, totalCount] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          plan: true,
          planExpiry: true,
          isAdmin: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              sites: true,
              purchases: true
            }
          }
        }
      }),
      db.user.count({ where })
    ])

    // Add additional user info
    const enrichedUsers = users.map(user => ({
      ...user,
      siteCount: user._count.sites,
      purchaseCount: user._count.purchases,
      status: user.emailVerified ? 'active' : 'pending',
      lastActivity: user.updatedAt
    }))

    return NextResponse.json({
      success: true,
      data: {
        users: enrichedUsers,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: skip + limit < totalCount
        }
      }
    })

  } catch (error) {
    console.error('Admin users API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch users'
      }
    }, { status: 500 })
  }
}

// Export with rate limiting
export const GET = withRateLimit(getAdminUsers, RATE_LIMITS.admin)