/**
 * Admin Templates Management Page
 * Manage all platform templates with split layout and preview
 */

"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DynamicTemplateRenderer } from "@/components/DynamicTemplateRenderer"
import { generateTemplatePreviewData } from "@/lib/template-registry"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  Layout,
  Archive,
  CheckCircle,
  XCircle,
  Palette,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

interface Template {
  id: string
  slug: string
  name: string
  description: string
  category: string
  creator: string
  status: string
  isPaid: boolean
  priceCents: number
  createdAt: string
  updatedAt: string
  _count: {
    versions: number
    purchases: number
    tags: number
  }
  activeVersion?: {
    id: string
    version: string
    manifestJson: any
    cssVarsJson: any
    isPaid: boolean
    priceCents: number
    requiredPlan: string
    publishedAt: string
  }
}

export default function AdminTemplatesPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    async function checkAdminAndFetch() {
      if (!isPending && !session) {
        router.push("/auth/login")
        return
      }

      if (session) {
        // Check admin status securely
        try {
          const response = await fetch('/api/user/me')
          if (response.ok) {
            const userData = await response.json()
            if (userData.user?.isAdmin) {
              setIsAdmin(true)
              fetchTemplates()
            } else {
              router.push("/dashboard")
            }
          } else {
            router.push("/dashboard")
          }
        } catch (error) {
          router.push("/dashboard")
        }
      }
    }

    checkAdminAndFetch()
  }, [session, isPending, router])

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/templates")
      const data = await response.json()

      if (data.success) {
        setTemplates(data.data.templates)
        // Set first template as selected for preview
        if (data.data.templates && data.data.templates.length > 0) {
          setSelectedTemplate(data.data.templates[0])
        }
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return

    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setTemplates(prev => prev.filter(t => t.id !== templateId))
      }
    } catch (error) {
      console.error("Failed to delete template:", error)
    }
  }

  const handleStatusChange = async (templateId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setTemplates(prev => prev.map(t =>
          t.id === templateId ? { ...t, status: newStatus } : t
        ))
      }
    } catch (error) {
      console.error("Failed to update template status:", error)
    }
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || template.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Pagination logic
  const totalItems = filteredTemplates.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex)

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterStatus])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Published</Badge>
      case "DRAFT":
        return <Badge variant="secondary">Draft</Badge>
      case "ARCHIVED":
        return <Badge variant="outline"><Archive className="h-3 w-3 mr-1" />Archived</Badge>
      default:
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Unknown</Badge>
    }
  }

  const getPriceBadge = (isPaid: boolean, priceCents: number) => {
    if (!isPaid) {
      return <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">Free</Badge>
    }
    return <Badge variant="default" className="text-[10px] px-1 py-0 h-4">${(priceCents / 100).toFixed(0)}</Badge>
  }

  if (isPending || loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
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
                onClick={() => router.push("/admin")}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                ← Back to Admin
              </Button>
              <h1 className="text-2xl font-bold text-white ml-4">Templates</h1>
            </div>

            <Button
              onClick={() => router.push("/admin/templates/new")}
              className="text-white"
              style={{ backgroundColor: '#66A38A' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5A8F7A'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#66A38A'}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter: {filterStatus === "all" ? "All" : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-600">
                <DropdownMenuLabel className="text-gray-300">Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterStatus("all")} className="text-white hover:bg-gray-700">
                  All Templates
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("PUBLISHED")} className="text-white hover:bg-gray-700">
                  Published
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("DRAFT")} className="text-white hover:bg-gray-700">
                  Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("ARCHIVED")} className="text-white hover:bg-gray-700">
                  Archived
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="text-sm text-gray-400">
            {totalPages > 1 ? (
              <>
                Page {currentPage} of {totalPages} • {filteredTemplates.length} of {templates.length} templates
              </>
            ) : (
              <>
                {filteredTemplates.length} of {templates.length} templates
              </>
            )}
          </div>
        </div>

        {/* Split Layout - Template List & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-[calc(120vh-80px)]">

          {/* Left Side - Template List */}
          <Card className="border-gray-700 lg:col-span-6" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
            <CardHeader>
              <CardTitle className="text-white">Template List</CardTitle>
              <CardDescription className="text-gray-400">
                Select a template to preview
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div className="h-[calc(120vh-200px)] overflow-y-auto">
                <div className="p-6 pt-0">
                  <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    <Table className="min-w-[1200px]">
                    <TableHeader>
                      <TableRow className="border-gray-700 hover:bg-[#1F2937]">
                        <TableHead className="text-gray-300 text-xs w-16 sticky left-0 bg-[#1A2332] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)]"></TableHead>
                        <TableHead className="text-gray-300 text-xs min-w-[250px] sticky left-16 bg-[#1A2332] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">Template</TableHead>
                        <TableHead className="text-gray-300 text-xs min-w-[100px]">Creator</TableHead>
                        <TableHead className="text-gray-300 text-xs min-w-[80px]">Category</TableHead>
                        <TableHead className="text-gray-300 text-xs min-w-[100px]">Status</TableHead>
                        <TableHead className="text-gray-300 text-xs min-w-[80px]">Price</TableHead>
                        <TableHead className="text-gray-300 text-xs min-w-[120px]">Stats</TableHead>
                        <TableHead className="text-gray-300 text-xs min-w-[100px]">Created</TableHead>
                        <TableHead className="text-gray-300 text-xs min-w-[100px]">Updated</TableHead>
                        <TableHead className="text-right text-gray-300 text-xs w-16 sticky right-0 bg-[#1A2332] z-10 shadow-[-2px_0_5px_rgba(0,0,0,0.1)]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTemplates.map((template) => (
                        <TableRow
                          key={template.id}
                          className={`border-gray-700 hover:bg-gray-800 cursor-pointer transition-colors ${selectedTemplate?.id === template.id ? 'bg-gray-700 border-l-4 border-l-green-500' : ''
                            }`}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <TableCell className={`w-16 sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)] ${selectedTemplate?.id === template.id ? 'bg-gray-700' : 'bg-[#1A2332]'} hover:bg-gray-800 transition-colors`}>
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-md flex items-center justify-center flex-shrink-0">
                              <Palette className="w-4 h-4 text-white" />
                            </div>
                          </TableCell>
                          <TableCell className={`min-w-[250px] sticky left-16 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)] ${selectedTemplate?.id === template.id ? 'bg-gray-700' : 'bg-[#1A2332]'} hover:bg-gray-800 transition-colors`}>
                            <div>
                              <div className="font-medium text-white text-sm">{template.name}</div>
                              <div className="text-xs text-gray-400 truncate max-w-[220px]">
                                {template.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-gray-300">
                              {template.creator || 'Admin'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-gray-300 border-gray-600 text-[10px] px-1 py-0 h-4">
                              {template.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(template.status)}
                          </TableCell>
                          <TableCell>
                            {getPriceBadge(template.isPaid, template.priceCents)}
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <div className="text-white">{template._count.purchases} purchases</div>
                              <div className="text-gray-400">{template._count.versions} versions</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-gray-400">
                              {new Date(template.createdAt).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: '2-digit'
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-gray-400">
                              {new Date(template.updatedAt).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: '2-digit'
                              })}
                            </div>
                          </TableCell>
                          <TableCell className={`text-right w-16 sticky right-0 z-10 shadow-[-2px_0_5px_rgba(0,0,0,0.1)] ${selectedTemplate?.id === template.id ? 'bg-gray-700' : 'bg-[#1A2332]'} hover:bg-gray-800 transition-colors`}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-6 w-6 p-0 text-gray-300 hover:text-white hover:bg-gray-700">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-600">
                                <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSelectedTemplate(template)} className="text-white hover:bg-gray-700">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/admin/templates/${template.id}`)} className="text-white hover:bg-gray-700">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white hover:bg-gray-700">
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {template.status === "PUBLISHED" ? (
                                  <DropdownMenuItem onClick={() => handleStatusChange(template.id, "ARCHIVED")} className="text-white hover:bg-gray-700">
                                    <Archive className="h-4 w-4 mr-2" />
                                    Archive
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleStatusChange(template.id, "PUBLISHED")} className="text-white hover:bg-gray-700">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Publish
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-red-400 hover:bg-red-900/20"
                                  onClick={() => handleDeleteTemplate(template.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>

                  {filteredTemplates.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No templates found</p>
                      {searchTerm && (
                        <Button variant="outline" className="mt-2 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white" onClick={() => setSearchTerm("")}>
                          Clear search
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
                      <div className="text-sm text-gray-400">
                        Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} templates
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white disabled:opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first page, last page, current page, and pages around current
                            const isVisible = page === 1 || page === totalPages || 
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                            
                            if (!isVisible) {
                              // Show ellipsis for gaps
                              if (page === currentPage - 2 || page === currentPage + 2) {
                                return (
                                  <span key={page} className="px-2 text-gray-500">
                                    ...
                                  </span>
                                )
                              }
                              return null
                            }
                            
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 p-0 ${
                                  currentPage === page 
                                    ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
                                    : "text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
                                }`}
                              >
                                {page}
                              </Button>
                            )
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white disabled:opacity-50"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Template Preview */}
          <Card className="border-gray-700 lg:col-span-4" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
            <CardHeader>
              <CardTitle className="text-white">Template Preview</CardTitle>
              <CardDescription className="text-gray-400">
                {selectedTemplate ? `Previewing: ${selectedTemplate.name}` : 'Select a template to preview'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-6">
              {selectedTemplate ? (
                <div className="w-full h-full flex items-center justify-center">
                  {/* Mobile Frame - iPhone 14 Pro dimensions */}
                  <div className="bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
                    <div className="bg-white rounded-[1.5rem] w-[360px] h-[800px] overflow-hidden relative">
                      {/* Mobile Status Bar - Dynamic Island */}
                      <div className="h-8 bg-black flex items-center justify-center relative">
                        {/* Dynamic Island */}
                        <div className="w-24 h-4 bg-black rounded-full absolute top-2"></div>
                        {/* Status indicators */}
                        <div className="absolute top-2 left-4 text-white text-xs font-medium">9:41</div>
                        <div className="absolute top-2 right-4 flex items-center gap-1">
                          <div className="w-3 h-1.5 border border-white rounded-sm">
                            <div className="w-2 h-0.5 bg-white rounded-sm m-0.5"></div>
                          </div>
                        </div>
                      </div>

                      {/* Template Content */}
                      <div className="h-[800px] overflow-y-auto">
                        <DynamicTemplateRenderer
                          siteData={selectedTemplate.activeVersion?.manifestJson ?
                            generateTemplatePreviewData(selectedTemplate.activeVersion.manifestJson) :
                            {
                              blocks: [
                                {
                                  id: 'bio-1',
                                  type: 'bio',
                                  props: {
                                    name: selectedTemplate.name,
                                    bio: selectedTemplate.description || 'Template preview',
                                    avatar: '',
                                    showAvatar: true
                                  }
                                },
                                {
                                  id: 'links-1',
                                  type: 'link-list',
                                  props: {
                                    style: 'pill',
                                    items: [
                                      { id: '1', title: 'Sample Link 1', url: '#' },
                                      { id: '2', title: 'Sample Link 2', url: '#' },
                                      { id: '3', title: 'Sample Link 3', url: '#' }
                                    ]
                                  }
                                }
                              ],
                              meta: {
                                title: selectedTemplate.name,
                                description: selectedTemplate.description || 'Template preview',
                                theme: selectedTemplate.activeVersion?.cssVarsJson || {}
                              }
                            }
                          }
                          isPreview={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Palette className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-white">Select a template to preview</h3>
                  <p className="text-gray-400">Choose from {templates.length} available templates</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}