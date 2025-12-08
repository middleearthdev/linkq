/**
 * QRISPaymentBlock Component
 * QRIS QR Code payment display for Indonesian e-wallets
 */

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { QRISPaymentBlockProps } from '@/types'
import { cn } from '@/lib/utils'
import { Wallet, QrCode, CheckCircle2 } from 'lucide-react'

interface QRISPaymentBlockComponentProps {
  props: QRISPaymentBlockProps
  className?: string
  isEditing?: boolean
}

// E-wallet logos (using emojis for now, can be replaced with actual logos)
const EWALLET_LOGOS: Record<string, string> = {
  'Gopay': '💚',
  'OVO': '💜',
  'Dana': '💙',
  'ShopeePay': '🧡',
  'LinkAja': '❤️',
  'BCA Mobile': '🔵',
  'Mandiri E-Cash': '🔷',
  'BNI Mobile Banking': '🟠',
  'BRI Mobile Banking': '🔶',
}

export function QRISPaymentBlock({
  props,
  className,
  isEditing = false
}: QRISPaymentBlockComponentProps) {
  const {
    qrisImage,
    merchantName,
    paymentMethods = ['Gopay', 'OVO', 'Dana', 'ShopeePay'],
    instructions,
    showPaymentLogos = true,
  } = props

  return (
    <Card className={cn('w-full max-w-md mx-auto p-6 space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
          <QrCode className="w-6 h-6" />
          <h3 className="text-xl font-bold">QRIS Payment</h3>
        </div>
        {merchantName && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {merchantName}
          </p>
        )}
      </div>

      {/* QR Code */}
      <div className="space-y-3">
        <div className="relative bg-white p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700">
          {qrisImage ? (
            <div className="aspect-square w-full max-w-xs mx-auto">
              <img
                src={qrisImage}
                alt="QRIS QR Code"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="aspect-square w-full max-w-xs mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <QrCode className="w-16 h-16 mx-auto mb-2" />
                <p className="text-sm">Upload QRIS QR Code</p>
              </div>
            </div>
          )}

          {/* QRIS Logo Overlay */}
          <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-bold text-red-600">QRIS</p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      {showPaymentLogos && paymentMethods.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Wallet className="w-4 h-4" />
            <p className="text-xs font-semibold">Metode Pembayaran</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {paymentMethods.map((method) => (
              <div
                key={method}
                className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5"
              >
                <span>{EWALLET_LOGOS[method] || '💳'}</span>
                <span>{method}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {instructions && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
          <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Cara Pembayaran
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
            {instructions}
          </p>
        </div>
      )}

      {/* Default Instructions if not provided */}
      {!instructions && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Scan QR code dengan aplikasi e-wallet kamu untuk melakukan pembayaran
          </p>
        </div>
      )}

      {/* Security Note */}
      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-green-500" />
          Aman & Terpercaya oleh Bank Indonesia
        </p>
      </div>
    </Card>
  )
}
