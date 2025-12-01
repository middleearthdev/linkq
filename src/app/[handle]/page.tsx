/**
 * Public Bio Link Page
 * Dynamic route for displaying user bio link pages
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DynamicTemplateRenderer } from '@/components/DynamicTemplateRenderer'
import { AnalyticsScript } from '@/components/analytics/AnalyticsScript'
import { db } from '@/lib/db'
import { getPlanLimits } from '@/lib/utils'

interface PageProps {
  params: Promise<{ handle: string }>
}

async function getSiteData(handle: string) {
  const site = await db.userSite.findUnique({
    where: {
      handle,
      status: 'PUBLISHED',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          plan: true,
          planExpiry: true,
        },
      },
      templateVersion: {
        include: {
          template: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  })

  if (!site) {
    return null
  }

  // Get user entitlements based on their plan
  const limits = getPlanLimits(site.user.plan as any)
  const userEntitlements = {
    plan: site.user.plan,
    features: [] as string[],
    templates: [] as string[],
    blocks: ['bio', 'link-list', 'social-icons'],
    limits,
  }

  // Add premium features based on plan
  if (site.user.plan === 'STARTER' || site.user.plan === 'PRO') {
    userEntitlements.blocks.push('cta')
    userEntitlements.features.push('premium-templates', 'basic-analytics', 'remove-branding')
  }

  if (site.user.plan === 'PRO') {
    userEntitlements.blocks.push('gallery', 'analytics')
    userEntitlements.features.push('advanced-analytics', 'custom-domain', 'custom-css')
  }

  return {
    handle: site.handle,
    title: site.title,
    description: site.description,
    favicon: site.favicon,
    customDomain: site.customDomain,
    template: {
      name: site.templateVersion.template.name,
      slug: site.templateVersion.template.slug,
      manifest: site.templateVersion.manifestJson,
      cssVars: site.templateVersion.cssVarsJson,
    },
    data: site.dataJson,
    entitlements: userEntitlements,
    branding: {
      showBranding: !site.removeBranding,
      customBranding: site.removeBranding ? null : {
        text: 'Created with LinkQ',
        url: 'https://linkq.id',
      },
    },
    customCss: site.customCss,
    publishedAt: site.publishedAt,
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params
  const siteData = await getSiteData(handle)

  if (!siteData) {
    return {
      title: 'Page Not Found - LinkQ',
      description: 'The page you are looking for does not exist.',
    }
  }

  // Extract bio data for metadata
  const dataBlocks = (siteData.data as any)?.blocks || []
  const bioBlock = dataBlocks.find((block: any) => block.type === 'bio')
  const userName = bioBlock?.props?.name || siteData.handle
  const userBio = bioBlock?.props?.bio || siteData.description
  const userAvatar = bioBlock?.props?.avatar

  const title = siteData.title || `${userName} - LinkQ`
  const description = userBio || `${userName}'s bio link page created with LinkQ`
  const siteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${siteData.handle}`

  // Get font information for preload
  const fontName = (siteData.data as any)?.meta?.font
  const fontUrl = fontName && fontName !== 'system'
    ? `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`
    : null

  return {
    title,
    description,
    keywords: [userName, 'bio link', 'links', 'profile', 'LinkQ'].join(', '),
    authors: [{ name: userName }],
    creator: userName,
    publisher: 'LinkQ',

    // Open Graph
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: 'LinkQ',
      type: 'profile',
      images: userAvatar ? [
        {
          url: userAvatar,
          width: 400,
          height: 400,
          alt: `${userName}'s profile picture`,
        }
      ] : [],
      locale: 'en_US',
    },

    // Twitter Card
    twitter: {
      card: 'summary',
      site: '@linkq',
      creator: `@${siteData.handle}`,
      title,
      description,
      images: userAvatar ? [userAvatar] : [],
    },

    // Additional SEO
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Icons
    icons: {
      icon: siteData.favicon || '/favicon.ico',
      apple: siteData.favicon || '/apple-touch-icon.png',
    },

    // Verification
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },

    // Canonical URL
    alternates: {
      canonical: siteUrl,
    },

    // Preload critical resources
    other: {
      // Preload Google Font
      ...(fontUrl && {
        'link-preload-font': `<link rel="preload" href="${fontUrl}" as="style" crossorigin="anonymous">`,
      }),
      // Preload avatar image
      ...(userAvatar && {
        'link-preload-avatar': `<link rel="preload" href="${userAvatar}" as="image" crossorigin="anonymous">`,
      }),
    },
  }
}

export default async function PublicBioLinkPage({ params }: PageProps) {
  const { handle } = await params
  const siteData = await getSiteData(handle)

  if (!siteData) {
    notFound()
  }

  // Get site ID for analytics tracking
  const site = await db.userSite.findUnique({
    where: { handle },
    select: { id: true },
  })

  // Extract bio data for structured data
  const dataBlocks = (siteData.data as any)?.blocks || []
  const bioBlock = dataBlocks.find((block: any) => block.type === 'bio')
  const userName = bioBlock?.props?.name || siteData.handle
  const userBio = bioBlock?.props?.bio || siteData.description
  const userAvatar = bioBlock?.props?.avatar

  // Get font information for preload
  const fontName = (siteData.data as any)?.meta?.font
  const fontUrl = fontName && fontName !== 'system'
    ? `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`
    : null

  return (
    <>
      {/* Analytics Tracking */}
      {site && <AnalyticsScript siteId={site.id} />}

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: userName,
            description: userBio,
            image: userAvatar,
            url: `${process.env.NEXT_PUBLIC_APP_URL}/${siteData.handle}`,
            sameAs: dataBlocks.find((block: any) => block.type === 'social-icons')?.props?.platforms?.map((p: any) => p.url) || [],
          }),
        }}
      />

      {/* Preload critical resources */}
      {fontUrl && (
        <link
          rel="preload"
          href={fontUrl}
          as="style"
          crossOrigin="anonymous"
        />
      )}
      {userAvatar && (
        <link
          rel="preload"
          href={userAvatar}
          as="image"
          crossOrigin="anonymous"
        />
      )}

      {/* Load Google Font early */}
      {fontUrl && (
        <link
          rel="stylesheet"
          href={fontUrl}
          crossOrigin="anonymous"
        />
      )}

      {/* Inline critical CSS for theme variables to prevent background delay */}
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            ${Object.entries((siteData.data as any)?.meta?.theme || {})
            .map(([key, value]) => `${key}: ${value};`)
            .join('\n            ')}
          }
          .template-container {
            background: var(--background, linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)) !important;
            color: var(--text-color, #333) !important;
          }
        `
      }} />

      {/* Custom CSS if provided */}
      {siteData.customCss && (
        <style dangerouslySetInnerHTML={{ __html: siteData.customCss }} />
      )}

      {/* Render the bio link page */}
      <DynamicTemplateRenderer
        siteData={siteData.data as any}
      />

      {/* Google Analytics */}
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                  page_title: '${siteData.title || siteData.handle}',
                  page_location: '${process.env.NEXT_PUBLIC_APP_URL}/${siteData.handle}',
                });
              `,
            }}
          />
        </>
      )}
    </>
  )
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 60 // Revalidate every 60 seconds

// Generate static params for popular handles (optional)
export async function generateStaticParams() {
  // During build time, database might not be available
  try {
    // Get the most popular handles for pre-generation
    const popularSites = await db.userSite.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 100, // Pre-generate top 100 sites
      select: { handle: true },
    })

    return popularSites.map((site: { handle: string }) => ({
      handle: site.handle,
    }))
  } catch (error) {
    console.warn('Database not available during build, skipping static generation')
    return []
  }
}