/**
 * My Sites Page - Mobile First
 * Comprehensive site management interface
 */

"use client"

import { useSession, signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter,
  Globe,
  Eye,
  Edit3,
  MoreVertical,
  Copy,
  Trash2,
  Settings,
  BarChart3,
  ExternalLink,
  Clock,
  Users,
  Menu,
  SortAsc,
  SortDesc,
  Grid,
  List
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { QuickLoading, CoolLoading } from "@/components/ui/cool-loading"

interface Site {
  id: string
  title: string
  handle: string
  description: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  customDomain: string | null
  template: {
    name: string
    slug: string
  }
  views: number
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export default function MySitesPage() {
  const { data: session, isPending } = useSession()
  const [sites, setSites] = useState<Site[]>([])
  const [filteredSites, setFilteredSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('ALL')
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'views' | 'title'>('updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Fetch sites
  useEffect(() => {
    const fetchSites = async () => {
      if (!session?.user) return
      
      try {
        setLoading(true)
        setError('')
        
        const response = await fetch('/api/dashboard/sites')
        const data = await response.json()
        
        if (data.success) {
          setSites(data.data.sites || [])
        } else {
          setError(data.error?.message || 'Failed to load sites')
        }
      } catch (err) {
        setError('Failed to load sites')
      } finally {
        setLoading(false)
      }
    }
    
    fetchSites()
  }, [session])

  // Filter and sort sites
  useEffect(() => {
    let filtered = [...sites]
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(site => 
        site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(site => site.status === statusFilter)
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'views':
          aValue = a.views
          bValue = b.views
          break
        case 'created':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        default: // 'updated'
          aValue = new Date(a.updatedAt)
          bValue = new Date(b.updatedAt)
          break
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
    
    setFilteredSites(filtered)
  }, [sites, searchQuery, statusFilter, sortBy, sortOrder])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return { bg: '#1F2937', border: '#10B981', text: '#10B981' }
      case 'DRAFT':
        return { bg: '#374151', border: '#6B7280', text: '#9CA3AF' }
      case 'ARCHIVED':
        return { bg: '#451A03', border: '#D97706', text: '#F59E0B' }
      default:
        return { bg: '#374151', border: '#6B7280', text: '#9CA3AF' }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleCreateSite = () => {
    setShowCreateModal(true)
  }

  const handleSiteAction = (action: string, siteId: string) => {
    // TODO: Implement site actions (duplicate, delete, etc.)
    console.log(`${action} site:`, siteId)
  }

  const handlePublishSite = async (site: Site) => {
    try {
      const response = await fetch(`/api/sites/${site.handle}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: site.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
        })
      })

      if (response.ok) {
        // Update local state
        setSites(sites.map(s => 
          s.id === site.id 
            ? { ...s, status: s.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' as any }
            : s
        ))
      } else {
        console.error('Failed to update site status')
      }
    } catch (error) {
      console.error('Error updating site status:', error)
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F1419' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#66A38A' }} />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F1419' }}>
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">Please sign in to access your sites.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F1419' }}>
      {/* Mobile Header */}
      <header className="lg:hidden px-4 py-4" style={{ backgroundColor: '#0F1419' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-white">My Sites</h1>
              <p className="text-sm text-gray-400">{sites.length} sites</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white p-2"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Filter className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleCreateSite}
              size="sm"
              className="px-3 h-8 rounded-xl"
              style={{
                backgroundColor: '#66A38A',
                borderColor: '#66A38A',
                color: '#FFFFFF'
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search sites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-600 text-white h-10"
          />
        </div>

        {/* Mobile Filters */}
        {showMobileFilters && (
          <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: '#1A2332' }}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full h-8 px-2 rounded-lg bg-gray-700 border-gray-600 text-white text-sm"
                >
                  <option value="ALL">All Status</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Sort by</label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('-')
                    setSortBy(sort as any)
                    setSortOrder(order as any)
                  }}
                  className="w-full h-8 px-2 rounded-lg bg-gray-700 border-gray-600 text-white text-sm"
                >
                  <option value="updated-desc">Recently Updated</option>
                  <option value="created-desc">Recently Created</option>
                  <option value="views-desc">Most Views</option>
                  <option value="title-asc">Name A-Z</option>
                  <option value="title-desc">Name Z-A</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">View mode</span>
              <div className="flex rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-sage-green text-white' : 'bg-gray-700 text-gray-400'}`}
                  style={{ backgroundColor: viewMode === 'list' ? '#66A38A' : '#374151' }}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-sage-green text-white' : 'bg-gray-700 text-gray-400'}`}
                  style={{ backgroundColor: viewMode === 'grid' ? '#66A38A' : '#374151' }}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block px-6 py-4 border-b" style={{ backgroundColor: '#0F1419', borderColor: '#2A3441' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-6">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-white">My Sites</h1>
                <p className="text-sm text-gray-400">Manage all your bio link sites</p>
              </div>
            </div>
            
            <Button
              onClick={handleCreateSite}
              className="rounded-xl"
              style={{
                backgroundColor: '#66A38A',
                borderColor: '#66A38A',
                color: '#FFFFFF'
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Site
            </Button>
          </div>

          {/* Desktop Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search sites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-10 px-3 rounded-lg bg-gray-800 border-gray-600 text-white"
              >
                <option value="ALL">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-')
                  setSortBy(sort as any)
                  setSortOrder(order as any)
                }}
                className="h-10 px-3 rounded-lg bg-gray-800 border-gray-600 text-white"
              >
                <option value="updated-desc">Recently Updated</option>
                <option value="created-desc">Recently Created</option>
                <option value="views-desc">Most Views</option>
                <option value="title-asc">Name A-Z</option>
              </select>
              
              <div className="flex rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-sage-green text-white' : 'bg-gray-700 text-gray-400'}`}
                  style={{ backgroundColor: viewMode === 'list' ? '#66A38A' : '#374151' }}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-sage-green text-white' : 'bg-gray-700 text-gray-400'}`}
                  style={{ backgroundColor: viewMode === 'grid' ? '#66A38A' : '#374151' }}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 lg:max-w-7xl lg:mx-auto lg:px-6">
        {loading ? (
          <div className="py-12">
            <CoolLoading variant="skeleton" text="Loading your sites..." />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2A3441' }}>
              <Globe className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-red-400 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="text-gray-300 border-gray-600"
            >
              Try Again
            </Button>
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2A3441' }}>
              <Globe className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {sites.length === 0 ? 'No sites yet' : 'No sites found'}
            </h3>
            <p className="text-gray-400 mb-6">
              {sites.length === 0 
                ? 'Create your first bio link site to get started'
                : 'Try adjusting your search or filters'
              }
            </p>
            {sites.length === 0 && (
              <Button
                onClick={handleCreateSite}
                className="rounded-xl"
                style={{
                  backgroundColor: '#66A38A',
                  borderColor: '#66A38A',
                  color: '#FFFFFF'
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Site
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">
                {filteredSites.length} of {sites.length} sites
              </p>
              <div className="text-xs text-gray-500">
                Sorted by {sortBy} ({sortOrder === 'desc' ? 'newest first' : 'oldest first'})
              </div>
            </div>

            {/* Sites List/Grid */}
            {viewMode === 'list' ? (
              <div className="space-y-3">
                {filteredSites.map((site) => {
                  const statusColor = getStatusColor(site.status)
                  
                  return (
                    <Card 
                      key={site.id}
                      className="border-gray-700 hover:shadow-lg transition-all cursor-pointer"
                      style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}
                      onClick={() => window.location.href = `/editor/${site.handle}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-medium text-white truncate">{site.title}</h3>
                              <Badge 
                                variant="outline" 
                                className="text-xs px-2 py-1"
                                style={{
                                  backgroundColor: statusColor.bg,
                                  borderColor: statusColor.border,
                                  color: statusColor.text
                                }}
                              >
                                {site.status}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                              <span className="flex items-center gap-1">
                                <Globe className="h-4 w-4" />
                                @{site.handle}
                              </span>
                              <span className="flex items-center gap-1">
                                <BarChart3 className="h-4 w-4" />
                                {site.views} views
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Updated {formatDate(site.updatedAt)}
                              </span>
                            </div>
                            
                            {site.description && (
                              <p className="text-sm text-gray-500 truncate">{site.description}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            {/* Mobile: Show publish as primary action for DRAFT sites */}
                            <div className="flex lg:hidden">
                              {site.status === 'DRAFT' ? (
                                <Button
                                  size="sm"
                                  className="h-8 px-3 text-xs rounded-lg"
                                  style={{
                                    backgroundColor: '#10B981',
                                    borderColor: '#10B981',
                                    color: '#FFFFFF'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handlePublishSite(site)
                                  }}
                                >
                                  Publish
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-3 text-xs rounded-lg border-orange-500 text-orange-400 hover:bg-orange-500/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handlePublishSite(site)
                                  }}
                                >
                                  Unpublish
                                </Button>
                              )}
                            </div>
                            
                            {/* Desktop: Show all actions */}
                            <div className="hidden lg:flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.open(`/${site.handle}`, '_blank')
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.location.href = `/editor/${site.handle}`
                                }}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              {site.status === 'DRAFT' ? (
                                <Button
                                  size="sm"
                                  className="h-8 px-3 text-xs rounded-lg"
                                  style={{
                                    backgroundColor: '#10B981',
                                    borderColor: '#10B981',
                                    color: '#FFFFFF'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handlePublishSite(site)
                                  }}
                                >
                                  Publish
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-3 text-xs rounded-lg border-orange-500 text-orange-400 hover:bg-orange-500/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handlePublishSite(site)
                                  }}
                                >
                                  Unpublish
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // TODO: Show more actions menu
                                }}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSites.map((site) => {
                  const statusColor = getStatusColor(site.status)
                  
                  return (
                    <Card 
                      key={site.id}
                      className="border-gray-700 hover:shadow-lg transition-all cursor-pointer"
                      style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}
                      onClick={() => window.location.href = `/editor/${site.handle}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg text-white truncate mb-1">{site.title}</CardTitle>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant="outline" 
                                className="text-xs px-2 py-1"
                                style={{
                                  backgroundColor: statusColor.bg,
                                  borderColor: statusColor.border,
                                  color: statusColor.text
                                }}
                              >
                                {site.status}
                              </Badge>
                              <span className="text-xs text-gray-500">@{site.handle}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              // TODO: Show more actions menu
                            }}
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        {site.description && (
                          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{site.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            {site.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(site.updatedAt)}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          {/* Mobile: Prioritize publish action */}
                          <div className="flex gap-2 md:hidden w-full">
                            {site.status === 'DRAFT' ? (
                              <Button
                                size="sm"
                                className="flex-1 h-8 text-xs rounded-lg"
                                style={{
                                  backgroundColor: '#10B981',
                                  borderColor: '#10B981',
                                  color: '#FFFFFF'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePublishSite(site)
                                }}
                              >
                                Publish
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 h-8 text-xs rounded-lg border-orange-500 text-orange-400 hover:bg-orange-500/10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePublishSite(site)
                                }}
                              >
                                Unpublish
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 text-xs border-gray-600 text-gray-300"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.location.href = `/editor/${site.handle}`
                              }}
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                          
                          {/* Desktop: Show all actions */}
                          <div className="hidden md:flex gap-2 w-full">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 text-xs border-gray-600 text-gray-300"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(`/${site.handle}`, '_blank')
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 text-xs border-gray-600 text-gray-300"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.location.href = `/editor/${site.handle}`
                              }}
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            {site.status === 'DRAFT' ? (
                              <Button
                                size="sm"
                                className="flex-1 h-8 text-xs rounded-lg"
                                style={{
                                  backgroundColor: '#10B981',
                                  borderColor: '#10B981',
                                  color: '#FFFFFF'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePublishSite(site)
                                }}
                              >
                                Publish
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 h-8 text-xs rounded-lg border-orange-500 text-orange-400 hover:bg-orange-500/10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePublishSite(site)
                                }}
                              >
                                Unpublish
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Site Modal - Reuse from dashboard */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black opacity-50" 
            onClick={() => setShowCreateModal(false)}
          />
          <div 
            className="relative w-full max-w-md rounded-3xl p-6 shadow-xl"
            style={{ backgroundColor: '#F7F9FA' }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create New Site</h3>
              <p className="text-gray-600 text-sm">
                Start building your bio link page in minutes
              </p>
            </div>
            
            <div className="text-center py-8">
              <p className="text-gray-500">Creation form will be implemented here</p>
              <Button 
                onClick={() => setShowCreateModal(false)}
                className="mt-4"
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}