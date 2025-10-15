/**
 * Create Payment Invoice API
 * POST /api/payments/create-invoice - Create Xendit invoice for subscription or template purchase
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { createInvoice, generateExternalId, SUBSCRIPTION_PLANS, TEMPLATE_PRICING, PAYMENT_METHODS } from '@/lib/xendit'
import { z } from 'zod'

const CreateInvoiceSchema = z.object({
  type: z.enum(['subscription', 'template']),
  planId: z.string().optional(),
  templateId: z.string().optional(),
  paymentMethods: z.array(z.string()).min(1, 'At least one payment method required')
})

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
      }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = CreateInvoiceSchema.parse(body)

    let amount: number
    let description: string
    let metadata: Record<string, any>

    if (validatedData.type === 'subscription') {
      if (!validatedData.planId) {
        return NextResponse.json({
          success: false,
          error: { code: 'MISSING_PLAN', message: 'Plan ID is required for subscription' },
        }, { status: 400 })
      }

      const plan = SUBSCRIPTION_PLANS[validatedData.planId.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS]
      if (!plan) {
        return NextResponse.json({
          success: false,
          error: { code: 'INVALID_PLAN', message: 'Invalid subscription plan' },
        }, { status: 400 })
      }

      amount = plan.price
      description = `LinkQ ${plan.name} - Monthly Subscription`
      metadata = {
        type: 'subscription',
        planId: validatedData.planId.toUpperCase(),
        userId: session.user.id,
        userEmail: session.user.email
      }

    } else if (validatedData.type === 'template') {
      if (!validatedData.templateId) {
        return NextResponse.json({
          success: false,
          error: { code: 'MISSING_TEMPLATE', message: 'Template ID is required for template purchase' },
        }, { status: 400 })
      }

      // Get template details
      const template = await db.template.findUnique({
        where: { id: validatedData.templateId },
        include: {
          versions: {
            where: { isActive: true },
            take: 1
          }
        }
      })

      if (!template || !template.versions[0]) {
        return NextResponse.json({
          success: false,
          error: { code: 'TEMPLATE_NOT_FOUND', message: 'Template not found' },
        }, { status: 404 })
      }

      const templateVersion = template.versions[0]
      if (!templateVersion.isPaid) {
        return NextResponse.json({
          success: false,
          error: { code: 'TEMPLATE_FREE', message: 'This template is free' },
        }, { status: 400 })
      }

      amount = templateVersion.priceCents || 0
      description = `LinkQ Template: ${template.name}`
      metadata = {
        type: 'template',
        templateId: validatedData.templateId,
        templateName: template.name,
        userId: session.user.id,
        userEmail: session.user.email
      }

    } else {
      return NextResponse.json({
        success: false,
        error: { code: 'INVALID_TYPE', message: 'Invalid payment type' },
      }, { status: 400 })
    }

    // Generate external ID
    const externalId = generateExternalId(`linkq_${validatedData.type}`)

    // Create invoice with Xendit
    const invoice = await createInvoice({
      externalId,
      amount,
      currency: 'IDR',
      description,
      userId: session.user.id,
      userEmail: session.user.email || '',
      userName: session.user.name || 'LinkQ User',
      paymentMethods: validatedData.paymentMethods,
      successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?external_id=${externalId}`,
      failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure?external_id=${externalId}`,
      metadata
    })

    // Store payment record in database for template purchases
    if (validatedData.type === 'template') {
      await db.userTemplatePurchase.create({
        data: {
          userId: session.user.id,
          templateId: validatedData.templateId!,
          priceCents: amount,
          currency: 'IDR',
          xenditInvoiceId: invoice.id,
          status: 'PENDING'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        invoiceId: invoice.id,
        externalId,
        invoiceUrl: invoice.invoiceUrl,
        amount,
        currency: 'IDR',
        description,
        expiryDate: invoice.expiryDate
      }
    })

  } catch (error) {
    console.error('Create invoice API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.issues,
        },
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create payment invoice',
      },
    }, { status: 500 })
  }
}