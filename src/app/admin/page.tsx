/**
 * Admin Dashboard Page
 * Main admin interface for managing templates, users, and platform
 */

import { requireAdmin } from "@/lib/auth-utils"
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient"

export default async function AdminDashboardPage() {
  // Server-side admin check - secure dan performant
  const user = await requireAdmin()
  
  return <AdminDashboardClient user={user} />
}