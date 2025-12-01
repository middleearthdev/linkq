/**
 * Template Preview Page
 * Clean template rendering for screenshots and previews
 * No UI chrome, just the template
 */

import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { generateTemplatePreviewData } from '@/lib/template-registry'
import { DynamicTemplateRenderer } from '@/components/DynamicTemplateRenderer'

interface PreviewPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PreviewPage(props: PreviewPageProps) {
  const params = await props.params
  const { slug } = params

  // Get template from database
  const template = await db.template.findUnique({
    where: { slug },
    include: {
      versions: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  console.log(template, 'template')

  if (!template || template.versions.length === 0) {
    notFound()
  }

  const version = template.versions[0]
  const manifest = version.manifestJson as any

  // // Generate preview data
  const previewData = generateTemplatePreviewData(manifest)

  // // Add template-specific sample data
  const siteData = {
    ...previewData,
    meta: {
      ...previewData.meta,
      title: template.name,
      description: template.description || 'Template preview',
    },
  }

  return (
    <div className="min-h-screen">
      <DynamicTemplateRenderer
        siteData={siteData}
        isPreview={true}
      />
    </div>
  )
}

// Generate static params for all templates (optional, for static export)
export async function generateStaticParams() {
  const templates = await db.template.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  })

  return templates.map((template) => ({
    slug: template.slug,
  }))
}
