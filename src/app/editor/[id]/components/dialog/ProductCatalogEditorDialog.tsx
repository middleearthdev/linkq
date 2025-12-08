/**
 * Product Catalog Editor Dialog
 * Full-screen dialog for managing product catalog
 * Features: CRUD, drag & drop, bulk operations, search, Media Library integration
 */

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Copy, Package, GripVertical, Trash2, ChevronDown, ChevronUp,
  ImageIcon, Search, Plus, CheckSquare, Grid2x2, Grid3x3, Smartphone, Tablet
} from "lucide-react"
import { MediaLibraryPicker } from "@/components/media/MediaLibraryPicker"

interface Block {
  id: string
  type: string
  props: any
}

// Product Layout Dialog
function ProductLayoutDialog({
  currentColumns,
  onClose,
  onSelectLayout
}: {
  currentColumns: 'medium' | 'large'
  onClose: () => void
  onSelectLayout: (columns: 'medium' | 'large') => void
}) {
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

  const handleSelectLayout = (layout: 'medium' | 'large') => {
    onSelectLayout(layout)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200"
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
            const isSelected = currentColumns === option.value
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

// Main Product Catalog Editor Dialog
export default function ProductCatalogEditorDialog({
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
    <>
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
                  className={`group flex flex-col gap-2 p-2.5 rounded-lg border transition-all ${bulkMode ? 'cursor-pointer' : ''
                    } ${draggedProductIndex === originalIndex
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
                        <span className={`text-[10px] font-medium ${product.stock === 'available' ? 'text-green-600' :
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
                            className={`flex-1 h-7 rounded-md text-[10px] font-medium transition-all ${product.stock === 'available'
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
                            className={`flex-1 h-7 rounded-md text-[10px] font-medium transition-all ${product.stock === 'low'
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
                            className={`flex-1 h-7 rounded-md text-[10px] font-medium transition-all ${product.stock === 'out'
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
      </div>

      {/* Product Image Selector Modal - Using Media Library */}
      {selectedProductIndex !== null && canUploadImages && (
        <MediaLibraryPicker
          isOpen={imagePickerOpen}
          onClose={() => {
            setImagePickerOpen(false)
            setSelectedProductIndex(null)
          }}
          onSelect={(imageUrl: string) => {
            if (selectedProductIndex !== null) {
              const newItems = [...block.props.items]
              newItems[selectedProductIndex] = {
                ...newItems[selectedProductIndex],
                image: imageUrl
              }
              onUpdateBlock(block.id, { items: newItems })
              setImagePickerOpen(false)
              setSelectedProductIndex(null)
            }
          }}
          category="product"
          referenceId={`product-catalog:${block.id}:item-${selectedProductIndex}:image`}
          currentImage={block.props.items[selectedProductIndex]?.image}
          title="Choose Product Image"
        />
      )}

      {/* Layout Dialog */}
      {isLayoutDialogOpen && (
        <ProductLayoutDialog
          currentColumns={block.props.columns || 'medium'}
          onClose={() => setIsLayoutDialogOpen(false)}
          onSelectLayout={(columns) => {
            onUpdateBlock(block.id, { columns })
            setIsLayoutDialogOpen(false)
          }}
        />
      )}
    </>
  )
}
