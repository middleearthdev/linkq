/**
 * Custom Hook: useSiteData
 * Manages site data loading, saving, and publishing
 * Features: Undo/redo, auto-save
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from '@/lib/auth-client'

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

interface UseSiteDataReturn {
  siteData: SiteData | null
  loading: boolean
  saving: boolean
  publishing: boolean
  error: string
  canUndo: boolean
  canRedo: boolean
  saveSite: () => Promise<void>
  publishSite: () => Promise<void>
  updateSiteData: (data: Partial<SiteData>) => void
  updateBlock: (blockId: string, newProps: any) => void
  addBlock: (blockType: string) => void
  deleteBlock: (blockId: string) => void
  duplicateBlock: (blockId: string) => void
  undo: () => void
  redo: () => void
}

export function useSiteData(siteId: string): UseSiteDataReturn {
  const { data: session } = useSession()
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')

  // Undo/Redo state
  const historyRef = useRef<SiteData[]>([])
  const historyIndexRef = useRef<number>(-1)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  // Load site data
  useEffect(() => {
    const loadSite = async () => {
      try {
        const response = await fetch(`/api/sites/by-id/${siteId}`)
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
  }, [session, siteId])

  // Save site
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

      setError('')
    } catch (err) {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  // Publish/unpublish site
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

      setSiteData({
        ...siteData,
        status: siteData.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
      })

      setError('')
    } catch (err) {
      setError('Network error')
    } finally {
      setPublishing(false)
    }
  }

  // Add to history for undo/redo
  const addToHistory = useCallback((newData: SiteData) => {
    // Remove any future history when making a new change
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)

    // Add new state to history
    historyRef.current.push(JSON.parse(JSON.stringify(newData)))
    historyIndexRef.current = historyRef.current.length - 1

    // Limit history to 50 items
    if (historyRef.current.length > 50) {
      historyRef.current.shift()
      historyIndexRef.current--
    }

    setCanUndo(historyIndexRef.current > 0)
    setCanRedo(false)
  }, [])

  // Undo function
  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--
      const previousState = historyRef.current[historyIndexRef.current]
      setSiteData(JSON.parse(JSON.stringify(previousState)))
      setCanUndo(historyIndexRef.current > 0)
      setCanRedo(true)

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(30)
      }
    }
  }, [])

  // Redo function
  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++
      const nextState = historyRef.current[historyIndexRef.current]
      setSiteData(JSON.parse(JSON.stringify(nextState)))
      setCanUndo(true)
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1)

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(30)
      }
    }
  }, [])

  // Update site data with history tracking
  const updateSiteData = (data: Partial<SiteData>) => {
    if (!siteData) return
    const newData = { ...siteData, ...data }
    setSiteData(newData)
    addToHistory(newData)
  }

  // Update block props
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

  // Add new block
  const addBlock = (blockType: string) => {
    if (!siteData) return

    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      props: getDefaultPropsForBlockType(blockType)
    }

    setSiteData({
      ...siteData,
      dataJson: {
        ...siteData.dataJson,
        blocks: [...siteData.dataJson.blocks, newBlock]
      }
    })
  }

  // Delete block
  const deleteBlock = (blockId: string) => {
    if (!siteData) return

    setSiteData({
      ...siteData,
      dataJson: {
        ...siteData.dataJson,
        blocks: siteData.dataJson.blocks.filter(block => block.id !== blockId)
      }
    })
  }

  // Duplicate block
  const duplicateBlock = (blockId: string) => {
    if (!siteData) return

    const blockToDuplicate = siteData.dataJson.blocks.find(block => block.id === blockId)
    if (!blockToDuplicate) return

    // Create a new block with duplicated props
    const duplicatedBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: blockToDuplicate.type,
      props: JSON.parse(JSON.stringify(blockToDuplicate.props)) // Deep clone props
    }

    // Find the index of the original block
    const originalIndex = siteData.dataJson.blocks.findIndex(block => block.id === blockId)

    // Insert duplicated block right after the original
    const newBlocks = [...siteData.dataJson.blocks]
    newBlocks.splice(originalIndex + 1, 0, duplicatedBlock)

    setSiteData({
      ...siteData,
      dataJson: {
        ...siteData.dataJson,
        blocks: newBlocks
      }
    })
  }

  // Initialize history when siteData is loaded
  useEffect(() => {
    if (siteData && historyRef.current.length === 0) {
      historyRef.current = [JSON.parse(JSON.stringify(siteData))]
      historyIndexRef.current = 0
      setCanUndo(false)
      setCanRedo(false)
    }
  }, [siteData])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey

      // Cmd/Ctrl + Z = Undo
      if (isCmdOrCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      // Cmd/Ctrl + Shift + Z OR Cmd/Ctrl + Y = Redo
      if (isCmdOrCtrl && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])


  return {
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
  }
}

// Helper function for default block props
function getDefaultPropsForBlockType(blockType: string): any {
  const defaultProps: Record<string, any> = {
    'link-list': {
      items: [{
        id: `link-${Date.now()}`,
        title: 'New Link',
        url: 'https://yoursite.com'
      }]
    },
    'social-icons': {
      platforms: [],
      style: 'round',
      size: 'md',
      colorMode: 'brand'
    },
    'divider': {
      style: 'solid',
      thickness: 1,
      color: '#e5e7eb',
      spacing: 'md',
      width: '100',
      alignment: 'center'
    },
    'gallery': {
      items: [],
      layout: 'grid',
      columns: 3,
      aspectRatio: 'square'
    },
    'footer': {
      copyrightText: `© ${new Date().getFullYear()} Your Name`,
      layout: 'centered',
      showSocial: true,
      showLinks: true,
      links: [],
      socialLinks: []
    },
    'whatsapp-business': {
      phoneNumber: '081234567890',
      buttonText: 'Chat via WhatsApp',
      buttonStyle: 'fab',
      showIcon: true,
      fabPosition: 'bottom-right'
    },
    'delivery-platform': {
      platforms: {},
      layout: 'buttons',
      showRatings: true,
      showPromos: true
    },
    'marketplace': {
      stores: {},
      featuredProducts: [],
      layout: 'store-links',
      showBadges: true,
      showRatings: true
    },
    'location': {
      googleMapsUrl: '',
      address: '',
      locationName: 'My Location',
      showDirectionsButton: true,
      mapHeight: 300
    },
    'qris-payment': {
      qrisImage: '',
      merchantName: '',
      paymentMethods: ['Gopay', 'OVO', 'Dana', 'ShopeePay'],
      showPaymentLogos: true
    },
    'product-catalog': {
      items: [],
      style: 'instagram-card',
      columns: 2,
      showSearch: true,
      showCategories: true,
      showStockIndicator: true
    },
    'analytics': {
      showViews: true,
      showClicks: true,
      showVisitors: false,
      period: '30d',
      style: 'minimal'
    }
  }

  return defaultProps[blockType] || {}
}
