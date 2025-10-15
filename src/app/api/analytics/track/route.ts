/**
 * Analytics Tracking API
 * POST /api/analytics/track - Track analytics events
 */

import { NextRequest, NextResponse } from 'next/server'
import { trackEvent, parseUserAgent, getLocationFromIP } from '@/lib/analytics'
import { z } from 'zod'

const TrackEventSchema = z.object({
  siteId: z.string().min(1, 'Site ID is required'),
  event: z.enum(['view', 'click', 'conversion']),
  target: z.string().optional(),
  referrer: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = TrackEventSchema.parse(body)

    // Get request metadata
    const userAgent = request.headers.get('user-agent') || ''
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0] || realIP || ''

    // Parse user agent for device and browser info
    const { device, browser } = parseUserAgent(userAgent)

    // Get location from IP (optional)
    const location = await getLocationFromIP(ip)

    // Track the event
    await trackEvent({
      siteId: validatedData.siteId,
      event: validatedData.event,
      target: validatedData.target,
      referrer: validatedData.referrer || request.headers.get('referer') || undefined,
      userAgent,
      country: location.country,
      city: location.city,
      device,
      browser,
      timestamp: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
    })

  } catch (error) {
    console.error('Analytics tracking API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid tracking data',
          details: error.issues,
        },
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to track event',
      },
    }, { status: 500 })
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}