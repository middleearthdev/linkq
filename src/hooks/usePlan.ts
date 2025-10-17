/**
 * Plan Management Hook
 * Mobile-first plan utilities for dashboard
 */

"use client"

import { useSession } from "@/lib/auth-client"
import { getPlanLimits, getPlanFeatures } from "@/lib/utils"

export function usePlan() {
  const { data: session } = useSession()
  const userPlan = (session?.user as any)?.plan || 'FREE'
  
  const limits = getPlanLimits(userPlan as 'FREE' | 'STARTER' | 'PRO')
  const features = getPlanFeatures(userPlan as 'FREE' | 'STARTER' | 'PRO')
  
  const isPremium = userPlan !== 'FREE'
  const isPro = userPlan === 'PRO'
  const isStarter = userPlan === 'STARTER'
  const isFree = userPlan === 'FREE'
  
  // Feature checks
  const canUseAnalytics = limits.analytics
  const canRemoveBranding = limits.removeBranding
  const canUseCustomDomain = limits.customDomain
  const canUseCustomCSS = limits.customCSS
  
  // Usage checks
  const canCreateSite = (currentSites: number) => {
    return currentSites < limits.maxSites
  }
  
  const canAddLink = (currentLinks: number) => {
    return limits.maxLinks === -1 || currentLinks < limits.maxLinks
  }
  
  const getSiteUsage = (currentSites: number) => ({
    used: currentSites,
    max: limits.maxSites,
    percentage: limits.maxSites > 0 ? (currentSites / limits.maxSites) * 100 : 0,
    isAtLimit: currentSites >= limits.maxSites
  })
  
  const getLinkUsage = (currentLinks: number) => ({
    used: currentLinks,
    max: limits.maxLinks === -1 ? Infinity : limits.maxLinks,
    percentage: limits.maxLinks === -1 ? 0 : (currentLinks / limits.maxLinks) * 100,
    isAtLimit: limits.maxLinks !== -1 && currentLinks >= limits.maxLinks,
    isUnlimited: limits.maxLinks === -1
  })
  
  const getPlanColor = () => {
    switch (userPlan) {
      case 'PRO': return '#8B5CF6' // Purple
      case 'STARTER': return '#3B82F6' // Blue  
      default: return '#66A38A' // Sage green
    }
  }
  
  const getPlanIcon = () => {
    switch (userPlan) {
      case 'PRO': return '👑'
      case 'STARTER': return '⭐'
      default: return '🆓'
    }
  }
  
  return {
    // Plan info
    userPlan,
    limits,
    features,
    
    // Plan checks
    isPremium,
    isPro,
    isStarter,
    isFree,
    
    // Feature access
    canUseAnalytics,
    canRemoveBranding,
    canUseCustomDomain,
    canUseCustomCSS,
    
    // Usage functions
    canCreateSite,
    canAddLink,
    getSiteUsage,
    getLinkUsage,
    
    // UI helpers
    getPlanColor,
    getPlanIcon
  }
}