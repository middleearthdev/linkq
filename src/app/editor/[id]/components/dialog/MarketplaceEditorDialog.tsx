/**
 * Marketplace Editor Dialog
 * Full-screen dialog for managing marketplace/e-commerce store links
 * Features: Tokopedia, Shopee, TikTok Shop configuration
 */

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Store, Trash2 } from "lucide-react"

interface Block {
  id: string
  type: string
  props: any
}

// Marketplace Editor Dialog
export default function MarketplaceEditorDialog({
  block,
  onUpdateBlock,
  onClose
}: {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
  onClose: () => void
}) {
  const stores = block.props.stores || {}

  const updateStore = (storeKey: string, field: string, value: any) => {
    const currentStore = stores[storeKey] || {}
    onUpdateBlock(block.id, {
      ...block.props,
      stores: {
        ...stores,
        [storeKey]: {
          ...currentStore,
          [field]: value
        }
      }
    })
  }

  const removeStore = (storeKey: string) => {
    const newStores = { ...stores }
    delete newStores[storeKey]
    onUpdateBlock(block.id, {
      ...block.props,
      stores: newStores
    })
  }

  const MARKETPLACES = [
    { key: 'tokopedia', name: 'Tokopedia', icon: '🟢', color: 'bg-green-600' },
    { key: 'shopee', name: 'Shopee', icon: '🛍️', color: 'bg-orange-600' },
    { key: 'tiktokshop', name: 'TikTok Shop', icon: '🎵', color: 'bg-black' }
  ]

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-gradient-to-r from-orange-500/5 via-red-500/5 to-pink-500/5">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex-shrink-0">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-base sm:text-lg truncate">E-commerce Stores</h2>
              <p className="text-xs text-muted-foreground">
                Configure your marketplace store links
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-9 w-9 p-0 flex-shrink-0"
            title="Close (Esc)"
          >
            <Copy className="h-4 w-4 rotate-45" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">

          {/* Add Store Buttons */}
          <div className="space-y-2">
            {MARKETPLACES.map(marketplace => {
              const isActive = !!stores[marketplace.key]
              return (
                <div
                  key={marketplace.key}
                  className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-secondary/50 cursor-pointer'
                    }`}
                  onClick={() => {
                    if (!isActive) {
                      updateStore(marketplace.key, 'storeUrl', '')
                    }
                  }}
                >
                  <span className="text-2xl">{marketplace.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm">{marketplace.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {isActive ? 'Configured ✓' : 'Click to add'}
                    </div>
                  </div>
                  {isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeStore(marketplace.key)
                      }}
                      className="p-1 hover:bg-destructive/20 rounded text-destructive transition-colors"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Store Configuration */}
          {Object.keys(stores).map(storeKey => {
            const marketplace = MARKETPLACES.find(m => m.key === storeKey)
            if (!marketplace || !stores[storeKey]) return null

            const config = stores[storeKey]

            return (
              <div key={storeKey} className="p-4 rounded-lg bg-card border space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{marketplace.icon}</span>
                  <h4 className="font-semibold text-sm">{marketplace.name}</h4>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Store URL</label>
                  <Input
                    value={config.storeUrl || ''}
                    onChange={(e) => updateStore(storeKey, 'storeUrl', e.target.value)}
                    placeholder={`https://${storeKey}.com/your-store`}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Store Name (Optional)</label>
                  <Input
                    value={config.storeName || ''}
                    onChange={(e) => updateStore(storeKey, 'storeName', e.target.value)}
                    placeholder="Your Shop Name"
                    className="h-10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Rating (Optional)</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={config.rating || ''}
                      onChange={(e) => updateStore(storeKey, 'rating', e.target.value)}
                      placeholder="4.8"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Followers (Optional)</label>
                    <Input
                      value={config.followers || ''}
                      onChange={(e) => updateStore(storeKey, 'followers', e.target.value)}
                      placeholder="10K"
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Badge</label>
                  <select
                    value={config.badge || ''}
                    onChange={(e) => updateStore(storeKey, 'badge', e.target.value)}
                    className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background"
                  >
                    <option value="">None</option>
                    {storeKey === 'tokopedia' && (
                      <>
                        <option value="official">Official Store</option>
                        <option value="power-merchant">Power Merchant</option>
                      </>
                    )}
                    {storeKey === 'shopee' && (
                      <>
                        <option value="star-seller">Star Seller</option>
                        <option value="shopee-mall">Shopee Mall</option>
                      </>
                    )}
                    {storeKey === 'tiktokshop' && (
                      <option value="verified">Verified Seller</option>
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Review Count (Optional)</label>
                  <Input
                    value={config.reviewCount || ''}
                    onChange={(e) => updateStore(storeKey, 'reviewCount', e.target.value)}
                    placeholder="500"
                    className="h-10"
                  />
                </div>
              </div>
            )
          })}

          {Object.keys(stores).length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No stores added yet. Click a marketplace above to get started!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t bg-secondary/30 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs">Esc</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs">⌘S</kbd> to close
          </p>
          <Button onClick={onClose} className="min-w-[100px]">
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
