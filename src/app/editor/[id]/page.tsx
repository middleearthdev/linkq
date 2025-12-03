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

import { use, useState } from "react"
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
import { MobileTabs } from "./components/MobileTabs"
import { EditTab } from "./components/EditTab"
import { DesignTab } from "./components/DesignTab"
import { SettingsTab } from "./components/SettingsTab"
import { BlockPicker } from "./components/BlockPicker"
import { MobilePreview } from "./components/MobilePreview"
import { Button } from "@/components/ui/button"

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { data: session, isPending } = useSession()

  // UI State
  const [activeTab, setActiveTab] = useState<'edit' | 'design' | 'settings'>('edit')
  const [showPreview, setShowPreview] = useState(false)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [showBlockPicker, setShowBlockPicker] = useState(false)

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
      updateSiteData({
        ...siteData,
        dataJson: {
          ...siteData.dataJson,
          blocks: [newBioBlock, ...siteData.dataJson.blocks]
        }
      })
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

  const handleFontChange = (font: string) => {
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
        {/* Mobile Header */}
        <EditorHeader
          variant="mobile"
          handle={siteData.handle}
          status={siteData.status as any}
          saving={saving}
          publishing={publishing}
          showPreview={showPreview}
          onSave={saveSite}
          onPublish={publishSite}
          onTogglePreview={() => setShowPreview(!showPreview)}
        />

        {/* Mobile Tabs */}
        <div className="lg:hidden">
          <MobileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Desktop Header */}
        <EditorHeader
          variant="desktop"
          handle={siteData.handle}
          status={siteData.status as any}
          saving={saving}
          publishing={publishing}
          showPreview={showPreview}
          onSave={saveSite}
          onPublish={publishSite}
          onTogglePreview={() => setShowPreview(!showPreview)}
        />

        {/* Main Content - 2 Column Layout (Center + Preview) */}
        <main className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Mobile Preview Mode */}
          <MobilePreview
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            siteData={siteData.dataJson}
          />

          {/* Center Content Area - Scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin lg:border-r lg:border-border">
            <div className="p-4 lg:p-6 max-w-3xl mx-auto pb-20">
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
                <DesignTab
                  templateName={siteData.templateVersion.template.name}
                  currentFont={siteData.dataJson.meta.font}
                  onFontChange={handleFontChange}
                  onOpenTemplatePicker={() => setShowTemplatePicker(true)}
                />
              )}

              {activeTab === 'settings' && <SettingsTab />}
            </div>
          </div>

          {/* Preview Panel - Desktop Only */}
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
      <BlockPicker
        isOpen={showBlockPicker}
        onClose={() => setShowBlockPicker(false)}
        onAddBlock={addBlock}
      />
    </div>
  )
}
