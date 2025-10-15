/**
 * Xendit Webhook Handler
 * POST /api/payments/xendit/webhook - Handle Xendit payment notifications
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyWebhookSignature } from '@/lib/xendit'

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-signature') || ''
    const webhookToken = process.env.XENDIT_WEBHOOK_TOKEN || ''

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature, webhookToken)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)
    
    console.log('Xendit webhook received:', event.event_type, event.external_id)

    // Handle different event types
    switch (event.event_type) {
      case 'invoice.paid':
        await handleInvoicePaid(event)
        break
        
      case 'invoice.expired':
        await handleInvoiceExpired(event)
        break
        
      case 'invoice.failed':
        await handleInvoiceFailed(event)
        break
        
      case 'virtual_account.payment':
        await handleVirtualAccountPayment(event)
        break
        
      default:
        console.log('Unhandled webhook event type:', event.event_type)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleInvoicePaid(event: any) {
  try {
    const externalId = event.external_id
    const xenditInvoiceId = event.id
    const amountPaid = event.amount

    // Find payment record by invoice ID
    const payment = await db.userTemplatePurchase.findFirst({
      where: { xenditInvoiceId: event.id }
    })

    if (!payment) {
      console.error('Payment record not found for invoice_id:', event.id)
      return
    }

    // Update payment status
    await db.userTemplatePurchase.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED'
      }
    })

    // Process template payment
    await processTemplatePayment(payment, event)

    console.log('Payment processed successfully:', externalId)

  } catch (error) {
    console.error('Error handling invoice paid:', error)
  }
}

async function handleInvoiceExpired(event: any) {
  try {
    const externalId = event.external_id

    await db.userTemplatePurchase.updateMany({
      where: { xenditInvoiceId: event.id },
      data: {
        status: 'FAILED'
      }
    })

    console.log('Payment expired:', externalId)

  } catch (error) {
    console.error('Error handling invoice expired:', error)
  }
}

async function handleInvoiceFailed(event: any) {
  try {
    const externalId = event.external_id

    await db.userTemplatePurchase.updateMany({
      where: { xenditInvoiceId: event.id },
      data: {
        status: 'FAILED'
      }
    })

    console.log('Payment failed:', externalId)

  } catch (error) {
    console.error('Error handling invoice failed:', error)
  }
}

async function handleVirtualAccountPayment(event: any) {
  // Handle virtual account specific payments
  console.log('Virtual account payment received:', event)
}

async function processSubscriptionPayment(payment: any, event: any) {
  try {
    const metadata = payment.metadata as any
    const planId = metadata.planId
    const userId = payment.userId

    // Calculate subscription expiry (30 days from now)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)

    // Update user's plan
    await db.user.update({
      where: { id: userId },
      data: {
        plan: planId,
        planExpiry: expiryDate
      }
    })

    // TODO: Create subscription record when subscription model is added
    // await db.subscriptionPurchase.create({
    //   data: {
    //     userId,
    //     plan: planId,
    //     amountCents: payment.amount,
    //     currency: payment.currency,
    //     xenditInvoiceId: payment.xenditInvoiceId,
    //     purchasedAt: new Date(),
    //     expiresAt: expiryDate
    //   }
    // })

    console.log('Subscription activated for user:', userId, 'Plan:', planId)

  } catch (error) {
    console.error('Error processing subscription payment:', error)
  }
}

async function processTemplatePayment(payment: any, event: any) {
  try {
    const metadata = payment.metadata as any
    const templateId = metadata.templateId
    const userId = payment.userId

    // Template purchase record already exists and was updated above

    console.log('Template purchased by user:', userId, 'Template:', templateId)

  } catch (error) {
    console.error('Error processing template payment:', error)
  }
}