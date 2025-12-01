/**
 * Category Landing Page
 * Dynamic route for industry-specific template categories
 * /templates/creator, /templates/umkm, etc.
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getCategoryById, type TemplateCategoryId } from '@/lib/template-categories'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CategoryBadge } from '@/components/CategoryNav'
import {
  Search,
  ArrowRight,
  Check,
  Sparkles,
  ChevronRight,
  Home,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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
  primaryCategory?: string
  subCategory?: string
  industryTags?: string[]
  targetAudience?: string[]
  includesFeatures?: string[]
  localizedName?: { en: string; id: string }
  localizedDesc?: { en: string; id: string }
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.category as TemplateCategoryId

  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [locale, setLocale] = useState<'en' | 'id'>('id')
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>()

  // Get category data
  const category = getCategoryById(categoryId)

  // Redirect if invalid category
  useEffect(() => {
    if (!category) {
      router.push('/templates')
    }
  }, [category, router])

  // Fetch templates
  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => {
        // Filter templates for this category
        const filtered = (data.templates || []).filter(
          (t: Template) => t.primaryCategory === categoryId
        )
        setTemplates(filtered)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to fetch templates:', error)
        setLoading(false)
      })
  }, [categoryId])

  // Filter templates by subcategory and search
  const filteredTemplates = useMemo(() => {
    let filtered = templates

    // Filter by subcategory
    if (selectedSubCategory) {
      filtered = filtered.filter((t) => t.subCategory === selectedSubCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((template) => {
        const name = template.localizedName?.[locale] || template.name
        const desc = template.localizedDesc?.[locale] || template.description
        return (
          name.toLowerCase().includes(query) ||
          desc.toLowerCase().includes(query) ||
          template.industryTags?.some((tag) => tag.toLowerCase().includes(query))
        )
      })
    }

    return filtered
  }, [templates, selectedSubCategory, searchQuery, locale])

  if (!category) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}05 100%)`
        }}
      >
        <div className="container mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/templates" className="hover:text-blue-600 transition-colors">
              {locale === 'id' ? 'Template' : 'Templates'}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium" style={{ color: category.color }}>
              {category.name[locale]}
            </span>
          </nav>

          {/* Hero Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-6xl">{category.icon}</span>
                <Badge
                  variant="outline"
                  className="text-sm font-medium"
                  style={{ borderColor: category.color, color: category.color }}
                >
                  {templates.length} {locale === 'id' ? 'Template' : 'Templates'}
                </Badge>
              </div>

              <h1
                className="text-5xl font-bold mb-4 bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${category.color}, ${category.color}aa)`
                }}
              >
                {category.name[locale]}
              </h1>

              <p className="text-xl text-gray-700 mb-6">{category.description[locale]}</p>

              {/* Language Toggle */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex gap-1 bg-white p-1 rounded-lg shadow-sm">
                  <button
                    onClick={() => setLocale('id')}
                    className={cn(
                      'px-4 py-2 rounded text-sm font-medium transition-all',
                      locale === 'id'
                        ? 'bg-gradient-to-r text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                    style={
                      locale === 'id'
                        ? { background: `linear-gradient(to right, ${category.color}, ${category.color}dd)` }
                        : {}
                    }
                  >
                    🇮🇩 ID
                  </button>
                  <button
                    onClick={() => setLocale('en')}
                    className={cn(
                      'px-4 py-2 rounded text-sm font-medium transition-all',
                      locale === 'en'
                        ? 'bg-gradient-to-r text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                    style={
                      locale === 'en'
                        ? { background: `linear-gradient(to right, ${category.color}, ${category.color}dd)` }
                        : {}
                    }
                  >
                    🇬🇧 EN
                  </button>
                </div>
              </div>

              {/* Stats */}
              {category.marketSize && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Users className="w-5 h-5" style={{ color: category.color }} />
                  <span className="font-medium">{category.marketSize}</span>
                </div>
              )}

              {/* CTA */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="text-white shadow-lg hover:shadow-xl transition-all"
                  style={{
                    background: `linear-gradient(to right, ${category.color}, ${category.color}dd)`
                  }}
                  onClick={() => {
                    document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  {locale === 'id' ? 'Lihat Template' : 'Browse Templates'}
                </Button>
                <Link href="/templates">
                  <Button variant="outline" size="lg">
                    {locale === 'id' ? 'Semua Kategori' : 'All Categories'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {category.features.slice(0, 4).map((feature, idx) => (
                <Card key={idx} className="border-2 hover:shadow-lg transition-all">
                  <CardHeader className="pb-3">
                    <div
                      className="w-10 h-10 rounded-lg mb-2 flex items-center justify-center text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      <Check className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-sm">{feature}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path
              fill="white"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12" id="templates-section">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={locale === 'id' ? 'Cari template...' : 'Search templates...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3"
              />
            </div>

            {/* Subcategory Filter */}
            {category.subCategories.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={!selectedSubCategory ? 'default' : 'outline'}
                  onClick={() => setSelectedSubCategory(undefined)}
                  style={
                    !selectedSubCategory
                      ? { background: `linear-gradient(to right, ${category.color}, ${category.color}dd)` }
                      : {}
                  }
                >
                  {locale === 'id' ? 'Semua' : 'All'}
                </Button>
                {category.subCategories.slice(0, 4).map((sub) => (
                  <Button
                    key={sub.id}
                    variant={selectedSubCategory === sub.id ? 'default' : 'outline'}
                    onClick={() => setSelectedSubCategory(sub.id)}
                    style={
                      selectedSubCategory === sub.id
                        ? { background: `linear-gradient(to right, ${category.color}, ${category.color}dd)` }
                        : {}
                    }
                  >
                    {sub.icon && <span className="mr-2">{sub.icon}</span>}
                    {sub.name[locale]}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredTemplates.length} {locale === 'id' ? 'Template Ditemukan' : 'Templates Found'}
          </h2>
          {selectedSubCategory && (
            <Button variant="ghost" onClick={() => setSelectedSubCategory(undefined)}>
              {locale === 'id' ? 'Reset Filter' : 'Clear Filter'}
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} locale={locale} categoryColor={category.color} />
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
                {locale === 'id' ? 'Coba kata kunci atau filter lain' : 'Try different keywords or filters'}
              </p>
            </div>
            <Button
              onClick={() => {
                setSearchQuery('')
                setSelectedSubCategory(undefined)
              }}
              variant="outline"
            >
              {locale === 'id' ? 'Reset Filter' : 'Reset Filters'}
            </Button>
          </Card>
        )}

        {/* Why Choose This Category */}
        {!loading && templates.length > 0 && (
          <div className="mt-16">
            <Card className="border-2" style={{ borderColor: `${category.color}33` }}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
                    style={{ backgroundColor: category.color }}
                  >
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl">
                    {locale === 'id'
                      ? `Kenapa Pilih ${category.name[locale]}?`
                      : `Why Choose ${category.name[locale]}?`}
                  </CardTitle>
                </div>
                <CardDescription>{category.sampleUseCase[locale]}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Target Audience */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" style={{ color: category.color }} />
                      {locale === 'id' ? 'Cocok Untuk' : 'Perfect For'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.targetAudience.map((audience, idx) => (
                        <Badge key={idx} variant="outline" style={{ borderColor: category.color, color: category.color }}>
                          {audience[locale]}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" style={{ color: category.color }} />
                      {locale === 'id' ? 'Fitur Utama' : 'Key Features'}
                    </h3>
                    <ul className="space-y-2">
                      {category.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-700">
                          <Check className="w-4 h-4" style={{ color: category.color }} />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

// Template Card Component
function TemplateCard({
  template,
  locale,
  categoryColor
}: {
  template: Template
  locale: 'en' | 'id'
  categoryColor: string
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
          <div
            className="flex items-center justify-center h-full text-6xl opacity-50"
            style={{ color: categoryColor }}
          >
            {template.primaryCategory && getCategoryById(template.primaryCategory as TemplateCategoryId)?.icon}
          </div>
        )}

        {/* Category Badge */}
        {template.primaryCategory && (
          <div className="absolute top-3 left-3">
            <CategoryBadge categoryId={template.primaryCategory as TemplateCategoryId} size="sm" locale={locale} />
          </div>
        )}

        {/* Price Badge */}
        {template.isPaid && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 border">
              {template.isOwned ? (
                <>
                  <Check className="w-3 h-3 mr-1" /> Owned
                </>
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
        <CardTitle className="line-clamp-1 group-hover:text-blue-600 transition-colors">{name}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">{description}</CardDescription>
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
          <Button
            className="w-full group-hover:shadow-lg transition-all text-white"
            style={{ background: `linear-gradient(to right, ${categoryColor}, ${categoryColor}dd)` }}
          >
            {locale === 'id' ? 'Lihat Detail' : 'View Details'}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
