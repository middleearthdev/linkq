/**
 * Edit Tab Component
 * Blocks editor with special features toggles
 */

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, GripVertical, Link2, Settings, Smartphone, Sparkles, Eye, EyeOff, Copy, ChevronDown, ChevronUp, Hash, ImageIcon, CheckSquare, Undo2, Redo2, Package, ShoppingBag, Edit3, Search, Grid2x2, Grid3x3, Share2, MessageCircle, UtensilsCrossed, Store } from "lucide-react"
import { getIconByName } from "./IconPicker"
import { ImageIconSelector } from "./ImageIconSelector"

interface Block {
  id: string
  type: string
  props: any
}

interface EditTabProps {
  blocks: Block[]
  handle: string
  bioBlock: Block | undefined
  userPlan?: 'FREE' | 'STARTER' | 'PRO' // Subscription tier
  onToggleBioBlock: () => void
  onToggleWhatsAppBlock: () => void
  onAddBlock: () => void
  onUpdateBlock: (blockId: string, newProps: any) => void
  onDeleteBlock: (blockId: string) => void
  onDuplicateBlock?: (blockId: string) => void
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
  draggedBlockIndex: number | null
  dragOverBlockIndex: number | null
  onBlockDragStart: (e: React.DragEvent, index: number) => void
  onBlockDragEnd: (e: React.DragEvent) => void
  onBlockDragOver: (e: React.DragEvent, index: number) => void
  onBlockDrop: (e: React.DragEvent, index: number) => void
  onBlockTouchStart: (e: React.TouchEvent, index: number) => void
  onBlockTouchMove: (e: React.TouchEvent) => void
  onBlockTouchEnd: () => void
}

// Bio Block Card Component - Opens Editor Dialog
function BioBlockCard({
  bioBlock,
  onToggleBioBlock,
  onUpdateBlock
}: {
  bioBlock: Block | undefined
  onToggleBioBlock: () => void
  onUpdateBlock: (blockId: string, newProps: any) => void
}) {
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const hasBioBlock = !!bioBlock

  return (
    <>
      <div className="border-2 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/5 to-purple-500/5">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Avatar Preview */}
            {hasBioBlock && bioBlock.props.avatar && bioBlock.props.showAvatar ? (
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500/30 flex-shrink-0">
                <img
                  src={bioBlock.props.avatar}
                  alt={bioBlock.props.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <Settings className="h-5 w-5 text-blue-500" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground dark:text-white">
                {hasBioBlock && bioBlock.props.name ? bioBlock.props.name : 'Bio Section'}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {hasBioBlock && bioBlock.props.description
                  ? bioBlock.props.description
                  : 'Avatar, name, and description'}
              </p>
            </div>

            {/* Edit Button */}
            {hasBioBlock && (
              <button
                onClick={() => setIsEditorOpen(true)}
                className="p-2 hover:bg-background/50 rounded-lg transition-all flex-shrink-0"
                title="Edit Bio"
              >
                <Edit3 className="h-4 w-4 text-blue-500" />
              </button>
            )}
          </div>

          {/* Toggle Switch */}
          <button
            onClick={onToggleBioBlock}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-2 ${
              hasBioBlock ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                hasBioBlock ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Empty State Hint */}
        {!hasBioBlock && (
          <div className="p-3 border-t bg-card/30">
            <p className="text-xs text-muted-foreground text-center">
              Enable to show your profile picture, name, and bio
            </p>
          </div>
        )}
      </div>

      {/* Bio Editor Dialog */}
      {isEditorOpen && hasBioBlock && bioBlock && (
        <BioEditorDialog
          bioBlock={bioBlock}
          onUpdateBlock={onUpdateBlock}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </>
  )
}

// Bio Editor Dialog - Fullscreen
function BioEditorDialog({
  bioBlock,
  onUpdateBlock,
  onClose
}: {
  bioBlock: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
  onClose: () => void
}) {
  const updateBioField = (field: string, value: any) => {
    onUpdateBlock(bioBlock.id, {
      ...bioBlock.props,
      [field]: value
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
      <div className="flex-shrink-0 border-b bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-base sm:text-lg truncate">Bio Editor</h2>
              <p className="text-xs text-muted-foreground">
                Edit your profile information
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
          {/* Avatar Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Profile Picture</h3>

            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                {bioBlock.props.avatar ? (
                  <img
                    src={bioBlock.props.avatar}
                    alt={bioBlock.props.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Settings className="h-10 w-10 text-blue-500/50" />
                )}
              </div>
              <div className="flex-1">
                <Input
                  value={bioBlock.props.avatar || ''}
                  onChange={(e) => updateBioField('avatar', e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="h-10"
                />
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Paste your image URL (JPG, PNG, WebP)
                </p>
              </div>
            </div>

            {/* Show Avatar Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border">
              <div>
                <span className="text-sm font-medium">Show Avatar</span>
                <p className="text-xs text-muted-foreground">Display profile picture on your page</p>
              </div>
              <button
                onClick={() => updateBioField('showAvatar', !bioBlock.props.showAvatar)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  bioBlock.props.showAvatar ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    bioBlock.props.showAvatar ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Name Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Name</h3>
            <Input
              value={bioBlock.props.name || ''}
              onChange={(e) => updateBioField('name', e.target.value)}
              placeholder="Your Name"
              className="h-11 text-base"
            />
          </div>

          {/* Bio Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">Bio</h3>
              <span className="text-xs text-muted-foreground">
                {(bioBlock.props.description || '').length} / 160
              </span>
            </div>
            <textarea
              value={bioBlock.props.description || ''}
              onChange={(e) => updateBioField('description', e.target.value)}
              placeholder="Tell people about yourself..."
              className="w-full h-32 px-4 py-3 text-sm rounded-lg border bg-background resize-none"
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground">
              A short description about yourself (max 160 characters)
            </p>
          </div>

          {/* Preview Card */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Preview</h3>
            <div className="p-6 rounded-xl border-2 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
              <div className="flex flex-col items-center text-center space-y-3">
                {bioBlock.props.showAvatar && (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {bioBlock.props.avatar ? (
                      <img
                        src={bioBlock.props.avatar}
                        alt={bioBlock.props.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <Settings className="h-12 w-12 text-blue-500/50" />
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <h4 className="text-xl font-bold">
                    {bioBlock.props.name || 'Your Name'}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    {bioBlock.props.description || 'Tell people about yourself'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t bg-card p-4">
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

// WhatsApp Business Card Component - Similar to Bio Block
function WhatsAppBusinessCard({
  whatsappBlock,
  onToggleWhatsAppBlock,
  onUpdateBlock
}: {
  whatsappBlock: Block | undefined
  onToggleWhatsAppBlock: () => void
  onUpdateBlock: (blockId: string, newProps: any) => void
}) {
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const hasWhatsAppBlock = !!whatsappBlock

  return (
    <>
      <div className="border-2 rounded-lg overflow-hidden bg-gradient-to-br from-green-500/5 to-emerald-500/5">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* WhatsApp Icon */}
            <div className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-500/30 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-5 w-5 text-green-500" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground dark:text-white">
                WhatsApp Business
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {hasWhatsAppBlock && whatsappBlock.props.phoneNumber
                  ? whatsappBlock.props.phoneNumber
                  : 'Floating chat button'}
              </p>
            </div>

            {/* Edit Button */}
            {hasWhatsAppBlock && (
              <button
                onClick={() => setIsEditorOpen(true)}
                className="p-2 hover:bg-background/50 rounded-lg transition-all flex-shrink-0"
                title="Edit WhatsApp"
              >
                <Edit3 className="h-4 w-4 text-green-500" />
              </button>
            )}
          </div>

          {/* Toggle Switch */}
          <button
            onClick={onToggleWhatsAppBlock}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-2 ${
              hasWhatsAppBlock ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                hasWhatsAppBlock ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Empty State Hint */}
        {!hasWhatsAppBlock && (
          <div className="p-3 border-t bg-card/30">
            <p className="text-xs text-muted-foreground text-center">
              Enable to add floating WhatsApp chat button
            </p>
          </div>
        )}
      </div>

      {/* WhatsApp Editor Dialog */}
      {isEditorOpen && hasWhatsAppBlock && whatsappBlock && (
        <WhatsAppEditorDialog
          whatsappBlock={whatsappBlock}
          onUpdateBlock={onUpdateBlock}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </>
  )
}

// WhatsApp Editor Dialog - Fullscreen
function WhatsAppEditorDialog({
  whatsappBlock,
  onUpdateBlock,
  onClose
}: {
  whatsappBlock: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
  onClose: () => void
}) {
  // Auto-format phone number untuk Indonesia
  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '')

    // Handle empty input
    if (!cleaned) return ''

    // Auto-format berdasarkan pattern
    if (cleaned.startsWith('08')) {
      // 08xxx → +628xxx
      return '+62' + cleaned.substring(1)
    } else if (cleaned.startsWith('628')) {
      // 628xxx → +628xxx
      return '+' + cleaned
    } else if (cleaned.startsWith('62')) {
      // 62xxx → +62xxx
      return '+' + cleaned
    } else if (cleaned.startsWith('8')) {
      // 8xxx → +628xxx
      return '+62' + cleaned
    }

    // Return as is with + prefix if doesn't match pattern
    return cleaned.startsWith('+') ? cleaned : '+' + cleaned
  }

  const updateField = (field: string, value: any) => {
    // Auto-format phone number on blur
    if (field === 'phoneNumber' && value) {
      value = formatPhoneNumber(value)
    }

    onUpdateBlock(whatsappBlock.id, {
      ...whatsappBlock.props,
      [field]: value
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
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-base sm:text-lg truncate">WhatsApp Business</h2>
              <p className="text-xs text-muted-foreground">
                Configure your floating chat button
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
          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Phone Number</label>
            <Input
              value={whatsappBlock.props.phoneNumber || ''}
              onChange={(e) => onUpdateBlock(whatsappBlock.id, { ...whatsappBlock.props, phoneNumber: e.target.value })}
              onBlur={(e) => updateField('phoneNumber', e.target.value)}
              placeholder="081234567890"
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">
              Type 08xxx and it will auto-format to +628xxx when you finish typing
            </p>
          </div>

          {/* Pre-filled Message */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Pre-filled Message (Optional)</label>
            <textarea
              value={whatsappBlock.props.message || ''}
              onChange={(e) => updateField('message', e.target.value)}
              placeholder="Hello! I have a question..."
              className="w-full h-24 px-3 py-2 text-sm rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              This message will be pre-filled when users click the button
            </p>
          </div>

          {/* Button Text */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Button Text</label>
            <Input
              value={whatsappBlock.props.buttonText || 'Chat via WhatsApp'}
              onChange={(e) => updateField('buttonText', e.target.value)}
              placeholder="Chat via WhatsApp"
              className="h-10"
            />
          </div>

          {/* Business Name (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Business Name (Optional)</label>
            <Input
              value={whatsappBlock.props.businessName || ''}
              onChange={(e) => updateField('businessName', e.target.value)}
              placeholder="Your Business"
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">
              Shows as a badge above the button
            </p>
          </div>

          {/* FAB Position */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Button Position</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateField('fabPosition', 'bottom-right')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  whatsappBlock.props.fabPosition === 'bottom-right' || !whatsappBlock.props.fabPosition
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-border/80'
                }`}
              >
                <div className="text-sm font-medium">Bottom Right</div>
                <div className="text-xs text-muted-foreground mt-1">Default position</div>
              </button>
              <button
                onClick={() => updateField('fabPosition', 'bottom-left')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  whatsappBlock.props.fabPosition === 'bottom-left'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-border/80'
                }`}
              >
                <div className="text-sm font-medium">Bottom Left</div>
                <div className="text-xs text-muted-foreground mt-1">Alternative position</div>
              </button>
            </div>
          </div>

          {/* Enable Pulse Animation */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border">
            <div>
              <span className="text-sm font-medium">Pulse Animation</span>
              <p className="text-xs text-muted-foreground">Animated ring to attract attention</p>
            </div>
            <button
              onClick={() => updateField('enablePulse', !whatsappBlock.props.enablePulse)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                whatsappBlock.props.enablePulse !== false ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  whatsappBlock.props.enablePulse !== false ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
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

export function EditTab({
  blocks,
  handle,
  bioBlock,
  userPlan = 'FREE',
  onToggleBioBlock,
  onToggleWhatsAppBlock,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  draggedBlockIndex,
  dragOverBlockIndex,
  onBlockDragStart,
  onBlockDragEnd,
  onBlockDragOver,
  onBlockDrop,
  onBlockTouchStart,
  onBlockTouchMove,
  onBlockTouchEnd
}: EditTabProps) {
  // Check if user can upload custom images (STARTER or PRO)
  const canUploadImages = userPlan === 'STARTER' || userPlan === 'PRO'

  // Local state for block collapse and FAB
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set())
  const [showFAB, setShowFAB] = useState(false)
  const addBlockButtonRef = useRef<HTMLDivElement>(null)

  // Toggle block visibility - Now persists to database
  const toggleBlockVisibility = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId)
    if (!block) return

    // Update block's isVisible property at block level (not in props)
    // Note: We're using a workaround here by storing in props since onUpdateBlock only updates props
    // Ideally, we'd need a separate handler for block-level properties
    onUpdateBlock(blockId, {
      ...block.props,
      _isVisible: !(block.props._isVisible ?? true)
    })
  }

  // Toggle block collapse
  const toggleBlockCollapse = (blockId: string) => {
    setCollapsedBlocks(prev => {
      const next = new Set(prev)
      if (next.has(blockId)) {
        next.delete(blockId)
      } else {
        next.add(blockId)
      }
      return next
    })
  }

  // Filter blocks (exclude bio and whatsapp-business)
  const editableBlocks = blocks.filter(b => b.type !== 'bio' && b.type !== 'whatsapp-business')

  // Helper to get block item count
  const getBlockItemCount = (block: Block): number => {
    if (block.type === 'link-list' && Array.isArray(block.props.items)) {
      return block.props.items.length
    }
    if (block.type === 'gallery' && Array.isArray(block.props.images)) {
      return block.props.images.length
    }
    if (block.type === 'social-icons' && Array.isArray(block.props.links)) {
      return block.props.links.length
    }
    return 0
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Cmd (Mac) or Ctrl (Windows/Linux) is pressed
      const isCmdOrCtrl = e.metaKey || e.ctrlKey

      // ⌘K or Ctrl+K - Add new block
      if (isCmdOrCtrl && e.key === 'k') {
        e.preventDefault()
        onAddBlock()
      }

      // ⌘D or Ctrl+D - Duplicate first selected/focused block
      if (isCmdOrCtrl && e.key === 'd' && onDuplicateBlock) {
        e.preventDefault()
        // Get first editable block to duplicate as example
        if (editableBlocks.length > 0) {
          onDuplicateBlock(editableBlocks[0].id)
        }
      }

      // Escape - Collapse all blocks
      if (e.key === 'Escape') {
        setCollapsedBlocks(new Set(editableBlocks.map(b => b.id)))
      }

      // ⌘E or Ctrl+E - Expand all blocks
      if (isCmdOrCtrl && e.key === 'e') {
        e.preventDefault()
        setCollapsedBlocks(new Set())
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onAddBlock, onDuplicateBlock, editableBlocks])

  // IntersectionObserver for FAB - detect when Add Block button is not visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show FAB when Add Block button is NOT visible
        setShowFAB(!entry.isIntersecting)
      },
      {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px' // Trigger slightly before it goes out of view
      }
    )

    if (addBlockButtonRef.current) {
      observer.observe(addBlockButtonRef.current)
    }

    return () => {
      if (addBlockButtonRef.current) {
        observer.unobserve(addBlockButtonRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Keyboard Shortcuts Helper & Undo/Redo - Hidden on Mobile */}
      <div className="hidden md:flex items-center justify-between gap-4 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
        <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
          <span className="font-medium text-foreground dark:text-white">Shortcuts:</span>
          <code className="px-2 py-0.5 rounded bg-background border border-border">⌘K</code>
          <span>Add Block</span>
          <span className="text-border">•</span>
          <code className="px-2 py-0.5 rounded bg-background border border-border">⌘D</code>
          <span>Duplicate</span>
          <span className="text-border">•</span>
          <code className="px-2 py-0.5 rounded bg-background border border-border">⌘E</code>
          <span>Expand All</span>
          <span className="text-border">•</span>
          <code className="px-2 py-0.5 rounded bg-background border border-border">ESC</code>
          <span>Collapse All</span>
          <span className="text-border">•</span>
          <code className="px-2 py-0.5 rounded bg-background border border-border">⌘Z</code>
          <span>Undo</span>
          <span className="text-border">•</span>
          <code className="px-2 py-0.5 rounded bg-background border border-border">⌘⇧Z</code>
          <span>Redo</span>
        </div>
        {onUndo && onRedo && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="h-7 px-2 text-xs"
              title="Undo (⌘Z)"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="h-7 px-2 text-xs"
              title="Redo (⌘⇧Z)"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Profile Preview at Top - Linktree Style */}
      {bioBlock && (
        <div className="mb-6 flex flex-col items-center text-center">
          {bioBlock.props.avatar && (
            <div className="mb-3">
              <img
                src={bioBlock.props.avatar}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-border"
              />
            </div>
          )}
          <h2 className="text-lg font-semibold text-foreground dark:text-white">
            @{handle}
          </h2>
        </div>
      )}

      {/* Add Block Button - With Ref for FAB detection */}
      <div ref={addBlockButtonRef}>
        <Button
          onClick={onAddBlock}
          className="w-full h-11 md:h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-lg text-sm md:text-base"
        >
          <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2" />
          Add Block
          <span className="ml-auto text-xs opacity-70 hidden md:inline">⌘K</span>
        </Button>
      </div>

      {/* Special Blocks Settings - Bio & WhatsApp */}
      <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h3 className="text-sm font-semibold text-foreground dark:text-white">Special Features</h3>
        </div>

        {/* Bio Block Card */}
        <BioBlockCard
          bioBlock={bioBlock}
          onToggleBioBlock={onToggleBioBlock}
          onUpdateBlock={onUpdateBlock}
        />

        {/* WhatsApp Business Card */}
        <WhatsAppBusinessCard
          whatsappBlock={blocks.find(b => b.type === 'whatsapp-business')}
          onToggleWhatsAppBlock={onToggleWhatsAppBlock}
          onUpdateBlock={onUpdateBlock}
        />
      </div>

      {/* All Blocks Section - Exclude Bio & WhatsApp */}
      {editableBlocks.length > 0 ? (
        <div className="space-y-3">
          {editableBlocks.map((block) => {
            const originalIndex = blocks.findIndex(b => b.id === block.id)
            const isDraggable = true

            return (
              <div
                key={block.id}
                data-block-index={originalIndex}
                data-draggable-index={originalIndex}
                className={`relative space-y-3 rounded-lg border transition-all duration-300 ease-out ${draggedBlockIndex === originalIndex
                  ? 'opacity-50 scale-95 border-border shadow-xl'
                  : dragOverBlockIndex === originalIndex
                    ? 'border-primary bg-primary/5 scale-105 shadow-lg'
                    : block.props._isVisible === false
                      ? 'border-dashed border-border/50 bg-secondary/30 opacity-60'
                      : 'border-border bg-card dark:bg-[#2A3441] hover:border-border/80'
                  }`}
                style={{
                  transformOrigin: 'center',
                  willChange: draggedBlockIndex === originalIndex ? 'transform, opacity' : 'auto'
                }}
                onDragOver={isDraggable ? (e) => onBlockDragOver(e, originalIndex) : undefined}
                onDrop={isDraggable ? (e) => onBlockDrop(e, originalIndex) : undefined}
              >
                {/* Drop Indicator - Mobile Only */}
                {dragOverBlockIndex === originalIndex && draggedBlockIndex !== null && draggedBlockIndex !== originalIndex && (
                  <div className={`md:hidden absolute left-0 right-0 h-1 bg-primary rounded-full shadow-lg ${draggedBlockIndex < originalIndex ? 'bottom-[-8px]' : 'top-[-8px]'
                    }`} />
                )}
                {/* Enhanced Block Header with Statistics and Actions - Mobile Optimized */}
                <div className="flex items-center justify-between p-2 md:p-3 gap-2">
                  <div className="flex items-center gap-1.5 md:gap-2 flex-1 min-w-0">
                    {/* Drag Handle Icon */}
                    <div
                      draggable={isDraggable}
                      onDragStart={isDraggable ? (e) => onBlockDragStart(e, originalIndex) : undefined}
                      onDragEnd={isDraggable ? onBlockDragEnd : undefined}
                      onTouchStart={isDraggable ? (e) => {
                        onBlockTouchStart(e, originalIndex)
                      } : undefined}
                      onTouchMove={isDraggable ? onBlockTouchMove : undefined}
                      onTouchEnd={isDraggable ? onBlockTouchEnd : undefined}
                      className={`${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''} ${draggedBlockIndex === originalIndex ? 'scale-110 opacity-70' : ''} select-none p-1 -m-1 rounded hover:bg-secondary/50 active:bg-secondary transition-all flex-shrink-0 touch-none`}
                      data-block-drag-handle
                    >
                      <GripVertical className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground pointer-events-none" />
                    </div>

                    {/* Block Type with Collapse Icon */}
                    <button
                      onClick={() => toggleBlockCollapse(block.id)}
                      className="flex items-center gap-1 md:gap-1.5 hover:text-primary transition-colors min-w-0 flex-shrink"
                    >
                      <span className="text-xs md:text-sm font-medium text-foreground dark:text-white capitalize truncate">
                        {block.type.replace('-', ' ')}
                      </span>
                      {collapsedBlocks.has(block.id) ? (
                        <ChevronDown className="h-3 w-3 md:h-3.5 md:w-3.5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronUp className="h-3 w-3 md:h-3.5 md:w-3.5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>

                    {/* Item Count Badge */}
                    {getBlockItemCount(block) > 0 && (
                      <div className="flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0">
                        <Hash className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary" />
                        <span className="text-[10px] md:text-xs font-medium text-primary">
                          {getBlockItemCount(block)}
                        </span>
                      </div>
                    )}

                    {/* Hidden Badge - Compact on Mobile */}
                    {block.props._isVisible === false && (
                      <div className="px-1.5 md:px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex-shrink-0">
                        <span className="text-[10px] md:text-xs font-medium text-yellow-600 dark:text-yellow-500">
                          Hidden
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Compact on Mobile */}
                  <div className="flex items-center gap-0.5 md:gap-1 flex-shrink-0">
                    {/* Visibility Toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBlockVisibility(block.id)}
                      className="h-7 w-7 md:h-8 md:w-8 p-0 text-muted-foreground hover:text-primary"
                      title={block.props._isVisible === false ? 'Show block' : 'Hide block'}
                    >
                      {block.props._isVisible === false ? (
                        <EyeOff className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      ) : (
                        <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      )}
                    </Button>

                    {/* Duplicate Block */}
                    {onDuplicateBlock && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicateBlock(block.id)}
                        className="h-7 w-7 md:h-8 md:w-8 p-0 text-muted-foreground hover:text-blue-500"
                        title="Duplicate block"
                      >
                        <Copy className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </Button>
                    )}

                    {/* Delete Block */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteBlock(block.id)}
                      className="h-7 w-7 md:h-8 md:w-8 p-0 text-muted-foreground hover:text-red-500"
                      title="Delete block"
                    >
                      <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </div>

                {/* Block Content - Collapsible */}
                {!collapsedBlocks.has(block.id) && (
                  <>
                    {/* Link List Block Editor */}
                    {block.type === 'link-list' && (
                      <LinkListEditor
                        block={block}
                        onUpdateBlock={onUpdateBlock}
                        canUploadImages={canUploadImages}
                      />
                    )}

                    {/* Product Catalog Block - Link to Manager */}
                    {block.type === 'product-catalog' && (
                      <ProductCatalogBlockLink
                        block={block}
                        onUpdateBlock={onUpdateBlock}
                        canUploadImages={canUploadImages}
                      />
                    )}

                    {/* Social Icons Block - Link to Manager */}
                    {block.type === 'social-icons' && (
                      <SocialIconsBlockLink
                        block={block}
                        onUpdateBlock={onUpdateBlock}
                      />
                    )}

                    {/* Delivery Platform Block Editor */}
                    {block.type === 'delivery-platform' && (
                      <DeliveryPlatformEditor
                        block={block}
                        onUpdateBlock={onUpdateBlock}
                      />
                    )}

                    {/* Marketplace Block Editor */}
                    {block.type === 'marketplace' && (
                      <MarketplaceEditor
                        block={block}
                        onUpdateBlock={onUpdateBlock}
                      />
                    )}

                    {/* Text Block Editor */}
                    {block.type === 'text' && (
                      <TextBlockEditor
                        block={block}
                        onUpdateBlock={onUpdateBlock}
                      />
                    )}

                    {/* Placeholder for other block types */}
                    {block.type !== 'link-list' &&
                     block.type !== 'product-catalog' &&
                     block.type !== 'social-icons' &&
                     block.type !== 'delivery-platform' &&
                     block.type !== 'marketplace' &&
                     block.type !== 'text' && (
                      <div className="px-3 pb-3">
                        <p className="text-xs text-muted-foreground">
                          Edit via preview panel →
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No blocks yet. Click "Add Block" to get started!</p>
        </div>
      )}

      {/* Floating Action Button - Mobile Only */}
      <button
        onClick={onAddBlock}
        className={`md:hidden fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-95 ${showFAB
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-75 translate-y-10 pointer-events-none'
          }`}
        aria-label="Add Block"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  )
}

// Link List Editor Sub-component
function LinkListEditor({
  block,
  onUpdateBlock,
  canUploadImages = false
}: {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
  canUploadImages?: boolean
}) {
  const [draggedLinkIndex, setDraggedLinkIndex] = useState<number | null>(null)
  const [dragOverLinkIndex, setDragOverLinkIndex] = useState<number | null>(null)
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [selectedLinkIndex, setSelectedLinkIndex] = useState<number | null>(null)
  const [selectedLinks, setSelectedLinks] = useState<Set<number>>(new Set())
  const [bulkMode, setBulkMode] = useState(false)
  const [isDraggingLink, setIsDraggingLink] = useState(false)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)

  // URL validation function
  const isValidURL = (url: string): boolean => {
    if (!url || url.trim() === '') return true // Allow empty for now
    try {
      new URL(url)
      return true
    } catch {
      // Check if it's a relative URL or just missing protocol
      if (url.startsWith('/') || url.startsWith('#')) return true
      if (!url.includes('://') && url.includes('.')) {
        // Try adding https://
        try {
          new URL(`https://${url}`)
          return true
        } catch {
          return false
        }
      }
      return false
    }
  }

  // Bulk selection handlers
  const toggleLinkSelection = (index: number) => {
    setSelectedLinks(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const selectAllLinks = () => {
    setSelectedLinks(new Set(block.props.items.map((_: any, i: number) => i)))
  }

  const deselectAllLinks = () => {
    setSelectedLinks(new Set())
  }

  const deleteSelectedLinks = () => {
    const newItems = block.props.items.filter((_: any, i: number) => !selectedLinks.has(i))
    onUpdateBlock(block.id, { items: newItems })
    setSelectedLinks(new Set())
  }

  // Handle link drag & drop (Desktop)
  const handleLinkDragStart = (e: React.DragEvent, index: number) => {
    setDraggedLinkIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleLinkDragEnd = () => {
    setDraggedLinkIndex(null)
    setDragOverLinkIndex(null)
  }

  const handleLinkDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverLinkIndex(index)
  }

  const handleLinkDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    e.stopPropagation()

    if (draggedLinkIndex === null || draggedLinkIndex === dropIndex) {
      setDraggedLinkIndex(null)
      setDragOverLinkIndex(null)
      return
    }

    const newItems = [...block.props.items]
    const [draggedItem] = newItems.splice(draggedLinkIndex, 1)
    newItems.splice(dropIndex, 0, draggedItem)

    onUpdateBlock(block.id, { items: newItems })
    setDraggedLinkIndex(null)
    setDragOverLinkIndex(null)
  }

  // Handle link drag & drop (Mobile Touch)
  const handleLinkTouchStart = (e: React.TouchEvent, index: number) => {
    if (bulkMode) return

    const touch = e.touches[0]
    setTouchStartY(touch.clientY)
    setDraggedLinkIndex(index)
    setIsDraggingLink(false) // Reset dragging state

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  const handleLinkTouchMove = (e: React.TouchEvent) => {
    if (draggedLinkIndex === null || bulkMode || touchStartY === null) return

    const touch = e.touches[0]
    const deltaY = Math.abs(touch.clientY - touchStartY)

    // Start dragging if moved more than 10px (threshold to distinguish from scroll)
    if (deltaY > 10 && !isDraggingLink) {
      setIsDraggingLink(true)
    }

    // Only prevent default when actually dragging
    if (isDraggingLink) {
      e.preventDefault()

      const element = document.elementFromPoint(touch.clientX, touch.clientY)
      const linkElement = element?.closest('[data-link-index]')

      if (linkElement) {
        const targetIndex = parseInt(linkElement.getAttribute('data-link-index') || '0')
        setDragOverLinkIndex(targetIndex)
      }
    }
  }

  const handleLinkTouchEnd = () => {
    if (draggedLinkIndex === null || dragOverLinkIndex === null || bulkMode || !isDraggingLink) {
      setDraggedLinkIndex(null)
      setDragOverLinkIndex(null)
      setIsDraggingLink(false)
      setTouchStartY(null)
      return
    }

    if (draggedLinkIndex !== dragOverLinkIndex) {
      const newItems = [...block.props.items]
      const [draggedItem] = newItems.splice(draggedLinkIndex, 1)
      newItems.splice(dragOverLinkIndex, 0, draggedItem)
      onUpdateBlock(block.id, { items: newItems })
    }

    setDraggedLinkIndex(null)
    setDragOverLinkIndex(null)
    setIsDraggingLink(false)
    setTouchStartY(null)
  }

  return (
    <div className="px-3 pb-3 space-y-2">
      {/* Bulk Actions Header - Mobile Optimized */}
      {block.props.items?.length > 1 && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-2 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
          {/* Top row: Mode toggle + Actions */}
          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBulkMode(!bulkMode)}
              className="h-8 md:h-7 text-[11px] md:text-xs px-2 md:px-3"
            >
              <CheckSquare className={`h-3 w-3 md:h-3.5 md:w-3.5 mr-1 ${bulkMode ? 'text-primary' : ''}`} />
              <span className="hidden sm:inline">{bulkMode ? 'Exit Bulk' : 'Bulk Select'}</span>
              <span className="sm:hidden">{bulkMode ? 'Exit' : 'Select'}</span>
            </Button>

            {bulkMode && (
              <>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllLinks}
                  className="h-8 md:h-7 text-[11px] md:text-xs px-2 md:px-3"
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deselectAllLinks}
                  className="h-8 md:h-7 text-[11px] md:text-xs px-2 md:px-3"
                >
                  None
                </Button>
              </>
            )}
          </div>

          {/* Bottom row: Delete action (shows when items selected) */}
          {bulkMode && selectedLinks.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] md:text-xs text-muted-foreground">
                {selectedLinks.size} selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={deleteSelectedLinks}
                className="h-8 md:h-7 text-[11px] md:text-xs px-2 md:px-3"
              >
                <Trash2 className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" />
                <span className="hidden sm:inline">Delete Selected</span>
                <span className="sm:hidden">Delete</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {block.props.items?.map((link: any, index: number) => {
        const urlValid = isValidURL(link.url)
        const LinkIcon = link.icon ? getIconByName(link.icon) : null

        return (
          <div
            key={link.id}
            data-link-index={index}
            draggable={!bulkMode}
            onDragStart={!bulkMode ? (e) => handleLinkDragStart(e, index) : undefined}
            onDragEnd={!bulkMode ? handleLinkDragEnd : undefined}
            onDragOver={!bulkMode ? (e) => handleLinkDragOver(e, index) : undefined}
            onDrop={!bulkMode ? (e) => handleLinkDrop(e, index) : undefined}
            onTouchStart={!bulkMode ? (e) => {
              const target = e.target as HTMLElement
              if (target.closest('[data-drag-handle]')) {
                handleLinkTouchStart(e, index)
              }
            } : undefined}
            onTouchMove={!bulkMode ? (e) => handleLinkTouchMove(e) : undefined}
            onTouchEnd={!bulkMode ? handleLinkTouchEnd : undefined}
            className={`group flex items-start gap-2 p-2 rounded border transition-all ${bulkMode ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
              } ${draggedLinkIndex === index
                ? 'opacity-50 scale-95 border-primary'
                : dragOverLinkIndex === index
                  ? 'border-primary bg-primary/5 scale-105'
                  : selectedLinks.has(index)
                    ? 'border-primary bg-primary/10'
                    : !urlValid
                      ? 'border-red-500/50 bg-red-500/5'
                      : 'border-border bg-background hover:border-primary/50'
              }`}
            onClick={bulkMode ? () => toggleLinkSelection(index) : undefined}
          >
            {/* Bulk Selection Checkbox */}
            {bulkMode && (
              <div className="pt-2 md:pt-2.5 flex-shrink-0">
                <Checkbox
                  checked={selectedLinks.has(index)}
                  onCheckedChange={() => toggleLinkSelection(index)}
                />
              </div>
            )}

            {/* Drag handle indicator */}
            {!bulkMode && (
              <div className="pt-2 md:pt-2.5 flex-shrink-0" data-drag-handle>
                <GripVertical className="h-3 w-3 md:h-3.5 md:w-3.5 text-muted-foreground" />
              </div>
            )}

            {/* Icon/Image Button - Compact on Mobile */}
            <div className="pt-1 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedLinkIndex(index)
                  setSelectorOpen(true)
                }}
                className="h-7 w-7 md:h-8 md:w-8 p-0"
                title="Choose icon or image"
              >
                {LinkIcon ? (
                  <LinkIcon className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                ) : link.image ? (
                  <img src={link.image} alt="" className="h-full w-full object-cover rounded" />
                ) : (
                  <ImageIcon className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                )}
              </Button>
            </div>

            <div className="flex-1 space-y-1.5 md:space-y-2 min-w-0">
              <Input
                value={link.title}
                onChange={(e) => {
                  const newItems = [...block.props.items]
                  newItems[index] = { ...link, title: e.target.value }
                  onUpdateBlock(block.id, { items: newItems })
                }}
                className="h-8 md:h-9 text-xs md:text-sm"
                placeholder="Link title"
              />
              <div className="space-y-0.5 md:space-y-1">
                <Input
                  value={link.url}
                  onChange={(e) => {
                    const newItems = [...block.props.items]
                    newItems[index] = { ...link, url: e.target.value }
                    onUpdateBlock(block.id, { items: newItems })
                  }}
                  className={`h-8 md:h-9 text-xs md:text-sm ${!urlValid ? 'border-red-500 focus-visible:ring-red-500' : ''
                    }`}
                  placeholder="https://yoursite.com"
                />
                {!urlValid && link.url && (
                  <p className="text-[10px] md:text-xs text-red-500 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                    Invalid URL
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                const newItems = block.props.items.filter((_: any, i: number) => i !== index)
                onUpdateBlock(block.id, { items: newItems })
              }}
              className="h-7 w-7 md:h-8 md:w-8 p-0 text-muted-foreground hover:text-red-500 flex-shrink-0 mt-1"
            >
              <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </div>
        )
      })}

      {/* Add New Link Button */}
      <div className="pb-2">
        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
          <Button
            onClick={() => {
              const newLink = {
                id: `link-${Date.now()}`,
                title: 'New Link',
                url: 'https://yoursite.com',
                icon: ''
              }
              const newItems = [...(block.props.items || []), newLink]
              onUpdateBlock(block.id, { items: newItems })
            }}
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Link
          </Button>
        </div>
      </div>

      {/* Image/Icon Selector Modal */}
      <ImageIconSelector
        isOpen={selectorOpen}
        onClose={() => {
          setSelectorOpen(false)
          setSelectedLinkIndex(null)
        }}
        onSelectIcon={(iconName: string) => {
          if (selectedLinkIndex !== null) {
            const newItems = [...block.props.items]
            newItems[selectedLinkIndex] = {
              ...newItems[selectedLinkIndex],
              icon: iconName,
              image: '' // Clear image when icon selected
            }
            onUpdateBlock(block.id, { items: newItems })
          }
        }}
        onSelectImage={(imageUrl: string) => {
          if (selectedLinkIndex !== null) {
            const newItems = [...block.props.items]
            newItems[selectedLinkIndex] = {
              ...newItems[selectedLinkIndex],
              image: imageUrl,
              icon: '' // Clear icon when image selected
            }
            onUpdateBlock(block.id, { items: newItems })
          }
        }}
        currentIcon={
          selectedLinkIndex !== null
            ? block.props.items[selectedLinkIndex]?.icon
            : undefined
        }
        currentImage={
          selectedLinkIndex !== null
            ? block.props.items[selectedLinkIndex]?.image
            : undefined
        }
        isPremium={canUploadImages}
      />
    </div>
  )
}

// Product Image Selector Component
// Product Image Selector - Uses Media Library
function ProductImageSelector({
  isOpen,
  onClose,
  onSelectImage,
  currentImage,
  isPremium,
  referenceId
}: {
  isOpen: boolean
  onClose: () => void
  onSelectImage: (imageUrl: string) => void
  currentImage?: string
  isPremium: boolean
  referenceId?: string
}) {
  if (!isOpen) return null

  // Use Media Library for STARTER/PRO users
  if (isPremium) {
    const MediaLibraryPicker = require('@/components/media/MediaLibraryPicker').MediaLibraryPicker

    return (
      <MediaLibraryPicker
        isOpen={true}
        onClose={onClose}
        onSelect={onSelectImage}
        category="product"
        referenceId={referenceId}
        currentImage={currentImage}
        title="Select Product Image"
      />
    )
  }

  // FREE users can only use URL
  const [imageUrl, setImageUrl] = useState(currentImage || '')

  const handleSubmit = () => {
    if (imageUrl.trim()) {
      onSelectImage(imageUrl.trim())
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center animate-in fade-in duration-200">
      <div className="bg-background rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 md:slide-in-from-bottom-0 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center justify-between">
          <h3 className="font-semibold">Product Image</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <Copy className="h-4 w-4 rotate-45" />
          </Button>
        </div>

        {/* Content - URL Only for FREE */}
        <div className="p-4 space-y-4">
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm">
            <p className="font-medium text-blue-700">💡 URL Mode (Free)</p>
            <p className="text-xs text-blue-600 mt-1">
              Upgrade to STARTER or PRO to upload and manage images
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Image URL
            </label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/product.jpg"
              className="h-10"
            />
          </div>

          {imageUrl && (
            <div className="aspect-square rounded-lg overflow-hidden bg-secondary border">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t px-4 py-3 flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!imageUrl.trim()}
            className="flex-1"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}

// Product Layout Dialog - Popup for choosing grid layout
function ProductLayoutDialog({
  currentColumns,
  onClose,
  onSelectLayout
}: {
  currentColumns: 'small' | 'medium'
  onClose: () => void
  onSelectLayout: (columns: 'small' | 'medium') => void
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Choose Grid Layout</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Select how products are displayed</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-all"
            title="Close"
          >
            <Copy className="h-4 w-4 rotate-45" />
          </button>
        </div>

        {/* Layout Options */}
        <div className="p-5 space-y-3">
          {/* Grid Option */}
          <button
            onClick={() => onSelectLayout('small')}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              currentColumns === 'small'
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30'
                : 'border-border hover:border-purple-300 hover:bg-secondary/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                currentColumns === 'small' ? 'bg-purple-600' : 'bg-secondary'
              }`}>
                <Grid3x3 className={`h-6 w-6 ${
                  currentColumns === 'small' ? 'text-white' : 'text-muted-foreground'
                }`} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-base mb-1">Grid</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Compact grid layout for more products
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-md bg-background border">
                    <Smartphone className="h-3 w-3 inline mr-1" />
                    2 columns
                  </span>
                  <span className="px-2 py-1 rounded-md bg-background border">
                    📱 3 columns
                  </span>
                </div>
              </div>
              {currentColumns === 'small' && (
                <div className="flex-shrink-0">
                  <CheckSquare className="h-5 w-5 text-purple-600" />
                </div>
              )}
            </div>
          </button>

          {/* Large Option */}
          <button
            onClick={() => onSelectLayout('medium')}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              currentColumns === 'medium'
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30'
                : 'border-border hover:border-purple-300 hover:bg-secondary/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                currentColumns === 'medium' ? 'bg-purple-600' : 'bg-secondary'
              }`}>
                <Grid2x2 className={`h-6 w-6 ${
                  currentColumns === 'medium' ? 'text-white' : 'text-muted-foreground'
                }`} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-base mb-1">Large</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Bigger cards with more details
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-md bg-background border">
                    <Smartphone className="h-3 w-3 inline mr-1" />
                    1 column
                  </span>
                  <span className="px-2 py-1 rounded-md bg-background border">
                    📱 2 columns
                  </span>
                </div>
              </div>
              {currentColumns === 'medium' && (
                <div className="flex-shrink-0">
                  <CheckSquare className="h-5 w-5 text-purple-600" />
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t bg-secondary/30">
          <p className="text-xs text-muted-foreground text-center">
            Changes will be reflected immediately in preview
          </p>
        </div>
      </div>
    </div>
  )
}

// Product Catalog Block Link - Opens Manager Dialog
function ProductCatalogBlockLink({
  block,
  onUpdateBlock,
  canUploadImages = false
}: {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
  canUploadImages?: boolean
}) {
  const [isManagerOpen, setIsManagerOpen] = useState(false)
  const [isLayoutDialogOpen, setIsLayoutDialogOpen] = useState(false)
  const productCount = block.props.items?.length || 0

  return (
    <>
      <div className="px-3 pb-3">
        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border-2 border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <ShoppingBag className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Product Catalog</h3>
              <p className="text-xs text-muted-foreground">
                {productCount} {productCount === 1 ? 'product' : 'products'}
              </p>
            </div>
            <button
              onClick={() => setIsLayoutDialogOpen(true)}
              className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-all"
              title="Change Layout"
            >
              <Settings className="h-4 w-4 text-purple-600" />
            </button>
          </div>

          <Button
            onClick={() => setIsManagerOpen(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Manage Products
          </Button>

          {productCount === 0 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Click to add your first product
            </p>
          )}
        </div>
      </div>

      {/* Layout Dialog */}
      {isLayoutDialogOpen && (
        <ProductLayoutDialog
          currentColumns={block.props.columns || 'small'}
          onClose={() => setIsLayoutDialogOpen(false)}
          onSelectLayout={(columns) => {
            onUpdateBlock(block.id, { columns })
            setIsLayoutDialogOpen(false)
          }}
        />
      )}

      {/* Product Manager Dialog */}
      {isManagerOpen && (
        <ProductCatalogManager
          block={block}
          onUpdateBlock={onUpdateBlock}
          onClose={() => setIsManagerOpen(false)}
          canUploadImages={canUploadImages}
        />
      )}
    </>
  )
}

// Product Catalog Manager - Fullscreen Dialog
function ProductCatalogManager({
  block,
  onUpdateBlock,
  onClose,
  canUploadImages = false
}: {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
  onClose: () => void
  canUploadImages?: boolean
}) {
  const [draggedProductIndex, setDraggedProductIndex] = useState<number | null>(null)
  const [dragOverProductIndex, setDragOverProductIndex] = useState<number | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set())
  const [bulkMode, setBulkMode] = useState(false)
  const [isDraggingProduct, setIsDraggingProduct] = useState(false)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [imagePickerOpen, setImagePickerOpen] = useState(false)
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set())
  const [isLayoutDialogOpen, setIsLayoutDialogOpen] = useState(false)

  // Toggle expand/collapse product
  const toggleExpandProduct = (index: number) => {
    setExpandedProducts(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  // Duplicate product
  const duplicateProduct = (index: number) => {
    const productToDuplicate = block.props.items[index]
    if (!productToDuplicate) return

    const duplicatedProduct = {
      id: `product-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      ...JSON.parse(JSON.stringify(productToDuplicate))
    }

    const newItems = [...block.props.items]
    newItems.splice(index + 1, 0, duplicatedProduct)
    onUpdateBlock(block.id, { items: newItems })

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  // Filter products by search
  const filteredProducts = block.props.items?.filter((product: any) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      product.name?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    )
  }) || []

  // Bulk selection handlers
  const toggleProductSelection = (index: number) => {
    setSelectedProducts(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const selectAllProducts = () => {
    setSelectedProducts(new Set(block.props.items.map((_: any, i: number) => i)))
  }

  const deselectAllProducts = () => {
    setSelectedProducts(new Set())
  }

  const deleteSelectedProducts = () => {
    const newItems = block.props.items.filter((_: any, i: number) => !selectedProducts.has(i))
    onUpdateBlock(block.id, { items: newItems })
    setSelectedProducts(new Set())
  }

  // Handle product drag & drop (Desktop)
  const handleProductDragStart = (e: React.DragEvent, index: number) => {
    setDraggedProductIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleProductDragEnd = () => {
    setDraggedProductIndex(null)
    setDragOverProductIndex(null)
  }

  const handleProductDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverProductIndex(index)
  }

  const handleProductDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    e.stopPropagation()

    if (draggedProductIndex === null || draggedProductIndex === dropIndex) {
      setDraggedProductIndex(null)
      setDragOverProductIndex(null)
      return
    }

    const newItems = [...block.props.items]
    const [draggedItem] = newItems.splice(draggedProductIndex, 1)
    newItems.splice(dropIndex, 0, draggedItem)

    onUpdateBlock(block.id, { items: newItems })
    setDraggedProductIndex(null)
    setDragOverProductIndex(null)
  }

  // Handle product drag & drop (Mobile Touch)
  const handleProductTouchStart = (e: React.TouchEvent, index: number) => {
    if (bulkMode) return

    const touch = e.touches[0]
    setTouchStartY(touch.clientY)
    setDraggedProductIndex(index)
    setIsDraggingProduct(false)

    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  const handleProductTouchMove = (e: React.TouchEvent) => {
    if (draggedProductIndex === null || bulkMode || touchStartY === null) return

    const touch = e.touches[0]
    const deltaY = Math.abs(touch.clientY - touchStartY)

    if (deltaY > 10 && !isDraggingProduct) {
      setIsDraggingProduct(true)
    }

    if (isDraggingProduct) {
      e.preventDefault()

      const element = document.elementFromPoint(touch.clientX, touch.clientY)
      const productElement = element?.closest('[data-product-index]')

      if (productElement) {
        const targetIndex = parseInt(productElement.getAttribute('data-product-index') || '0')
        setDragOverProductIndex(targetIndex)
      }
    }
  }

  const handleProductTouchEnd = () => {
    if (draggedProductIndex === null || dragOverProductIndex === null || bulkMode || !isDraggingProduct) {
      setDraggedProductIndex(null)
      setDragOverProductIndex(null)
      setIsDraggingProduct(false)
      setTouchStartY(null)
      return
    }

    if (draggedProductIndex !== dragOverProductIndex) {
      const newItems = [...block.props.items]
      const [draggedItem] = newItems.splice(draggedProductIndex, 1)
      newItems.splice(dragOverProductIndex, 0, draggedItem)
      onUpdateBlock(block.id, { items: newItems })
    }

    setDraggedProductIndex(null)
    setDragOverProductIndex(null)
    setIsDraggingProduct(false)
    setTouchStartY(null)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S = Save (prevent default browser save)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        onClose()
      }

      // Escape = Close
      if (e.key === 'Escape') {
        onClose()
      }

      // Cmd/Ctrl + N = New Product
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        const newProduct = {
          id: `product-${Date.now()}`,
          name: 'New Product',
          image: '',
          price: 0,
          stock: 'available',
          category: '',
          description: ''
        }
        const newItems = [...(block.props.items || []), newProduct]
        onUpdateBlock(block.id, { items: newItems })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, block, onUpdateBlock])

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-orange-500/5">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-base sm:text-lg truncate">Product Manager</h2>
              <p className="text-xs text-muted-foreground">
                {filteredProducts.length} of {block.props.items?.length || 0} products
              </p>
            </div>
          </div>

          {/* Layout Button */}
          <button
            onClick={() => setIsLayoutDialogOpen(true)}
            className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-all flex-shrink-0"
            title="Change Layout"
          >
            {block.props.columns === 'medium' ? (
              <Grid2x2 className="h-4 w-4" />
            ) : (
              <Grid3x3 className="h-4 w-4" />
            )}
          </button>

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

        {/* Search Bar */}
        {block.props.items?.length > 0 && (
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="h-9 pl-9 pr-9 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center"
                >
                  <Copy className="h-3 w-3 rotate-45" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-3">
          {/* Bulk Actions Header */}
          {block.props.items?.length > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBulkMode(!bulkMode)}
              className="h-8 md:h-7 text-[11px] md:text-xs px-2 md:px-3"
            >
              <CheckSquare className={`h-3 w-3 md:h-3.5 md:w-3.5 mr-1 ${bulkMode ? 'text-primary' : ''}`} />
              <span className="hidden sm:inline">{bulkMode ? 'Exit Bulk' : 'Bulk Select'}</span>
              <span className="sm:hidden">{bulkMode ? 'Exit' : 'Select'}</span>
            </Button>

            {bulkMode && (
              <>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllProducts}
                  className="h-8 md:h-7 text-[11px] md:text-xs px-2 md:px-3"
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deselectAllProducts}
                  className="h-8 md:h-7 text-[11px] md:text-xs px-2 md:px-3"
                >
                  None
                </Button>
              </>
            )}
          </div>

          {bulkMode && selectedProducts.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] md:text-xs text-muted-foreground">
                {selectedProducts.size} selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={deleteSelectedProducts}
                className="h-8 md:h-7 text-[11px] md:text-xs px-2 md:px-3"
              >
                <Trash2 className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" />
                <span className="hidden sm:inline">Delete Selected</span>
                <span className="sm:hidden">Delete</span>
              </Button>
            </div>
          )}
        </div>
      )}

          {/* No Results Message */}
          {filteredProducts.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">No products found</p>
              <p className="text-xs text-muted-foreground">
                Try a different search term
              </p>
            </div>
          )}

          {/* Product List */}
          {filteredProducts.map((product: any) => {
            const originalIndex = block.props.items.findIndex((p: any) => p.id === product.id)
            const isExpanded = expandedProducts.has(originalIndex)

            return (
              <div
                key={product.id}
                data-product-index={originalIndex}
                draggable={!bulkMode}
                onDragStart={!bulkMode ? (e) => handleProductDragStart(e, originalIndex) : undefined}
                onDragEnd={!bulkMode ? handleProductDragEnd : undefined}
                onDragOver={!bulkMode ? (e) => handleProductDragOver(e, originalIndex) : undefined}
                onDrop={!bulkMode ? (e) => handleProductDrop(e, originalIndex) : undefined}
                onTouchStart={!bulkMode ? (e) => {
                  const target = e.target as HTMLElement
                  if (target.closest('[data-drag-handle]')) {
                    handleProductTouchStart(e, originalIndex)
                  }
                } : undefined}
                onTouchMove={!bulkMode ? (e) => handleProductTouchMove(e) : undefined}
                onTouchEnd={!bulkMode ? handleProductTouchEnd : undefined}
                className={`group flex flex-col gap-2 p-2.5 rounded-lg border transition-all ${
                  bulkMode ? 'cursor-pointer' : ''
                } ${
                  draggedProductIndex === originalIndex
                    ? 'opacity-50 scale-[0.98] border-purple-500 bg-purple-50'
                    : dragOverProductIndex === originalIndex
                      ? 'border-purple-500 bg-purple-500/5 scale-[1.01]'
                      : selectedProducts.has(originalIndex)
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-border bg-card hover:border-purple-200 hover:shadow-sm'
                }`}
                onClick={bulkMode ? () => toggleProductSelection(originalIndex) : undefined}
              >
                {/* Header Row: Checkbox/Drag + Image + Info + Actions */}
                <div className="flex items-start gap-2">
                  {/* Bulk Selection Checkbox */}
                  {bulkMode && (
                    <div className="pt-1 flex-shrink-0">
                      <Checkbox
                        checked={selectedProducts.has(originalIndex)}
                        onCheckedChange={() => toggleProductSelection(originalIndex)}
                      />
                    </div>
                  )}

                  {/* Drag handle with Product Number */}
                  {!bulkMode && (
                    <div className="flex-shrink-0 flex flex-col items-center gap-1" data-drag-handle>
                      <div className="p-1.5 hover:bg-purple-50 rounded-lg cursor-grab active:cursor-grabbing transition-colors">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="text-[10px] font-semibold text-muted-foreground/70 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                        #{originalIndex + 1}
                      </div>
                    </div>
                  )}

                  {/* Product Image - Clickable */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedProductIndex(originalIndex)
                      setImagePickerOpen(true)
                    }}
                    className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 transition-all active:scale-95"
                    title="Change image"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-purple-400" />
                      </div>
                    )}
                  </button>

                  {/* Product Info Summary */}
                  <div className="flex-1 min-w-0 py-0.5">
                    <h3 className="font-semibold text-sm truncate mb-0.5">
                      {product.name || 'Unnamed Product'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">
                        Rp {product.price?.toLocaleString('id-ID') || '0'}
                      </span>
                      <span className="text-[10px]">•</span>
                      <span className={`text-[10px] font-medium ${
                        product.stock === 'available' ? 'text-green-600' :
                        product.stock === 'low' ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {product.stock === 'available' ? '✓' :
                         product.stock === 'low' ? '⚠' : '✗'}
                      </span>
                      {product.category && (
                        <>
                          <span className="text-[10px]">•</span>
                          <span className="text-[10px] truncate">{product.category}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex-shrink-0 flex gap-1">
                    {/* Expand/Collapse */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpandProduct(originalIndex)
                      }}
                      className="h-7 w-7 rounded-md hover:bg-secondary flex items-center justify-center transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        duplicateProduct(originalIndex)
                      }}
                      className="h-7 w-7 rounded-md hover:bg-secondary flex items-center justify-center transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const newItems = block.props.items.filter((_: any, i: number) => i !== originalIndex)
                        onUpdateBlock(block.id, { items: newItems })
                      }}
                      className="h-7 w-7 rounded-md hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Form - All Fields */}
                {isExpanded && (
                  <div className="space-y-2 pt-2 border-t">
                    {/* Product Name */}
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Product Name *</label>
                      <Input
                        value={product.name || ''}
                        onChange={(e) => {
                          const newItems = [...block.props.items]
                          newItems[originalIndex] = { ...product, name: e.target.value }
                          onUpdateBlock(block.id, { items: newItems })
                        }}
                        className={`h-8 text-sm ${!product.name ? 'border-red-300' : ''}`}
                        placeholder="e.g. Nasi Goreng Special"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Description</label>
                      <textarea
                        value={product.description || ''}
                        onChange={(e) => {
                          const newItems = [...block.props.items]
                          newItems[originalIndex] = { ...product, description: e.target.value }
                          onUpdateBlock(block.id, { items: newItems })
                        }}
                        className="w-full h-16 px-3 py-2 text-xs rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                        placeholder="Brief description of your product..."
                      />
                    </div>

                    {/* Price & Original Price */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Price (IDR) *</label>
                        <Input
                          type="number"
                          value={product.price || ''}
                          onChange={(e) => {
                            const newItems = [...block.props.items]
                            newItems[originalIndex] = { ...product, price: parseFloat(e.target.value) || 0 }
                            onUpdateBlock(block.id, { items: newItems })
                          }}
                          className={`h-8 text-xs ${product.price <= 0 ? 'border-red-300' : ''}`}
                          placeholder="25000"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Original Price</label>
                        <Input
                          type="number"
                          value={product.originalPrice || ''}
                          onChange={(e) => {
                            const newItems = [...block.props.items]
                            newItems[originalIndex] = { ...product, originalPrice: parseFloat(e.target.value) || undefined }
                            onUpdateBlock(block.id, { items: newItems })
                          }}
                          className="h-8 text-xs"
                          placeholder="35000"
                        />
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Stock Status</label>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            const newItems = [...block.props.items]
                            newItems[originalIndex] = { ...product, stock: 'available' }
                            onUpdateBlock(block.id, { items: newItems })
                          }}
                          className={`flex-1 h-7 rounded-md text-[10px] font-medium transition-all ${
                            product.stock === 'available'
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80'
                          }`}
                        >
                          ✓ Stock
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            const newItems = [...block.props.items]
                            newItems[originalIndex] = { ...product, stock: 'low' }
                            onUpdateBlock(block.id, { items: newItems })
                          }}
                          className={`flex-1 h-7 rounded-md text-[10px] font-medium transition-all ${
                            product.stock === 'low'
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80'
                          }`}
                        >
                          ⚠ Low
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            const newItems = [...block.props.items]
                            newItems[originalIndex] = { ...product, stock: 'out' }
                            onUpdateBlock(block.id, { items: newItems })
                          }}
                          className={`flex-1 h-7 rounded-md text-[10px] font-medium transition-all ${
                            product.stock === 'out'
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80'
                          }`}
                        >
                          ✗ Out
                        </button>
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Category</label>
                      <Input
                        value={product.category || ''}
                        onChange={(e) => {
                          const newItems = [...block.props.items]
                          newItems[originalIndex] = { ...product, category: e.target.value }
                          onUpdateBlock(block.id, { items: newItems })
                        }}
                        className="h-8 text-xs"
                        placeholder="e.g. Main Course, Beverage"
                      />
                    </div>

                    {/* WhatsApp Message */}
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Custom WhatsApp Message</label>
                      <textarea
                        value={product.whatsappMessage || ''}
                        onChange={(e) => {
                          const newItems = [...block.props.items]
                          newItems[originalIndex] = { ...product, whatsappMessage: e.target.value }
                          onUpdateBlock(block.id, { items: newItems })
                        }}
                        className="w-full h-12 px-3 py-2 text-xs rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                        placeholder="Halo, saya ingin order..."
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Add New Product Button */}
          {filteredProducts.length > 0 && (
            <div className="pb-2">
              <Button
                onClick={() => {
                  const newProduct = {
                    id: `product-${Date.now()}`,
                    name: '',
                    description: '',
                    image: '',
                    price: 0,
                    originalPrice: undefined,
                    stock: 'available',
                    category: '',
                    whatsappMessage: ''
                  }
                  const newItems = [...(block.props.items || []), newProduct]
                  onUpdateBlock(block.id, { items: newItems })

                  // Expand the new product automatically
                  setTimeout(() => {
                    setExpandedProducts(prev => {
                      const next = new Set(prev)
                      next.add(newItems.length - 1)
                      return next
                    })
                  }, 100)
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-9"
                title="Add Product (Cmd+N)"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          )}

          {/* Empty State - Actionable */}
          {(!block.props.items || block.props.items.length === 0) && !searchQuery && (
            <div className="text-center py-16">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4">
                <Package className="h-16 w-16 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                Start building your catalog by adding your first product
              </p>
              <Button
                onClick={() => {
                  const newProduct = {
                    id: `product-${Date.now()}`,
                    name: '',
                    description: '',
                    image: '',
                    price: 0,
                    originalPrice: undefined,
                    stock: 'available',
                    category: '',
                    whatsappMessage: ''
                  }
                  const newItems = [newProduct]
                  onUpdateBlock(block.id, { items: newItems })

                  // Expand automatically
                  setTimeout(() => {
                    setExpandedProducts(new Set([0]))
                  }, 100)
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add First Product
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">Cmd+N</kbd> to quickly add products
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t bg-card p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {block.props.items?.length || 0} products in catalog
          </div>
          <Button
            onClick={onClose}
            variant="outline"
          >
            Done
          </Button>
        </div>
      </div>

      {/* Product Image Selector Modal */}
      {selectedProductIndex !== null && (
        <ProductImageSelector
          isOpen={imagePickerOpen}
          onClose={() => {
            setImagePickerOpen(false)
            setSelectedProductIndex(null)
          }}
          onSelectImage={(imageUrl: string) => {
            if (selectedProductIndex !== null) {
              const newItems = [...block.props.items]
              newItems[selectedProductIndex] = {
                ...newItems[selectedProductIndex],
                image: imageUrl
              }
              onUpdateBlock(block.id, { items: newItems })
            }
          }}
          currentImage={block.props.items[selectedProductIndex]?.image}
          isPremium={canUploadImages}
          referenceId={`product-grid:${block.id}:item-${selectedProductIndex}:image`}
        />
      )}

      {/* Layout Dialog */}
      {isLayoutDialogOpen && (
        <ProductLayoutDialog
          currentColumns={block.props.columns || 'small'}
          onClose={() => setIsLayoutDialogOpen(false)}
          onSelectLayout={(columns) => {
            onUpdateBlock(block.id, { columns })
            setIsLayoutDialogOpen(false)
          }}
        />
      )}
    </div>
  )
}

// Social Icons Block Link - Opens Manager Dialog
function SocialIconsBlockLink({
  block,
  onUpdateBlock
}: {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
}) {
  const [isManagerOpen, setIsManagerOpen] = useState(false)
  const platformCount = block.props.platforms?.length || 0

  return (
    <>
      <div className="px-3 pb-3">
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 border-2 border-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Share2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Social Icons</h3>
              <p className="text-xs text-muted-foreground">
                {platformCount} {platformCount === 1 ? 'platform' : 'platforms'}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsManagerOpen(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Manage Social Links
          </Button>

          {platformCount === 0 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Click to add your social media links
            </p>
          )}
        </div>
      </div>

      {/* Social Icons Manager Dialog */}
      {isManagerOpen && (
        <SocialIconsManager
          block={block}
          onUpdateBlock={onUpdateBlock}
          onClose={() => setIsManagerOpen(false)}
        />
      )}
    </>
  )
}

// Delivery Platform Editor Component - Card Link Style
function DeliveryPlatformEditor({
  block,
  onUpdateBlock
}: {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
}) {
  const [isManagerOpen, setIsManagerOpen] = useState(false)
  const platforms = block.props.platforms || {}
  const activePlatformCount = Object.keys(platforms).filter(key => platforms[key]).length

  return (
    <>
      <div className="px-3 pb-3">
        <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-green-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <UtensilsCrossed className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Food Delivery</h3>
              <p className="text-xs text-muted-foreground">
                {activePlatformCount} {activePlatformCount === 1 ? 'platform' : 'platforms'} configured
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsManagerOpen(true)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Manage Delivery Platforms
          </Button>

          {activePlatformCount === 0 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Click to add your delivery platform links
            </p>
          )}
        </div>
      </div>

      {/* Delivery Platform Manager Dialog */}
      {isManagerOpen && (
        <DeliveryPlatformManager
          block={block}
          onUpdateBlock={onUpdateBlock}
          onClose={() => setIsManagerOpen(false)}
        />
      )}
    </>
  )
}

// Delivery Platform Manager Dialog - Fullscreen
function DeliveryPlatformManager({
  block,
  onUpdateBlock,
  onClose
}: {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
  onClose: () => void
}) {
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

  const DELIVERY_PLATFORMS = [
    { key: 'gofood', name: 'GoFood', icon: '🟢', color: 'bg-green-600' },
    { key: 'grabfood', name: 'GrabFood', icon: '🍴', color: 'bg-emerald-600' },
    { key: 'shopeefood', name: 'ShopeeFood', icon: '🍜', color: 'bg-orange-600' }
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
                className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  isActive
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

// Marketplace Editor Component - Card Link Style
function MarketplaceEditor({
  block,
  onUpdateBlock
}: {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
}) {
  const [isManagerOpen, setIsManagerOpen] = useState(false)
  const stores = block.props.stores || {}
  const activeStoreCount = Object.keys(stores).filter(key => stores[key]).length

  return (
    <>
      <div className="px-3 pb-3">
        <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 border-2 border-orange-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Store className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">E-commerce Stores</h3>
              <p className="text-xs text-muted-foreground">
                {activeStoreCount} {activeStoreCount === 1 ? 'store' : 'stores'} configured
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsManagerOpen(true)}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Manage E-commerce Stores
          </Button>

          {activeStoreCount === 0 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Click to add your online store links
            </p>
          )}
        </div>
      </div>

      {/* Marketplace Manager Dialog */}
      {isManagerOpen && (
        <MarketplaceManager
          block={block}
          onUpdateBlock={onUpdateBlock}
          onClose={() => setIsManagerOpen(false)}
        />
      )}
    </>
  )
}

// Marketplace Manager Dialog - Fullscreen
function MarketplaceManager({
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
                className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  isActive
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

// Text Block Editor Component
function TextBlockEditor({
  block,
  onUpdateBlock
}: {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
}) {
  const updateField = (field: string, value: any) => {
    onUpdateBlock(block.id, {
      ...block.props,
      [field]: value
    })
  }

  return (
    <div className="px-3 pb-3 space-y-3">
      <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-2 border-blue-500/20">
        {/* Content Textarea */}
        <div className="space-y-2 mb-4">
          <label className="text-sm font-semibold text-muted-foreground">Text Content</label>
          <textarea
            value={block.props.content || ''}
            onChange={(e) => updateField('content', e.target.value)}
            placeholder="Enter your text here..."
            className="w-full h-32 px-3 py-2 text-sm rounded-md border border-input bg-background resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">
            Supports multi-line text
          </p>
        </div>

        {/* Formatting Options */}
        <div className="grid grid-cols-2 gap-3">
          {/* Alignment */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Alignment</label>
            <select
              value={block.props.align || 'left'}
              onChange={(e) => updateField('align', e.target.value)}
              className="w-full h-9 px-3 text-xs rounded-md border border-input bg-background"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Font Size</label>
            <select
              value={block.props.size || 'base'}
              onChange={(e) => updateField('size', e.target.value)}
              className="w-full h-9 px-3 text-xs rounded-md border border-input bg-background"
            >
              <option value="xs">Extra Small</option>
              <option value="sm">Small</option>
              <option value="base">Base</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
              <option value="2xl">2X Large</option>
              <option value="3xl">3X Large</option>
            </select>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Font Weight</label>
            <select
              value={block.props.weight || 'normal'}
              onChange={(e) => updateField('weight', e.target.value)}
              className="w-full h-9 px-3 text-xs rounded-md border border-input bg-background"
            >
              <option value="light">Light</option>
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="semibold">Semibold</option>
              <option value="bold">Bold</option>
            </select>
          </div>

          {/* Spacing */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Line Height</label>
            <select
              value={block.props.spacing || 'normal'}
              onChange={(e) => updateField('spacing', e.target.value)}
              className="w-full h-9 px-3 text-xs rounded-md border border-input bg-background"
            >
              <option value="tight">Tight</option>
              <option value="normal">Normal</option>
              <option value="relaxed">Relaxed</option>
              <option value="loose">Loose</option>
            </select>
          </div>
        </div>

        {/* Color and Max Width */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {/* Text Color */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Text Color (Optional)</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={block.props.color || '#000000'}
                onChange={(e) => updateField('color', e.target.value)}
                className="w-12 h-9 rounded border cursor-pointer"
              />
              <Input
                type="text"
                value={block.props.color || ''}
                onChange={(e) => updateField('color', e.target.value)}
                placeholder="Default"
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Max Width */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Max Width</label>
            <select
              value={block.props.maxWidth || 'md'}
              onChange={(e) => updateField('maxWidth', e.target.value)}
              className="w-full h-9 px-3 text-xs rounded-md border border-input bg-background"
            >
              <option value="sm">Small (384px)</option>
              <option value="md">Medium (448px)</option>
              <option value="lg">Large (512px)</option>
              <option value="xl">Extra Large (576px)</option>
              <option value="2xl">2X Large (672px)</option>
              <option value="full">Full Width</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

// Popular social platforms with brand colors
const POPULAR_PLATFORMS = [
  { key: 'instagram', name: 'Instagram', color: '#E4405F', icon: '📷' },
  { key: 'twitter', name: 'Twitter', color: '#1DA1F2', icon: '🐦' },
  { key: 'x', name: 'X', color: '#000000', icon: '✖' },
  { key: 'facebook', name: 'Facebook', color: '#1877F2', icon: '👍' },
  { key: 'tiktok', name: 'TikTok', color: '#000000', icon: '🎵' },
  { key: 'youtube', name: 'YouTube', color: '#FF0000', icon: '▶' },
  { key: 'linkedin', name: 'LinkedIn', color: '#0A66C2', icon: '💼' },
  { key: 'github', name: 'GitHub', color: '#181717', icon: '💻' },
  { key: 'threads', name: 'Threads', color: '#000000', icon: '🧵' },
  { key: 'whatsapp', name: 'WhatsApp', color: '#25D366', icon: '💬' },
  { key: 'telegram', name: 'Telegram', color: '#26A5E4', icon: '✈️' },
  { key: 'discord', name: 'Discord', color: '#5865F2', icon: '🎮' },
  { key: 'snapchat', name: 'Snapchat', color: '#FFFC00', icon: '👻' },
  { key: 'pinterest', name: 'Pinterest', color: '#E60023', icon: '📌' },
  { key: 'twitch', name: 'Twitch', color: '#9146FF', icon: '🎮' },
  { key: 'spotify', name: 'Spotify', color: '#1DB954', icon: '🎵' },
  { key: 'soundcloud', name: 'SoundCloud', color: '#FF5500', icon: '🎧' },
  { key: 'medium', name: 'Medium', color: '#000000', icon: '📝' },
  { key: 'behance', name: 'Behance', color: '#1769FF', icon: '🎨' },
  { key: 'dribbble', name: 'Dribbble', color: '#EA4C89', icon: '🏀' },
]

// Social Icons Manager - Fullscreen Dialog
function SocialIconsManager({
  block,
  onUpdateBlock,
  onClose
}: {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
  onClose: () => void
}) {
  const platforms = block.props.platforms || []
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  // Add platform
  const addPlatform = (platformKey: string) => {
    const platformInfo = POPULAR_PLATFORMS.find(p => p.key === platformKey)
    if (!platformInfo) return

    // Check if already exists
    if (platforms.some((p: any) => p.platform === platformKey)) {
      alert(`${platformInfo.name} already added!`)
      return
    }

    const newPlatform = {
      platform: platformKey,
      url: '',
      username: ''
    }

    onUpdateBlock(block.id, {
      platforms: [...platforms, newPlatform]
    })

    // Auto-expand the newly added platform
    setTimeout(() => {
      setExpandedIndex(platforms.length)
    }, 100)
  }

  // Update platform
  const updatePlatform = (index: number, field: string, value: string) => {
    const newPlatforms = [...platforms]
    newPlatforms[index] = { ...newPlatforms[index], [field]: value }
    onUpdateBlock(block.id, { platforms: newPlatforms })
  }

  // Delete platform
  const deletePlatform = (index: number) => {
    const newPlatforms = platforms.filter((_: any, i: number) => i !== index)
    onUpdateBlock(block.id, { platforms: newPlatforms })
    if (expandedIndex === index) setExpandedIndex(null)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Get added platform keys
  const addedPlatformKeys = platforms.map((p: any) => p.platform)

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-teal-500/5">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0">
              <Share2 className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-base sm:text-lg truncate">Social Links Manager</h2>
              <p className="text-xs text-muted-foreground">
                {platforms.length} {platforms.length === 1 ? 'platform' : 'platforms'} connected
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
        <div className="max-w-4xl mx-auto p-4 space-y-6">

          {/* Added Platforms */}
          {platforms.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Connected Platforms</h3>
              {platforms.map((platform: any, index: number) => {
                const platformInfo = POPULAR_PLATFORMS.find(p => p.key === platform.platform)
                const isExpanded = expandedIndex === index

                return (
                  <div
                    key={index}
                    className="border-2 rounded-lg bg-card overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 p-3 bg-secondary/30">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: platformInfo?.color + '20' }}
                      >
                        {platformInfo?.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{platformInfo?.name || platform.platform}</h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {platform.username ? `@${platform.username}` : platform.url || 'Not configured'}
                        </p>
                      </div>
                      <button
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                        className="p-2 hover:bg-background rounded-lg transition-all"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => deletePlatform(index)}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Expanded Form */}
                    {isExpanded && (
                      <div className="p-4 space-y-3 border-t">
                        <div>
                          <label className="text-xs font-medium block mb-1.5">Username</label>
                          <Input
                            value={platform.username || ''}
                            onChange={(e) => updatePlatform(index, 'username', e.target.value)}
                            placeholder="yourusername"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium block mb-1.5">Full URL (Optional)</label>
                          <Input
                            value={platform.url || ''}
                            onChange={(e) => updatePlatform(index, 'url', e.target.value)}
                            placeholder={`https://${platformInfo?.name.toLowerCase()}.com/yourusername`}
                            className="h-9"
                          />
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Leave empty to auto-generate from username
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Add New Platform */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Add Platform</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {POPULAR_PLATFORMS.map((platform) => {
                const isAdded = addedPlatformKeys.includes(platform.key)
                return (
                  <button
                    key={platform.key}
                    onClick={() => !isAdded && addPlatform(platform.key)}
                    disabled={isAdded}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      isAdded
                        ? 'opacity-50 cursor-not-allowed bg-secondary/50'
                        : 'hover:border-primary hover:bg-primary/5 active:scale-95'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="text-xs font-medium truncate">{platform.name}</span>
                    </div>
                    {isAdded && (
                      <span className="text-[10px] text-green-600 font-medium">✓ Added</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Empty State */}
          {platforms.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Share2 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="font-semibold mb-2">No Social Links Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Click on any platform above to add your social media links
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t bg-card p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {platforms.length} / {POPULAR_PLATFORMS.length} platforms
          </div>
          <Button onClick={onClose} variant="outline">
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
