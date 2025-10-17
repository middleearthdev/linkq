/**
 * Template Preview Page
 * Quick way to see all templates in action with filtering
 */

"use client"

import { useState, useEffect } from "react"
import { DynamicTemplateRenderer } from "@/components/DynamicTemplateRenderer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { TagFilter } from "@/components/ui/tag-filter"
import { Palette, Search, Filter, X, ArrowLeft } from "lucide-react"
import { Tag } from "@/types"
import Link from "next/link"

interface TemplatePreview {
  id: string
  slug: string
  name: string
  description?: string
  category: string
  tags: Tag[]
  previewData?: any
  canAccess: boolean
  isPaid: boolean
  priceCents?: number
  isOwned: boolean
  needsUpgrade?: boolean
}

export default function TemplatePreviews() {
  const [templates, setTemplates] = useState<TemplatePreview[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<TemplatePreview | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
    fetchTags()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch templates')
      }

      setTemplates(data.templates || [])

      // Set first template as default
      if (data.templates && data.templates.length > 0) {
        setSelectedTemplate(data.templates[0])
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tags')
      }

      setAllTags(data.tags || [])
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    }
  }

  // Filter templates based on search, tags, and category
  const filteredTemplates = templates.filter(template => {
    // Search filter
    if (searchTerm && !template.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(template.description || '').toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Category filter
    if (selectedCategory !== 'all' && template.category !== selectedCategory) {
      return false
    }

    // Tags filter
    if (selectedTags.length > 0) {
      const templateTagSlugs = template.tags.map(tag => tag.slug)
      return selectedTags.every(tagSlug => templateTagSlugs.includes(tagSlug))
    }

    return true
  })

  const handleTagToggle = (tagSlug: string) => {
    setSelectedTags(prev =>
      prev.includes(tagSlug)
        ? prev.filter(t => t !== tagSlug)
        : [...prev, tagSlug]
    )
  }

  const handleClearFilters = () => {
    setSelectedTags([])
    setSearchTerm('')
    setSelectedCategory('all')
  }

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'free', name: 'Free', count: templates.filter(t => t.category === 'free').length },
    { id: 'premium', name: 'Premium', count: templates.filter(t => t.category === 'premium').length },
    { id: 'pro', name: 'Pro', count: templates.filter(t => t.category === 'pro').length }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading templates...</p>
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
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Template Previews</h1>
                <p className="text-muted-foreground">See all {templates.length} templates in action</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {(selectedTags.length > 0 || searchTerm || selectedCategory !== 'all') && (
                <Badge variant="secondary" className="ml-2">
                  {selectedTags.length + (searchTerm ? 1 : 0) + (selectedCategory !== 'all' ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">

          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>

            {/* Search */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9"
                />
              </CardContent>
            </Card>

            {/* Category Filter */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="w-full justify-between h-8"
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Tag Filters */}
            <TagFilter
              tags={allTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              onClearAll={() => setSelectedTags([])}
              className="w-full"
            />

            {/* Clear All Filters */}
            {(selectedTags.length > 0 || searchTerm || selectedCategory !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>

          {/* Templates List - Compact */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Templates ({filteredTemplates.length})
              </h2>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2 pr-4">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selectedTemplate?.id === template.id
                      ? 'border-primary bg-primary/5'
                      : ''
                      }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-md flex items-center justify-center flex-shrink-0">
                          <Palette className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm truncate">{template.name}</h3>
                            {template.isPaid ? (
                              <Badge variant="secondary" className="text-xs px-1">
                                ${(template.priceCents! / 100).toFixed(0)}
                              </Badge>
                            ) : (
                              <Badge variant="default" className="text-xs px-1">
                                Free
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {template.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag.slug}
                                variant="outline"
                                className="text-xs px-1 py-0 h-5"
                                style={{
                                  borderColor: tag.color,
                                  color: tag.color
                                }}
                              >
                                {tag.icon} {tag.name}
                              </Badge>
                            ))}
                            {template.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                                +{template.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-8">
                    <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No templates found</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearFilters}
                      className="mt-2"
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2">
            {selectedTemplate ? (
              <div className="space-y-4">


                {/* Mobile Frame - iPhone 14 Pro dimensions */}
                <div className="bg-gray-900 rounded-[3rem] p-2 mx-auto w-fit shadow-2xl">
                  <div className="bg-white rounded-[2.5rem] w-[375px] h-[812px] overflow-hidden relative">
                    {/* Mobile Status Bar - Dynamic Island */}
                    <div className="h-12 bg-black flex items-center justify-center relative">
                      {/* Dynamic Island */}
                      <div className="w-32 h-6 bg-black rounded-full absolute top-3"></div>
                      {/* Status indicators */}
                      <div className="absolute top-3 left-6 text-white text-xs font-medium">9:41</div>
                      <div className="absolute top-3 right-6 flex items-center gap-1">
                        <div className="w-4 h-2 border border-white rounded-sm">
                          <div className="w-3 h-1 bg-white rounded-sm m-0.5"></div>
                        </div>
                      </div>
                    </div>

                    {/* Template Content */}
                    <div className="h-[768px] overflow-y-auto">
                      <DynamicTemplateRenderer
                        siteData={selectedTemplate.previewData || {
                          blocks: [
                            {
                              id: 'bio-1',
                              type: 'bio',
                              props: {
                                name: 'Preview User',
                                bio: 'This is a preview of the template',
                                avatar: '',
                                showAvatar: true
                              }
                            },
                            {
                              id: 'links-1',
                              type: 'linkList',
                              props: {
                                style: 'pill',
                                items: [
                                  { id: '1', title: 'Sample Link 1', url: '#', isActive: true },
                                  { id: '2', title: 'Sample Link 2', url: '#', isActive: true },
                                  { id: '3', title: 'Sample Link 3', url: '#', isActive: true }
                                ]
                              }
                            }
                          ],
                          meta: {
                            title: selectedTemplate.name,
                            description: selectedTemplate.description || 'Template preview',
                            theme: {}
                          }
                        }}
                        isPreview={true}
                      />
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <Palette className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a template to preview</h3>
                  <p className="text-muted-foreground">Choose from {templates.length} available templates</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}