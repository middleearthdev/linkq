/**
 * Payment Status API
 * GET /api/payments/status - Get payment status by external_id
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const externalId = searchParams.get('external_id')

    if (!externalId) {
      return NextResponse.json({
        success: false,
        error: { code: 'MISSING_EXTERNAL_ID', message: 'External ID is required' },
      }, { status: 400 })
    }

    // Get session (optional for status check)
    const session = await auth.api.getSession({
      headers: request.headers
    })

    // Find payment record by Xendit invoice ID
    const payment = await db.userTemplatePurchase.findFirst({
      where: { xenditInvoiceId: externalId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        template: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json({
        success: false,
        error: { code: 'PAYMENT_NOT_FOUND', message: 'Payment not found' },
      }, { status: 404 })
    }

    // If user is authenticated, check if they own this payment
    if (session && payment.userId !== session.user.id) {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Access denied' },
      }, { status: 403 })
    }

    const response = {
      id: payment.id,
      xenditInvoiceId: payment.xenditInvoiceId,
      status: payment.status,
      type: 'template',
      amount: payment.priceCents,
      currency: payment.currency,
      template: payment.template,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      user: payment.user,
    }

    return NextResponse.json({
      success: true,
      data: response,
    })

  } catch (error) {
    console.error('Payment status API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch payment status',
      },
    }, { status: 500 })
  }
}