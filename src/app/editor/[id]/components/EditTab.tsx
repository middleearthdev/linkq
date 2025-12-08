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
import WhatsAppEditorDialog from "./dialog/WhatsAppEditorDialog"
import BioEditorDialog from "./dialog/BioEditorDialog"
import ProductCatalogEditorDialog from "./dialog/ProductCatalogEditorDialog"
import MarketplaceEditorDialog from "./dialog/MarketplaceEditorDialog"
import DeliveryPlatformManagerDialog from "./dialog/DeliveryPlatformManagerDialog"
import SocialIconsManagerDialog from "./dialog/SocialIconsManagerDialog"
import { TextBlockEditor } from "./editors/TextBlockEditor"

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
  onUpdateBlock,
  userPlan = 'FREE'
}: {
  bioBlock: Block | undefined
  onToggleBioBlock: () => void
  onUpdateBlock: (blockId: string, newProps: any) => void
  userPlan?: 'FREE' | 'STARTER' | 'PRO'
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
                {hasBioBlock && bioBlock.props.bio
                  ? bioBlock.props.bio
                  : 'Avatar, name, and bio'}
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
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-2 ${hasBioBlock ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasBioBlock ? 'translate-x-6' : 'translate-x-1'
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
          userPlan={userPlan}
        />
      )}
    </>
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
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-2 ${hasWhatsAppBlock ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasWhatsAppBlock ? 'translate-x-6' : 'translate-x-1'
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

      {/* Blocks Settings - Bio  */}
      <div>
        <BioBlockCard
          bioBlock={bioBlock}
          onToggleBioBlock={onToggleBioBlock}
          onUpdateBlock={onUpdateBlock}
          userPlan={userPlan}
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

      {/* Special Blocks Settings - Bio & WhatsApp */}
      <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h3 className="text-sm font-semibold text-foreground dark:text-white">Special Features</h3>
        </div>

        {/* WhatsApp Business Card */}
        <WhatsAppBusinessCard
          whatsappBlock={blocks.find(b => b.type === 'whatsapp-business')}
          onToggleWhatsAppBlock={onToggleWhatsAppBlock}
          onUpdateBlock={onUpdateBlock}
        />
      </div>

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

      {/* Product Manager Dialog */}
      {isManagerOpen && (
        <ProductCatalogEditorDialog
          block={block}
          onUpdateBlock={onUpdateBlock}
          onClose={() => setIsManagerOpen(false)}
          canUploadImages={canUploadImages}
        />
      )}
    </>
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
        <SocialIconsManagerDialog
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
        <DeliveryPlatformManagerDialog
          block={block}
          onUpdateBlock={onUpdateBlock}
          onClose={() => setIsManagerOpen(false)}
        />
      )}
    </>
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
        <MarketplaceEditorDialog
          block={block}
          onUpdateBlock={onUpdateBlock}
          onClose={() => setIsManagerOpen(false)}
        />
      )}
    </>
  )
}

