/**
 * User Management Component for Admin Dashboard
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Search, 
  Filter,
  Eye,
  Edit,
  Crown,
  Mail,
  Calendar,
  Globe,
  ShoppingCart
} from "lucide-react"

interface User {
  id: string
  email: string
  name: string | null
  avatar: string | null
  plan: 'FREE' | 'STARTER' | 'PRO'
  planExpiry: string | null
  isAdmin: boolean
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  siteCount: number
  purchaseCount: number
  status: string
  lastActivity: string
}

interface UserManagementProps {
  className?: string
}

export function UserManagement({ className }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPlan, setFilterPlan] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [currentPage, filterPlan, searchTerm])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(filterPlan !== 'all' && { plan: filterPlan })
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()

      if (data.success) {
        setUsers(data.data.users)
        setTotalPages(data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserPlan = async (userId: string, newPlan: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan })
      })

      if (response.ok) {
        fetchUsers() // Refresh list
      }
    } catch (error) {
      console.error('Failed to update user plan:', error)
    }
  }

  const getPlanBadge = (plan: string) => {
    const styles = {
      FREE: 'bg-gray-500',
      STARTER: 'bg-blue-500', 
      PRO: 'bg-purple-500'
    }
    
    return (
      <Badge className={`${styles[plan as keyof typeof styles]} text-white`}>
        {plan}
      </Badge>
    )
  }

  const getStatusBadge = (status: string, emailVerified: boolean) => {
    if (!emailVerified) {
      return <Badge variant="outline" className="text-orange-600 border-orange-600">Pending</Badge>
    }
    return <Badge variant="default" className="bg-green-500">Active</Badge>
  }

  return (
    <div className={className}>
      <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Crown className="h-5 w-5" style={{ color: '#66A38A' }} />
            User Management
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage user accounts, plans, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by email or name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
              />
            </div>
            
            <Select value={filterPlan} onValueChange={(value) => {
              setFilterPlan(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-600 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-700">All Plans</SelectItem>
                <SelectItem value="FREE" className="text-white hover:bg-gray-700">Free</SelectItem>
                <SelectItem value="STARTER" className="text-white hover:bg-gray-700">Starter</SelectItem>
                <SelectItem value="PRO" className="text-white hover:bg-gray-700">Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#66A38A' }} />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800">
                    <TableHead className="text-gray-300">User</TableHead>
                    <TableHead className="text-gray-300">Plan</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Sites</TableHead>
                    <TableHead className="text-gray-300">Joined</TableHead>
                    <TableHead className="text-right text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-gray-700 hover:bg-gray-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: '#66A38A' }}>
                            {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{user.name || 'No name'}</span>
                              {user.isAdmin && (
                                <Badge variant="outline" className="text-red-400 border-red-400 text-xs">
                                  Admin
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.plan}
                          onValueChange={(value) => updateUserPlan(user.id, value)}
                        >
                          <SelectTrigger className="w-24 bg-gray-800 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="FREE" className="text-white hover:bg-gray-700">Free</SelectItem>
                            <SelectItem value="STARTER" className="text-white hover:bg-gray-700">Starter</SelectItem>
                            <SelectItem value="PRO" className="text-white hover:bg-gray-700">Pro</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status, user.emailVerified)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-white">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span>{user.siteCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                              className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 text-white">
                            <DialogHeader>
                              <DialogTitle className="text-white">User Details</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                View and manage user information
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedUser && (
                              <div className="space-y-6">
                                {/* User Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Name</label>
                                    <p className="mt-1 text-white">{selectedUser.name || 'No name set'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Email</label>
                                    <p className="mt-1 flex items-center gap-2 text-white">
                                      {selectedUser.email}
                                      {selectedUser.emailVerified ? (
                                        <Badge variant="outline" className="text-green-400 border-green-400">Verified</Badge>
                                      ) : (
                                        <Badge variant="outline" className="text-orange-400 border-orange-400">Unverified</Badge>
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Plan</label>
                                    <p className="mt-1">{getPlanBadge(selectedUser.plan)}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Sites Created</label>
                                    <p className="mt-1 flex items-center gap-1 text-white">
                                      <Globe className="h-4 w-4 text-gray-400" />
                                      {selectedUser.siteCount} sites
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Purchases</label>
                                    <p className="mt-1 flex items-center gap-1 text-white">
                                      <ShoppingCart className="h-4 w-4 text-gray-400" />
                                      {selectedUser.purchaseCount} purchases
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Last Activity</label>
                                    <p className="mt-1 flex items-center gap-1 text-white">
                                      <Calendar className="h-4 w-4 text-gray-400" />
                                      {new Date(selectedUser.lastActivity).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}