/**
 * QRIS Payment Dialog
 * Mobile-optimized full-screen dialog for QRIS payments
 */

'use client'

import { useEffect, useState } from 'react'
import { X, QrCode, Wallet, CheckCircle2, Copy, Download, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QRISPaymentDialogProps {
  isOpen: boolean
  onClose: () => void
  qrisImage: string
  merchantName: string
  paymentMethods: string[]
  instructions?: string
  showPaymentLogos?: boolean
}

// E-wallet logos
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

export function QRISPaymentDialog({
  isOpen,
  onClose,
  qrisImage,
  merchantName,
  paymentMethods,
  instructions,
  showPaymentLogos = true
}: QRISPaymentDialogProps) {
  const [isClosing, setIsClosing] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  if (!isOpen && !isClosing) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm',
        'flex items-end sm:items-center justify-center',
        'transition-opacity duration-300',
        isClosing ? 'opacity-0' : 'opacity-100'
      )}
      onClick={handleClose}
    >
      <div
        className={cn(
          'w-full sm:max-w-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800',
          'sm:rounded-2xl sm:border-2 sm:border-white/20',
          'shadow-2xl max-h-[95vh] sm:max-h-[90vh]',
          'flex flex-col overflow-hidden',
          'transition-transform duration-300',
          isClosing
            ? 'translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0'
            : 'translate-y-0 sm:scale-100'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 pb-8 text-white">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon & Title */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Scan untuk Bayar</h2>
              {merchantName && (
                <p className="text-sm text-white/80 mt-1">{merchantName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* QR Code Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            {qrisImage ? (
              <div className="relative">
                {/* QR Code */}
                <div className="aspect-square w-full max-w-sm mx-auto bg-white p-4 rounded-xl">
                  <img
                    src={qrisImage}
                    alt="QRIS QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* QRIS Logo Badge */}
                <div className="absolute top-2 right-2 bg-white px-3 py-1.5 rounded-lg shadow-md border-2 border-red-500">
                  <p className="text-sm font-bold text-red-600">QRIS</p>
                </div>

                {/* Scan Instruction */}
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Arahkan kamera ke QR Code
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Gunakan aplikasi e-wallet favorit kamu
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-square w-full max-w-sm mx-auto bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <QrCode className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">QR Code not available</p>
                </div>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          {showPaymentLogos && paymentMethods.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Wallet className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-semibold">Bisa bayar pakai:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method}
                    className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <span className="text-lg">{EWALLET_LOGOS[method] || '💳'}</span>
                    <span className="text-gray-700 dark:text-gray-300">{method}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {instructions ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Cara Pembayaran
              </p>
              <div className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed whitespace-pre-line">
                {instructions}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-200 dark:border-gray-600 rounded-xl p-4">
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  Langkah-langkah:
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-7 text-gray-600 dark:text-gray-400">
                  <li>Buka aplikasi e-wallet kamu</li>
                  <li>Pilih menu "Scan QR" atau "QRIS"</li>
                  <li>Arahkan kamera ke QR Code di atas</li>
                  <li>Konfirmasi nominal pembayaran</li>
                  <li>Selesaikan transaksi</li>
                </ol>
              </div>
            </div>
          )}

          {/* Security Note */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
            <p className="text-xs text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Pembayaran aman & terpercaya oleh Bank Indonesia
            </p>
          </div>
        </div>

        {/* Footer Actions - Optional */}
        {/* <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div> */}
      </div>
    </div>
  )
}
