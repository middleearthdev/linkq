/**
 * Edit Tab Component
 * Blocks editor with special features toggles
 */

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, GripVertical, Link2, Settings, Smartphone, Sparkles } from "lucide-react"

interface Block {
  id: string
  type: string
  props: any
}

interface EditTabProps {
  blocks: Block[]
  handle: string
  bioBlock: Block | undefined
  onToggleBioBlock: () => void
  onToggleWhatsAppBlock: () => void
  onAddBlock: () => void
  onUpdateBlock: (blockId: string, newProps: any) => void
  onDeleteBlock: (blockId: string) => void
  draggedBlockIndex: number | null
  dragOverBlockIndex: number | null
  onBlockDragStart: (e: React.DragEvent, index: number) => void
  onBlockDragEnd: () => void
  onBlockDragOver: (e: React.DragEvent, index: number) => void
  onBlockDrop: (e: React.DragEvent, index: number) => void
  onBlockTouchStart: (e: React.TouchEvent, index: number) => void
  onBlockTouchMove: (e: React.TouchEvent) => void
  onBlockTouchEnd: () => void
}

export function EditTab({
  blocks,
  handle,
  bioBlock,
  onToggleBioBlock,
  onToggleWhatsAppBlock,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
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

  // Filter blocks (exclude bio and whatsapp-business)
  const editableBlocks = blocks.filter(b => b.type !== 'bio' && b.type !== 'whatsapp-business')
  const hasBioBlock = blocks.some(b => b.type === 'bio')
  const hasWhatsAppBlock = blocks.some(b => b.type === 'whatsapp-business')

  return (
    <div className="space-y-6">
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

      {/* Add Block Button */}
      <Button
        onClick={onAddBlock}
        className="w-full h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-lg"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Block
      </Button>

      {/* Special Blocks Settings - Bio & WhatsApp */}
      <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h3 className="text-sm font-semibold text-foreground dark:text-white">Special Features</h3>
        </div>

        {/* Bio Block Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-card dark:bg-[#2A3441] border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Settings className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground dark:text-white">Bio Section</h4>
              <p className="text-xs text-muted-foreground">Avatar, name, and description</p>
            </div>
          </div>
          <button
            onClick={onToggleBioBlock}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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

        {/* WhatsApp Business Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-card dark:bg-[#2A3441] border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Smartphone className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground dark:text-white">WhatsApp Business</h4>
              <p className="text-xs text-muted-foreground">Floating chat button</p>
            </div>
          </div>
          <button
            onClick={onToggleWhatsAppBlock}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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
                className={`space-y-3 rounded-lg border transition-all ${
                  draggedBlockIndex === originalIndex
                    ? 'opacity-50 scale-95 border-border shadow-xl'
                    : dragOverBlockIndex === originalIndex
                    ? 'border-primary bg-primary/5 scale-105'
                    : 'border-border bg-card dark:bg-[#2A3441]'
                }`}
                onDragOver={isDraggable ? (e) => onBlockDragOver(e, originalIndex) : undefined}
                onDrop={isDraggable ? (e) => onBlockDrop(e, originalIndex) : undefined}
              >
                {/* Simple Block Header */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    {/* Drag Handle Icon */}
                    <div
                      draggable={isDraggable}
                      onDragStart={isDraggable ? (e) => onBlockDragStart(e, originalIndex) : undefined}
                      onDragEnd={isDraggable ? onBlockDragEnd : undefined}
                      onTouchStart={isDraggable ? (e) => onBlockTouchStart(e, originalIndex) : undefined}
                      onTouchMove={isDraggable ? onBlockTouchMove : undefined}
                      onTouchEnd={isDraggable ? onBlockTouchEnd : undefined}
                      className={`${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''} touch-none select-none p-1 -m-1 rounded hover:bg-secondary/50 transition-colors`}
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground dark:text-white capitalize">
                      {block.type.replace('-', ' ')}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteBlock(block.id)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Link List Block Editor */}
                {block.type === 'link-list' && (
                  <LinkListEditor
                    block={block}
                    onUpdateBlock={onUpdateBlock}
                  />
                )}

                {/* Placeholder for other block types */}
                {block.type !== 'link-list' && (
                  <div className="px-3 pb-3">
                    <p className="text-xs text-muted-foreground">
                      Edit via preview panel →
                    </p>
                  </div>
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
    </div>
  )
}

// Link List Editor Sub-component
function LinkListEditor({
  block,
  onUpdateBlock
}: {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
}) {
  return (
    <div className="px-3 pb-3 space-y-2">
      {block.props.items?.map((link: any, index: number) => (
        <div
          key={link.id}
          data-link-index={index}
          className="group flex items-start gap-2 p-2 rounded border border-border bg-background"
        >
          <div className="flex-1 space-y-2">
            <Input
              value={link.title}
              onChange={(e) => {
                const newItems = [...block.props.items]
                newItems[index] = { ...link, title: e.target.value }
                onUpdateBlock(block.id, { items: newItems })
              }}
              className="h-8 text-sm"
              placeholder="Link title"
            />
            <Input
              value={link.url}
              onChange={(e) => {
                const newItems = [...block.props.items]
                newItems[index] = { ...link, url: e.target.value }
                onUpdateBlock(block.id, { items: newItems })
              }}
              className="h-8 text-sm"
              placeholder="https://yoursite.com"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newItems = block.props.items.filter((_: any, i: number) => i !== index)
              onUpdateBlock(block.id, { items: newItems })
            }}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500 flex-shrink-0 mt-1"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {/* Add New Link Button */}
      <div className="pb-2">
        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
          <Button
            onClick={() => {
              const newLink = {
                id: `link-${Date.now()}`,
                title: 'New Link',
                url: 'https://yoursite.com'
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
    </div>
  )
}
