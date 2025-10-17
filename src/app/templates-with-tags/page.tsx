/**
 * Templates with Tag Filtering Demo Page
 * Demonstrates the tag filtering functionality
 */

'use client'

import { useState, useEffect } from 'react'
import { TagFilter } from '@/components/ui/tag-filter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Tag } from '@/types'

interface Template {
  id: string
  slug: string
  name: string
  description: string
  category: string
  tags: Tag[]
  thumbnail?: string
  isPaid: boolean
  priceCents?: number
  canAccess: boolean
  isOwned: boolean
}

export default function TemplatesWithTagsPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch data from API
  useEffect(() => {
    Promise.all([
      fetch('/api/templates').then(res => res.json()),
      fetch('/api/tags').then(res => res.json())
    ]).then(([templatesData, tagsData]) => {
      setTemplates(templatesData.templates || [])
      setAllTags(tagsData.tags || [])
      setFilteredTemplates(templatesData.templates || [])
      setLoading(false)
    }).catch(error => {
      console.error('Failed to fetch data:', error)
      setLoading(false)
    })
  }, [])

  // Filter templates based on selected tags
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredTemplates(templates)
    } else {
      const filtered = templates.filter(template =>
        selectedTags.every(tagSlug => template.tags.some(tag => tag.slug === tagSlug))
      )
      setFilteredTemplates(filtered)
    }
  }, [selectedTags, templates])

  const handleTagToggle = (tagSlug: string) => {
    setSelectedTags(prev => 
      prev.includes(tagSlug)
        ? prev.filter(t => t !== tagSlug)
        : [...prev, tagSlug]
    )
  }

  const handleClearAll = () => {
    setSelectedTags([])
  }

  const getTagBySlug = (slug: string) => allTags.find(tag => tag.slug === slug)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/color-customizer">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  🏷️ Templates with Tags
                </h1>
                <p className="text-muted-foreground">Filter {templates.length} templates by industry, style, purpose, and audience</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Tag Filter Sidebar */}
          <div className="lg:col-span-1">
            <TagFilter
              tags={allTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Templates Grid */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {filteredTemplates.length} Template{filteredTemplates.length !== 1 ? 's' : ''} Found
                  </h2>
                  {selectedTags.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">Filtered by:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedTags.map(tagSlug => {
                          const tag = getTagBySlug(tagSlug)
                          return tag ? (
                            <Badge key={tagSlug} variant="secondary" className="text-xs">
                              {tag.icon} {tag.name}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Templates Grid */}
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="group hover:shadow-lg transition-all duration-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <CardDescription className="text-sm mt-1">
                              {template.description}
                            </CardDescription>
                          </div>
                          {template.isPaid ? (
                            <Badge variant="secondary">
                              ${(template.priceCents! / 100).toFixed(0)}
                            </Badge>
                          ) : (
                            <Badge variant="default">
                              Free
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {/* Template Preview Placeholder */}
                        <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg mb-4 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">Template Preview</span>
                        </div>
                        
                        {/* Tags */}
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-muted-foreground">Tags:</div>
                          <div className="flex flex-wrap gap-1">
                            {template.tags.map(tag => (
                              <Badge
                                key={tag.slug}
                                variant="outline"
                                className={cn(
                                  "text-xs cursor-pointer hover:scale-105 transition-transform",
                                  selectedTags.includes(tag.slug) && "bg-primary text-primary-foreground"
                                )}
                                style={{
                                  borderColor: tag.color,
                                  color: selectedTags.includes(tag.slug) ? undefined : tag.color
                                }}
                                onClick={() => handleTagToggle(tag.slug)}
                              >
                                {tag.icon} {tag.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="flex-1">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline">
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try removing some filters or selecting different tags
                  </p>
                  <Button onClick={handleClearAll} variant="outline">
                    Clear all filters
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}