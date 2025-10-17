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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Eye,
  Save,
  Plus,
  Settings,
  User,
  Share2,
  Edit3,
  Trash2,
  ExternalLink,
  Copy,
  Link2,
  Smartphone,
  Monitor,
  EyeOff,
  GripVertical,
  Globe,
  ChevronDown,
  ChevronUp,
  Palette
} from "lucide-react"
import Link from "next/link"
import { DynamicTemplateRenderer } from "@/components/DynamicTemplateRenderer"
import { detectPlatform } from "@/lib/platforms"
import PlatformIcon from "@/components/PlatformIcons"
import ColorPicker from "@/components/ColorPicker"
import FontPicker from "@/components/FontPicker"
import TemplatePicker from "@/components/TemplatePicker"
import { AvatarUpload } from "@/components/ui/avatar-upload"

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

export default function EditorPage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = use(params)
  const { data: session, isPending } = useSession()
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'edit' | 'design' | 'settings'>('edit')
  const [showPreview, setShowPreview] = useState(false)
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [expandedLinks, setExpandedLinks] = useState<Set<string>>(new Set())
  const [showGlobalStyle, setShowGlobalStyle] = useState(false)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)

  // Check if user has premium features
  const userPlan = (session?.user as any)?.plan || 'FREE'
  const isPremiumUser = userPlan !== 'FREE'

  // Reset collapse states when changing tabs
  useEffect(() => {
    setExpandedLinks(new Set())
    setShowGlobalStyle(false)
  }, [activeTab])

  // Load site data
  useEffect(() => {
    const loadSite = async () => {
      try {
        const response = await fetch(`/api/sites/${resolvedParams.handle}`)
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
  }, [session, resolvedParams.handle])

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

  const addLink = () => {
    if (!siteData) return

    const linkListBlock = siteData.dataJson.blocks.find(b => b.type === 'link-list')
    if (linkListBlock) {
      const newLink = {
        id: `link-${Date.now()}`,
        title: 'New Link',
        url: 'https://yoursite.com'
      }

      updateBlock(linkListBlock.id, {
        items: [...(linkListBlock.props.items || []), newLink]
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
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
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F1419' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#66A38A' }} />
      </div>
    )
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F1419' }}>
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-gray-400 mb-4">{error || 'Site not found'}</p>
          <Link href="/dashboard">
            <Button
              className="rounded-xl"
              style={{
                backgroundColor: '#66A38A',
                borderColor: '#66A38A',
                color: '#FFFFFF'
              }}
            >
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
    <div className="min-h-screen" style={{ backgroundColor: '#0F1419' }}>
      {/* Mobile Header */}
      <header className="lg:hidden px-4 py-4" style={{ backgroundColor: '#0F1419' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-white">Editor</h1>
              <p className="text-sm text-gray-400">@{siteData.handle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white p-2"
              onClick={() => setShowPreview(!showPreview)}
              style={{ backgroundColor: showPreview ? '#66A38A' : 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = showPreview ? '#5A8F7A' : '#212A33'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = showPreview ? '#66A38A' : 'transparent'}
            >
              {showPreview ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
            <Button
              onClick={saveSite}
              disabled={saving}
              size="sm"
              className="px-4 h-8 rounded-xl"
              style={{
                backgroundColor: saving ? '#9CA3AF' : '#66A38A',
                borderColor: saving ? '#9CA3AF' : '#66A38A',
                color: '#FFFFFF'
              }}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="mt-4 flex rounded-xl p-1" style={{ backgroundColor: '#1A2332' }}>
          <button
            onClick={() => setActiveTab('edit')}
            className="flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all"
            style={{
              backgroundColor: activeTab === 'edit' ? '#66A38A' : 'transparent',
              color: activeTab === 'edit' ? '#FFFFFF' : '#9CA3AF'
            }}
          >
            <Edit3 className="h-4 w-4 mx-auto mb-1" />
            Edit
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className="flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all"
            style={{
              backgroundColor: activeTab === 'design' ? '#66A38A' : 'transparent',
              color: activeTab === 'design' ? '#FFFFFF' : '#9CA3AF'
            }}
          >
            <Palette className="h-4 w-4 mx-auto mb-1" />
            Design
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className="flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all"
            style={{
              backgroundColor: activeTab === 'settings' ? '#66A38A' : 'transparent',
              color: activeTab === 'settings' ? '#FFFFFF' : '#9CA3AF'
            }}
          >
            <Settings className="h-4 w-4 mx-auto mb-1" />
            Settings
          </button>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block px-6 py-4 border-b" style={{ backgroundColor: '#0F1419', borderColor: '#2A3441' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-white">Bio Link Editor</h1>
              <p className="text-sm text-gray-400">Editing: @{siteData.handle}</p>
            </div>
            
            {/* Desktop Tabs */}
            <div className="flex rounded-xl p-1" style={{ backgroundColor: '#1A2332' }}>
              <button
                onClick={() => setActiveTab('edit')}
                className="py-2 px-4 text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                style={{
                  backgroundColor: activeTab === 'edit' ? '#66A38A' : 'transparent',
                  color: activeTab === 'edit' ? '#FFFFFF' : '#9CA3AF'
                }}
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className="py-2 px-4 text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                style={{
                  backgroundColor: activeTab === 'design' ? '#66A38A' : 'transparent',
                  color: activeTab === 'design' ? '#FFFFFF' : '#9CA3AF'
                }}
              >
                <Palette className="h-4 w-4" />
                Design
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className="py-2 px-4 text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                style={{
                  backgroundColor: activeTab === 'settings' ? '#66A38A' : 'transparent',
                  color: activeTab === 'settings' ? '#FFFFFF' : '#9CA3AF'
                }}
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className="px-3 py-1" style={{ backgroundColor: '#1A2332', color: '#66A38A' }}>
              {siteData.templateVersion.template.name}
            </Badge>
            <Button
              variant="outline"
              onClick={() => window.open(`/${siteData.handle}`, '_blank')}
              className="text-gray-300 border-gray-600"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={saveSite}
              disabled={saving}
              className="rounded-xl"
              style={{
                backgroundColor: saving ? '#9CA3AF' : '#66A38A',
                borderColor: saving ? '#9CA3AF' : '#66A38A',
                color: '#FFFFFF'
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="lg:grid lg:grid-cols-2 lg:h-[calc(100vh-80px)]">
          {/* Mobile Preview Mode */}
          {showPreview && (
            <div className="lg:hidden fixed inset-0 z-40" style={{ backgroundColor: '#0F1419', paddingTop: '140px' }}>
              <div className="h-full overflow-hidden">
                {/* Preview Header */}
                <div className="px-4 py-2 border-b" style={{ borderColor: '#2A3441' }}>
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                      className={`p-2 ${previewMode === 'mobile' ? 'text-white' : 'text-gray-400'}`}
                      style={{ backgroundColor: previewMode === 'mobile' ? '#66A38A' : 'transparent' }}
                    >
                      <Smartphone className="h-4 w-4 mr-1" />
                      Mobile
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                      className={`p-2 ${previewMode === 'desktop' ? 'text-white' : 'text-gray-400'}`}
                      style={{ backgroundColor: previewMode === 'desktop' ? '#66A38A' : 'transparent' }}
                    >
                      <Monitor className="h-4 w-4 mr-1" />
                      Desktop
                    </Button>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="h-full overflow-y-auto" style={{ backgroundColor: '#F7F9FA' }}>
                  <div className={`${previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'max-w-4xl mx-auto'} h-full`}>
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

          {/* Editor Panel */}
          <div className="p-4 lg:p-6 lg:overflow-y-auto">
            {activeTab === 'edit' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Edit Content</h2>

                {/* Bio Section */}
                {bioBlock && (
                  <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center">
                        <User className="h-5 w-5 mr-2" style={{ color: '#66A38A' }} />
                        Bio Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Profile Picture Upload */}
                      <div>
                        <label className="text-sm font-medium text-gray-300 block mb-3">Profile Picture</label>
                        <AvatarUpload
                          currentAvatar={bioBlock.props.avatar}
                          onAvatarChange={(url) => updateBlock(bioBlock.id, { avatar: url })}
                          size="lg"
                          className="mb-3"
                        />
                        
                        {/* Show Avatar Toggle */}
                        {bioBlock.props.avatar && (
                          <div className="mt-3 flex items-center justify-between">
                            <label htmlFor="showAvatar" className="text-sm font-medium text-gray-300">
                              Show profile picture
                            </label>
                            <button
                              type="button"
                              onClick={() => updateBlock(bioBlock.id, { showAvatar: !(bioBlock.props.showAvatar ?? true) })}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#66A38A] focus:ring-offset-2 focus:ring-offset-gray-800 ${
                                bioBlock.props.showAvatar ?? true ? 'bg-[#66A38A]' : 'bg-gray-600'
                              }`}
                              role="switch"
                              aria-checked={bioBlock.props.showAvatar ?? true}
                              aria-labelledby="showAvatar"
                            >
                              <span className="sr-only">Show profile picture</span>
                              <span
                                aria-hidden="true"
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  bioBlock.props.showAvatar ?? true ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">Name</label>
                        <Input
                          value={bioBlock.props.name || ''}
                          onChange={(e) => updateBlock(bioBlock.id, { name: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">Bio</label>
                        <Textarea
                          value={bioBlock.props.bio || ''}
                          onChange={(e) => updateBlock(bioBlock.id, { bio: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="Tell people about yourself"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Links Section */}
                {linkListBlock && (
                  <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center">
                          <Link2 className="h-5 w-5 mr-2" style={{ color: '#66A38A' }} />
                          Links ({linkListBlock.props.items?.length || 0})
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {linkListBlock.props.items?.length > 1 && (
                            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                              <GripVertical className="h-3 w-3" style={{ color: '#66A38A' }} />
                              <span>Drag to reorder</span>
                            </div>
                          )}
                          {linkListBlock.props.items?.length > 0 && isPremiumUser && (
                            <Button
                              onClick={() => setShowGlobalStyle(!showGlobalStyle)}
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-gray-400 hover:text-gray-300"
                              title="Global Link Styling - Premium Feature"
                            >
                              <Palette className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            onClick={addLink}
                            size="sm"
                            className="h-8 px-3 rounded-lg"
                            style={{
                              backgroundColor: '#66A38A',
                              borderColor: '#66A38A',
                              color: '#FFFFFF'
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Link
                          </Button>
                        </div>
                      </div>

                      {/* Quick Add Toggle */}
                      <div className="mt-3">
                        <Button
                          onClick={() => setShowQuickAdd(!showQuickAdd)}
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-gray-400 hover:text-gray-300"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Quick Add Templates
                          {showQuickAdd ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                        </Button>

                        {/* Collapsible Quick Templates */}
                        {showQuickAdd && (
                          <div className="mt-2 p-3 rounded-lg bg-gray-800/50 border border-gray-600">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {[
                                { id: 'whatsapp', name: 'WhatsApp', icon: 'whatsapp', color: '#25D366' },
                                { id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#E4405F' },
                                { id: 'shopee', name: 'Shopee', icon: 'shopee', color: '#EE4D2D' },
                                { id: 'tokopedia', name: 'Tokopedia', icon: 'tokopedia', color: '#42B549' },
                                { id: 'tiktok', name: 'TikTok', icon: 'tiktok', color: '#000000' },
                                { id: 'youtube', name: 'YouTube', icon: 'youtube', color: '#FF0000' }
                              ].map((template) => (
                                <Button
                                  key={template.id}
                                  onClick={() => {
                                    const newLink = {
                                      id: `link-${Date.now()}`,
                                      title: template.name,
                                      url: template.id === 'whatsapp' ? 'https://wa.me/' :
                                        template.id === 'instagram' ? 'https://instagram.com/' :
                                          template.id === 'shopee' ? 'https://shopee.co.id/' :
                                            template.id === 'tokopedia' ? 'https://tokopedia.com/' :
                                              template.id === 'tiktok' ? 'https://tiktok.com/@' :
                                                template.id === 'youtube' ? 'https://youtube.com/@' : 'https://'
                                    }
                                    const newItems = [...(linkListBlock.props.items || []), newLink]
                                    updateBlock(linkListBlock.id, { items: newItems })
                                    setShowQuickAdd(false)
                                  }}
                                  variant="outline"
                                  size="sm"
                                  className="h-10 flex flex-col items-center justify-center gap-1 p-2 text-white hover:scale-105 transition-transform"
                                  style={{
                                    borderColor: '#66A38A',
                                    backgroundColor: '#66A38A20'
                                  }}
                                >
                                  <PlatformIcon
                                    platform={template.icon}
                                    size={16}
                                    className="text-white"
                                  />
                                  <span className="text-xs text-white">
                                    {template.name}
                                  </span>
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Global Style Settings */}
                        {showGlobalStyle && (
                          <div className="mt-2 p-3 rounded-lg bg-gray-800/50 border border-gray-600">
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                                <Palette className="h-4 w-4" style={{ color: '#66A38A' }} />
                                Global Link Styling
                              </h4>

                              {/* Apply to All Buttons */}
                              <div className="space-y-2">
                                <div className="space-y-3">
                                  <ColorPicker
                                    value={undefined}
                                    defaultColor={'#66A38A'}
                                    onChange={(color) => {
                                      const newItems = linkListBlock.props.items.map((item: any) => ({
                                        ...item,
                                        customColor: color
                                      }))
                                      updateBlock(linkListBlock.id, { items: newItems })
                                    }}
                                    label="Apply Button Color to All Links"
                                    allowDefault={true}
                                  />
                                  
                                  <ColorPicker
                                    value={undefined}
                                    defaultColor={'#FFFFFF'}
                                    onChange={(color) => {
                                      const newItems = linkListBlock.props.items.map((item: any) => ({
                                        ...item,
                                        customTextColor: color
                                      }))
                                      updateBlock(linkListBlock.id, { items: newItems })
                                    }}
                                    label="Apply Text Color to All Links"
                                    allowDefault={true}
                                    isTextColor={true}
                                  />
                                </div>

                                <div>
                                  <label className="text-xs text-gray-400 block mb-2">Apply Style to All Links</label>
                                  <div className="grid grid-cols-3 gap-2">
                                    {[
                                      { name: 'Pill', value: 'pill' },
                                      { name: 'Card', value: 'card' },
                                      { name: 'Minimal', value: 'minimal' }
                                    ].map((styleOption) => (
                                      <button
                                        key={styleOption.value}
                                        onClick={() => {
                                          const newItems = linkListBlock.props.items.map((item: any) => ({
                                            ...item,
                                            customStyle: styleOption.value
                                          }))
                                          updateBlock(linkListBlock.id, { items: newItems })
                                        }}
                                        className="h-8 px-2 rounded-md border border-gray-600 text-xs text-gray-400 hover:border-gray-400 hover:text-gray-300 transition-all"
                                      >
                                        {styleOption.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {linkListBlock.props.items?.map((link: any, index: number) => (
                        <div
                          key={link.id}
                          data-link-index={index}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, index)}
                          onTouchStart={(e) => handleTouchStart(e, index)}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                          className={`group relative p-3 rounded-lg border transition-all duration-200 cursor-move touch-none select-none hover:shadow-lg hover:scale-[1.02] ${draggedIndex === index || (isDragging && draggedIndex === index) ? 'opacity-50 scale-95 shadow-2xl' : ''
                            } ${dragOverIndex === index ? 'border-green-500 bg-green-500/10 shadow-green-500/20 shadow-lg' : ''
                            }`}
                          style={{
                            backgroundColor: dragOverIndex === index ? '#1a3e1a' : '#2A3441',
                            borderColor: dragOverIndex === index ? '#66A38A' : '#3A4553',
                            boxShadow: draggedIndex === index ? '0 20px 25px -5px rgba(102, 163, 138, 0.3)' : ''
                          }}
                        >
                          {/* Always Visible Drag Handle */}
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 transition-all duration-200 group-hover:scale-110">
                            <GripVertical className="h-5 w-5" style={{ color: '#66A38A' }} />
                          </div>

                          <div className="space-y-3 ml-8">
                            {/* Link Number Badge */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs px-2 py-1"
                                  style={{ backgroundColor: '#66A38A20', borderColor: '#66A38A', color: '#66A38A' }}
                                >
                                  Link #{index + 1}
                                </Badge>
                                {(() => {
                                  const platform = detectPlatform(link.url)
                                  return platform && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs px-2 py-1 flex items-center gap-1"
                                      style={{ backgroundColor: platform.color + '20', borderColor: platform.color, color: platform.color }}
                                    >
                                      <PlatformIcon platform={platform.icon} size={12} />
                                      {platform.name}
                                    </Badge>
                                  )
                                })()}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newItems = linkListBlock.props.items.filter((_: any, i: number) => i !== index)
                                  updateBlock(linkListBlock.id, { items: newItems })
                                }}
                                className="text-red-400 hover:text-red-300 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <Input
                              value={link.title}
                              onChange={(e) => {
                                const newItems = [...linkListBlock.props.items]
                                newItems[index] = { ...link, title: e.target.value }
                                updateBlock(linkListBlock.id, { items: newItems })
                              }}
                              className="bg-gray-800 border-gray-600 text-white"
                              placeholder="Link title"
                            />
                            <div className="space-y-1">
                              <Input
                                value={link.url}
                                onChange={(e) => {
                                  const newItems = [...linkListBlock.props.items]
                                  newItems[index] = { ...link, url: e.target.value }
                                  updateBlock(linkListBlock.id, { items: newItems })
                                }}
                                className="bg-gray-800 border-gray-600 text-white"
                                placeholder="https://yoursite.com"
                              />
                              {(() => {
                                const platform = detectPlatform(link.url)
                                if (platform && link.url) {
                                  return (
                                    <div className="text-xs text-gray-400 px-2">
                                      <Globe className="w-3 h-3 inline mr-1" />
                                      Terdeteksi sebagai: {platform.name} - {platform.category}
                                    </div>
                                  )
                                }
                                return null
                              })()}
                            </div>

                            {/* Link Settings Toggle */}
                            {(() => {
                              const platform = detectPlatform(link.url)
                              const hasCustomFields = platform?.customFields
                              const hasNonPlatformCustomization = !platform
                              
                              // Only show link settings for premium users
                              if (!isPremiumUser || (!hasCustomFields && !hasNonPlatformCustomization)) return null

                              const isExpanded = expandedLinks.has(link.id)

                              return (
                                <div className="mt-2">
                                  <Button
                                    onClick={() => {
                                      const newExpanded = new Set(expandedLinks)
                                      if (isExpanded) {
                                        newExpanded.delete(link.id)
                                      } else {
                                        newExpanded.add(link.id)
                                      }
                                      setExpandedLinks(newExpanded)
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs text-gray-400 hover:text-gray-300"
                                    title={`${platform ? `${platform.name} Settings` : 'Link Settings'} - Premium Feature`}
                                  >
                                    <Settings className="h-3 w-3 mr-1" style={{ color: platform?.color || '#66A38A' }} />
                                    {platform ? `${platform.name} Settings` : 'Link Settings'}
                                    {isExpanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                                  </Button>

                                  {isExpanded && (
                                    <div className="mt-2 p-3 rounded-lg bg-gray-800/50 border border-gray-600 space-y-2">
                                      {platform?.customFields?.phone && (
                                        <div>
                                          <label className="text-xs text-gray-400 block mb-1">Nomor WhatsApp</label>
                                          <Input
                                            value={link.phone || ''}
                                            onChange={(e) => {
                                              const newItems = [...linkListBlock.props.items]
                                              newItems[index] = { ...link, phone: e.target.value }
                                              updateBlock(linkListBlock.id, { items: newItems })
                                            }}
                                            className="bg-gray-700 border-gray-600 text-white h-8 text-sm"
                                            placeholder="081234567890"
                                          />
                                        </div>
                                      )}

                                      {platform?.customFields?.message && (
                                        <div>
                                          <label className="text-xs text-gray-400 block mb-1">Pesan Default</label>
                                          <Textarea
                                            value={link.message || ''}
                                            onChange={(e) => {
                                              const newItems = [...linkListBlock.props.items]
                                              newItems[index] = { ...link, message: e.target.value }
                                              updateBlock(linkListBlock.id, { items: newItems })
                                            }}
                                            className="bg-gray-700 border-gray-600 text-white text-sm"
                                            placeholder="Halo, saya tertarik dengan..."
                                            rows={2}
                                          />
                                        </div>
                                      )}

                                      {platform?.customFields?.amount && (
                                        <div>
                                          <label className="text-xs text-gray-400 block mb-1">Nominal (Rp)</label>
                                          <Input
                                            value={link.amount || ''}
                                            onChange={(e) => {
                                              const newItems = [...linkListBlock.props.items]
                                              newItems[index] = { ...link, amount: e.target.value }
                                              updateBlock(linkListBlock.id, { items: newItems })
                                            }}
                                            className="bg-gray-700 border-gray-600 text-white h-8 text-sm"
                                            placeholder="50000"
                                            type="number"
                                          />
                                        </div>
                                      )}

                                      {platform?.customFields?.username && (
                                        <div>
                                          <label className="text-xs text-gray-400 block mb-1">Username/Handle</label>
                                          <Input
                                            value={link.username || ''}
                                            onChange={(e) => {
                                              const newItems = [...linkListBlock.props.items]
                                              newItems[index] = { ...link, username: e.target.value }
                                              updateBlock(linkListBlock.id, { items: newItems })
                                            }}
                                            className="bg-gray-700 border-gray-600 text-white h-8 text-sm"
                                            placeholder="@username"
                                          />
                                        </div>
                                      )}

                                      {/* Style Settings - Always show for customization */}
                                      <div className={`${platform?.customFields ? 'border-t border-gray-600 pt-3 mt-3' : ''}`}>
                                        <div className="space-y-3">
                                          {/* Button Color */}
                                          <ColorPicker
                                            value={link.customColor}
                                            defaultColor={platform?.color || '#66A38A'}
                                            onChange={(color) => {
                                              const newItems = [...linkListBlock.props.items]
                                              newItems[index] = { ...link, customColor: color }
                                              updateBlock(linkListBlock.id, { items: newItems })
                                            }}
                                            label="Button Color"
                                            allowDefault={true}
                                          />
                                          
                                          {/* Text Color */}
                                          <ColorPicker
                                            value={link.customTextColor}
                                            defaultColor={'#FFFFFF'}
                                            onChange={(color) => {
                                              const newItems = [...linkListBlock.props.items]
                                              newItems[index] = { ...link, customTextColor: color }
                                              updateBlock(linkListBlock.id, { items: newItems })
                                            }}
                                            label="Text Color"
                                            allowDefault={true}
                                            isTextColor={true}
                                          />

                                          {/* Button Style */}
                                          <div>
                                            <label className="text-xs text-gray-400 block mb-2">Button Style</label>
                                            <div className="grid grid-cols-3 gap-2">
                                              {[
                                                { name: 'Pill', value: 'pill', icon: '🫙' },
                                                { name: 'Card', value: 'card', icon: '📄' },
                                                { name: 'Minimal', value: 'minimal', icon: '➖' }
                                              ].map((styleOption) => (
                                                <button
                                                  key={styleOption.value}
                                                  onClick={() => {
                                                    const newItems = [...linkListBlock.props.items]
                                                    newItems[index] = { ...link, customStyle: styleOption.value }
                                                    updateBlock(linkListBlock.id, { items: newItems })
                                                  }}
                                                  className={`h-8 px-2 rounded-md border text-xs transition-all ${(link.customStyle === styleOption.value) ||
                                                      (!link.customStyle && styleOption.value === 'pill')
                                                      ? 'border-sage-green bg-sage-green/20 text-white'
                                                      : 'border-gray-600 text-gray-400 hover:border-gray-400'
                                                    }`}
                                                  style={{
                                                    borderColor: (link.customStyle === styleOption.value) ||
                                                      (!link.customStyle && styleOption.value === 'pill')
                                                      ? '#66A38A' : '',
                                                    backgroundColor: (link.customStyle === styleOption.value) ||
                                                      (!link.customStyle && styleOption.value === 'pill')
                                                      ? '#66A38A20' : ''
                                                  }}
                                                >
                                                  {styleOption.name}
                                                </button>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })()}
                          </div>
                        </div>
                      ))}

                      {(!linkListBlock.props.items || linkListBlock.props.items.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No links added yet</p>
                          <Button
                            onClick={addLink}
                            size="sm"
                            className="mt-2 rounded-lg"
                            style={{
                              backgroundColor: '#66A38A',
                              borderColor: '#66A38A',
                              color: '#FFFFFF'
                            }}
                          >
                            Add Your First Link
                          </Button>
                        </div>
                      )}

                      {/* Mobile Drag Instructions */}
                      {linkListBlock.props.items?.length > 1 && (
                        <div className="sm:hidden mt-4 p-3 rounded-lg bg-gray-800/30 border border-gray-600/50">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <GripVertical className="h-3 w-3" style={{ color: '#66A38A' }} />
                            <span>Touch & hold the grip handle to reorder links</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Quick Share */}
                <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center">
                      <Share2 className="h-5 w-5 mr-2" style={{ color: '#66A38A' }} />
                      Share Your Page
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input
                        value={`${window.location.origin}/${siteData.handle}`}
                        readOnly
                        className="flex-1 bg-gray-800 border-gray-600 text-white"
                      />
                      <Button
                        onClick={() => copyToClipboard(`${window.location.origin}/${siteData.handle}`)}
                        size="sm"
                        className="px-3 rounded-lg"
                        style={{
                          backgroundColor: '#66A38A',
                          borderColor: '#66A38A',
                          color: '#FFFFFF'
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Design & Typography</h2>
                
                {/* Global Font Settings */}
                <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center">
                      <Palette className="h-5 w-5 mr-2" style={{ color: '#66A38A' }} />
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
                <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center">
                      <Palette className="h-5 w-5 mr-2" style={{ color: '#66A38A' }} />
                      Template & Themes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Current Template Info */}
                      <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-600">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium mb-1">Current Template</h4>
                            <p className="text-gray-400 text-sm">{siteData.templateVersion.template.name}</p>
                          </div>
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-gray-600 flex items-center justify-center">
                            <Palette className="w-6 h-6 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Template Picker Button */}
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-600 text-gray-300 hover:border-[#66A38A] hover:text-white"
                        onClick={() => setShowTemplatePicker(true)}
                      >
                        <Palette className="w-4 h-4 mr-2" />
                        Browse Templates
                      </Button>

                      <div className="text-xs text-gray-500 text-center">
                        Switch templates anytime without losing your content
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Site Settings</h2>
                <div className="text-center py-12 text-gray-500">
                  <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Advanced settings coming soon</p>
                  <p className="text-sm">Custom domains, analytics, and more</p>
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel - Desktop Only */}
          <div className="hidden lg:block border-l" style={{ borderColor: '#2A3441' }}>
            <div className="h-full" style={{ backgroundColor: '#1A2332' }}>
              {/* Desktop Preview Header */}
              <div className="px-4 py-3 border-b" style={{ borderColor: '#2A3441' }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Live Preview</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                      className={`p-2 ${previewMode === 'mobile' ? 'text-white' : 'text-gray-400'}`}
                      style={{ backgroundColor: previewMode === 'mobile' ? '#66A38A' : 'transparent' }}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                      className={`p-2 ${previewMode === 'desktop' ? 'text-white' : 'text-gray-400'}`}
                      style={{ backgroundColor: previewMode === 'desktop' ? '#66A38A' : 'transparent' }}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/${siteData.handle}`, '_blank')}
                      className="text-gray-400 hover:text-white p-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Desktop Preview Content */}
              <div className="h-[calc(100%-60px)] overflow-y-auto" style={{ backgroundColor: '#F7F9FA' }}>
                <div className={`${previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'} h-full`}>
                  <DynamicTemplateRenderer
                    siteData={siteData.dataJson}
                    isPreview={true}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Template Picker Fullscreen */}
      <TemplatePicker
        currentTemplateId={siteData.templateVersionId}
        onTemplateSelect={handleTemplateSwitch}
        onClose={() => setShowTemplatePicker(false)}
        isOpen={showTemplatePicker}
      />
    </div>
  )
}