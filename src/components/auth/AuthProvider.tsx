/**
 * Authentication Provider Component
 */

"use client"

import { authClient } from "@/lib/auth-client"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Better Auth doesn't require a provider - it handles session via cookies
  return <>{children}</>
}