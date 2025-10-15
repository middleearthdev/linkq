/**
 * Admin Stats API Routes
 * GET /api/admin/stats - Get platform statistics
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
      }, { status: 401 })
    }

    // Check if user is admin (implement your admin check logic)
    if (session.user.email !== 'admin@linkq.app') {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' },
      }, { status: 403 })
    }

    // Get current date for calculations
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    // Fetch platform statistics
    const [
      totalUsers,
      totalSites,
      totalTemplates,
      currentMonthUsers,
      lastMonthUsers,
      totalRevenue,
      activeUsers
    ] = await Promise.all([
      // Total users
      db.user.count(),
      
      // Total sites
      db.userSite.count(),
      
      // Total templates
      db.template.count({
        where: { status: 'PUBLISHED' }
      }),
      
      // Current month users
      db.user.count({
        where: {
          createdAt: {
            gte: currentMonth
          }
        }
      }),
      
      // Last month users
      db.user.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: currentMonth
          }
        }
      }),
      
      // Total revenue (from template purchases)
      db.userTemplatePurchase.aggregate({
        _sum: {
          priceCents: true
        }
      }),
      
      // Active users (users with published sites)
      db.user.count({
        where: {
          sites: {
            some: {
              status: 'PUBLISHED'
            }
          }
        }
      })
    ])

    // Calculate monthly growth percentage
    const monthlyGrowth = lastMonthUsers > 0 
      ? Math.round(((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100)
      : 0

    const stats = {
      totalUsers,
      totalSites,
      totalTemplates,
      totalRevenue: totalRevenue._sum.priceCents || 0,
      monthlyGrowth,
      activeUsers,
      currentMonthUsers,
      lastMonthUsers,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })

  } catch (error) {
    console.error('Admin stats API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch admin statistics',
      },
    }, { status: 500 })
  }
}