/**
 * QRISPaymentBlock Component
 * QRIS QR Code payment display for Indonesian e-wallets
 * Enhanced with clickable dialog interaction
 */

'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { QRISPaymentBlockProps } from '@/types'
import { cn } from '@/lib/utils'
import { Wallet, QrCode, CheckCircle2, Maximize2, ChevronRight } from 'lucide-react'
import { QRISPaymentDialog } from './QRISPaymentDialog'

interface QRISPaymentBlockComponentProps {
  props: QRISPaymentBlockProps
  className?: string
  isEditing?: boolean
}

// E-wallet logos with colors
const EWALLET_INFO: Record<string, { emoji: string; color: string }> = {
  'Gopay': { emoji: '💚', color: 'text-green-600' },
  'OVO': { emoji: '💜', color: 'text-purple-600' },
  'Dana': { emoji: '💙', color: 'text-blue-600' },
  'ShopeePay': { emoji: '🧡', color: 'text-orange-600' },
  'LinkAja': { emoji: '❤️', color: 'text-red-600' },
  'BCA Mobile': { emoji: '🔵', color: 'text-blue-700' },
  'Mandiri E-Cash': { emoji: '🔷', color: 'text-yellow-600' },
  'BNI Mobile Banking': { emoji: '🟠', color: 'text-orange-700' },
  'BRI Mobile Banking': { emoji: '🔶', color: 'text-blue-800' },
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

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenDialog = () => {
    if (!isEditing && qrisImage) {
      setIsDialogOpen(true)
    }
  }

  return (
    <>
      <Card className={cn(
        'w-full max-w-md mx-auto p-6 space-y-6 transition-all',
        !isEditing && qrisImage && 'cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-100',
        className
      )}>
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
            <QrCode className="w-6 h-6" />
            <h3 className="text-xl font-bold">QRIS Payment</h3>
          </div>
          {merchantName && (
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {merchantName}
            </p>
          )}
        </div>

        {/* QR Code - Clickable */}
        <div className="space-y-3">
          <div
            onClick={handleOpenDialog}
            className={cn(
              "relative bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 transition-all",
              !isEditing && qrisImage && "hover:border-blue-500 dark:hover:border-blue-400 group"
            )}
          >
            {qrisImage ? (
              <>
                <div className="aspect-square w-full max-w-xs mx-auto">
                  <img
                    src={qrisImage}
                    alt="QRIS QR Code"
                    className="w-full h-full object-contain transition-transform group-hover:scale-105"
                  />
                </div>

                {/* Hover Hint - Only show if not editing */}
                {!isEditing && (
                  <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center space-y-2">
                      <Maximize2 className="w-12 h-12 mx-auto" />
                      <p className="font-semibold text-sm">Klik untuk memperbesar</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square w-full max-w-xs mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <QrCode className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">Upload QRIS QR Code</p>
                </div>
              </div>
            )}

            {/* QRIS Logo Badge */}
            {qrisImage && (
              <div className="absolute top-2 right-2 bg-gradient-to-br from-red-500 to-red-600 px-3 py-1.5 rounded-lg shadow-md border-2 border-white dark:border-gray-800">
                <p className="text-xs font-bold text-white tracking-wide">QRIS</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        {showPaymentLogos && paymentMethods.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Wallet className="w-4 h-4" />
              <p className="text-xs font-semibold">Metode Pembayaran</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {paymentMethods.slice(0, 4).map((method) => {
                const info = EWALLET_INFO[method] || { emoji: '💳', color: 'text-gray-600' }
                return (
                  <div
                    key={method}
                    className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border border-gray-200 dark:border-gray-700"
                  >
                    <span className="text-base">{info.emoji}</span>
                    <span>{method}</span>
                  </div>
                )
              })}
              {paymentMethods.length > 4 && (
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800">
                  +{paymentMethods.length - 4} lainnya
                </div>
              )}
            </div>
          </div>
        )}

        {/* Call to Action Button - Only show if not editing and has QR */}
        {!isEditing && qrisImage && (
          <button
            onClick={handleOpenDialog}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 flex items-center justify-center gap-2"
          >
            <QrCode className="w-5 h-5" />
            Lihat Detail Pembayaran
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Instructions Preview - Only show if editing or no QR */}
        {(isEditing || !qrisImage) && (
          <>
            {instructions ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Cara Pembayaran
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed line-clamp-3">
                  {instructions}
                </p>
              </div>
            ) : (
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
          </>
        )}
      </Card>

      {/* Enhanced Dialog */}
      {!isEditing && (
        <QRISPaymentDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          qrisImage={qrisImage}
          merchantName={merchantName}
          paymentMethods={paymentMethods}
          instructions={instructions}
          showPaymentLogos={showPaymentLogos}
        />
      )}
    </>
  )
}
