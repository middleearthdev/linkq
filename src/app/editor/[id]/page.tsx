/**
 * Bio Link Editor Page
 * Mobile-first editor interface for managing bio link content
 */

"use client"

import { useEffect, useState, use } from "react"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Eye,
  Plus,
  Settings,
  Edit3,
  Trash2,
  ExternalLink,
  Link2,
  Smartphone,
  EyeOff,
  GripVertical,
  Globe,
  Palette,
  X,
  Save,
  Image,
  Minus,
  Hash,
  ShoppingBag,
  MapPin,
  QrCode,
  Package,
  Sparkles,
  BarChart3,
  FootprintsIcon
} from "lucide-react"
import Link from "next/link"
import { DynamicTemplateRenderer } from "@/components/DynamicTemplateRenderer"
import FontPicker from "@/components/FontPicker"
import TemplatePicker from "@/components/TemplatePicker"
import { SiteLoadingScreen } from "@/components/ui/cool-loading"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { DeviceSimulator } from "@/components/editor/DeviceSimulator"

interface SiteData {
  id: string
  handle: string
  title: string
  description: string
  status: string
  templateVersionId: string
  templateVersion: {
    template: {
      name: string
    }
  }
  dataJson: {
    blocks: Array<{
      id: string
      type: string
      props: any
    }>
    meta: {
      title: string
      description: string
      theme: Record<string, string>
      font?: string
    }
  }
}

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { data: session, isPending } = useSession()
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'edit' | 'design' | 'settings'>('edit')
  const [showPreview, setShowPreview] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null)
  const [dragOverBlockIndex, setDragOverBlockIndex] = useState<number | null>(null)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [showBlockPicker, setShowBlockPicker] = useState(false)

  // Load site data by ID
  useEffect(() => {
    const loadSite = async () => {
      try {
        const response = await fetch(`/api/sites/by-id/${resolvedParams.id}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Site not found')
          return
        }

        setSiteData(data.site)
      } catch (err) {
        setError('Failed to load site')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      loadSite()
    }
  }, [session, resolvedParams.id])

  const saveSite = async () => {
    if (!siteData) return

    setSaving(true)
    try {
      const response = await fetch(`/api/sites/${siteData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataJson: siteData.dataJson,
          title: siteData.title,
          description: siteData.description
        })
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to save')
        return
      }

      // Success feedback
      setError('')
    } catch (err) {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  const publishSite = async () => {
    if (!siteData) return

    setPublishing(true)
    try {
      const response = await fetch(`/api/sites/${siteData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: siteData.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
        })
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to update site status')
        return
      }

      // Update local state
      setSiteData({
        ...siteData,
        status: siteData.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
      })

      // Success feedback
      setError('')
    } catch (err) {
      setError('Network error')
    } finally {
      setPublishing(false)
    }
  }

  const updateBlock = (blockId: string, newProps: any) => {
    if (!siteData) return

    setSiteData({
      ...siteData,
      dataJson: {
        ...siteData.dataJson,
        blocks: siteData.dataJson.blocks.map(block =>
          block.id === blockId ? { ...block, props: { ...block.props, ...newProps } } : block
        )
      }
    })
  }

  const addBlock = (blockType: string) => {
    if (!siteData) return

    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      props: {}
    }

    // Configure default props based on block type
    switch (blockType) {
      case 'link-list':
        newBlock.props = {
          items: [{
            id: `link-${Date.now()}`,
            title: 'New Link',
            url: 'https://yoursite.com'
          }]
        }
        break
      case 'social-icons':
        newBlock.props = {
          platforms: [],
          style: 'round',
          size: 'md',
          colorMode: 'brand'
        }
        break
      case 'divider':
        newBlock.props = {
          style: 'solid',
          thickness: 1,
          color: '#e5e7eb',
          spacing: 'md',
          width: '100',
          alignment: 'center'
        }
        break
      case 'gallery':
        newBlock.props = {
          items: [],
          layout: 'grid',
          columns: 3,
          aspectRatio: 'square'
        }
        break
      case 'footer':
        newBlock.props = {
          copyrightText: `© ${new Date().getFullYear()} Your Name`,
          layout: 'centered',
          showSocial: true,
          showLinks: true,
          links: [],
          socialLinks: []
        }
        break
      case 'whatsapp-business':
        newBlock.props = {
          phoneNumber: '081234567890',
          buttonText: 'Chat via WhatsApp',
          buttonStyle: 'fab',
          showIcon: true,
          fabPosition: 'bottom-right'
        }
        break
      case 'delivery-platform':
        newBlock.props = {
          platforms: {},
          layout: 'buttons',
          showRatings: true,
          showPromos: true
        }
        break
      case 'marketplace':
        newBlock.props = {
          stores: {},
          featuredProducts: [],
          layout: 'store-links',
          showBadges: true,
          showRatings: true
        }
        break
      case 'location':
        newBlock.props = {
          googleMapsUrl: '',
          address: '',
          locationName: 'My Location',
          showDirectionsButton: true,
          mapHeight: 300
        }
        break
      case 'qris-payment':
        newBlock.props = {
          qrisImage: '',
          merchantName: '',
          paymentMethods: ['Gopay', 'OVO', 'Dana', 'ShopeePay'],
          showPaymentLogos: true
        }
        break
      case 'product-catalog':
        newBlock.props = {
          items: [],
          style: 'instagram-card',
          columns: 2,
          showSearch: true,
          showCategories: true,
          showStockIndicator: true
        }
        break
      case 'analytics':
        newBlock.props = {
          showViews: true,
          showClicks: true,
          showVisitors: false,
          period: '30d',
          style: 'minimal'
        }
        break
      default:
        break
    }

    setSiteData({
      ...siteData,
      dataJson: {
        ...siteData.dataJson,
        blocks: [...siteData.dataJson.blocks, newBlock]
      }
    })

    setShowBlockPicker(false)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML)

    // Add some visual feedback
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5'
      }
    }, 0)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1'
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || !siteData || draggedIndex === dropIndex) {
      return
    }

    const linkListBlock = siteData.dataJson.blocks.find(b => b.type === 'link-list')
    if (!linkListBlock?.props.items) return

    const items = [...linkListBlock.props.items]
    const draggedItem = items[draggedIndex]

    // Remove dragged item and insert at new position
    items.splice(draggedIndex, 1)
    items.splice(dropIndex, 0, draggedItem)

    updateBlock(linkListBlock.id, { items })

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  // Touch events for mobile drag and drop
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0]
    setTouchStartY(touch.clientY)
    setDraggedIndex(index)

    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedIndex === null || touchStartY === null) return

    e.preventDefault() // Prevent scrolling
    const touch = e.touches[0]
    const deltaY = touch.clientY - touchStartY

    // Start dragging if moved more than 10px
    if (Math.abs(deltaY) > 10 && !isDragging) {
      setIsDragging(true)
    }

    if (isDragging) {
      // Find which link item we're hovering over
      const elements = document.querySelectorAll('[data-link-index]')
      const targetElement = document.elementFromPoint(touch.clientX, touch.clientY)

      elements.forEach((el, idx) => {
        if (el.contains(targetElement)) {
          setDragOverIndex(idx)
        }
      })
    }
  }

  const handleTouchEnd = () => {
    if (isDragging && draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      // Perform the reorder
      if (!siteData) return

      const linkListBlock = siteData.dataJson.blocks.find(b => b.type === 'link-list')
      if (!linkListBlock?.props.items) return

      const items = [...linkListBlock.props.items]
      const draggedItem = items[draggedIndex]

      items.splice(draggedIndex, 1)
      items.splice(dragOverIndex, 0, draggedItem)

      updateBlock(linkListBlock.id, { items })

      // Haptic feedback for successful drop
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50])
      }
    }

    // Reset states
    setDraggedIndex(null)
    setDragOverIndex(null)
    setTouchStartY(null)
    setIsDragging(false)
  }

  // Block-level drag and drop handlers
  const handleBlockDragStart = (e: React.DragEvent, blockIndex: number) => {
    setDraggedBlockIndex(blockIndex)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML)
  }

  const handleBlockDragEnd = () => {
    setDraggedBlockIndex(null)
    setDragOverBlockIndex(null)
  }

  const handleBlockDragOver = (e: React.DragEvent, blockIndex: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverBlockIndex(blockIndex)
  }

  const handleBlockDrop = (e: React.DragEvent, dropBlockIndex: number) => {
    e.preventDefault()

    if (draggedBlockIndex === null || !siteData || draggedBlockIndex === dropBlockIndex) {
      return
    }

    const blocks = [...siteData.dataJson.blocks]
    const draggedBlock = blocks[draggedBlockIndex]

    blocks.splice(draggedBlockIndex, 1)
    blocks.splice(dropBlockIndex, 0, draggedBlock)

    setSiteData({
      ...siteData,
      dataJson: {
        ...siteData.dataJson,
        blocks
      }
    })

    setDraggedBlockIndex(null)
    setDragOverBlockIndex(null)
  }

  // Block-level touch handlers for mobile
  const handleBlockTouchStart = (e: React.TouchEvent, blockIndex: number) => {
    const touch = e.touches[0]
    setTouchStartY(touch.clientY)
    setDraggedBlockIndex(blockIndex)

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  const handleBlockTouchMove = (e: React.TouchEvent) => {
    if (draggedBlockIndex === null || touchStartY === null) return

    const touch = e.touches[0]
    const deltaY = touch.clientY - touchStartY

    // Only start dragging if moved more than 10px
    if (Math.abs(deltaY) > 10) {
      e.preventDefault()

      // Find the element under touch point
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
      const blockElement = elementBelow?.closest('[data-block-index]')

      if (blockElement) {
        const targetIndex = parseInt(blockElement.getAttribute('data-block-index') || '-1')
        if (targetIndex !== -1 && targetIndex !== draggedBlockIndex) {
          setDragOverBlockIndex(targetIndex)
        }
      }
    }
  }

  const handleBlockTouchEnd = () => {
    if (draggedBlockIndex === null || !siteData) {
      setDraggedBlockIndex(null)
      setDragOverBlockIndex(null)
      setTouchStartY(null)
      return
    }

    // Perform the drop
    if (dragOverBlockIndex !== null && draggedBlockIndex !== dragOverBlockIndex) {
      const blocks = [...siteData.dataJson.blocks]
      const draggedBlock = blocks[draggedBlockIndex]

      blocks.splice(draggedBlockIndex, 1)
      blocks.splice(dragOverBlockIndex, 0, draggedBlock)

      setSiteData({
        ...siteData,
        dataJson: {
          ...siteData.dataJson,
          blocks
        }
      })

      // Success haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50])
      }
    }

    // Reset states
    setDraggedBlockIndex(null)
    setDragOverBlockIndex(null)
    setTouchStartY(null)
  }

  // Handle template switching
  const handleTemplateSwitch = async (templateVersionId: string) => {
    if (!siteData) return

    try {
      setSaving(true)
      const response = await fetch(`/api/sites/${siteData.handle}/template`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateVersionId,
          preserveData: true
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to switch template')
      }

      // Reload the page to get updated template data
      window.location.reload()

    } catch (error) {
      console.error('Template switch failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to switch template')
    } finally {
      setSaving(false)
    }
  }

  if (isPending || loading) {
    return <SiteLoadingScreen handle={resolvedParams.id} />
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Error</h1>
          <p className="text-muted-foreground mb-4">{error || 'Site not found'}</p>
          <Link href="/dashboard">
            <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const bioBlock = siteData.dataJson.blocks.find(b => b.type === 'bio')
  const linkListBlock = siteData.dataJson.blocks.find(b => b.type === 'link-list')

  return (
    <div className="h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Desktop Sidebar Navigation - Modern Professional Style */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:border-r lg:border-border/50 lg:bg-gradient-to-b lg:from-card lg:to-card/95 backdrop-blur-sm flex-shrink-0">
        {/* Sidebar Header with Logo */}
        <div className="p-6 border-b border-border/50">
          <div className="mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              LinkQ Editor
            </h2>
            <p className="text-xs text-muted-foreground mt-1">@{siteData.handle}</p>
          </div>
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200 rounded-xl group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Sidebar Menu with Enhanced Styling */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('edit')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === 'edit'
                ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-l-4 border-primary shadow-sm'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground hover:translate-x-1'
                }`}
            >
              <div className={`p-2 rounded-lg ${activeTab === 'edit' ? 'bg-primary/20' : 'bg-secondary/50'}`}>
                <Edit3 className="h-4 w-4" />
              </div>
              <span className="flex-1 text-left">Links</span>
              {activeTab === 'edit' && (
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === 'design'
                ? 'bg-gradient-to-r from-purple-500/20 to-purple-500/10 text-purple-600 dark:text-purple-400 border-l-4 border-purple-500 shadow-sm'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground hover:translate-x-1'
                }`}
            >
              <div className={`p-2 rounded-lg ${activeTab === 'design' ? 'bg-purple-500/20' : 'bg-secondary/50'}`}>
                <Palette className="h-4 w-4" />
              </div>
              <span className="flex-1 text-left">Design</span>
              {activeTab === 'design' && (
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === 'settings'
                ? 'bg-gradient-to-r from-orange-500/20 to-orange-500/10 text-orange-600 dark:text-orange-400 border-l-4 border-orange-500 shadow-sm'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground hover:translate-x-1'
                }`}
            >
              <div className={`p-2 rounded-lg ${activeTab === 'settings' ? 'bg-orange-500/20' : 'bg-secondary/50'}`}>
                <Settings className="h-4 w-4" />
              </div>
              <span className="flex-1 text-left">Settings</span>
              {activeTab === 'settings' && (
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              )}
            </button>
          </div>

          {/* Quick Stats Card */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
            <h3 className="text-xs font-semibold text-muted-foreground mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${siteData.status === 'PUBLISHED'
                  ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                  : 'bg-orange-500/20 text-orange-600 dark:text-orange-400'
                  }`}>
                  {siteData.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Links</span>
                <span className="text-xs font-medium text-foreground">
                  {linkListBlock?.props.items?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer with Enhanced Theme Toggle */}
        <div className="p-4 border-t border-border/50 bg-secondary/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Appearance</span>
          </div>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content Area - Desktop */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile Header */}
        <header className="lg:hidden px-3 sm:px-4 py-3 sm:py-4 bg-background border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-foreground dark:text-white p-1.5 sm:p-2 hover:bg-secondary">
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-semibold text-foreground dark:text-white truncate">Editor</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">@{siteData.handle}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="hidden xs:block">
                <ThemeToggle />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`p-1.5 sm:p-2 ${showPreview ? 'bg-primary text-white hover:bg-primary/90' : 'text-foreground dark:text-white hover:bg-secondary'}`}
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
              <Button
                onClick={saveSite}
                disabled={saving}
                size="sm"
                className="px-2 sm:px-3 h-7 sm:h-8 text-xs sm:text-sm rounded-lg sm:rounded-xl bg-primary hover:bg-primary/90 text-white disabled:opacity-60 shadow-sm"
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
              {siteData?.status === 'DRAFT' ? (
                <Button
                  onClick={publishSite}
                  disabled={publishing || saving}
                  size="sm"
                  className="px-2 sm:px-3 h-7 sm:h-8 text-xs sm:text-sm rounded-lg sm:rounded-xl bg-green-600 hover:bg-green-700 text-white disabled:opacity-60 shadow-sm hidden xs:inline-flex"
                >
                  {publishing ? 'Publishing...' : 'Publish'}
                </Button>
              ) : (
                <Button
                  onClick={publishSite}
                  disabled={publishing || saving}
                  variant="outline"
                  size="sm"
                  className="px-2 sm:px-3 h-7 sm:h-8 text-xs sm:text-sm rounded-lg sm:rounded-xl border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 disabled:opacity-60 hidden xs:inline-flex"
                >
                  {publishing ? 'Unpublishing...' : 'Unpublish'}
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="mt-3 sm:mt-4 flex rounded-lg sm:rounded-xl p-0.5 sm:p-1 bg-secondary/50 dark:bg-card border border-border">
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-all ${activeTab === 'edit'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                }`}
            >
              <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-auto mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs">Edit</span>
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-all ${activeTab === 'design'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                }`}
            >
              <Palette className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-auto mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs">Design</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-all ${activeTab === 'settings'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                }`}
            >
              <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-auto mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs">Settings</span>
            </button>
          </div>
        </header>

        {/* Desktop Header - Modern Professional Design */}
        <header className="hidden lg:flex items-center justify-between px-6 py-3 border-b bg-card/80 border-border/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${activeTab === 'edit' ? 'bg-primary/10' :
              activeTab === 'design' ? 'bg-purple-500/10' :
                'bg-orange-500/10'
              }`}>
              {activeTab === 'edit' ? <Edit3 className="h-4 w-4 text-primary" /> :
                activeTab === 'design' ? <Palette className="h-4 w-4 text-purple-600 dark:text-purple-400" /> :
                  <Settings className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground dark:text-white">
                {activeTab === 'edit' ? 'Edit Links' : activeTab === 'design' ? 'Design & Themes' : 'Site Settings'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {activeTab === 'edit' ? 'Manage your bio link content' :
                  activeTab === 'design' ? 'Customize appearance and branding' :
                    'Configure site preferences'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`/${siteData.handle}`, '_blank')}
              className="h-9 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg group"
            >
              <Globe className="h-3.5 w-3.5 mr-1.5 group-hover:rotate-12 transition-transform" />
              <span>linkq.com/{siteData.handle}</span>
              <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
            </Button>

            <div className="h-5 w-px bg-border/50 mx-1" />

            <Button
              onClick={saveSite}
              disabled={saving}
              size="sm"
              className="h-9 px-3 rounded-lg bg-primary hover:bg-primary/90 text-white disabled:opacity-60 text-xs font-medium"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
                  Saving
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Save
                </>
              )}
            </Button>

            {siteData?.status === 'DRAFT' ? (
              <Button
                onClick={publishSite}
                disabled={publishing || saving}
                size="sm"
                className="h-9 px-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white disabled:opacity-60 text-xs font-medium"
              >
                {publishing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
                    Publishing
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    Publish
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={publishSite}
                disabled={publishing || saving}
                variant="outline"
                size="sm"
                className="h-9 px-3 rounded-lg border-orange-500/50 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 disabled:opacity-60 text-xs font-medium"
              >
                {publishing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mr-1.5" />
                    Unpublishing
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                    Unpublish
                  </>
                )}
              </Button>
            )}
          </div>
        </header>

        {/* Main Content - 2 Column Layout (Center + Preview) */}
        <main className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Mobile Preview Mode */}
          {showPreview && (
            <div className="lg:hidden fixed inset-0 z-40 bg-background">
              <div className="h-full overflow-hidden">
                {/* Compact Preview Header */}
                <div className="px-3 py-2 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground dark:text-white font-medium">Preview</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(false)}
                    className="text-muted-foreground hover:text-foreground dark:hover:text-white p-1.5"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Preview Content - Full Width */}
                <div className="h-[calc(100vh-50px)] overflow-y-auto editor-preview-bg">
                  <div className="w-full h-full">
                    <DynamicTemplateRenderer
                      siteData={siteData.dataJson}
                      isPreview={true}
                      className="h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Center Content Area - Scrollable Only */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin lg:border-r lg:border-border">
            <div className="p-4 lg:p-6 max-w-3xl mx-auto pb-20">
              <>
                {activeTab === 'edit' && (
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
                          @{siteData.handle}
                        </h2>
                      </div>
                    )}

                    {/* Add Block Button */}
                    <Button
                      onClick={() => setShowBlockPicker(true)}
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
                          onClick={() => {
                            const bioBlock = siteData.dataJson.blocks.find((b: any) => b.type === 'bio')
                            if (bioBlock) {
                              // Remove bio block
                              const newBlocks = siteData.dataJson.blocks.filter((b: any) => b.type !== 'bio')
                              setSiteData({
                                ...siteData,
                                dataJson: {
                                  ...siteData.dataJson,
                                  blocks: newBlocks
                                }
                              })
                            } else {
                              // Add bio block at the beginning
                              const newBioBlock = {
                                id: `block-bio-${Date.now()}`,
                                type: 'bio',
                                props: {
                                  name: 'Your Name',
                                  description: 'Add your bio here',
                                  avatar: '',
                                  showAvatar: true,
                                  avatarSize: 'lg',
                                  avatarStyle: 'circle',
                                  textAlign: 'center',
                                  nameStyle: 'default'
                                }
                              }
                              setSiteData({
                                ...siteData,
                                dataJson: {
                                  ...siteData.dataJson,
                                  blocks: [newBioBlock, ...siteData.dataJson.blocks]
                                }
                              })
                            }
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${siteData.dataJson.blocks.some((b: any) => b.type === 'bio')
                              ? 'bg-primary'
                              : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${siteData.dataJson.blocks.some((b: any) => b.type === 'bio')
                                ? 'translate-x-6'
                                : 'translate-x-1'
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
                          onClick={() => {
                            const waBlock = siteData.dataJson.blocks.find((b: any) => b.type === 'whatsapp-business')
                            if (waBlock) {
                              // Remove WhatsApp block
                              const newBlocks = siteData.dataJson.blocks.filter((b: any) => b.type !== 'whatsapp-business')
                              setSiteData({
                                ...siteData,
                                dataJson: {
                                  ...siteData.dataJson,
                                  blocks: newBlocks
                                }
                              })
                            } else {
                              // Add WhatsApp block
                              const newWABlock = {
                                id: `block-wa-${Date.now()}`,
                                type: 'whatsapp-business',
                                props: {
                                  phoneNumber: '',
                                  message: 'Hello! I have a question',
                                  buttonText: 'Chat on WhatsApp',
                                  position: 'bottom-right',
                                  showLabel: true
                                }
                              }
                              setSiteData({
                                ...siteData,
                                dataJson: {
                                  ...siteData.dataJson,
                                  blocks: [...siteData.dataJson.blocks, newWABlock]
                                }
                              })
                            }
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${siteData.dataJson.blocks.some((b: any) => b.type === 'whatsapp-business')
                              ? 'bg-primary'
                              : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${siteData.dataJson.blocks.some((b: any) => b.type === 'whatsapp-business')
                                ? 'translate-x-6'
                                : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* All Blocks Section - Exclude Bio & WhatsApp */}
                    {siteData.dataJson.blocks && siteData.dataJson.blocks.filter((b: any) => b.type !== 'bio' && b.type !== 'whatsapp-business').length > 0 ? (
                      <div className="space-y-3">
                        {/* Display all blocks except bio and whatsapp-business */}
                        {siteData.dataJson.blocks
                          .filter((block: any) => block.type !== 'bio' && block.type !== 'whatsapp-business')
                          .map((block: any) => {
                            const originalIndex = siteData.dataJson.blocks.findIndex((b: any) => b.id === block.id)
                            const isDraggable = true // All blocks are draggable

                            return (
                              <div
                                key={block.id}
                                data-block-index={originalIndex}
                                className={`space-y-3 rounded-lg border transition-all ${draggedBlockIndex === originalIndex
                                    ? 'opacity-50 scale-95 border-border shadow-xl'
                                    : dragOverBlockIndex === originalIndex
                                      ? 'border-primary bg-primary/5 scale-105'
                                      : 'border-border bg-card dark:bg-[#2A3441]'
                                  }`}
                                onDragOver={isDraggable ? (e) => handleBlockDragOver(e, originalIndex) : undefined}
                                onDrop={isDraggable ? (e) => handleBlockDrop(e, originalIndex) : undefined}
                              >
                                {/* Simple Block Header */}
                                <div className="flex items-center justify-between p-3">
                                  <div className="flex items-center gap-2">
                                    {/* Drag Handle Icon */}
                                    <div
                                      draggable={isDraggable}
                                      onDragStart={isDraggable ? (e) => handleBlockDragStart(e, originalIndex) : undefined}
                                      onDragEnd={isDraggable ? handleBlockDragEnd : undefined}
                                      onTouchStart={isDraggable ? (e) => handleBlockTouchStart(e, originalIndex) : undefined}
                                      onTouchMove={isDraggable ? handleBlockTouchMove : undefined}
                                      onTouchEnd={isDraggable ? handleBlockTouchEnd : undefined}
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
                                    onClick={() => {
                                      const newBlocks = siteData.dataJson.blocks.filter((_: any, i: number) => i !== originalIndex)
                                      setSiteData({
                                        ...siteData,
                                        dataJson: {
                                          ...siteData.dataJson,
                                          blocks: newBlocks
                                        }
                                      })
                                    }}
                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Link List Block Editor */}
                                {block.type === 'link-list' && (
                                  <div className="px-3 pb-3 space-y-2">
                                    {block.props.items?.map((link: any, index: number) => (
                                      <div
                                        key={link.id}
                                        data-link-index={index}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, index)}
                                        className={`group flex items-start gap-2 p-2 rounded border transition-all ${draggedIndex === index ? 'opacity-50' :
                                          dragOverIndex === index ? 'border-primary bg-primary/5' :
                                            'border-border bg-background'
                                          }`}
                                      >
                                        {/* Drag Handle Icon */}
                                        <div
                                          draggable
                                          onDragStart={(e) => handleDragStart(e, index)}
                                          onDragEnd={handleDragEnd}
                                          onTouchStart={(e) => handleTouchStart(e, index)}
                                          onTouchMove={handleTouchMove}
                                          onTouchEnd={handleTouchEnd}
                                          className="cursor-grab active:cursor-grabbing touch-none select-none p-1 -m-1 rounded hover:bg-secondary/50 transition-colors mt-1.5"
                                        >
                                          <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                          <Input
                                            value={link.title}
                                            onChange={(e) => {
                                              const newItems = [...block.props.items]
                                              newItems[index] = { ...link, title: e.target.value }
                                              updateBlock(block.id, { items: newItems })
                                            }}
                                            className="h-8 text-sm"
                                            placeholder="Link title"
                                          />
                                          <Input
                                            value={link.url}
                                            onChange={(e) => {
                                              const newItems = [...block.props.items]
                                              newItems[index] = { ...link, url: e.target.value }
                                              updateBlock(block.id, { items: newItems })
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
                                            updateBlock(block.id, { items: newItems })
                                          }}
                                          className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500 flex-shrink-0 mt-1"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}

                                    {/* LinkList Settings */}
                                    <div className="pb-2">
                                      <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                                        <h4 className="text-xs font-semibold text-foreground dark:text-white mb-3">Link List Settings</h4>
                                        <div className="space-y-3">
                                          {/* Add New Link Button */}
                                          <Button
                                            onClick={() => {
                                              const newLink = {
                                                id: `link-${Date.now()}`,
                                                title: 'New Link',
                                                url: 'https://yoursite.com'
                                              }
                                              const newItems = [...(block.props.items || []), newLink]
                                              updateBlock(block.id, { items: newItems })
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
                                  </div>
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
                )}

                {activeTab === 'design' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Design & Typography</h2>

                    {/* Global Font Settings */}
                    <Card className="bg-card border-border shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-foreground dark:text-white flex items-center">
                          <Palette className="h-5 w-5 mr-2 text-primary" />
                          Global Font Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FontPicker
                          value={siteData.dataJson.meta.font}
                          onChange={(font) => {
                            const newSiteData = {
                              ...siteData,
                              dataJson: {
                                ...siteData.dataJson,
                                meta: {
                                  ...siteData.dataJson.meta,
                                  font: font
                                }
                              }
                            }
                            setSiteData(newSiteData)
                          }}
                          label="Choose Font Family"
                        />
                      </CardContent>
                    </Card>

                    {/* Template Selection */}
                    <Card className="bg-card border-border shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-foreground dark:text-white flex items-center">
                          <Palette className="h-5 w-5 mr-2 text-primary" />
                          Template & Themes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Current Template Info */}
                          <div className="p-4 rounded-lg bg-secondary/50 dark:bg-secondary/50 border border-border">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-foreground dark:text-white font-medium mb-1">Current Template</h4>
                                <p className="text-muted-foreground text-sm">{siteData.templateVersion.template.name}</p>
                              </div>
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-border flex items-center justify-center">
                                <Palette className="w-6 h-6 text-muted-foreground" />
                              </div>
                            </div>
                          </div>

                          {/* Template Picker Button */}
                          <Button
                            variant="outline"
                            className="w-full border-border text-foreground dark:text-white hover:border-primary hover:text-primary dark:hover:text-white"
                            onClick={() => setShowTemplatePicker(true)}
                          >
                            <Palette className="w-4 h-4 mr-2" />
                            Browse Templates
                          </Button>

                          <div className="text-xs text-muted-foreground text-center">
                            Switch templates anytime without losing your content
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-foreground dark:text-white mb-4">Site Settings</h2>
                    <div className="text-center py-12 text-muted-foreground">
                      <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">Advanced settings coming soon</p>
                      <p className="text-sm">Custom domains, analytics, and more</p>
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>

          {/* Preview Panel - Desktop Only - Device Simulator */}
          <DeviceSimulator
            siteData={siteData.dataJson}
            className="hidden lg:block lg:w-[420px] lg:flex-shrink-0 min-h-0"
          />
        </main>
      </div>

      {/* Template Picker Fullscreen */}
      <TemplatePicker
        currentTemplateId={siteData.templateVersionId}
        onTemplateSelect={handleTemplateSwitch}
        onClose={() => setShowTemplatePicker(false)}
        isOpen={showTemplatePicker}
      />

      {/* Block Picker Modal */}
      {showBlockPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card dark:bg-[#1A2332] rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="sticky top-0 bg-card dark:bg-[#1A2332] border-b border-border/50 p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground dark:text-white">Add Block</h2>
                  <p className="text-sm text-muted-foreground mt-1">Choose a block to add to your page</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBlockPicker(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Block Options */}
            <div className="p-6 space-y-6">
              {/* Basic Blocks */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Basic Blocks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Link List Block */}
                  <button
                    onClick={() => addBlock('link-list')}
                    className="group p-4 rounded-xl border-2 border-border hover:border-primary bg-card dark:bg-[#2A3441] hover:bg-primary/5 transition-all duration-200 text-left hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Link2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground dark:text-white text-sm mb-0.5">Links</h4>
                        <p className="text-xs text-muted-foreground">Clickable link buttons</p>
                      </div>
                    </div>
                  </button>

                  {/* Social Icons Block */}
                  <button
                    onClick={() => addBlock('social-icons')}
                    className="group p-4 rounded-xl border-2 border-border hover:border-primary bg-card dark:bg-[#2A3441] hover:bg-primary/5 transition-all duration-200 text-left hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                        <Hash className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground dark:text-white text-sm mb-0.5">Social Icons</h4>
                        <p className="text-xs text-muted-foreground">Social media links</p>
                      </div>
                    </div>
                  </button>

                  {/* Divider Block */}
                  <button
                    onClick={() => addBlock('divider')}
                    className="group p-4 rounded-xl border-2 border-border hover:border-primary bg-card dark:bg-[#2A3441] hover:bg-primary/5 transition-all duration-200 text-left hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-gray-500/10 group-hover:bg-gray-500/20 transition-colors">
                        <Minus className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground dark:text-white text-sm mb-0.5">Divider</h4>
                        <p className="text-xs text-muted-foreground">Horizontal separator</p>
                      </div>
                    </div>
                  </button>

                  {/* Footer Block */}
                  <button
                    onClick={() => addBlock('footer')}
                    className="group p-4 rounded-xl border-2 border-border hover:border-primary bg-card dark:bg-[#2A3441] hover:bg-primary/5 transition-all duration-200 text-left hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-500/10 group-hover:bg-slate-500/20 transition-colors">
                        <FootprintsIcon className="h-5 w-5 text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground dark:text-white text-sm mb-0.5">Footer</h4>
                        <p className="text-xs text-muted-foreground">Copyright & links</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Media & Content */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Media & Content</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Gallery Block */}
                  <button
                    onClick={() => addBlock('gallery')}
                    className="group p-4 rounded-xl border-2 border-border hover:border-primary bg-card dark:bg-[#2A3441] hover:bg-primary/5 transition-all duration-200 text-left hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors">
                        <Image className="h-5 w-5 text-pink-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground dark:text-white text-sm mb-0.5">Gallery</h4>
                        <p className="text-xs text-muted-foreground">Image & video grid</p>
                      </div>
                    </div>
                  </button>

                  {/* Analytics Block */}
                  <button
                    onClick={() => addBlock('analytics')}
                    className="group p-4 rounded-xl border-2 border-border hover:border-primary bg-card dark:bg-[#2A3441] hover:bg-primary/5 transition-all duration-200 text-left hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                        <BarChart3 className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground dark:text-white text-sm mb-0.5">Analytics</h4>
                        <p className="text-xs text-muted-foreground">Site statistics</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Indonesia Business */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Indonesia Business 🇮🇩</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Delivery Platform */}
                  <button
                    onClick={() => addBlock('delivery-platform')}
                    className="group p-4 rounded-xl border-2 border-border hover:border-primary bg-card dark:bg-[#2A3441] hover:bg-primary/5 transition-all duration-200 text-left hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                        <Package className="h-5 w-5 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground dark:text-white text-sm mb-0.5">Food Delivery</h4>
                        <p className="text-xs text-muted-foreground">GoFood, GrabFood, etc</p>
                      </div>
                    </div>
                  </button>

                  {/* Marketplace */}
                  <button
                    onClick={() => addBlock('marketplace')}
                    className="group p-4 rounded-xl border-2 border-border hover:border-primary bg-card dark:bg-[#2A3441] hover:bg-primary/5 transition-all duration-200 text-left hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                        <ShoppingBag className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground dark:text-white text-sm mb-0.5">E-Commerce Store</h4>
                        <p className="text-xs text-muted-foreground">Tokped, Shopee, TikTok</p>
                      </div>
                    </div>
                  </button>

                  {/* Product Catalog */}
                  <button
                    onClick={() => addBlock('product-catalog')}
                    className="group p-4 rounded-xl border-2 border-border hover:border-primary bg-card dark:bg-[#2A3441] hover:bg-primary/5 transition-all duration-200 text-left hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground dark:text-white text-sm mb-0.5">Product Catalog</h4>
                        <p className="text-xs text-muted-foreground">Showcase products</p>
                      </div>
                    </div>
                  </button>

                  {/* Location */}
                  <button
                    onClick={() => addBlock('location')}
                    className="group p-4 rounded-xl border-2 border-border hover:border-primary bg-card dark:bg-[#2A3441] hover:bg-primary/5 transition-all duration-200 text-left hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                        <MapPin className="h-5 w-5 text-cyan-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground dark:text-white text-sm mb-0.5">Location & Map</h4>
                        <p className="text-xs text-muted-foreground">Google Maps embed</p>
                      </div>
                    </div>
                  </button>

                  {/* QRIS Payment */}
                  <button
                    onClick={() => addBlock('qris-payment')}
                    className="group p-4 rounded-xl border-2 border-border hover:border-primary bg-card dark:bg-[#2A3441] hover:bg-primary/5 transition-all duration-200 text-left hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-teal-500/10 group-hover:bg-teal-500/20 transition-colors">
                        <QrCode className="h-5 w-5 text-teal-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground dark:text-white text-sm mb-0.5">QRIS Payment</h4>
                        <p className="text-xs text-muted-foreground">QR code payments</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}