/**
 * Middleware for authentication and route protection
 */

import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/api/auth',
    '/api/templates',
    '/api/sites',
    '/api/blocks',
    '/api/analytics/track',
    '/pricing',
    '/payment',
  ]

  // Check if the route is public or an API route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  )

  // Allow access to bio link pages (dynamic routes like /username)
  const isBioLinkPage = pathname.match(/^\/[a-zA-Z0-9_-]+$/) && pathname !== '/'

  // Allow access to static files
  const isStaticFile = pathname.includes('.') || pathname.startsWith('/_next')

  if (isPublicRoute || isBioLinkPage || isStaticFile) {
    return NextResponse.next()
  }

  // For protected routes, check for session cookie
  const sessionCookie = request.cookies.get('linkq-session')
  
  if (!sessionCookie) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}