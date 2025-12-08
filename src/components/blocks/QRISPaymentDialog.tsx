/**
 * QRIS Payment Dialog - Simple & Clean
 * Mobile-optimized dialog without hydration errors
 */

'use client'

import { useEffect, useState } from 'react'
import {
  X, QrCode, Wallet, CheckCircle2, Copy, Download,
  Share2, Maximize2, Check
} from 'lucide-react'
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

// E-wallet info with colors
const EWALLET_INFO: Record<string, { emoji: string; colorClass: string; bgClass: string }> = {
  'Gopay': { emoji: '💚', colorClass: 'text-green-600', bgClass: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
  'OVO': { emoji: '💜', colorClass: 'text-purple-600', bgClass: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' },
  'Dana': { emoji: '💙', colorClass: 'text-blue-600', bgClass: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
  'ShopeePay': { emoji: '🧡', colorClass: 'text-orange-600', bgClass: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' },
  'LinkAja': { emoji: '❤️', colorClass: 'text-red-600', bgClass: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
  'BCA Mobile': { emoji: '🔵', colorClass: 'text-blue-700', bgClass: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
  'Mandiri E-Cash': { emoji: '🔷', colorClass: 'text-yellow-600', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
  'BNI Mobile Banking': { emoji: '🟠', colorClass: 'text-orange-700', bgClass: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' },
  'BRI Mobile Banking': { emoji: '🔶', colorClass: 'text-blue-800', bgClass: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
}

const DEFAULT_STEPS = [
  'Buka aplikasi e-wallet kamu',
  'Pilih menu "Scan QR" atau "QRIS"',
  'Arahkan kamera ke QR Code',
  'Konfirmasi nominal pembayaran',
  'Selesaikan transaksi'
]

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
  const [copied, setCopied] = useState(false)
  const [showZoom, setShowZoom] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [canShare, setCanShare] = useState(false)

  // Check share capability on mount (client-side only)
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  // Keyboard shortcuts & body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  const handleCopy = async () => {
    if (!merchantName) return
    try {
      await navigator.clipboard.writeText(merchantName)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const handleDownload = async () => {
    if (!qrisImage) return
    try {
      const response = await fetch(qrisImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qris-${merchantName?.replace(/\s+/g, '-').toLowerCase() || 'payment'}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 2000)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const handleShare = async () => {
    if (!qrisImage || !canShare) return
    try {
      const response = await fetch(qrisImage)
      const blob = await response.blob()
      const file = new File([blob], 'qris-payment.png', { type: 'image/png' })
      await navigator.share({
        title: `QRIS Payment - ${merchantName}`,
        text: `Scan QR code untuk bayar ke ${merchantName}`,
        files: [file]
      })
    } catch (err) {
      // User cancelled or share failed - silent fail is ok
      console.log('Share cancelled or failed')
    }
  }

  if (!isOpen && !isClosing) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm',
          'transition-opacity duration-300',
          isClosing ? 'opacity-0' : 'opacity-100'
        )}
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 sm:inset-0 z-50',
          'flex items-end sm:items-center justify-center',
          'pointer-events-none'
        )}
      >
        <div
          className={cn(
            'w-full sm:max-w-lg pointer-events-auto',
            'bg-white dark:bg-gray-900',
            'sm:rounded-t-3xl sm:rounded-b-3xl rounded-t-3xl',
            'shadow-2xl max-h-[90vh] sm:max-h-[85vh]',
            'flex flex-col overflow-hidden',
            'transition-transform duration-300 ease-out',
            isClosing
              ? 'translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0'
              : 'translate-y-0 sm:scale-100'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-8 text-white">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Scan untuk Bayar</h2>
                {merchantName && (
                  <button
                    onClick={handleCopy}
                    className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-sm"
                  >
                    <span>{merchantName}</span>
                    {copied ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* QR Code */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              {qrisImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowZoom(true)}
                      className="relative bg-white p-4 rounded-xl w-full group"
                    >
                      <div className="aspect-square w-full max-w-xs mx-auto">
                        <img
                          src={qrisImage}
                          alt="QRIS QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors flex items-center justify-center">
                        <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>

                    {/* QRIS Badge */}
                    <div className="absolute top-2 right-2 bg-red-600 px-3 py-1 rounded-lg shadow-lg">
                      <p className="text-xs font-bold text-white">QRIS</p>
                    </div>
                  </div>

                  {/* Instructions */}
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Arahkan kamera ke QR Code dengan aplikasi e-wallet kamu
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownload}
                      className={cn(
                        'flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2',
                        downloaded
                          ? 'bg-green-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500'
                      )}
                    >
                      {downloaded ? (
                        <>
                          <Check className="w-4 h-4" />
                          Downloaded
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download
                        </>
                      )}
                    </button>

                    {canShare && (
                      <button
                        onClick={handleShare}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-square w-full max-w-xs mx-auto bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <QrCode className="w-16 h-16 mx-auto mb-2" />
                    <p className="text-sm">QR Code tidak tersedia</p>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Methods */}
            {showPaymentLogos && paymentMethods.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <p className="font-semibold">Bisa bayar pakai:</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((method) => {
                    const info = EWALLET_INFO[method] || {
                      emoji: '💳',
                      colorClass: 'text-gray-600',
                      bgClass: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }
                    return (
                      <div
                        key={method}
                        className={cn(
                          'p-3 rounded-xl font-medium text-sm flex items-center gap-2 border',
                          info.bgClass
                        )}
                      >
                        <span className="text-xl">{info.emoji}</span>
                        <span className={info.colorClass}>{method}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <p className="font-bold text-gray-800 dark:text-gray-100">Cara Pembayaran</p>
              </div>

              {instructions ? (
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-9">
                  {instructions}
                </p>
              ) : (
                <ol className="space-y-2 pl-9 text-sm text-gray-700 dark:text-gray-300">
                  {DEFAULT_STEPS.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Security Badge */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
              <p className="text-sm text-green-800 dark:text-green-300 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Pembayaran aman & terpercaya oleh Bank Indonesia
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {showZoom && qrisImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setShowZoom(false)}
        >
          <button
            onClick={() => setShowZoom(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="bg-white p-6 rounded-2xl max-w-2xl w-full">
            <img
              src={qrisImage}
              alt="QRIS QR Code - Zoomed"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
