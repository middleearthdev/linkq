/**
 * Background Migration Script
 * Replaces old --background CSS variables with new backgroundKey system
 */

const fs = require('fs')
const path = require('path')

const seedPath = path.join(__dirname, 'prisma', 'seed.ts')

// Mapping of old gradients to new keys
const backgroundMap = {
  "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)": "gradient-soft-clouds",
  "linear-gradient(135deg, #3A3A3A 0%, #2A2A2A 100%)": "gradient-carbon-fiber",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)": "gradient-ocean-breeze",
  "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)": "gradient-pearl-white",
  "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)": "gradient-aurora-borealis",
  "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)": "gradient-dark-ocean",
  "linear-gradient(135deg, #1a0028 0%, #4c0080 50%, #ff0080 100%)": "gradient-cyberpunk-night",
  "linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 50%, #34d399 100%)": "gradient-mint-fresh",
  "linear-gradient(135deg, #f0f9ff 0%, #7dd3fc 50%, #0ea5e9 100%)": "gradient-aqua-splash",
  "linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #f97316 100%)": "gradient-peachy-keen",
  "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f23 100%)": "gradient-space-void",
  "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)": "gradient-pearl-white",
  "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)": "gradient-lavender-dream",
  "linear-gradient(135deg, #0a0a0a 0%, #7c2d12 50%, #facc15 100%)": "gradient-electric-violet",
  "linear-gradient(135deg, #f0f9ff 0%, #bae6fd 50%, #06b6d4 100%)": "gradient-pastel-sky",
  "linear-gradient(135deg, #fef2f2 0%, #fecaca 50%, #dc2626 100%)": "gradient-cherry-blossom",
  "linear-gradient(135deg, #0c0a1e 0%, #1e1b4b 50%, #312e81 100%)": "gradient-midnight-city",
  "linear-gradient(135deg, #fef7ed 0%, #fed7aa 50%, #fdba74 100%)": "gradient-desert-sand",
  "linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #e5e7eb 100%)": "gradient-pearl-white",
  "linear-gradient(135deg, #ecfeff 0%, #67e8f9 50%, #22d3ee 100%)": "gradient-aqua-splash",
  "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)": "gradient-pastel-sky",
  "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)": "gradient-desert-sand",
  "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)": "gradient-cherry-blossom",
  "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)": "gradient-lavender-dream",
  "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)": "gradient-space-void",
}

console.log('🔄 Starting background migration...\n')

// Read seed file
let content = fs.readFileSync(seedPath, 'utf8')
let replacements = 0

// Track templates processed
const templatesProcessed = []

// Process each background mapping
for (const [oldBg, newKey] of Object.entries(backgroundMap)) {
  // Create regex to match the pattern
  const regex = new RegExp(
    `(defaults:\\s*{[^}]*?tokens:\\s*{[^}]*?)'--background':\\s*'${oldBg.replace(/[()[\]{}*+?^$|#.,\\]/g, '\\$&')}'`,
    'g'
  )

  // Replace with backgroundKey
  const newContent = content.replace(regex, (match, prefix) => {
    replacements++
    // Insert backgroundKey before tokens
    return match.replace(
      /(defaults:\s*{)(\s*)(tokens:)/,
      `$1$2backgroundKey: '${newKey}',$2$3`
    ).replace(/'--background':\s*'[^']*',?\s*/g, '')
  })

  if (newContent !== content) {
    console.log(`✓ Replaced: ${oldBg.substring(0, 50)}... → ${newKey}`)
    templatesProcessed.push(newKey)
    content = newContent
  }
}

// Handle special case: Mountain Escape (image background)
const imageRegex = /'--background':\s*'url\([^)]*\)[^']*'/g
if (content.match(imageRegex)) {
  console.log(`\n⚠️  Found image background in Mountain Escape template`)
  console.log(`   Manual intervention needed for image background migration`)
}

// Write back to file
fs.writeFileSync(seedPath, content, 'utf8')

console.log(`\n✅ Migration complete!`)
console.log(`   ${replacements} backgrounds migrated`)
console.log(`   ${templatesProcessed.length} templates processed`)
console.log(`\n📝 Templates migrated:`)
templatesProcessed.forEach((key, i) => {
  console.log(`   ${i + 1}. ${key}`)
})

console.log(`\n🚀 Next steps:`)
console.log(`   1. Review changes: git diff prisma/seed.ts`)
console.log(`   2. Test seed script: bun prisma db seed`)
console.log(`   3. Verify templates render correctly`)
