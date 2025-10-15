/**
 * Xendit Payment Gateway Configuration
 */

import { Xendit } from 'xendit-node'

// Lazy initialization for build compatibility
let xenditClient: any = null

const getXenditClient = () => {
  if (!xenditClient) {
    if (!process.env.XENDIT_SECRET_KEY) {
      throw new Error('XENDIT_SECRET_KEY environment variable is required')
    }
    xenditClient = new Xendit({
      secretKey: process.env.XENDIT_SECRET_KEY
    })
  }
  return xenditClient
}

export const xendit = {
  get Invoice() { return getXenditClient().Invoice },
  get VirtualAccount() { return getXenditClient().VirtualAccount },
  get EWallet() { return getXenditClient().EWallet },
  get Webhook() { return getXenditClient().Webhook }
}

// Payment method types for Indonesia
export const PAYMENT_METHODS = {
  VIRTUAL_ACCOUNT: {
    BCA: 'BCA',
    BNI: 'BNI', 
    BRI: 'BRI',
    MANDIRI: 'MANDIRI',
    PERMATA: 'PERMATA',
    CIMB: 'CIMB'
  },
  EWALLET: {
    OVO: 'OVO',
    DANA: 'DANA',
    LINKAJA: 'LINKAJA',
    SHOPEEPAY: 'SHOPEEPAY',
    GOPAY: 'GOPAY'
  },
  CREDIT_CARD: 'CREDIT_CARD',
  RETAIL_OUTLET: {
    ALFAMART: 'ALFAMART',
    INDOMARET: 'INDOMARET'
  }
}

// Subscription plans with IDR pricing
export const SUBSCRIPTION_PLANS = {
  STARTER: {
    id: 'starter',
    name: 'Starter Plan',
    price: 49000, // IDR 49,000 per month
    currency: 'IDR',
    interval: 'monthly',
    features: [
      'Premium templates',
      'Basic analytics',
      'Remove LinkQ branding',
      'CTA blocks',
      'Priority support'
    ]
  },
  PRO: {
    id: 'pro',
    name: 'Pro Plan', 
    price: 99000, // IDR 99,000 per month
    currency: 'IDR',
    interval: 'monthly',
    features: [
      'All Starter features',
      'Advanced analytics',
      'Custom domains',
      'Custom CSS',
      'Gallery blocks',
      'Analytics blocks',
      'White-label solution'
    ]
  }
}

// Template pricing for one-time purchases
export const TEMPLATE_PRICING = {
  AURORA: {
    price: 129000, // IDR 129,000
    currency: 'IDR'
  },
  PROFESSIONAL: {
    price: 199000, // IDR 199,000  
    currency: 'IDR'
  }
}

export interface PaymentData {
  amount: number
  currency: string
  description: string
  userId: string
  userEmail: string
  userName: string
  metadata: Record<string, any>
}

export interface CreateInvoiceParams extends PaymentData {
  externalId: string
  paymentMethods: string[]
  successRedirectUrl: string
  failureRedirectUrl: string
}

export const createInvoice = async (params: CreateInvoiceParams) => {
  try {
    // TODO: Fix Xendit API parameter types
    const invoice = await xendit.Invoice.createInvoice({
      external_id: params.externalId,
      amount: params.amount,
      currency: params.currency,
      description: params.description,
      customer: {
        email: params.userEmail,
        given_names: params.userName
      },
      customer_notification_preference: {
        invoice_created: ['email'],
        invoice_paid: ['email']
      },
      payment_methods: params.paymentMethods,
      success_redirect_url: params.successRedirectUrl,
      failure_redirect_url: params.failureRedirectUrl,
      metadata: params.metadata
    })

    return invoice
  } catch (error) {
    console.error('Xendit create invoice error:', error)
    throw error
  }
}

export const createVirtualAccount = async (params: PaymentData & {
  externalId: string
  bankCode: string
  expectedAmount: number
}) => {
  try {
    const va = await xendit.VirtualAccount.createVirtualAccount({
      externalId: params.externalId,
      bankCode: params.bankCode,
      name: params.userName,
      expectedAmount: params.expectedAmount,
      description: params.description,
      metadata: params.metadata
    })

    return va
  } catch (error) {
    console.error('Xendit create VA error:', error)
    throw error
  }
}

export const createEWalletCharge = async (params: PaymentData & {
  externalId: string
  ewalletType: string
  callbackUrl: string
  redirectUrl: string
}) => {
  try {
    const charge = await xendit.EWallet.createEWalletCharge({
      referenceId: params.externalId,
      currency: params.currency,
      amount: params.amount,
      checkoutMethod: 'ONE_TIME_PAYMENT',
      channelCode: params.ewalletType,
      channelProperties: {
        successRedirectUrl: params.redirectUrl,
        failureRedirectUrl: params.redirectUrl,
      },
      metadata: params.metadata
    })

    return charge
  } catch (error) {
    console.error('Xendit create e-wallet charge error:', error)
    throw error
  }
}

export const verifyWebhookSignature = (
  rawBody: string,
  signature: string,
  webhookToken: string
): boolean => {
  try {
    return xendit.Webhook.verifyWebhookSignature(rawBody, signature, webhookToken)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return false
  }
}

export const generateExternalId = (prefix: string): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}_${random}`
}