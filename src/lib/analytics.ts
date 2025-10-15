/**
 * Analytics Utilities
 * Track and analyze site performance
 */

import { db } from './db'

export interface AnalyticsEvent {
  siteId: string
  event: 'view' | 'click' | 'conversion'
  target?: string
  referrer?: string
  userAgent?: string
  country?: string
  city?: string
  device?: string
  browser?: string
  timestamp: Date
}

export interface AnalyticsData {
  totalViews: number
  totalClicks: number
  conversionRate: number
  topLinks: Array<{
    target: string
    clicks: number
    percentage: number
  }>
  topReferrers: Array<{
    referrer: string
    views: number
    percentage: number
  }>
  deviceBreakdown: Array<{
    device: string
    views: number
    percentage: number
  }>
  browserBreakdown: Array<{
    browser: string
    views: number
    percentage: number
  }>
  locationBreakdown: Array<{
    country: string
    views: number
    percentage: number
  }>
  dailyViews: Array<{
    date: string
    views: number
    clicks: number
  }>
  monthlyViews: Array<{
    month: string
    views: number
    clicks: number
  }>
}

export async function trackEvent(event: AnalyticsEvent) {
  try {
    await db.siteAnalytics.create({
      data: {
        siteId: event.siteId,
        event: event.event,
        target: event.target,
        referrer: event.referrer,
        userAgent: event.userAgent,
        country: event.country,
        city: event.city,
        timestamp: event.timestamp,
      }
    })
  } catch (error) {
    console.error('Failed to track analytics event:', error)
  }
}

export async function getSiteAnalytics(
  siteId: string, 
  dateRange: { from: Date; to: Date }
): Promise<AnalyticsData> {
  try {
    const whereClause = {
      siteId,
      timestamp: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    }

    // Get basic metrics
    const [totalViews, totalClicks, allEvents] = await Promise.all([
      db.siteAnalytics.count({
        where: { ...whereClause, event: 'view' }
      }),
      db.siteAnalytics.count({
        where: { ...whereClause, event: 'click' }
      }),
      db.siteAnalytics.findMany({
        where: whereClause,
        orderBy: { timestamp: 'desc' },
      })
    ])

    const conversionRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0

    // Top links (clicks)
    const clickEvents = allEvents.filter(e => e.event === 'click' && e.target)
    const linkClicks = clickEvents.reduce((acc, event) => {
      const target = event.target || 'Unknown'
      acc[target] = (acc[target] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topLinks = Object.entries(linkClicks)
      .map(([target, clicks]) => ({
        target,
        clicks: clicks as number,
        percentage: totalClicks > 0 ? ((clicks as number) / totalClicks) * 100 : 0
      }))
      .sort((a, b) => (b.clicks as number) - (a.clicks as number))
      .slice(0, 10)

    // Top referrers
    const viewEvents = allEvents.filter(e => e.event === 'view' && e.referrer)
    const referrerViews = viewEvents.reduce((acc, event) => {
      const referrer = event.referrer || 'Direct'
      const domain = referrer === 'Direct' ? 'Direct' : getDomain(referrer)
      acc[domain] = (acc[domain] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topReferrers = Object.entries(referrerViews)
      .map(([referrer, views]) => ({
        referrer,
        views: views as number,
        percentage: totalViews > 0 ? ((views as number) / totalViews) * 100 : 0
      }))
      .sort((a, b) => (b.views as number) - (a.views as number))
      .slice(0, 10)

    // Device breakdown (TODO: implement when device field is added to schema)
    const deviceBreakdown: Array<{device: string, views: number, percentage: number}> = []

    // Browser breakdown (TODO: implement when browser field is added to schema)
    const browserBreakdown: Array<{browser: string, views: number, percentage: number}> = []

    // Location breakdown
    const locationViews = allEvents
      .filter(e => e.event === 'view')
      .reduce((acc, event) => {
        const country = event.country || 'Unknown'
        acc[country] = (acc[country] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    const locationBreakdown = Object.entries(locationViews)
      .map(([country, views]) => ({
        country,
        views: views as number,
        percentage: totalViews > 0 ? ((views as number) / totalViews) * 100 : 0
      }))
      .sort((a, b) => (b.views as number) - (a.views as number))

    // Daily views for the last 30 days
    const dailyData = await getDailyAnalytics(siteId, dateRange)
    
    // Monthly views for the last 12 months
    const monthlyData = await getMonthlyAnalytics(siteId)

    return {
      totalViews,
      totalClicks,
      conversionRate,
      topLinks,
      topReferrers,
      deviceBreakdown,
      browserBreakdown,
      locationBreakdown,
      dailyViews: dailyData,
      monthlyViews: monthlyData,
    }

  } catch (error) {
    console.error('Failed to get site analytics:', error)
    throw error
  }
}

async function getDailyAnalytics(siteId: string, dateRange: { from: Date; to: Date }) {
  const dailyStats = await db.siteAnalytics.groupBy({
    by: ['timestamp'],
    where: {
      siteId,
      timestamp: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    },
    _count: {
      event: true,
    },
  })

  // Group by date and event type
  const dailyData: Record<string, { views: number; clicks: number }> = {}
  
  for (const stat of dailyStats) {
    const date = stat.timestamp.toISOString().split('T')[0]
    if (!dailyData[date]) {
      dailyData[date] = { views: 0, clicks: 0 }
    }
  }

  // Get actual counts
  const events = await db.siteAnalytics.findMany({
    where: {
      siteId,
      timestamp: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    },
    select: {
      event: true,
      timestamp: true,
    },
  })

  events.forEach(event => {
    const date = event.timestamp.toISOString().split('T')[0]
    if (!dailyData[date]) {
      dailyData[date] = { views: 0, clicks: 0 }
    }
    
    if (event.event === 'view') {
      dailyData[date].views++
    } else if (event.event === 'click') {
      dailyData[date].clicks++
    }
  })

  return Object.entries(dailyData)
    .map(([date, data]) => ({
      date,
      views: data.views,
      clicks: data.clicks,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

async function getMonthlyAnalytics(siteId: string) {
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

  const events = await db.siteAnalytics.findMany({
    where: {
      siteId,
      timestamp: {
        gte: twelveMonthsAgo,
      },
    },
    select: {
      event: true,
      timestamp: true,
    },
  })

  const monthlyData: Record<string, { views: number; clicks: number }> = {}

  events.forEach(event => {
    const month = event.timestamp.toISOString().slice(0, 7) // YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = { views: 0, clicks: 0 }
    }
    
    if (event.event === 'view') {
      monthlyData[month].views++
    } else if (event.event === 'click') {
      monthlyData[month].clicks++
    }
  })

  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      views: data.views,
      clicks: data.clicks,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

function getDomain(url: string): string {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname
  } catch {
    return 'Unknown'
  }
}

export function parseUserAgent(userAgent: string) {
  const device = getDevice(userAgent)
  const browser = getBrowser(userAgent)
  
  return { device, browser }
}

function getDevice(userAgent: string): string {
  if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    if (/iPad/i.test(userAgent)) return 'Tablet'
    return 'Mobile'
  }
  return 'Desktop'
}

function getBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('Opera')) return 'Opera'
  return 'Other'
}

export async function getLocationFromIP(ip: string): Promise<{ country?: string; city?: string }> {
  try {
    // You can integrate with IP geolocation services like:
    // - ipapi.co
    // - ip-api.com
    // - MaxMind GeoIP
    
    // For now, return empty data
    // In production, you would make an API call to get location data
    return {}
  } catch (error) {
    console.error('Failed to get location from IP:', error)
    return {}
  }
}