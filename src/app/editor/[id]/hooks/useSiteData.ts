/**
 * Custom Hook: useSiteData
 * Manages site data loading, saving, and publishing
 */

import { useState, useEffect } from 'react'
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
  saveSite: () => Promise<void>
  publishSite: () => Promise<void>
  updateSiteData: (data: Partial<SiteData>) => void
  updateBlock: (blockId: string, newProps: any) => void
  addBlock: (blockType: string) => void
  deleteBlock: (blockId: string) => void
}

export function useSiteData(siteId: string): UseSiteDataReturn {
  const { data: session } = useSession()
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')

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

  // Update site data
  const updateSiteData = (data: Partial<SiteData>) => {
    if (!siteData) return
    setSiteData({ ...siteData, ...data })
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

  return {
    siteData,
    loading,
    saving,
    publishing,
    error,
    saveSite,
    publishSite,
    updateSiteData,
    updateBlock,
    addBlock,
    deleteBlock
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
