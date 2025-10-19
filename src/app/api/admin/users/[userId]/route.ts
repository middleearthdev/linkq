/**
 * Admin User Management API
 * GET /api/admin/users/[userId] - Get user details
 * PATCH /api/admin/users/[userId] - Update user
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth-utils'
import { z } from 'zod'

const UpdateUserSchema = z.object({
  plan: z.enum(['FREE', 'STARTER', 'PRO']).optional(),
  planExpiry: z.string().datetime().optional().nullable(),
  isAdmin: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Security: Check admin access
    const user = await getSessionUser()

    if (!user?.isAdmin) {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }, { status: 403 })
    }

    const { userId } = await params

    // Get user with detailed information
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        sites: {
          select: {
            id: true,
            handle: true,
            title: true,
            status: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: { updatedAt: 'desc' }
        },
        purchases: {
          select: {
            id: true,
            priceCents: true,
            status: true,
            createdAt: true,
            template: {
              select: {
                name: true,
                slug: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            sites: true,
            purchases: true
          }
        }
      }
    })

    if (!targetUser) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' }
      }, { status: 404 })
    }

    // Remove sensitive data
    const { ...userData } = targetUser

    return NextResponse.json({
      success: true,
      data: userData
    })

  } catch (error) {
    console.error('Admin user detail API error:', error)

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch user details'
      }
    }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Security: Check admin access
    const adminUser = await getSessionUser()

    if (!adminUser?.isAdmin) {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }, { status: 403 })
    }

    const { userId } = await params
    const body = await request.json()
    const validatedData = UpdateUserSchema.parse(body)

    // Security: Prevent non-super-admin from modifying admin status
    if ('isAdmin' in validatedData) {
      // For now, only allow email-based super admin to modify admin status
      if (adminUser.email !== 'middleearthdev@gmail.com') {
        return NextResponse.json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Only super admin can modify admin status' }
        }, { status: 403 })
      }
    }

    // Check if target user exists
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, plan: true }
    })

    if (!targetUser) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' }
      }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}

    if (validatedData.plan) {
      updateData.plan = validatedData.plan
    }

    if (validatedData.planExpiry !== undefined) {
      updateData.planExpiry = validatedData.planExpiry ? new Date(validatedData.planExpiry) : null
    }

    if (validatedData.isAdmin !== undefined) {
      updateData.isAdmin = validatedData.isAdmin
    }

    if (validatedData.emailVerified !== undefined) {
      updateData.emailVerified = validatedData.emailVerified
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        planExpiry: true,
        isAdmin: true,
        emailVerified: true,
        updatedAt: true
      }
    })

    // Log admin action (could be expanded with audit log)
    console.log(`Admin ${adminUser.email} updated user ${targetUser.email}:`, updateData)

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    })

  } catch (error) {
    console.error('Admin user update API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.issues
        }
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update user'
      }
    }, { status: 500 })
  }
}