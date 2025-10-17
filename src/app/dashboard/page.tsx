/**
 * Dashboard Page
 * Mobile-first dashboard for bio link management
 */

"use client"

import { useSession, signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LinkQLogo } from "@/components/ui/linkq-logo"
import {
  LogOut,
  Plus,
  Settings,
  BarChart3,
  Link,
  Palette,
  Globe,
  Crown,
  Eye,
  Edit3,
  Menu,
  Search
} from "lucide-react"
import { useState, useEffect } from "react"
import { QuickLoading } from "@/components/ui/cool-loading"

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [handle, setHandle] = useState('')
  // Use default template - no selection needed
  const defaultTemplate = 'minimal'
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [sites, setSites] = useState<any[]>([])
  const [loadingSites, setLoadingSites] = useState(true)
  const [sitesError, setSitesError] = useState('')

  // Fetch user sites
  useEffect(() => {
    const fetchSites = async () => {
      if (!session?.user) return

      try {
        setLoadingSites(true)
        setSitesError('')

        const response = await fetch('/api/dashboard/sites')
        const data = await response.json()

        if (data.success) {
          setSites(data.data.sites || [])
        } else {
          setSitesError(data.error?.message || 'Failed to load sites')
        }
      } catch (err) {
        setSitesError('Failed to load sites')
      } finally {
        setLoadingSites(false)
      }
    }

    fetchSites()
  }, [session])

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
          <p className="text-gray-400">Please sign in to access the dashboard.</p>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const handleCreateSite = () => {
    setShowCreateModal(true)
  }

  const navigateToSites = () => {
    window.location.href = '/sites'
  }

  const navigateToTemplates = () => {
    // TODO: Navigate to templates page
    console.log('Navigate to templates')
  }

  const navigateToAnalytics = () => {
    // TODO: Navigate to analytics page
    console.log('Navigate to analytics')
  }

  const handleCreateSiteSubmit = async () => {
    if (!handle.trim()) {
      setError('Please enter a handle')
      return
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(handle) || handle.length < 3 || handle.length > 30) {
      setError('Handle must be 3-30 characters and contain only letters, numbers, hyphens, and underscores')
      return
    }

    setCreating(true)
    setError('')

    try {
      const response = await fetch('/api/sites/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          handle: handle.trim(),
          templateSlug: defaultTemplate
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create site')
        return
      }

      // Success - redirect to editor
      window.location.href = data.site.editUrl

    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const resetCreateModal = () => {
    setShowCreateModal(false)
    setHandle('')
    // No template selection needed - using default
    setError('')
    setCreating(false)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F1419' }}>
      {/* Mobile Header */}
      <header className="lg:hidden" style={{ backgroundColor: '#0F1419' }}>
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <LinkQLogo size="sm" variant="minimal" showText={false} />
              <Badge className="text-xs px-2 py-1" style={{ backgroundColor: '#66A38A', color: '#FFFFFF' }}>
                {(session.user as any).plan || 'FREE'}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white p-2"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#212A33'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white p-2"
                style={{ backgroundColor: 'transparent' }}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#212A33'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile User Info */}
          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#212A33' }}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ backgroundColor: '#66A38A' }}>
                {session.user.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{session.user.name}</p>
                <p className="text-gray-400 text-xs">{session.user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block" style={{ backgroundColor: '#0F1419', borderBottom: '1px solid #212A33' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <LinkQLogo size="md" variant="default" />
              <div className="flex items-center space-x-1">
                <Button variant="ghost" className="text-gray-300 hover:text-white" size="sm">
                  Dashboard
                </Button>
                <Button variant="ghost" className="text-gray-400 hover:text-white" size="sm" onClick={navigateToSites}>
                  Sites
                </Button>
                <Button variant="ghost" className="text-gray-400 hover:text-white" size="sm">
                  Templates
                </Button>
                <Button variant="ghost" className="text-gray-400 hover:text-white" size="sm">
                  Analytics
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="text-xs px-3 py-1" style={{ backgroundColor: '#66A38A', color: '#FFFFFF' }}>
                {(session.user as any).plan || 'FREE'}
              </Badge>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ backgroundColor: '#66A38A' }}>
                  {session.user.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm text-gray-300">{session.user.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-300 border-gray-600 hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowMobileMenu(false)}
          />
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] shadow-xl"
            style={{ backgroundColor: '#1A2332' }}
          >
            {/* Mobile Menu Header */}
            <div className="px-4 py-4 border-b" style={{ borderColor: '#2A3441' }}>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Menu</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileMenu(false)}
                  className="text-white p-2"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#212A33'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Mobile Menu Content */}
            <div className="px-4 py-6 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-white bg-gray-800/50 h-11 rounded-xl"
                style={{ backgroundColor: '#2A3441' }}
              >
                <Link className="h-5 w-5 mr-3" style={{ color: '#66A38A' }} />
                Dashboard
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/30 h-11 rounded-xl"
                onClick={navigateToSites}
              >
                <Globe className="h-5 w-5 mr-3" />
                My Sites
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/30 h-11 rounded-xl"
              >
                <Palette className="h-5 w-5 mr-3" />
                Templates
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/30 h-11 rounded-xl"
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                Analytics
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/30 h-11 rounded-xl"
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Button>

              {/* Divider */}
              <div className="my-6 border-t" style={{ borderColor: '#2A3441' }} />

              {/* Upgrade Section */}
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#2A2416' }}>
                <div className="flex items-center mb-2">
                  <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-white font-medium">Upgrade Plan</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Unlock premium features and templates
                </p>
                <Button
                  size="sm"
                  className="w-full h-8 text-sm rounded-xl"
                  style={{
                    backgroundColor: '#66A38A',
                    borderColor: '#66A38A',
                    color: '#FFFFFF'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5A8F7A'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#66A38A'}
                >
                  Upgrade Now
                </Button>
              </div>

              {/* Sign Out */}
              <div className="pt-4">
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 h-11 rounded-xl"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 py-6 lg:max-w-7xl lg:mx-auto lg:px-6 lg:py-8">
        {/* Mobile Header */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-gray-400 text-sm lg:text-base">
            Manage your bio link pages and track performance
          </p>
        </div>

        {/* Quick Create Button - Mobile Priority */}
        <div className="mb-6 lg:hidden">
          <Button
            onClick={handleCreateSite}
            className="w-full h-12 font-medium text-base rounded-2xl shadow-sm"
            style={{
              backgroundColor: '#66A38A',
              borderColor: '#66A38A',
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5A8F7A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#66A38A'}
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Bio Link
          </Button>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <Card
            onClick={handleCreateSite}
            className="cursor-pointer hover:shadow-lg transition-all border-gray-700"
            style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}
          >
            <CardHeader className="pb-2 lg:pb-3">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <Plus className="h-6 w-6 lg:h-5 lg:w-5 mb-2 lg:mb-0" style={{ color: '#66A38A' }} />
                <CardTitle className="text-sm lg:text-lg text-white">Create Site</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs lg:text-sm text-gray-400">
                Start building your page
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            onClick={navigateToSites}
            className="cursor-pointer hover:shadow-lg transition-all border-gray-700"
            style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}
          >
            <CardHeader className="pb-2 lg:pb-3">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <Link className="h-6 w-6 lg:h-5 lg:w-5 mb-2 lg:mb-0" style={{ color: '#66A38A' }} />
                <CardTitle className="text-sm lg:text-lg text-white">My Sites</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs lg:text-sm text-gray-400">
                View & edit sites
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            onClick={navigateToTemplates}
            className="cursor-pointer hover:shadow-lg transition-all border-gray-700"
            style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}
          >
            <CardHeader className="pb-2 lg:pb-3">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <Palette className="h-6 w-6 lg:h-5 lg:w-5 mb-2 lg:mb-0" style={{ color: '#66A38A' }} />
                <CardTitle className="text-sm lg:text-lg text-white">Templates</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs lg:text-sm text-gray-400">
                Browse themes
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            onClick={navigateToAnalytics}
            className="cursor-pointer hover:shadow-lg transition-all border-gray-700"
            style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}
          >
            <CardHeader className="pb-2 lg:pb-3">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <BarChart3 className="h-6 w-6 lg:h-5 lg:w-5 mb-2 lg:mb-0" style={{ color: '#66A38A' }} />
                <CardTitle className="text-sm lg:text-lg text-white">Analytics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs lg:text-sm text-gray-400">
                Track performance
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
          {/* Recent Sites */}
          <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Link className="h-5 w-5 mr-2" style={{ color: '#66A38A' }} />
                Recent Sites
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your recently created or updated sites
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSites ? (
                <QuickLoading text="Loading sites..." />
              ) : sitesError ? (
                <div className="text-center py-6 lg:py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2A3441' }}>
                    <Globe className="h-8 w-8 text-red-400" />
                  </div>
                  <p className="text-red-400 mb-3">{sitesError}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    size="sm"
                    className="h-8 px-4 text-sm rounded-xl"
                    variant="outline"
                  >
                    Retry
                  </Button>
                </div>
              ) : sites.length === 0 ? (
                <div className="text-center py-6 lg:py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2A3441' }}>
                    <Globe className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 mb-3">No sites created yet</p>
                  <Button
                    onClick={handleCreateSite}
                    size="sm"
                    className="h-8 px-4 text-sm rounded-xl"
                    style={{
                      backgroundColor: '#66A38A',
                      borderColor: '#66A38A',
                      color: '#FFFFFF'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5A8F7A'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#66A38A'}
                  >
                    Create Your First Site
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sites.slice(0, 3).map((site) => (
                    <div
                      key={site.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/30 transition-colors cursor-pointer"
                      onClick={() => window.location.href = `/editor/${site.handle}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white text-sm font-medium truncate">{site.title}</h4>
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0.5"
                            style={{
                              backgroundColor: site.status === 'PUBLISHED' ? '#1F2937' : '#374151',
                              borderColor: site.status === 'PUBLISHED' ? '#10B981' : '#6B7280',
                              color: site.status === 'PUBLISHED' ? '#10B981' : '#9CA3AF'
                            }}
                          >
                            {site.status}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-xs truncate">@{site.handle}</p>
                        <p className="text-gray-500 text-xs">{site.views} views</p>
                      </div>
                      <div className="flex items-center gap-2">
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
                      </div>
                    </div>
                  ))}
                  {sites.length > 3 && (
                    <Button
                      variant="ghost"
                      className="w-full h-8 text-sm text-gray-400 hover:text-white"
                      onClick={() => console.log('Navigate to all sites')}
                    >
                      View all {sites.length} sites
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analytics Overview */}
          <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" style={{ color: '#66A38A' }} />
                Analytics Overview
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your site performance this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSites ? (
                <QuickLoading text="Loading analytics..." />
              ) : sites.length === 0 ? (
                <div className="text-center py-6 lg:py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2A3441' }}>
                    <BarChart3 className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 mb-1">No analytics data yet</p>
                  <p className="text-sm text-gray-500">Create a site to start tracking</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {sites.reduce((total, site) => total + site.views, 0)}
                      </div>
                      <div className="text-xs text-gray-400">Total Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {sites.filter(site => site.status === 'PUBLISHED').length}
                      </div>
                      <div className="text-xs text-gray-400">Published Sites</div>
                    </div>
                  </div>

                  {sites.length > 0 && (
                    <div className="pt-3 border-t" style={{ borderColor: '#2A3441' }}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Most viewed:</span>
                        <span className="text-white font-medium">
                          {sites.sort((a, b) => b.views - a.views)[0]?.title || 'N/A'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Premium Upgrade Banner - Mobile */}
        <div className="mt-6 lg:mt-8">
          <Card className="border-yellow-700" style={{ backgroundColor: '#2A2416', borderColor: '#3A3220' }}>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-start space-x-3">
                <Crown className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">Unlock Premium Features</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Get custom domains, advanced analytics, premium templates and more
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      className="h-8 px-4 text-sm rounded-xl flex-1 sm:flex-none"
                      style={{
                        backgroundColor: '#66A38A',
                        borderColor: '#66A38A',
                        color: '#FFFFFF'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5A8F7A'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#66A38A'}
                    >
                      Upgrade Now
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-4 text-sm rounded-xl text-gray-400 border-gray-600 hover:bg-gray-800 flex-1 sm:flex-none">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Create Site Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={resetCreateModal}
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

            {error && (
              <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }}>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Handle Input */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Choose Your Handle
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="yourname"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    disabled={creating}
                    className="w-full pl-16 pr-4 h-12 rounded-xl border text-gray-900 placeholder-gray-400"
                    style={{
                      backgroundColor: creating ? '#F3F4F6' : '#EFF2F5',
                      borderColor: error && error.toLowerCase().includes('handle') ? '#F87171' : '#DFE5EB'
                    }}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    linkq.id/
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  3-30 characters, letters, numbers, hyphens and underscores only
                </p>
              </div>

              {/* Info about default template */}
              <div className="text-center py-4">
                <p className="text-sm text-gray-600 mb-2">
                  Your new site will be created with our <strong>Minimal Template</strong>
                </p>
                <p className="text-xs text-gray-500">
                  You can customize and change templates later in the editor
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={resetCreateModal}
                disabled={creating}
                className="flex-1 h-12 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateSiteSubmit}
                disabled={creating || !handle.trim()}
                className="flex-1 h-12 rounded-xl font-medium"
                style={{
                  backgroundColor: creating || !handle.trim() ? '#9CA3AF' : '#66A38A',
                  borderColor: creating || !handle.trim() ? '#9CA3AF' : '#66A38A',
                  color: '#FFFFFF'
                }}
                onMouseEnter={(e) => {
                  if (!creating && handle.trim()) {
                    e.currentTarget.style.backgroundColor = '#5A8F7A'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!creating && handle.trim()) {
                    e.currentTarget.style.backgroundColor = '#66A38A'
                  }
                }}
              >
                {creating ? 'Creating...' : 'Create Site'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}