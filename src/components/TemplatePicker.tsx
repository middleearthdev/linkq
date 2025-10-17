/**
 * Template Picker Component
 * Mobile-first full page template selection
 */

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Search,
  Palette,
  Crown,
  Lock,
  Check,
  Eye,
  Star,
  ArrowLeft,
  X
} from "lucide-react"
import { DynamicTemplateRenderer } from "@/components/DynamicTemplateRenderer"
import { TemplateListResponse, TemplatePreview } from "@/types/template"

interface TemplatePickerProps {
  currentTemplateId?: string
  onTemplateSelect: (templateVersionId: string) => void // Changed to templateVersionId
  onClose: () => void
  isOpen: boolean
}

export default function TemplatePicker({
  currentTemplateId,
  onTemplateSelect,
  onClose,
  isOpen
}: TemplatePickerProps) {
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState<TemplatePreview[]>([])
  const [categories, setCategories] = useState<Array<{ id: string, name: string, count: number }>>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [previewTemplate, setPreviewTemplate] = useState<TemplatePreview | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Fetch templates when component opens
  useEffect(() => {
    if (isOpen && templates.length === 0) {
      fetchTemplates()
    }
  }, [isOpen])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/templates')
      const data: TemplateListResponse = await response.json()
      setTemplates(data.templates)
      setCategories([
        { id: 'all', name: 'All Templates', count: data.templates.length },
        ...data.categories
      ])
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" ||
      template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleTemplateSelect = async (template: TemplatePreview) => {
    if (!template.canAccess) {
      // Handle upgrade flow
      if (template.isPaid) {
        // Open purchase flow
        console.log('Opening purchase flow for:', template.id)
      } else {
        // Open upgrade flow
        console.log('Opening upgrade flow for plan:', template.requiredPlan)
      }
      return
    }

    try {
      await onTemplateSelect(template.versionId) // Use versionId instead of id
      onClose()
    } catch (error) {
      console.error('Failed to switch template:', error)
    }
  }

  const openPreview = (template: TemplatePreview) => {
    setPreviewTemplate(template)
    setShowPreview(true)
  }

  const TemplateCard = ({ template }: { template: TemplatePreview }) => (
    <Card
      className={`group cursor-pointer border-2 transition-all duration-200 active:scale-95 ${currentTemplateId === template.id
          ? 'border-[#66A38A] bg-[#66A38A]/5'
          : 'border-gray-700 bg-gray-800'
        }`}
      onClick={() => handleTemplateSelect(template)}
    >
      <CardContent className="p-3">
        {/* Template Thumbnail */}
        <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-900 mb-3 relative">
          <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <Palette className="w-10 h-10 text-gray-400" />
          </div>

          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {currentTemplateId === template.id && (
              <Badge className="bg-[#66A38A] text-white text-xs w-fit">
                <Check className="w-3 h-3 mr-1" />
                Active
              </Badge>
            )}
            {template.isPaid && (
              <Badge className="bg-amber-500 text-white text-xs w-fit">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
            {template.requiredPlan === 'PRO' && (
              <Badge className="bg-purple-500 text-white text-xs w-fit">
                <Star className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            )}
          </div>

          {/* Preview Button */}
          <div className="absolute top-2 right-2">
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white"
              onClick={(e) => {
                e.stopPropagation()
                openPreview(template)
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          {/* Lock Overlay for inaccessible templates */}
          {!template.canAccess && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center text-white">
                <Lock className="w-8 h-8 mx-auto mb-2" />
                <p className="text-xs font-medium">
                  {template.isPaid ? 'Purchase Required' : 'Upgrade Required'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Template Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-white text-base truncate pr-2">{template.name}</h3>
            {template.isPaid && template.priceCents && (
              <span className="text-sm text-[#66A38A] font-medium flex-shrink-0">
                ${(template.priceCents / 100).toFixed(0)}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-400 line-clamp-2 leading-tight">
            {template.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {template.features.slice(0, 1).map((feature, idx) => (
              <Badge key={idx} variant="outline" className="text-xs border-gray-600 text-gray-300">
                {feature}
              </Badge>
            ))}
            {template.features.length > 1 && (
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                +{template.features.length - 1} more
              </Badge>
            )}
          </div>

          {/* Action Button */}
          <Button
            size="sm"
            className={`w-full text-sm font-medium h-10 ${template.canAccess
                ? 'bg-[#66A38A] hover:bg-[#66A38A]/90 text-white'
                : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
              }`}
            onClick={(e) => {
              e.stopPropagation()
              handleTemplateSelect(template)
            }}
          >
            {currentTemplateId === template.id
              ? 'Current Template'
              : template.canAccess
                ? 'Select Template'
                : template.isPaid
                  ? `Buy $${(template.priceCents! / 100).toFixed(0)}`
                  : `Upgrade Plan`
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Don't render if not open
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-white">Choose Template</h1>
            <p className="text-sm text-gray-400">{filteredTemplates.length} templates available</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-white p-2"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="p-4 space-y-3 bg-gray-800/30">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-600 text-white h-12 text-base"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category.id
                  ? 'bg-[#66A38A] text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#66A38A] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400">Loading templates...</p>
              </div>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Palette className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No templates found</p>
              <p className="text-sm text-center max-w-xs">Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewTemplate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            {/* Preview Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">{previewTemplate.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Preview Content */}
            <div className="p-4 space-y-4">
              {/* Template Preview */}
              <div className="bg-white rounded-lg overflow-hidden aspect-[9/16] max-h-80">
                <DynamicTemplateRenderer
                  siteData={previewTemplate.previewData}
                  isPreview={true}
                  className="scale-50 origin-top-left w-[200%] h-[200%]"
                />
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {previewTemplate.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {previewTemplate.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              {previewTemplate.isPaid && (
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-white mb-1">Pricing</h4>
                  <div className="text-xl font-bold text-[#66A38A]">
                    ${(previewTemplate.priceCents! / 100).toFixed(0)}
                    <span className="text-sm font-normal text-gray-400 ml-2">one-time purchase</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 bg-[#66A38A] hover:bg-[#66A38A]/90 text-white h-12"
                  onClick={() => {
                    setShowPreview(false)
                    handleTemplateSelect(previewTemplate)
                  }}
                  disabled={!previewTemplate.canAccess}
                >
                  {previewTemplate.canAccess
                    ? 'Select Template'
                    : previewTemplate.isPaid
                      ? `Buy $${(previewTemplate.priceCents! / 100).toFixed(0)}`
                      : `Upgrade Plan`
                  }
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 h-12 px-4"
                  onClick={() => setShowPreview(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}