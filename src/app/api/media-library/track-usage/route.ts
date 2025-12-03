/**
 * Media Library Usage Tracking API
 * Track when images are added, changed, or removed from blocks
 *
 * Based on: MEDIA_LIBRARY_CONTEXT.md
 * POST /api/media-library/track-usage
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

const GRACE_PERIOD_DAYS = 30

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    // 2. Parse request body
    const body = await req.json()
    const { action, imageUrl, oldImageUrl, referenceId } = body

    if (!action || !referenceId) {
      return NextResponse.json({
        error: 'Missing required fields: action, referenceId'
      }, { status: 400 })
    }

    if (!['add', 'remove', 'change'].includes(action)) {
      return NextResponse.json({
        error: 'Invalid action. Must be: add, remove, or change'
      }, { status: 400 })
    }

    const updatedImages: any[] = []

    // 3. Handle 'remove' or 'change' - decrement old image usage
    if ((action === 'remove' || action === 'change') && oldImageUrl) {
      const oldImage = await prisma.mediaLibrary.findFirst({
        where: { userId, url: oldImageUrl }
      })

      if (oldImage) {
        const newUsageCount = Math.max(0, oldImage.usageCount - 1)
        const updatedUsedIn = oldImage.usedIn.filter(id => id !== referenceId)

        const updated = await prisma.mediaLibrary.update({
          where: { id: oldImage.id },
          data: {
            usageCount: newUsageCount,
            usedIn: updatedUsedIn,
            // Mark for deletion if usage drops to 0
            markedForDeletion: newUsageCount === 0,
            deleteAfter: newUsageCount === 0
              ? new Date(Date.now() + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000)
              : null
          }
        })

        updatedImages.push(updated)

        console.log(`📉 Image usage decreased: ${oldImage.filename}`)
        console.log(`   Usage: ${oldImage.usageCount} → ${newUsageCount}`)
        if (newUsageCount === 0) {
          console.log(`   ⚠️  Marked for deletion (${GRACE_PERIOD_DAYS} days grace)`)
        }
      }
    }

    // 4. Handle 'add' or 'change' - increment new image usage
    if ((action === 'add' || action === 'change') && imageUrl) {
      const newImage = await prisma.mediaLibrary.findFirst({
        where: { userId, url: imageUrl }
      })

      if (newImage) {
        // Check if reference already exists (prevent double-counting)
        const alreadyTracked = newImage.usedIn.includes(referenceId)

        const updated = await prisma.mediaLibrary.update({
          where: { id: newImage.id },
          data: {
            usageCount: alreadyTracked ? newImage.usageCount : { increment: 1 },
            usedIn: alreadyTracked ? newImage.usedIn : { push: referenceId },
            lastUsedAt: new Date(),
            // Cancel deletion if it was marked
            markedForDeletion: false,
            deleteAfter: null
          }
        })

        updatedImages.push(updated)

        console.log(`📈 Image usage increased: ${newImage.filename}`)
        console.log(`   Usage: ${newImage.usageCount} → ${updated.usageCount}`)
        if (newImage.markedForDeletion) {
          console.log(`   ✅ Deletion cancelled`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      updatedImages,
      message: `Successfully tracked '${action}' action`
    })

  } catch (error) {
    console.error('Track usage error:', error)

    return NextResponse.json({
      error: 'Failed to track usage',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
