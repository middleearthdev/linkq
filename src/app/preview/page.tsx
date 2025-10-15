/**
 * Template Preview Page
 * Quick way to see all templates in action
 */

"use client"

import { useState, useEffect } from "react"
import { DynamicTemplateRenderer } from "@/components/DynamicTemplateRenderer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette } from "lucide-react"

interface TemplatePreview {
  id: string
  slug: string
  name: string
  description: string
  category: string
  previewData: any
  canAccess: boolean
}

export default function TemplatePreviews() {
  const [templates, setTemplates] = useState<TemplatePreview[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<TemplatePreview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      const data = await response.json()
      setTemplates(data.templates)
      
      // Set first template as default
      if (data.templates.length > 0) {
        setSelectedTemplate(data.templates[0])
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setLoading(false)
    }
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Previews</h1>
          <p className="text-gray-600">See all available templates in action</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Template List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Templates</h2>
            {templates.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedTemplate?.id === template.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-gray-600 capitalize">{template.category}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      template.canAccess 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {template.canAccess ? 'Free' : 'Locked'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Preview Area */}
          <div className="lg:sticky lg:top-8">
            {selectedTemplate ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Preview: {selectedTemplate.name}
                  </h2>
                  <div className="text-sm text-gray-500">
                    Category: {selectedTemplate.category}
                  </div>
                </div>
                
                {/* Mobile Frame */}
                <div className="bg-gray-900 rounded-[2.5rem] p-2 mx-auto w-fit">
                  <div className="bg-white rounded-[2rem] w-[375px] h-[667px] overflow-hidden relative">
                    {/* Mobile Status Bar */}
                    <div className="h-6 bg-black flex items-center justify-center">
                      <div className="w-20 h-1 bg-white rounded-full"></div>
                    </div>
                    
                    {/* Template Content */}
                    <div className="h-[641px] overflow-y-auto">
                      <DynamicTemplateRenderer
                        siteData={selectedTemplate.previewData}
                        isPreview={true}
                        className="min-h-full"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => window.open(`/api/templates/${selectedTemplate.id}`, '_blank')}
                    variant="outline"
                    size="sm"
                  >
                    View API Data
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a template to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}