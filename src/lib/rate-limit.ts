/**
 * Rate Limiting Utility
 * Secure rate limiting for admin endpoints
 */

interface RateLimitEntry {
  count: number
  resetTime: number
  suspendedUntil?: number
}

// In-memory store (in production, use Redis)
const rateLimitStore = new Map<string, RateLimitEntry>()

interface RateLimitConfig {
  windowMs: number     // Time window in milliseconds
  maxRequests: number  // Max requests per window
  suspensionMs?: number // Suspension time for exceeding limit
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000,   // 1 minute
  maxRequests: 10,       // 10 requests per minute
  suspensionMs: 5 * 60 * 1000  // 5 minutes suspension
}

// Different limits for different endpoints
export const RATE_LIMITS = {
  admin: {
    windowMs: 60 * 1000,
    maxRequests: 20,
    suspensionMs: 10 * 60 * 1000 // 10 min suspension for admin abuse
  },
  auth: {
    windowMs: 60 * 1000,
    maxRequests: 5,
    suspensionMs: 15 * 60 * 1000 // 15 min suspension for auth abuse
  },
  api: {
    windowMs: 60 * 1000,
    maxRequests: 60,
    suspensionMs: 2 * 60 * 1000  // 2 min suspension
  }
} as const

export function checkRateLimit(
  identifier: string, 
  config: RateLimitConfig = defaultConfig
): { 
  allowed: boolean
  remaining: number
  resetTime: number
  suspended?: boolean
} {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // Check if suspended
  if (entry?.suspendedUntil && now < entry.suspendedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.suspendedUntil,
      suspended: true
    }
  }

  // Initialize or reset if window expired
  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs
    }
    rateLimitStore.set(identifier, newEntry)
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime
    }
  }

  // Increment count
  entry.count++

  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    // Apply suspension if configured
    if (config.suspensionMs) {
      entry.suspendedUntil = now + config.suspensionMs
      rateLimitStore.set(identifier, entry)
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.suspendedUntil,
        suspended: true
      }
    }

    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    }
  }

  // Update entry
  rateLimitStore.set(identifier, entry)

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime
  }
}

// Cleanup expired entries (run periodically)
export function cleanupRateLimit() {
  const now = Date.now()
  
  for (const [key, entry] of rateLimitStore.entries()) {
    // Remove if reset time passed and not suspended
    if (now > entry.resetTime && (!entry.suspendedUntil || now > entry.suspendedUntil)) {
      rateLimitStore.delete(key)
    }
  }
}

// Get identifier from request (IP + User ID if available)
export function getRateLimitIdentifier(
  request: Request, 
  userId?: string
): string {
  // Get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  // Combine IP and user ID for more granular control
  return userId ? `${ip}:${userId}` : ip
}

// Middleware function for Next.js API routes
export function withRateLimit(
  handler: Function,
  config: RateLimitConfig = defaultConfig
) {
  return async (request: Request, context?: any) => {
    try {
      const identifier = getRateLimitIdentifier(request)
      const result = checkRateLimit(identifier, config)

      if (!result.allowed) {
        const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000)
        
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: result.suspended 
                ? 'Account temporarily suspended due to excessive requests'
                : 'Too many requests. Please try again later.',
              retryAfter
            }
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': retryAfter.toString(),
              'X-RateLimit-Limit': config.maxRequests.toString(),
              'X-RateLimit-Remaining': result.remaining.toString(),
              'X-RateLimit-Reset': result.resetTime.toString()
            }
          }
        )
      }

      // Add rate limit headers to successful responses
      const response = await handler(request, context)
      
      if (response instanceof Response) {
        response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
        response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
        response.headers.set('X-RateLimit-Reset', result.resetTime.toString())
      }

      return response
    } catch (error) {
      console.error('Rate limit middleware error:', error)
      return await handler(request, context) // Fallback to original handler
    }
  }
}

// Schedule cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimit, 5 * 60 * 1000)
}