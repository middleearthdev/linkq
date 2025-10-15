/**
 * Admin Templates Management Page
 * Manage all platform templates
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
  XCircle
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
    sites: number
  }
}

export default function AdminTemplatesPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login")
      return
    }

    // Check if user is admin
    if (session && session.user.email !== "admin@linkq.app") {
      router.push("/dashboard")
      return
    }

    if (session) {
      fetchTemplates()
    }
  }, [session, isPending])

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/templates")
      const data = await response.json()
      
      if (data.success) {
        setTemplates(data.data.templates)
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
      return <Badge variant="secondary">Free</Badge>
    }
    return <Badge variant="default">${(priceCents / 100).toFixed(2)}</Badge>
  }

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.push("/admin")}>
                ← Back to Admin
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 ml-4">Templates</h1>
            </div>
            
            <Button onClick={() => router.push("/admin/templates/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter: {filterStatus === "all" ? "All" : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  All Templates
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("PUBLISHED")}>
                  Published
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("DRAFT")}>
                  Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("ARCHIVED")}>
                  Archived
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="text-sm text-gray-600">
            {filteredTemplates.length} of {templates.length} templates
          </div>
        </div>

        {/* Templates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Template Management</CardTitle>
            <CardDescription>
              Manage all platform templates, versions, and availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {template.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{template.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(template.status)}
                    </TableCell>
                    <TableCell>
                      {getPriceBadge(template.isPaid, template.priceCents)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{template._count.sites} sites</div>
                        <div className="text-gray-500">{template._count.versions} versions</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/templates/${template.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {template.status === "PUBLISHED" ? (
                            <DropdownMenuItem onClick={() => handleStatusChange(template.id, "ARCHIVED")}>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleStatusChange(template.id, "PUBLISHED")}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Publish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-red-600"
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

            {filteredTemplates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No templates found</p>
                {searchTerm && (
                  <Button variant="outline" className="mt-2" onClick={() => setSearchTerm("")}>
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}