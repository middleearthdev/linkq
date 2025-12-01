/**
 * Template Marketplace with Category System
 * Browse templates by industry-specific categories
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { CategoryNav, CategoryBadge } from '@/components/CategoryNav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Star, ArrowRight, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { TemplateCategoryId } from '@/lib/template-categories'
import { getCategoryById } from '@/lib/template-categories'

interface Template {
  id: string
  slug: string
  name: string
  description: string
  category: string
  thumbnail?: string
  isPaid: boolean
  priceCents?: number
  canAccess: boolean
  isOwned: boolean
  // New category fields
  primaryCategory?: string
  subCategory?: string
  industryTags?: string[]
  targetAudience?: string[]
  includesFeatures?: string[]
  localizedName?: { en: string; id: string }
  localizedDesc?: { en: string; id: string }
}

export default function TemplatesMarketplacePage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategoryId | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [locale, setLocale] = useState<'en' | 'id'>('id')

  // Fetch templates from API
  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        setTemplates(data.templates || [])
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to fetch templates:', error)
        setLoading(false)
      })
  }, [])

  // Filter templates by category and search
  const filteredTemplates = useMemo(() => {
    let filtered = templates

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        template => template.primaryCategory === selectedCategory
      )
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(template => {
        const name = template.localizedName?.[locale] || template.name
        const desc = template.localizedDesc?.[locale] || template.description
        return (
          name.toLowerCase().includes(query) ||
          desc.toLowerCase().includes(query) ||
          template.industryTags?.some(tag => tag.toLowerCase().includes(query)) ||
          template.targetAudience?.some(aud => aud.toLowerCase().includes(query))
        )
      })
    }

    return filtered
  }, [templates, selectedCategory, searchQuery, locale])

  // Get category stats
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { all: templates.length }
    templates.forEach(template => {
      if (template.primaryCategory) {
        stats[template.primaryCategory] = (stats[template.primaryCategory] || 0) + 1
      }
    })
    return stats
  }, [templates])

  const selectedCategoryData = selectedCategory !== 'all'
    ? getCategoryById(selectedCategory)
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 backdrop-blur-lg bg-white/90">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {locale === 'id' ? 'Template Marketplace' : 'Template Marketplace'}
              </h1>
              <p className="text-gray-600 mt-1">
                {locale === 'id'
                  ? `${templates.length} template profesional untuk berbagai industri`
                  : `${templates.length} professional templates for every industry`
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setLocale('id')}
                  className={cn(
                    'px-3 py-1.5 rounded text-sm font-medium transition-all',
                    locale === 'id'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  🇮🇩 ID
                </button>
                <button
                  onClick={() => setLocale('en')}
                  className={cn(
                    'px-3 py-1.5 rounded text-sm font-medium transition-all',
                    locale === 'en'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  🇬🇧 EN
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={locale === 'id' ? 'Cari template...' : 'Search templates...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-full text-base border-gray-300 focus:border-blue-500"
            />
          </div>

          {/* Category Navigation */}
          <CategoryNav
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            locale={locale}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {locale === 'id'
                ? `${filteredTemplates.length} Template Ditemukan`
                : `${filteredTemplates.length} Templates Found`
              }
            </h2>
            {selectedCategory !== 'all' && selectedCategoryData && (
              <Badge variant="outline" className="text-sm">
                {selectedCategoryData.icon} {selectedCategoryData.name[locale]}
              </Badge>
            )}
          </div>

          {/* View Toggle (future: grid/list view) */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {categoryStats[selectedCategory] && (
              <span>
                {categoryStats[selectedCategory]} {locale === 'id' ? 'template' : 'templates'}
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-40 bg-gray-200 rounded-lg mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Template Grid */}
        {!loading && filteredTemplates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                locale={locale}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTemplates.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {locale === 'id' ? 'Tidak Ada Template' : 'No Templates Found'}
              </h3>
              <p className="text-gray-600">
                {locale === 'id'
                  ? 'Coba kata kunci atau kategori lain'
                  : 'Try different keywords or categories'
                }
              </p>
            </div>
            <Button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              variant="outline"
            >
              {locale === 'id' ? 'Reset Filter' : 'Reset Filters'}
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}

// Template Card Component
function TemplateCard({
  template,
  locale
}: {
  template: Template
  locale: 'en' | 'id'
}) {
  const name = template.localizedName?.[locale] || template.name
  const description = template.localizedDesc?.[locale] || template.description

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-blue-500">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
        {template.thumbnail ? (
          <img
            src={template.thumbnail}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-6xl">
            {template.primaryCategory && getCategoryById(template.primaryCategory as TemplateCategoryId)?.icon}
          </div>
        )}

        {/* Category Badge */}
        {template.primaryCategory && (
          <div className="absolute top-3 left-3">
            <CategoryBadge
              categoryId={template.primaryCategory as TemplateCategoryId}
              size="sm"
              locale={locale}
            />
          </div>
        )}

        {/* Price Badge */}
        {template.isPaid && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 border">
              {template.isOwned ? (
                <><Check className="w-3 h-3 mr-1" /> Owned</>
              ) : (
                <>Rp {(template.priceCents! / 100).toLocaleString('id-ID')}</>
              )}
            </Badge>
          </div>
        )}

        {template.category === 'premium' && !template.isPaid && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
              <Sparkles className="w-3 h-3 mr-1" /> Premium
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <CardHeader>
        <CardTitle className="line-clamp-1 group-hover:text-blue-600 transition-colors">
          {name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features */}
        {template.includesFeatures && template.includesFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {template.includesFeatures.slice(0, 3).map((feature, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {template.includesFeatures.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{template.includesFeatures.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* CTA */}
        <Link href={`/templates/${template.slug}`} className="block">
          <Button className="w-full group-hover:bg-blue-600 transition-colors">
            {locale === 'id' ? 'Lihat Detail' : 'View Details'}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
