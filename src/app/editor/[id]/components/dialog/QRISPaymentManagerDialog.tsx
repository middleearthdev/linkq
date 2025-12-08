/**
 * QRIS Payment Manager Dialog
 * Mobile-friendly dialog for managing QRIS payment block settings
 */

import { useState, useEffect } from "react"
import { Copy, QrCode, Wallet, Trash2, ImageIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { MediaLibraryPicker } from "@/components/media/MediaLibraryPicker"

interface Block {
  id: string
  type: string
  props: any
}

interface QRISPaymentManagerDialogProps {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
  onClose: () => void
  canUploadImages?: boolean
}

const PAYMENT_METHODS = [
  'Gopay',
  'OVO',
  'Dana',
  'ShopeePay',
  'LinkAja',
  'BCA Mobile',
  'Mandiri E-Cash',
  'BNI Mobile Banking',
  'BRI Mobile Banking'
]

export default function QRISPaymentManagerDialog({
  block,
  onUpdateBlock,
  onClose,
  canUploadImages = false
}: QRISPaymentManagerDialogProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'settings'>('basic')
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)

  const qrisImage = block.props.qrisImage || ''
  const merchantName = block.props.merchantName || ''
  const paymentMethods = block.props.paymentMethods || ['Gopay', 'OVO', 'Dana', 'ShopeePay']
  const instructions = block.props.instructions || ''
  const showPaymentLogos = block.props.showPaymentLogos ?? true

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const updateField = (field: string, value: any) => {
    onUpdateBlock(block.id, {
      ...block.props,
      [field]: value
    })
  }

  const handleQRISImageSelect = (imageUrl: string) => {
    updateField('qrisImage', imageUrl)
    setIsMediaLibraryOpen(false)
  }

  const togglePaymentMethod = (method: string) => {
    const updated = paymentMethods.includes(method)
      ? paymentMethods.filter((m: string) => m !== method)
      : [...paymentMethods, method]
    updateField('paymentMethods', updated)
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="w-full sm:max-w-2xl bg-background border-t sm:border sm:rounded-xl shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-300 max-h-[85vh] sm:max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 border-b bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5">
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="font-bold text-lg">QRIS Payment Manager</h2>
                <p className="text-xs text-muted-foreground">
                  Manage QRIS payment details
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <Copy className="h-4 w-4 rotate-45" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-t">
              <button
                onClick={() => setActiveTab('basic')}
                className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                  activeTab === 'basic'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                  activeTab === 'settings'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto pb-24">
            {activeTab === 'basic' && (
              <div className="p-4 space-y-4">
                {/* Merchant Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    <Wallet className="inline h-4 w-4 mr-1" />
                    Merchant Name
                  </label>
                  <Input
                    value={merchantName}
                    onChange={(e) => updateField('merchantName', e.target.value)}
                    placeholder="e.g., Toko Kopi Nusantara"
                    className="h-10"
                  />
                </div>

                {/* QRIS Image */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    <QrCode className="inline h-4 w-4 mr-1" />
                    QRIS QR Code Image
                  </label>

                  {qrisImage ? (
                    <div className="relative">
                      <div className="relative w-full max-w-xs mx-auto aspect-square bg-white p-4 rounded-lg border-2 border-border">
                        <img
                          src={qrisImage}
                          alt="QRIS QR Code"
                          className="w-full h-full object-contain"
                        />
                        <button
                          onClick={() => updateField('qrisImage', '')}
                          className="absolute top-2 right-2 p-2 bg-destructive/90 text-destructive-foreground rounded-full hover:bg-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => canUploadImages ? setIsMediaLibraryOpen(true) : null}
                        className="w-full mt-2 px-4 py-2 text-sm border-2 border-dashed hover:border-primary rounded-lg transition-colors"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (canUploadImages) {
                          setIsMediaLibraryOpen(true)
                        } else {
                          // For free users, use a default placeholder
                          updateField('qrisImage', 'https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=400')
                        }
                      }}
                      className="w-full border-2 border-dashed hover:border-primary rounded-lg p-8 text-center transition-colors"
                    >
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-sm font-medium text-muted-foreground">Click to upload QRIS QR Code</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {canUploadImages ? 'Upload your custom QR code' : 'Add a sample QR code'}
                      </p>
                    </button>
                  )}
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Payment Instructions (Optional)
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => updateField('instructions', e.target.value)}
                    placeholder="1. Buka aplikasi e-wallet&#10;2. Scan QR code&#10;3. Konfirmasi pembayaran"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-4 space-y-6">
                {/* Payment Methods */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    <Wallet className="inline h-4 w-4 mr-1" />
                    Payment Methods
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method}
                        onClick={() => togglePaymentMethod(method)}
                        className={`p-3 rounded-lg border-2 transition-all text-left text-sm ${
                          paymentMethods.includes(method)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  {/* Show Payment Logos */}
                  <div className="flex items-center justify-between p-3 rounded-lg border-2 border-border">
                    <div>
                      <p className="font-semibold text-sm">Show Payment Logos</p>
                      <p className="text-xs text-muted-foreground">Display e-wallet badges</p>
                    </div>
                    <button
                      onClick={() => updateField('showPaymentLogos', !showPaymentLogos)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        showPaymentLogos ? 'bg-primary' : 'bg-secondary'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          showPaymentLogos ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Library Picker */}
      {canUploadImages && (
        <MediaLibraryPicker
          isOpen={isMediaLibraryOpen}
          onClose={() => setIsMediaLibraryOpen(false)}
          onSelect={handleQRISImageSelect}
          category="qris"
          referenceId={`qris:${block.id}`}
          currentImage={qrisImage}
          title="Choose QRIS QR Code"
        />
      )}
    </>
  )
}
