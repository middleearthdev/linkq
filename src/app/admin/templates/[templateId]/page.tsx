/**
 * Edit Template Page
 * Interface for editing existing templates using the template builder
 */

"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SiteEditorClient } from '@/components/editor/SiteEditorClient'
import { QuickLoading } from '@/components/ui/cool-loading'

interface Template {
  id: string
  name: string
  slug: string
  description: string
  category: string
  status: string
  activeVersion?: {
    manifestJson: any
    cssVarsJson: any
    isPaid: boolean
    priceCents: number
    requiredPlan: string
  }
}

export default function EditTemplatePage({ params }: { params: Promise<{ templateId: string }> }) {
  const router = useRouter()
  const [templateId, setTemplateId] = useState<string>('')
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Resolve params
  useEffect(() => {
    params.then(resolvedParams => {
      setTemplateId(resolvedParams.templateId)
    })
  }, [params])

  // Fetch template data
  useEffect(() => {
    if (!templateId) return

    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/admin/templates/${templateId}`)
        const data = await response.json()

        if (data.success) {
          setTemplate(data.data)
        } else {
          setError(data.error?.message || 'Failed to load template')
        }
      } catch (err) {
        setError('Failed to load template')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [templateId])

  // Handle save from editor
  const handleSave = async (manifest: any, cssVars: Record<string, string>) => {
    try {
      // Check if manifest/cssVars changed
      const activeVersion = template?.activeVersion
      const manifestChanged = JSON.stringify(activeVersion?.manifestJson) !== JSON.stringify(manifest)
      const cssVarsChanged = JSON.stringify(activeVersion?.cssVarsJson) !== JSON.stringify(cssVars)

      if (manifestChanged || cssVarsChanged) {
        // Create new version
        const response = await fetch(`/api/admin/templates/${templateId}/versions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            manifestJson: manifest,
            cssVarsJson: cssVars,
            isPaid: activeVersion?.isPaid || false,
            priceCents: activeVersion?.priceCents || 0,
            requiredPlan: activeVersion?.requiredPlan || 'FREE'
          })
        })

        if (!response.ok) {
          throw new Error('Failed to save template')
        }

        alert('Template saved successfully!')
        router.push('/admin/templates')
      } else {
        alert('No changes detected')
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save template')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <QuickLoading text="Loading template..." />
          <p className="text-gray-600 text-sm mt-2">Preparing the editor</p>
        </div>
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'Template not found'}</p>
          <button
            onClick={() => router.push('/admin/templates')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Templates
          </button>
        </div>
      </div>
    )
  }

  // Convert template to manifest format
  const initialTemplate = template.activeVersion?.manifestJson || {
    name: template.name,
    version: '1.0.0',
    description: template.description,
    layout: {
      header: [],
      body: [],
      footer: []
    },
    defaults: {
      meta: {
        title: template.name,
        description: template.description
      },
      tokens: template.activeVersion?.cssVarsJson || {},
      blockProps: {}
    },
    allowedBlocks: [],
    maxBlocks: {},
    priceCents: template.activeVersion?.priceCents || 0,
    requiredPlan: template.activeVersion?.requiredPlan || 'FREE'
  }

  return (
    <SiteEditorClient
      mode="edit"
      initialTemplate={initialTemplate}
      onSave={handleSave}
      user={{ id: 'admin', plan: 'PRO' }} // Mock user for now
    />
  )
}
