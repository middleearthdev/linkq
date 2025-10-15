/**
 * Signup Page
 * Modern mobile-first design with tab switcher
 */

"use client"

import { useState } from "react"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { ModernLoginForm } from "@/components/auth/ModernLoginForm"
import { ModernSignupForm } from "@/components/auth/ModernSignupForm"

export default function SignupPage() {
  const [currentTab, setCurrentTab] = useState<'login' | 'register'>('register')

  return (
    <AuthLayout
      title="Go ahead and set up your account"
      subtitle="Sign in-up to enjoy the best managing experience"
      currentTab={currentTab}
      onTabChange={setCurrentTab}
    >
      {currentTab === 'login' ? <ModernLoginForm /> : <ModernSignupForm />}
    </AuthLayout>
  )
}