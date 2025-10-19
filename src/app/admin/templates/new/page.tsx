/**
 * Create New Template Page  
 * Interface for creating new templates using the template builder
 */

import { Suspense } from 'react'
import { requireAdmin } from '@/lib/auth-utils'
import { SiteEditorClient } from '@/components/editor/SiteEditorClient'
import { QuickLoading } from '@/components/ui/cool-loading'

export default async function CreateTemplatePage() {
  // Server-side admin check - secure and performant
  const user = await requireAdmin()

  return (
    <Suspense fallback={<TemplateBuilderLoadingState />}>
      <SiteEditorClient 
        user={user} 
        mode="create"
      />
    </Suspense>
  )
}

function TemplateBuilderLoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F1419' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#66A38A' }} />
        <QuickLoading text="Loading template builder..." />
        <p className="text-gray-400 text-sm mt-2">Preparing the canvas for template creation</p>
      </div>
    </div>
  )
}

// Generate metadata for the page
export async function generateMetadata() {
  return {
    title: 'Create New Template | LinkQ Admin',
    description: 'Create a new bio link template for the marketplace',
  }
}