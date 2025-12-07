/**
 * Bio Link Editor Page (REFACTORED)
 * Mobile-first editor interface for managing bio link content
 *
 * REFACTORED: Split into smaller, maintainable modules
 * - Custom hooks for state management
 * - Smaller UI components
 * - Separated concerns
 */

"use client"

import { use, useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"
import { SiteLoadingScreen } from "@/components/ui/cool-loading"
import { DeviceSimulator } from "@/components/editor/DeviceSimulator"
import TemplatePicker from "@/components/TemplatePicker"

// Custom Hooks
import { useSiteData } from "./hooks/useSiteData"
import { useDragDrop } from "./hooks/useDragDrop"

// Components
import { EditorHeader } from "./components/EditorHeader"
import { EditorSidebar } from "./components/EditorSidebar"
import { BottomNavigation } from "./components/BottomNavigation"
import { EditTab } from "./components/EditTab"
import { DesignTabEnhanced } from "./components/DesignTabEnhanced"
import { SettingsTab } from "./components/SettingsTab"
import { BlockPicker } from "./components/BlockPicker"
import { Button } from "@/components/ui/button"

// Import enhancements CSS
import "@/styles/editor-enhancements.css"

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { data: session, isPending } = useSession()

  // UI State - Now includes 'preview' tab
  const [activeTab, setActiveTab] = useState<'edit' | 'design' | 'preview' | 'settings'>('edit')
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [showBlockPicker, setShowBlockPicker] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Store deleted bio block to preserve customization
  const [deletedBioBlock, setDeletedBioBlock] = useState<any>(null)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Site Data Management
  const {
    siteData,
    loading,
    saving,
    publishing,
    error,
    canUndo,
    canRedo,
    saveSite,
    publishSite,
    updateSiteData,
    updateBlock,
    addBlock,
    deleteBlock,
    duplicateBlock,
    undo,
    redo
  } = useSiteData(resolvedParams.id)

  // Drag & Drop for Blocks
  const blockDragDrop = useDragDrop()

  // Loading state
  if (isPending || loading) {
    return <SiteLoadingScreen handle={resolvedParams.id} />
  }

  // Error state
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

  // Helper functions
  const bioBlock = siteData.dataJson.blocks.find(b => b.type === 'bio')
  const linkListBlock = siteData.dataJson.blocks.find(b => b.type === 'link-list')

  const handleToggleBioBlock = () => {
    const bioBlock = siteData.dataJson.blocks.find((b: any) => b.type === 'bio')
    if (bioBlock) {
      // Store bio block before removing (to preserve customization)
      setDeletedBioBlock(bioBlock)

      // Remove bio block
      const newBlocks = siteData.dataJson.blocks.filter((b: any) => b.type !== 'bio')
      updateSiteData({
        ...siteData,
        dataJson: {
          ...siteData.dataJson,
          blocks: newBlocks
        }
      })
    } else {
      // Restore previously deleted bio block OR create new one
      const bioToAdd = deletedBioBlock || {
        id: `block-bio-${Date.now()}`,
        type: 'bio',
        props: {
          name: 'Your Name',
          bio: 'Add your bio here',  // Fixed: 'bio' not 'description'
          avatar: '',
          showAvatar: true,
          avatarSize: 'lg',
          avatarStyle: 'circle',
          textAlign: 'center',
          nameStyle: 'default',
          spacing: 'normal',
          bioStyle: 'default'
        }
      }

      updateSiteData({
        ...siteData,
        dataJson: {
          ...siteData.dataJson,
          blocks: [bioToAdd, ...siteData.dataJson.blocks]
        }
      })

      // Clear deletedBioBlock after restoring
      if (deletedBioBlock) {
        setDeletedBioBlock(null)
      }
    }
  }

  const handleToggleWhatsAppBlock = () => {
    const waBlock = siteData.dataJson.blocks.find((b: any) => b.type === 'whatsapp-business')
    if (waBlock) {
      // Remove WhatsApp block
      const newBlocks = siteData.dataJson.blocks.filter((b: any) => b.type !== 'whatsapp-business')
      updateSiteData({
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
      updateSiteData({
        ...siteData,
        dataJson: {
          ...siteData.dataJson,
          blocks: [...siteData.dataJson.blocks, newWABlock]
        }
      })
    }
  }

  const handleBlockReorder = (fromIndex: number, toIndex: number) => {
    const blocks = [...siteData.dataJson.blocks]
    const [draggedBlock] = blocks.splice(fromIndex, 1)
    blocks.splice(toIndex, 0, draggedBlock)

    updateSiteData({
      ...siteData,
      dataJson: {
        ...siteData.dataJson,
        blocks
      }
    })
  }

  const handleTemplateSwitch = async (templateVersionId: string) => {
    try {
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
    }
  }

  const handleFontChange = (font: string | undefined) => {
    if (!font) return
    updateSiteData({
      ...siteData,
      dataJson: {
        ...siteData.dataJson,
        meta: {
          ...siteData.dataJson.meta,
          font: font
        }
      }
    })
  }

  return (
    <div className="h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Desktop Sidebar Navigation */}
      <EditorSidebar
        handle={siteData.handle}
        status={siteData.status as any}
        linkCount={linkListBlock?.props.items?.length || 0}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile Header - Clean, No Tabs */}
        <EditorHeader
          variant="mobile"
          handle={siteData.handle}
          status={siteData.status as any}
          saving={saving}
          publishing={publishing}
          showPreview={activeTab === 'preview'}
          onSave={saveSite}
          onPublish={publishSite}
          onTogglePreview={() => setActiveTab(activeTab === 'preview' ? 'edit' : 'preview')}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
        />

        {/* Desktop Header */}
        <EditorHeader
          variant="desktop"
          handle={siteData.handle}
          status={siteData.status as any}
          saving={saving}
          publishing={publishing}
          showPreview={false}
          onSave={saveSite}
          onPublish={publishSite}
          onTogglePreview={() => {}}
        />

        {/* Main Content - 2 Column Layout (Center + Preview) */}
        <main className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Center Content Area - Scrollable */}
          <div className={`flex-1 min-h-0 overflow-y-auto scrollbar-thin lg:border-r lg:border-border ${activeTab === 'preview' && isMobile ? 'hidden' : ''}`}>
            <div className="p-4 lg:p-6 lg:pl-8 max-w-4xl pb-24 lg:pb-6">
              {activeTab === 'edit' && (
                <EditTab
                  blocks={siteData.dataJson.blocks}
                  handle={siteData.handle}
                  bioBlock={bioBlock}
                  userPlan={(session?.user as any)?.plan || 'FREE'}
                  onToggleBioBlock={handleToggleBioBlock}
                  onToggleWhatsAppBlock={handleToggleWhatsAppBlock}
                  onAddBlock={() => setShowBlockPicker(true)}
                  onUpdateBlock={updateBlock}
                  onDeleteBlock={deleteBlock}
                  onDuplicateBlock={duplicateBlock}
                  canUndo={canUndo}
                  canRedo={canRedo}
                  onUndo={undo}
                  onRedo={redo}
                  draggedBlockIndex={blockDragDrop.draggedIndex}
                  dragOverBlockIndex={blockDragDrop.dragOverIndex}
                  onBlockDragStart={(e, index) => blockDragDrop.handleDragStart(e, index)}
                  onBlockDragEnd={(e) => blockDragDrop.handleDragEnd(e)}
                  onBlockDragOver={(e, index) => blockDragDrop.handleDragOver(e, index)}
                  onBlockDrop={(e, index) => blockDragDrop.handleDrop(e, index, handleBlockReorder)}
                  onBlockTouchStart={(e, index) => blockDragDrop.handleTouchStart(e, index)}
                  onBlockTouchMove={(e) => blockDragDrop.handleTouchMove(e)}
                  onBlockTouchEnd={() => blockDragDrop.handleTouchEnd(handleBlockReorder)}
                />
              )}

              {activeTab === 'design' && (
                <DesignTabEnhanced
                  templateName={siteData.templateVersion.template.name}
                  currentFont={siteData.dataJson.meta.font}
                  onFontChange={handleFontChange}
                  onOpenTemplatePicker={() => setShowTemplatePicker(true)}
                  isMobile={isMobile}
                />
              )}

              {activeTab === 'settings' && <SettingsTab />}
            </div>
          </div>

          {/* Preview Panel - Mobile (Full Screen) & Desktop (Sidebar) */}
          {activeTab === 'preview' && isMobile ? (
            <div className="flex-1 min-h-0 overflow-y-auto bg-secondary/20 flex items-center justify-center p-4">
              <DeviceSimulator
                siteData={siteData.dataJson}
                className="w-full max-w-md"
              />
            </div>
          ) : (
            <DeviceSimulator
              siteData={siteData.dataJson}
              className="hidden lg:block lg:w-[420px] lg:flex-shrink-0 min-h-0"
            />
          )}
        </main>

        {/* Bottom Navigation Bar - Mobile Only */}
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Template Picker Fullscreen */}
      <TemplatePicker
        currentTemplateId={siteData.templateVersionId}
        onTemplateSelect={handleTemplateSwitch}
        onClose={() => setShowTemplatePicker(false)}
        isOpen={showTemplatePicker}
      />

      {/* Block Picker Modal */}
      <BlockPicker
        isOpen={showBlockPicker}
        onClose={() => setShowBlockPicker(false)}
        onAddBlock={addBlock}
      />
    </div>
  )
}
