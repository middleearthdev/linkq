/**
 * Admin Stats API Routes
 * GET /api/admin/stats - Get comprehensive platform statistics
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth-utils'
import { withRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

async function getAdminStats(request: NextRequest) {
  try {
    // Security: Check admin access with fresh DB check
    const user = await getSessionUser()
    
    if (!user?.isAdmin) {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }, { status: 403 })
    }

    // Performance: Parallel queries untuk efficiency
    const [
      totalUsers,
      totalSites,
      totalTemplates,
      totalRevenue,
      recentUsers,
      activeUsers,
      planDistribution,
      publishedSites,
      templateStats
    ] = await Promise.all([
      // Total users count
      db.user.count(),
      
      // Total sites count
      db.userSite.count(),
      
      // Total templates count (only published)
      db.template.count({
        where: { status: 'PUBLISHED' }
      }),
      
      // Total revenue from completed purchases
      db.userTemplatePurchase.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { priceCents: true }
      }),
      
      // Recent users (last 30 days)
      db.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Active users (had activity in last 7 days)
      db.user.count({
        where: {
          OR: [
            {
              sites: {
                some: {
                  updatedAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  }
                }
              }
            },
            {
              updatedAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              }
            }
          ]
        }
      }),
      
      // Plan distribution
      db.user.groupBy({
        by: ['plan'],
        _count: true
      }),
      
      // Published sites count
      db.userSite.count({
        where: { status: 'PUBLISHED' }
      }),
      
      // Popular templates
      db.template.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              purchases: true
            }
          }
        },
        orderBy: {
          purchases: {
            _count: 'desc'
          }
        },
        take: 5
      })
    ])

    // Calculate previous month for growth comparison
    const lastMonthUsers = await db.user.count({
      where: {
        createdAt: {
          lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    })
    
    // Calculate monthly growth
    const monthlyGrowth = lastMonthUsers > 0 
      ? Math.round(((recentUsers) / lastMonthUsers) * 100)
      : 100

    // Process plan distribution
    const planStats = {
      FREE: 0,
      STARTER: 0,
      PRO: 0
    }
    
    planDistribution.forEach(item => {
      planStats[item.plan as keyof typeof planStats] = item._count
    })

    const stats = {
      totalUsers,
      totalSites,
      totalTemplates,
      totalRevenue: totalRevenue._sum.priceCents || 0,
      monthlyGrowth,
      activeUsers,
      recentUsers,
      publishedSites,
      planDistribution: planStats,
      popularTemplates: templateStats,
      
      // Additional insights
      insights: {
        averageSitesPerUser: totalUsers > 0 ? Math.round((totalSites / totalUsers) * 100) / 100 : 0,
        userRetention: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
        conversionRate: totalUsers > 0 ? Math.round(((planStats.STARTER + planStats.PRO) / totalUsers) * 100) : 0,
        publishRate: totalSites > 0 ? Math.round((publishedSites / totalSites) * 100) : 0
      }
    }

    return NextResponse.json({
      success: true,
      data: stats,
      generatedAt: new Date().toISOString()
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

// Export with rate limiting
export const GET = withRateLimit(getAdminStats, RATE_LIMITS.admin)