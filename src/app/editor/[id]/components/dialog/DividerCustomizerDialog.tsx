/**
 * Divider Customizer Dialog
 * Mobile-friendly dialog for customizing divider appearance
 */

import { useEffect } from "react"
import { Copy, Sparkles, Circle, Square, Star, Heart, Zap, Minus } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Block {
  id: string
  type: string
  props: any
}

interface DividerCustomizerDialogProps {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
  onClose: () => void
}

const DIVIDER_STYLES = [
  { value: 'solid', label: 'Solid', preview: '─────────' },
  { value: 'dashed', label: 'Dashed', preview: '─ ─ ─ ─' },
  { value: 'dotted', label: 'Dotted', preview: '· · · · ·' },
  { value: 'double', label: 'Double', preview: '═════════' }
]

const DIVIDER_ICONS = [
  { value: 'none', label: 'None', icon: Minus },
  { value: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'circle', label: 'Circle', icon: Circle },
  { value: 'square', label: 'Square', icon: Square },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'heart', label: 'Heart', icon: Heart },
  { value: 'zap', label: 'Zap', icon: Zap }
]

const SPACING_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' }
]

export default function DividerCustomizerDialog({
  block,
  onUpdateBlock,
  onClose
}: DividerCustomizerDialogProps) {
  const updateField = (field: string, value: any) => {
    onUpdateBlock(block.id, {
      ...block.props,
      [field]: value
    })
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const currentStyle = block.props.style || 'solid'
  const currentIcon = block.props.icon || 'none'
  const currentSpacing = block.props.spacing || 'md'
  const currentColor = block.props.color || '#e5e7eb'
  const currentThickness = block.props.thickness || 1
  const currentAnimated = block.props.animated || false

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
            <h2 className="font-bold text-lg">Customize Divider</h2>
            <p className="text-xs text-muted-foreground">Style your divider line</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Copy className="h-4 w-4 rotate-45" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 pt-4 pb-24 space-y-6">
          {/* Preview */}
          <div className="p-4 rounded-lg bg-secondary/30 border-2 border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3">Preview</p>
            <div className="flex items-center gap-3">
              {currentIcon !== 'none' ? (
                <>
                  <div
                    className="flex-1"
                    style={{
                      borderTop: `${currentThickness}px ${currentStyle} ${currentColor}`,
                    }}
                  />
                  {(() => {
                    const IconComponent = DIVIDER_ICONS.find(i => i.value === currentIcon)?.icon || Minus
                    return (
                      <div
                        style={{ color: currentColor }}
                        className={currentAnimated ? 'animate-pulse' : ''}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                    )
                  })()}
                  <div
                    className="flex-1"
                    style={{
                      borderTop: `${currentThickness}px ${currentStyle} ${currentColor}`,
                    }}
                  />
                </>
              ) : (
                <div
                  className="w-full"
                  style={{
                    borderTop: `${currentThickness}px ${currentStyle} ${currentColor}`,
                  }}
                />
              )}
            </div>
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2">Line Style</label>
            <div className="grid grid-cols-2 gap-2">
              {DIVIDER_STYLES.map((style) => (
                <button
                  key={style.value}
                  onClick={() => updateField('style', style.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    currentStyle === style.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{style.label}</div>
                  <div className="text-lg text-muted-foreground">{style.preview}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2">Icon (Optional)</label>
            <div className="grid grid-cols-4 gap-2">
              {DIVIDER_ICONS.map((iconOpt) => {
                const IconComponent = iconOpt.icon
                return (
                  <button
                    key={iconOpt.value}
                    onClick={() => updateField('icon', iconOpt.value)}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                      currentIcon === iconOpt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="text-xs">{iconOpt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color & Thickness */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-2">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => updateField('color', e.target.value)}
                  className="w-full h-10 rounded-lg border-2 border-border cursor-pointer"
                />
              </div>
              <Input
                type="text"
                value={currentColor}
                onChange={(e) => updateField('color', e.target.value)}
                placeholder="#e5e7eb"
                className="mt-2 h-9 text-xs"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Thickness</label>
              <input
                type="range"
                min="1"
                max="5"
                value={currentThickness}
                onChange={(e) => updateField('thickness', parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer mt-4"
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">{currentThickness}px</p>
            </div>
          </div>

          {/* Spacing */}
          <div>
            <label className="block text-sm font-semibold mb-2">Spacing (Vertical)</label>
            <div className="grid grid-cols-4 gap-2">
              {SPACING_OPTIONS.map((spacing) => (
                <button
                  key={spacing.value}
                  onClick={() => updateField('spacing', spacing.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    currentSpacing === spacing.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-xs font-medium">{spacing.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Animated Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-border">
            <div>
              <p className="font-semibold text-sm">Animated</p>
              <p className="text-xs text-muted-foreground">Add pulse animation</p>
            </div>
            <button
              onClick={() => updateField('animated', !currentAnimated)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                currentAnimated ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  currentAnimated ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
