/**
 * Analytics Tracking Script
 * Client-side script for tracking page views and clicks
 */

"use client"

import { useEffect } from 'react'

interface AnalyticsScriptProps {
  siteId: string
  apiUrl?: string
}

export function AnalyticsScript({ siteId, apiUrl = '/api/analytics/track' }: AnalyticsScriptProps) {
  useEffect(() => {
    // Track page view
    trackEvent('view')

    // Track link clicks
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')
      
      if (link && link.href) {
        // Only track external links or specific tracking attributes
        if (link.hasAttribute('data-track') || isExternalLink(link.href)) {
          trackEvent('click', link.href)
        }
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [siteId])

  const trackEvent = async (event: 'view' | 'click' | 'conversion', target?: string) => {
    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteId,
          event,
          target,
          referrer: document.referrer || undefined,
        }),
      })
    } catch (error) {
      // Silently fail to avoid breaking the page
      console.debug('Analytics tracking failed:', error)
    }
  }

  const isExternalLink = (href: string): boolean => {
    try {
      const url = new URL(href)
      return url.hostname !== window.location.hostname
    } catch {
      return false
    }
  }

  return null // This component doesn't render anything
}

// Export utility functions for manual tracking
export const trackAnalyticsEvent = async (
  siteId: string, 
  event: 'view' | 'click' | 'conversion', 
  target?: string,
  apiUrl = '/api/analytics/track'
) => {
  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        siteId,
        event,
        target,
        referrer: document.referrer || undefined,
      }),
    })
  } catch (error) {
    console.debug('Analytics tracking failed:', error)
  }
}