/**
 * Product Layout Selector Dialog
 * Mobile-friendly dialog for selecting product catalog layout
 */

import { useEffect } from "react"
import { Copy, Grid2x2, Grid3x3, Smartphone, Tablet } from "lucide-react"

interface ProductLayoutSelectorDialogProps {
  currentLayout: string
  onSelectLayout: (layout: 'medium' | 'large') => void
  onClose: () => void
}

export default function ProductLayoutSelectorDialog({
  currentLayout,
  onSelectLayout,
  onClose
}: ProductLayoutSelectorDialogProps) {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSelectLayout = (layout: 'medium' | 'large') => {
    onSelectLayout(layout)
    onClose()
  }

  const layoutOptions = [
    {
      value: 'medium' as const,
      label: 'Medium',
      description: 'Compact product cards',
      tablet: { cols: 3, icon: Grid3x3 },
      phone: { cols: 2, icon: Grid2x2 }
    },
    {
      value: 'large' as const,
      label: 'Large',
      description: 'Spacious product cards',
      tablet: { cols: 2, icon: Grid2x2 },
      phone: { cols: 1, icon: Grid2x2 }
    }
  ]

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-background border-t sm:border sm:rounded-xl shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-300 max-h-[85vh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="font-bold text-lg">Product Layout</h2>
            <p className="text-xs text-muted-foreground">Choose how products are displayed</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Copy className="h-4 w-4 rotate-45" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 pt-4 pb-24 space-y-3">
          {layoutOptions.map((option) => {
            const isSelected = currentLayout === option.value
            const TabletIcon = option.tablet.icon
            const PhoneIcon = option.phone.icon

            return (
              <button
                key={option.value}
                onClick={() => handleSelectLayout(option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Radio Circle */}
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">{option.label}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{option.description}</p>

                    {/* Preview Grid */}
                    <div className="flex items-center gap-4">
                      {/* Tablet Preview */}
                      <div className="flex items-center gap-2">
                        <Tablet className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-1">
                          <TabletIcon className="h-4 w-4 text-primary" />
                          <span className="text-xs font-medium text-muted-foreground">
                            {option.tablet.cols} cols
                          </span>
                        </div>
                      </div>

                      <div className="h-4 w-px bg-border" />

                      {/* Phone Preview */}
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-1">
                          <PhoneIcon className="h-4 w-4 text-primary" />
                          <span className="text-xs font-medium text-muted-foreground">
                            {option.phone.cols} col{option.phone.cols > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

      </div>
    </div>
  )
}
