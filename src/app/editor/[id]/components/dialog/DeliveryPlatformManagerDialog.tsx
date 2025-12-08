/**
 * Delivery Platform Manager - Fullscreen Dialog
 * Manages food delivery platform links (GoFood, GrabFood, ShopeeFood)
 */

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Trash2, UtensilsCrossed } from "lucide-react"

interface Block {
  id: string
  type: string
  props: any
}

interface DeliveryPlatformManagerDialogProps {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
  onClose: () => void
}

const DELIVERY_PLATFORMS = [
  { key: 'gofood', name: 'GoFood', icon: '🟢', color: 'bg-green-600' },
  { key: 'grabfood', name: 'GrabFood', icon: '🍴', color: 'bg-emerald-600' },
  { key: 'shopeefood', name: 'ShopeeFood', icon: '🍜', color: 'bg-orange-600' }
]

export default function DeliveryPlatformManagerDialog({
  block,
  onUpdateBlock,
  onClose
}: DeliveryPlatformManagerDialogProps) {
  const platforms = block.props.platforms || {}

  const updatePlatform = (platformKey: string, field: string, value: any) => {
    const currentPlatform = platforms[platformKey] || {}
    onUpdateBlock(block.id, {
      ...block.props,
      platforms: {
        ...platforms,
        [platformKey]: {
          ...currentPlatform,
          [field]: value
        }
      }
    })
  }

  const removePlatform = (platformKey: string) => {
    const newPlatforms = { ...platforms }
    delete newPlatforms[platformKey]
    onUpdateBlock(block.id, {
      ...block.props,
      platforms: newPlatforms
    })
  }

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
      <div className="flex-shrink-0 border-b bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex-shrink-0">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-base sm:text-lg truncate">Food Delivery Platforms</h2>
              <p className="text-xs text-muted-foreground">
                Configure your delivery platform links
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

          {/* Add Platform Buttons */}
          <div className="space-y-2 mb-3">
            {DELIVERY_PLATFORMS.map(platform => {
              const isActive = !!platforms[platform.key]
              return (
                <div
                  key={platform.key}
                  className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-secondary/50 cursor-pointer'
                    }`}
                  onClick={() => {
                    if (!isActive) {
                      updatePlatform(platform.key, 'url', '')
                    }
                  }}
                >
                  <span className="text-2xl">{platform.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm">{platform.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {isActive ? 'Configured ✓' : 'Click to add'}
                    </div>
                  </div>
                  {isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removePlatform(platform.key)
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

          {/* Platform Configuration */}
          {Object.keys(platforms).map(platformKey => {
            const platform = DELIVERY_PLATFORMS.find(p => p.key === platformKey)
            if (!platform || !platforms[platformKey]) return null

            const config = platforms[platformKey]

            return (
              <div key={platformKey} className="p-3 rounded-lg bg-card border space-y-3 mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{platform.icon}</span>
                  <h4 className="font-semibold text-sm">{platform.name}</h4>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Store/Menu URL</label>
                  <Input
                    value={config.url || ''}
                    onChange={(e) => updatePlatform(platformKey, 'url', e.target.value)}
                    placeholder={`https://${platformKey}.com/your-store`}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Merchant Name (Optional)</label>
                  <Input
                    value={config.merchantName || ''}
                    onChange={(e) => updatePlatform(platformKey, 'merchantName', e.target.value)}
                    placeholder="Your Restaurant Name"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Rating (Optional)</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={config.rating || ''}
                      onChange={(e) => updatePlatform(platformKey, 'rating', e.target.value)}
                      placeholder="4.5"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Badge</label>
                    <select
                      value={config.badge || ''}
                      onChange={(e) => updatePlatform(platformKey, 'badge', e.target.value)}
                      className="w-full h-9 px-3 text-xs rounded-md border border-input bg-background"
                    >
                      <option value="">None</option>
                      <option value="official">Official</option>
                      <option value="featured">Featured</option>
                    </select>
                  </div>
                </div>
              </div>
            )
          })}

          {Object.keys(platforms).length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No platforms added yet. Click a platform above to get started!
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
