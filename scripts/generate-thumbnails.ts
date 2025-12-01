/**
 * Automated Thumbnail Generator
 * Generates screenshots for all templates using Playwright
 */

import { chromium, Browser, Page } from 'playwright'
import { PrismaClient } from '@/generated/prisma'
import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const prisma = new PrismaClient()

// Configuration
const CONFIG = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  outputDir: path.join(process.cwd(), 'public', 'thumbnails'),
  viewport: {
    width: 1200,
    height: 1600, // Tall for link-in-bio style
  },
  formats: {
    webp: { quality: 85 },
    jpg: { quality: 90 }, // Fallback
  },
  thumbnailSizes: {
    large: { width: 1200, height: 1600 },
    medium: { width: 800, height: 1067 },
    small: { width: 400, height: 533 },
  },
}

interface Template {
  id: string
  slug: string
  name: string
  primaryCategory: string | null
}

/**
 * Initialize output directory
 */
async function initOutputDir() {
  try {
    await fs.mkdir(CONFIG.outputDir, { recursive: true })
    console.log('✅ Output directory ready:', CONFIG.outputDir)
  } catch (error) {
    console.error('❌ Failed to create output directory:', error)
    throw error
  }
}

/**
 * Take screenshot of template
 */
async function captureTemplate(
  page: Page,
  template: Template
): Promise<Buffer | null> {
  try {
    const url = `${CONFIG.baseUrl}/preview/${template.slug}`
    console.log(`📸 Capturing: ${template.name} (${url})`)

    // Navigate to template preview
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

    // Wait for template to render
    await page.waitForTimeout(2000)

    // Hide scrollbar and any unnecessary UI elements
    await page.evaluate(() => {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'

      // Hide any "edit" buttons or admin UI
      const adminElements = document.querySelectorAll('[data-admin], .admin-only')
      adminElements.forEach((el) => (el as HTMLElement).style.display = 'none')
    })

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false, // Just viewport
    })

    console.log(`✅ Captured: ${template.name}`)
    return screenshot
  } catch (error) {
    console.error(`❌ Failed to capture ${template.name}:`, error)
    return null
  }
}

/**
 * Optimize and save image in multiple formats
 */
async function optimizeAndSave(
  imageBuffer: Buffer,
  slug: string
): Promise<{ webp: string; jpg: string; sizes: Record<string, string> }> {
  const basePath = path.join(CONFIG.outputDir, slug)

  const result: { webp: string; jpg: string; sizes: Record<string, string> } = {
    webp: '',
    jpg: '',
    sizes: {},
  }

  try {
    // Generate WebP (primary format)
    const webpPath = `${basePath}.webp`
    await sharp(imageBuffer)
      .resize(CONFIG.thumbnailSizes.large.width, CONFIG.thumbnailSizes.large.height, {
        fit: 'cover',
        position: 'top',
      })
      .webp(CONFIG.formats.webp)
      .toFile(webpPath)

    result.webp = `/thumbnails/${slug}.webp`
    console.log(`  ✅ WebP: ${result.webp}`)

    // Generate JPG (fallback)
    const jpgPath = `${basePath}.jpg`
    await sharp(imageBuffer)
      .resize(CONFIG.thumbnailSizes.large.width, CONFIG.thumbnailSizes.large.height, {
        fit: 'cover',
        position: 'top',
      })
      .jpeg(CONFIG.formats.jpg)
      .toFile(jpgPath)

    result.jpg = `/thumbnails/${slug}.jpg`
    console.log(`  ✅ JPG: ${result.jpg}`)

    // Generate responsive sizes
    for (const [sizeName, dimensions] of Object.entries(CONFIG.thumbnailSizes)) {
      if (sizeName === 'large') continue // Already generated above

      const sizePath = `${basePath}-${sizeName}.webp`
      await sharp(imageBuffer)
        .resize(dimensions.width, dimensions.height, {
          fit: 'cover',
          position: 'top',
        })
        .webp(CONFIG.formats.webp)
        .toFile(sizePath)

      result.sizes[sizeName] = `/thumbnails/${slug}-${sizeName}.webp`
      console.log(`  ✅ ${sizeName}: ${result.sizes[sizeName]}`)
    }

    return result
  } catch (error) {
    console.error(`❌ Failed to optimize ${slug}:`, error)
    throw error
  }
}

/**
 * Update database with thumbnail URL
 */
async function updateDatabase(templateId: string, thumbnailUrl: string) {
  try {
    await prisma.template.update({
      where: { id: templateId },
      data: { thumbnail: thumbnailUrl },
    })
    console.log(`  ✅ Database updated: ${thumbnailUrl}`)
  } catch (error) {
    console.error(`❌ Failed to update database for ${templateId}:`, error)
  }
}

/**
 * Generate thumbnails for all templates
 */
async function generateAllThumbnails() {
  let browser: Browser | null = null
  let successCount = 0
  let failCount = 0

  try {
    console.log('🚀 Starting thumbnail generation...\n')

    // Initialize
    await initOutputDir()

    // Get all published templates
    const templates = await prisma.template.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        slug: true,
        name: true,
        primaryCategory: true,
      },
      orderBy: { primaryCategory: 'asc' },
    })

    console.log(`📋 Found ${templates.length} templates to process\n`)

    // Launch browser
    console.log('🌐 Launching browser...')
    browser = await chromium.launch({
      headless: true,
    })

    const page = await browser.newPage({
      viewport: CONFIG.viewport,
    })

    // Process each template
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i]
      const progress = `[${i + 1}/${templates.length}]`

      console.log(`\n${progress} Processing: ${template.name}`)
      console.log(`  Category: ${template.primaryCategory || 'none'}`)

      // Capture screenshot
      const screenshot = await captureTemplate(page, template)

      if (!screenshot) {
        failCount++
        continue
      }

      // Optimize and save
      const result = await optimizeAndSave(screenshot, template.slug)

      // Update database with WebP URL (primary)
      await updateDatabase(template.id, result.webp)

      successCount++

      // Small delay between screenshots
      await page.waitForTimeout(500)
    }

    await browser.close()

    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('📊 SUMMARY')
    console.log('='.repeat(50))
    console.log(`✅ Success: ${successCount}/${templates.length}`)
    console.log(`❌ Failed: ${failCount}/${templates.length}`)
    console.log(`📁 Output: ${CONFIG.outputDir}`)
    console.log('='.repeat(50))

    if (successCount > 0) {
      console.log('\n🎉 Thumbnail generation complete!')
      console.log('\nNext steps:')
      console.log('1. Review thumbnails in /public/thumbnails/')
      console.log('2. Restart dev server to see thumbnails')
      console.log('3. Check template cards on /templates page')
    }

  } catch (error) {
    console.error('❌ Fatal error:', error)
    throw error
  } finally {
    if (browser) {
      await browser.close()
    }
    await prisma.$disconnect()
  }
}

/**
 * Generate thumbnail for single template
 */
async function generateSingleThumbnail(slug: string) {
  let browser: Browser | null = null

  try {
    console.log(`🚀 Generating thumbnail for: ${slug}\n`)

    // Initialize
    await initOutputDir()

    // Get template
    const template = await prisma.template.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        primaryCategory: true,
      },
    })

    if (!template) {
      throw new Error(`Template not found: ${slug}`)
    }

    // Launch browser
    console.log('🌐 Launching browser...')
    browser = await chromium.launch({
      headless: true,
    })

    const page = await browser.newPage({
      viewport: CONFIG.viewport,
    })

    // Capture
    console.log(`\n📸 Capturing: ${template.name}`)
    const screenshot = await captureTemplate(page, template)

    if (!screenshot) {
      throw new Error('Screenshot failed')
    }

    // Optimize and save
    const result = await optimizeAndSave(screenshot, template.slug)

    // Update database
    await updateDatabase(template.id, result.webp)

    await browser.close()

    console.log('\n✅ Done!')
    console.log(`📁 Saved to: ${CONFIG.outputDir}/${slug}.webp`)

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    if (browser) {
      await browser.close()
    }
    await prisma.$disconnect()
  }
}

// CLI
const args = process.argv.slice(2)

if (args.length === 0) {
  // Generate all thumbnails
  generateAllThumbnails().catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
} else if (args[0] === '--template' || args[0] === '-t') {
  // Generate single template
  const slug = args[1]
  if (!slug) {
    console.error('❌ Please provide template slug')
    console.error('Usage: npm run generate-thumbnails -- -t <template-slug>')
    process.exit(1)
  }
  generateSingleThumbnail(slug).catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
} else if (args[0] === '--help' || args[0] === '-h') {
  console.log('Thumbnail Generator')
  console.log('')
  console.log('Usage:')
  console.log('  npm run generate-thumbnails           # Generate all')
  console.log('  npm run generate-thumbnails -- -t slug # Generate one')
  console.log('  npm run generate-thumbnails -- -h      # Show help')
  console.log('')
  console.log('Environment:')
  console.log('  BASE_URL - Base URL for screenshots (default: http://localhost:3000)')
  process.exit(0)
} else {
  console.error('❌ Invalid arguments')
  console.error('Run with --help for usage')
  process.exit(1)
}
