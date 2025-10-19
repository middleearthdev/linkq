/**
 * Edit Template Page
 * Form for editing existing templates
 */

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, Code, Settings, Plus, X, History, Archive, CheckCircle, Palette } from "lucide-react"
import { getAllBlockTypes, validateBlockData } from "@/components/blocks/registry"
import { TemplateVisualBuilder } from "@/components/admin/TemplateVisualBuilder"

interface Template {
  id: string
  name: string
  slug: string
  description: string
  category: string
  creator: string
  status: string
  createdAt: string
  updatedAt: string
  _count: {
    versions: number
    purchases: number
  }
  activeVersion: {
    id: string
    version: string
    manifestJson: any
    cssVarsJson: any
    isPaid: boolean
    priceCents: number
    requiredPlan: string
    publishedAt: string | null
  } | null
  versions: Array<{
    id: string
    version: string
    isPaid: boolean
    priceCents: number
    requiredPlan: string
    isActive: boolean
    createdAt: string
    publishedAt: string | null
  }>
}

interface TemplateFormData {
  name: string
  slug: string
  description: string
  category: string
  creator: string
  status: string
  isPaid: boolean
  priceCents: number
  requiredPlan: string
  manifestJson: any
  cssVarsJson: any
}

export default function EditTemplatePage({ params }: { params: Promise<{ templateId: string }> }) {
  const router = useRouter()
  const [templateId, setTemplateId] = useState<string>('')
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'visual' | 'advanced' | 'versions'>('basic')
  
  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    slug: "",
    description: "",
    category: "free",
    creator: "",
    status: "DRAFT",
    isPaid: false,
    priceCents: 0,
    requiredPlan: "FREE",
    manifestJson: {},
    cssVarsJson: {}
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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
          const template = data.data
          setTemplate(template)
          
          // Populate form with template data
          setFormData({
            name: template.name,
            slug: template.slug,
            description: template.description,
            category: template.category,
            creator: template.creator,
            status: template.status,
            isPaid: template.activeVersion?.isPaid || false,
            priceCents: template.activeVersion?.priceCents || 0,
            requiredPlan: template.activeVersion?.requiredPlan || 'FREE',
            manifestJson: template.activeVersion?.manifestJson || {},
            cssVarsJson: template.activeVersion?.cssVarsJson || {}
          })
        } else {
          setErrors({ fetch: data.error?.message || 'Failed to load template' })
        }
      } catch (error) {
        setErrors({ fetch: 'Failed to load template' })
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [templateId])

  const handleInputChange = (field: keyof TemplateFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.slug.trim()) newErrors.slug = "Slug is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (formData.isPaid && formData.priceCents < 100) newErrors.priceCents = "Price must be at least $1.00"
    
    // Validate manifest JSON structure
    try {
      const manifest = formData.manifestJson
      const availableBlockTypes = getAllBlockTypes()
      
      if (manifest && manifest.blocks && Array.isArray(manifest.blocks)) {
        const manifestErrors: string[] = []
        
        manifest.blocks.forEach((block: any, index: number) => {
          if (!block.type) {
            manifestErrors.push(`Block ${index + 1}: Missing block type`)
          } else if (!availableBlockTypes.includes(block.type)) {
            manifestErrors.push(`Block ${index + 1}: Unknown block type "${block.type}". Available types: ${availableBlockTypes.join(', ')}`)
          } else {
            // Validate block configuration
            const blockValidation = validateBlockData(block.type, block.config || {})
            if (!blockValidation.isValid) {
              manifestErrors.push(`Block ${index + 1} (${block.type}): ${blockValidation.errors.join(', ')}`)
            }
          }
        })
        
        if (manifestErrors.length > 0) {
          newErrors.manifestJson = manifestErrors.join('; ')
        }
      }
    } catch (error) {
      newErrors.manifestJson = "Invalid JSON format"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      // Update basic template info
      const templateResponse = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          category: formData.category,
          creator: formData.creator,
          status: formData.status
        })
      })

      if (!templateResponse.ok) {
        const errorData = await templateResponse.json()
        throw new Error(errorData.error?.message || 'Failed to update template')
      }

      // Create new version if pricing/manifest changed
      const activeVersion = template?.activeVersion
      const versionChanged = 
        activeVersion?.isPaid !== formData.isPaid ||
        activeVersion?.priceCents !== formData.priceCents ||
        activeVersion?.requiredPlan !== formData.requiredPlan ||
        JSON.stringify(activeVersion?.manifestJson) !== JSON.stringify(formData.manifestJson) ||
        JSON.stringify(activeVersion?.cssVarsJson) !== JSON.stringify(formData.cssVarsJson)

      if (versionChanged && activeVersion) {
        const versionResponse = await fetch(`/api/admin/templates/${templateId}/versions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            manifestJson: formData.manifestJson,
            cssVarsJson: formData.cssVarsJson,
            isPaid: formData.isPaid,
            priceCents: formData.priceCents,
            requiredPlan: formData.requiredPlan
          })
        })

        if (!versionResponse.ok) {
          const errorData = await versionResponse.json()
          throw new Error(errorData.error?.message || 'Failed to create new version')
        }

        // Update local state with new version info
        const newVersionData = await versionResponse.json()
        console.log('New version created:', newVersionData.data.version)
      }

      router.push('/admin/templates')
    } catch (error) {
      setErrors({ submit: (error as Error).message })
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setFormData(prev => ({ ...prev, status: newStatus }))
        if (template) {
          setTemplate(prev => prev ? { ...prev, status: newStatus } : null)
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const addCssVariable = () => {
    const key = `--new-var-${Object.keys(formData.cssVarsJson).length + 1}`
    setFormData(prev => ({
      ...prev,
      cssVarsJson: { ...prev.cssVarsJson, [key]: "#000000" }
    }))
  }

  const removeCssVariable = (key: string) => {
    const newCssVars = { ...formData.cssVarsJson }
    delete newCssVars[key]
    setFormData(prev => ({ ...prev, cssVarsJson: newCssVars }))
  }

  const updateCssVariable = (oldKey: string, newKey: string, value: string) => {
    const newCssVars = { ...formData.cssVarsJson }
    if (oldKey !== newKey) {
      delete newCssVars[oldKey]
    }
    newCssVars[newKey] = value
    setFormData(prev => ({ ...prev, cssVarsJson: newCssVars }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F1419' }}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: '#66A38A' }} />
      </div>
    )
  }

  if (errors.fetch) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F1419' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Template Not Found</h1>
          <p className="text-gray-400 mb-6">{errors.fetch}</p>
          <Button onClick={() => router.push('/admin/templates')}>
            Back to Templates
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F1419' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#0F1419', borderBottom: '1px solid #212A33' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => router.push("/admin/templates")}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Templates
              </Button>
              <h1 className="text-2xl font-bold text-white ml-4">{template?.name}</h1>
              <Badge 
                variant="outline" 
                className={`ml-3 ${
                  template?.status === 'PUBLISHED' 
                    ? 'text-green-400 border-green-400' 
                    : template?.status === 'ARCHIVED'
                    ? 'text-gray-400 border-gray-400'
                    : 'text-yellow-400 border-yellow-400'
                }`}
              >
                {template?.status}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              {template?.status === 'DRAFT' && (
                <Button 
                  onClick={() => handleStatusChange('PUBLISHED')}
                  variant="outline"
                  className="text-green-400 border-green-400 hover:bg-green-900/20"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Publish
                </Button>
              )}
              {template?.status === 'PUBLISHED' && (
                <Button 
                  onClick={() => handleStatusChange('ARCHIVED')}
                  variant="outline"
                  className="text-gray-400 border-gray-400 hover:bg-gray-700"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              )}
              <Button 
                variant="outline"
                className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="text-white"
                style={{ backgroundColor: '#66A38A' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5A8F7A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#66A38A'}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Template Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">{template?._count.versions}</div>
              <div className="text-sm text-gray-400">Versions</div>
            </CardContent>
          </Card>
          <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">{template?._count.purchases}</div>
              <div className="text-sm text-gray-400">Purchases</div>
            </CardContent>
          </Card>
          <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">
                {template?.activeVersion?.isPaid ? `$${(template.activeVersion.priceCents / 100).toFixed(2)}` : 'Free'}
              </div>
              <div className="text-sm text-gray-400">Current Price</div>
            </CardContent>
          </Card>
          <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">
                {new Date(template?.createdAt || '').toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-400">Created</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6" style={{ backgroundColor: '#1A2332' }}>
          {[
            { id: 'basic', label: 'Basic Info', icon: Settings },
            { id: 'visual', label: 'Visual Builder', icon: Palette },
            { id: 'advanced', label: 'Advanced', icon: Code },
            { id: 'versions', label: 'Versions', icon: History }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === id 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {errors.submit && (
          <div className="mb-6 p-4 rounded-lg border border-red-600 bg-red-900/20">
            <p className="text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
              <CardHeader>
                <CardTitle className="text-white">Template Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Basic template details and metadata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Template Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="slug" className="text-gray-300">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
                  />
                  {errors.slug && <p className="text-red-400 text-sm mt-1">{errors.slug}</p>}
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
                    rows={3}
                  />
                  {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <Label htmlFor="category" className="text-gray-300">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="free" className="text-white hover:bg-gray-700">Free</SelectItem>
                      <SelectItem value="premium" className="text-white hover:bg-gray-700">Premium</SelectItem>
                      <SelectItem value="pro" className="text-white hover:bg-gray-700">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="creator" className="text-gray-300">Creator Name</Label>
                  <Input
                    id="creator"
                    value={formData.creator}
                    onChange={(e) => handleInputChange('creator', e.target.value)}
                    className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
              <CardHeader>
                <CardTitle className="text-white">Pricing & Access</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure template availability and pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Paid Template</Label>
                    <p className="text-sm text-gray-400">Require payment to access this template</p>
                  </div>
                  <Switch
                    checked={formData.isPaid}
                    onCheckedChange={(checked) => handleInputChange('isPaid', checked)}
                  />
                </div>

                {formData.isPaid && (
                  <div>
                    <Label htmlFor="price" className="text-gray-300">Price (USD)</Label>
                    <div className="mt-1 relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <Input
                        id="price"
                        type="number"
                        min="1"
                        step="0.01"
                        value={formData.priceCents / 100}
                        onChange={(e) => handleInputChange('priceCents', Math.round(parseFloat(e.target.value || '0') * 100))}
                        className="pl-8 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
                      />
                    </div>
                    {errors.priceCents && <p className="text-red-400 text-sm mt-1">{errors.priceCents}</p>}
                  </div>
                )}

                <div>
                  <Label htmlFor="requiredPlan" className="text-gray-300">Required Plan</Label>
                  <Select value={formData.requiredPlan} onValueChange={(value) => handleInputChange('requiredPlan', value)}>
                    <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="FREE" className="text-white hover:bg-gray-700">Free Plan</SelectItem>
                      <SelectItem value="STARTER" className="text-white hover:bg-gray-700">Starter Plan</SelectItem>
                      <SelectItem value="PRO" className="text-white hover:bg-gray-700">Pro Plan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Visual Builder Tab */}
        {activeTab === 'visual' && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-white text-lg font-semibold mb-2">Visual Template Builder</h3>
              <p className="text-gray-400 text-sm">Drag and drop blocks to modify your template layout</p>
            </div>
            <TemplateVisualBuilder
              manifestJson={formData.manifestJson}
              cssVarsJson={formData.cssVarsJson}
              onManifestChange={(manifest) => handleInputChange('manifestJson', manifest)}
              onCssVarsChange={(cssVars) => handleInputChange('cssVarsJson', cssVars)}
              templateName={formData.name}
              templateDescription={formData.description}
            />
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
              <CardHeader>
                <CardTitle className="text-white">Template Manifest</CardTitle>
                <CardDescription className="text-gray-400">
                  JSON configuration for template layout and blocks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={JSON.stringify(formData.manifestJson, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      handleInputChange('manifestJson', parsed)
                    } catch (error) {
                      // Keep typing, don't update if invalid JSON
                    }
                  }}
                  className={`font-mono text-sm bg-gray-800 text-white placeholder-gray-400 focus:border-gray-500 ${
                    errors.manifestJson ? 'border-red-500' : 'border-gray-600'
                  }`}
                  rows={20}
                />
                {errors.manifestJson && (
                  <div className="mt-2 p-3 rounded-lg border border-red-600 bg-red-900/20">
                    <p className="text-red-400 text-sm font-medium mb-1">Manifest Validation Errors:</p>
                    <div className="text-red-300 text-xs space-y-1">
                      {errors.manifestJson.split('; ').map((error, index) => (
                        <div key={index}>• {error}</div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  <div className="mb-2">Available block types:</div>
                  <div className="flex flex-wrap gap-1">
                    {getAllBlockTypes().map((blockType) => (
                      <Badge key={blockType} variant="outline" className="text-xs text-gray-400 border-gray-600">
                        {blockType}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  CSS Variables
                  <Button 
                    size="sm" 
                    onClick={addCssVariable}
                    className="text-white"
                    style={{ backgroundColor: '#66A38A' }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Custom CSS variables for template styling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(formData.cssVarsJson).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Input
                      value={key}
                      onChange={(e) => updateCssVariable(key, e.target.value, value as string)}
                      className="bg-gray-800 border-gray-600 text-white text-sm font-mono"
                    />
                    <Input
                      value={value as string}
                      onChange={(e) => updateCssVariable(key, key, e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white text-sm font-mono"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCssVariable(key)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Versions Tab */}
        {activeTab === 'versions' && (
          <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
            <CardHeader>
              <CardTitle className="text-white">Template Versions</CardTitle>
              <CardDescription className="text-gray-400">
                All versions of this template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {template?.versions.map((version) => (
                  <div key={version.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium text-white">Version {version.version}</div>
                        <div className="text-sm text-gray-400">
                          Created {new Date(version.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {version.isActive && (
                        <Badge style={{ backgroundColor: '#66A38A', color: 'white' }}>
                          Active
                        </Badge>
                      )}
                      {version.publishedAt && (
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          Published
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {version.isPaid ? (
                        <Badge style={{ backgroundColor: '#66A38A', color: 'white' }}>
                          ${(version.priceCents / 100).toFixed(2)}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                          Free
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-purple-400 border-purple-400">
                        {version.requiredPlan}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}