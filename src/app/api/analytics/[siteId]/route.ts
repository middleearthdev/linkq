/**
 * Analytics API Route
 * GET /api/analytics/[siteId] - Get analytics data for a site
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const siteId = resolvedParams.siteId
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || '30d'

    // Verify site ownership
    const site = await db.userSite.findFirst({
      where: {
        id: siteId,
        userId: user.id
      }
    })

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    // Calculate date range
    const now = new Date()
    let startDate: Date

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'all':
        startDate = new Date('2020-01-01')
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Get analytics data
    const analytics = await db.siteAnalytics.findMany({
      where: {
        siteId: siteId,
        timestamp: {
          gte: startDate
        }
      }
    })

    // Aggregate data
    const views = analytics.filter(a => a.event === 'view').length
    const clicks = analytics.filter(a => a.event === 'click').length
    
    // Count unique visitors by IP or user agent
    const uniqueVisitors = new Set(
      analytics
        .filter(a => a.event === 'view')
        .map(a => `${a.userAgent || 'unknown'}-${a.country || 'unknown'}`)
    ).size

    // Get top referrers
    const referrerCounts = analytics
      .filter(a => a.referrer && a.event === 'view')
      .reduce((acc, a) => {
        acc[a.referrer!] = (acc[a.referrer!] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    const topReferrers = Object.entries(referrerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([referrer, count]) => ({ referrer, count }))

    // Get top countries
    const countryCounts = analytics
      .filter(a => a.country && a.event === 'view')
      .reduce((acc, a) => {
        acc[a.country!] = (acc[a.country!] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    const topCountries = Object.entries(countryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }))

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalViews: views,
          totalClicks: clicks,
          uniqueVisitors,
          topReferrers,
          topCountries
        },
        period,
        dateRange: {
          from: startDate.toISOString(),
          to: now.toISOString()
        }
      }
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}