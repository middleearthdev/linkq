# 🎨 LinkQ Background System - Complete Guide

## Overview

The Background System provides a comprehensive, reusable way to manage backgrounds across LinkQ. It replaces the old hardcoded `--background` CSS variables with a centralized registry system.

## 📊 System Architecture

```
src/lib/backgrounds/
├── types.ts              # TypeScript type definitions
├── registry.ts           # Main registry & helper functions
└── presets/
    ├── gradients.ts      # 30+ gradient presets
    ├── patterns.ts       # 12+ pattern presets
    ├── solids.ts         # 8 solid color presets
    └── animated.ts       # 6 animated presets (Premium)

src/components/
├── backgrounds/
│   ├── BackgroundRenderer.tsx     # Renders backgrounds
│   └── ParticlesBackground.tsx    # Animated particles component
└── editor/
    └── BackgroundPicker.tsx       # UI for selecting backgrounds
```

---

## 🎯 Features

### 1. **5 Background Types**

| Type | Description | Count | Example |
|------|-------------|-------|---------|
| **Solid** | Single colors | 8 | Pure White, Pure Black, Sky Blue |
| **Gradient** | Linear gradients | 30+ | Ocean Breeze, Sunset Dream, Cyberpunk Night |
| **Pattern** | Repeating patterns | 12+ | Polka Dots, Grid Lines, Waves, Hexagons |
| **Image** | Custom images | ∞ | User uploads (coming soon) |
| **Animated** | Moving backgrounds | 6 | Gradient Flow, Particles, Aurora Lights |

### 2. **Tag-Based Organization**

Backgrounds are tagged for easy filtering:
- **Style**: light, dark, vibrant, minimal
- **Theme**: nature, tech, elegant, colorful
- **Mood**: calm, energetic, professional, playful

### 3. **Premium Tier**

- Free users: Access to 45+ backgrounds
- Premium users: Access to ALL backgrounds + animated backgrounds

---

## 🚀 Quick Start

### Using Background in Templates

```typescript
import { DynamicTemplateRenderer } from '@/components/DynamicTemplateRenderer'

const siteData = {
  blocks: [...],
  meta: {
    title: 'My Site',
    description: 'My awesome site',
    theme: { '--primary-color': '#3b82f6' },
    backgroundKey: 'gradient-ocean-breeze' // NEW!
  }
}

<DynamicTemplateRenderer siteData={siteData} />
```

### Using BackgroundPicker in Editor

```typescript
import { BackgroundPicker } from '@/components/editor/BackgroundPicker'

const [backgroundKey, setBackgroundKey] = useState('gradient-soft-clouds')

<BackgroundPicker
  value={backgroundKey}
  onChange={setBackgroundKey}
  isPremiumUser={user.plan !== 'FREE'}
/>
```

### Direct Background Rendering

```typescript
import { BackgroundRenderer } from '@/components/backgrounds/BackgroundRenderer'

<BackgroundRenderer backgroundKey="gradient-cyberpunk-night">
  <YourContent />
</BackgroundRenderer>
```

---

## 📚 API Reference

### Registry Functions

```typescript
import {
  getBackground,
  getBackgroundsByType,
  getBackgroundsByTag,
  getFreeBackgrounds,
  getPremiumBackgrounds,
  searchBackgrounds,
  getBackgroundCSS,
  getBackgroundStyles,
  migrateOldBackground,
} from '@/lib/backgrounds/registry'

// Get single background
const bg = getBackground('gradient-ocean-breeze')
console.log(bg.name) // "Ocean Breeze"

// Get all gradients
const gradients = getBackgroundsByType('gradient')

// Search backgrounds
const results = searchBackgrounds('ocean')

// Get CSS value
const css = getBackgroundCSS('gradient-sunset-dream')
// Returns: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)"

// Get full styles object
const styles = getBackgroundStyles('pattern-dots-light')
// Returns: { background: '...', backgroundSize: '20px 20px', backgroundColor: '#ffffff' }

// Migrate old CSS to registry key
const key = migrateOldBackground('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
// Returns: 'gradient-ocean-breeze'
```

---

## 🎨 Available Backgrounds

### Gradients (30+)

**Light & Soft (5)**
- `gradient-soft-clouds` - Soft Clouds
- `gradient-pearl-white` - Pearl White
- `gradient-pastel-sky` - Pastel Sky
- `gradient-mint-fresh` - Mint Fresh
- `gradient-lavender-dream` - Lavender Dream

**Vibrant & Colorful (8)**
- `gradient-ocean-breeze` - Ocean Breeze
- `gradient-sunset-dream` - Sunset Dream
- `gradient-tropical-paradise` - Tropical Paradise
- `gradient-aurora-borealis` - Aurora Borealis
- `gradient-peachy-keen` - Peachy Keen
- `gradient-neon-life` - Neon Life
- `gradient-aqua-splash` - Aqua Splash
- `gradient-cherry-blossom` - Cherry Blossom

**Dark & Bold (8)**
- `gradient-midnight-city` - Midnight City
- `gradient-dark-ocean` - Dark Ocean
- `gradient-cyberpunk-night` - Cyberpunk Night
- `gradient-electric-violet` - Electric Violet
- `gradient-carbon-fiber` - Carbon Fiber
- `gradient-space-void` - Space Void
- `gradient-noir` - Film Noir
- `gradient-deep-purple` - Deep Purple

**Nature & Earth (5)**
- `gradient-forest-mist` - Forest Mist
- `gradient-autumn-leaves` - Autumn Leaves
- `gradient-desert-sand` - Desert Sand
- `gradient-ocean-depth` - Ocean Depth
- `gradient-mountain-peak` - Mountain Peak

**Premium (4)** 👑
- `gradient-holographic` - Holographic
- `gradient-rainbow-wave` - Rainbow Wave
- `gradient-gold-luxury` - Gold Luxury
- `gradient-silver-chrome` - Silver Chrome

### Patterns (12+)

**Dots**
- `pattern-dots-light` - Polka Dots Light
- `pattern-dots-dark` - Polka Dots Dark
- `pattern-dots-colorful` - Colorful Dots

**Grid**
- `pattern-grid-light` - Grid Lines Light
- `pattern-grid-dark` - Grid Lines Dark
- `pattern-blueprint` - Blueprint Grid

**Diagonal**
- `pattern-stripes-light` - Diagonal Stripes
- `pattern-stripes-dark` - Diagonal Stripes Dark

**Geometric**
- `pattern-hexagons` - Hexagon Pattern
- `pattern-zigzag` - Zigzag Pattern
- `pattern-triangles` - Triangle Pattern
- `pattern-waves` - Wave Pattern

### Solid Colors (8)

- `solid-white` - Pure White
- `solid-black` - Pure Black
- `solid-gray-50` - Light Gray
- `solid-gray-900` - Dark Gray
- `solid-blue` - Sky Blue
- `solid-purple` - Royal Purple
- `solid-pink` - Hot Pink
- `solid-green` - Fresh Green

### Animated (6) 👑 Premium Only

- `animated-gradient-flow` - Gradient Flow
- `animated-aurora` - Aurora Lights
- `animated-particles` - Floating Particles
- `animated-waves` - Ocean Waves
- `animated-stars` - Starfield
- `animated-matrix` - Matrix Rain

---

## 🔄 Migration Guide

### From Old System to New System

**OLD (CSS Variables)**:
```typescript
defaults: {
  tokens: {
    '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
}
```

**NEW (Background Registry)**:
```typescript
defaults: {
  backgroundKey: 'gradient-ocean-breeze',
  tokens: {
    '--primary-color': '#667eea'
  }
}
```

### Automatic Migration

The system automatically migrates old backgrounds:

```typescript
// DynamicTemplateRenderer automatically detects and migrates
if (!backgroundKey && style['--background']) {
  backgroundKey = migrateOldBackground(style['--background'])
}
```

---

## 💾 Database Schema

```prisma
model UserSite {
  // ... existing fields

  // Background configuration
  backgroundType    String?  @default("gradient-soft-clouds")
  backgroundCustom  Json?    // For custom gradients
  backgroundImage   String?  // For uploaded images

  // ... rest of model
}
```

### Migration SQL

```sql
-- Add background fields to UserSite table
ALTER TABLE "user_sites"
  ADD COLUMN "backgroundType" TEXT DEFAULT 'gradient-soft-clouds',
  ADD COLUMN "backgroundCustom" JSONB,
  ADD COLUMN "backgroundImage" TEXT;
```

---

## 🎯 Best Practices

### 1. **Choose Appropriate Backgrounds**

- **Light content** → Dark backgrounds
- **Dark content** → Light backgrounds
- **Professional** → Minimal gradients or solids
- **Creative** → Vibrant gradients or patterns
- **Tech** → Grid patterns or dark themes

### 2. **Performance**

- Gradients and solids are fastest (pure CSS)
- Patterns use SVG data URIs (small file size)
- Images should be optimized (< 500KB)
- Animated backgrounds are lazy-loaded

### 3. **Accessibility**

- Ensure text contrast ratio ≥ 4.5:1
- Test with different backgrounds
- Provide text shadow or overlay if needed

### 4. **Adding New Backgrounds**

```typescript
// src/lib/backgrounds/presets/gradients.ts
export const GRADIENT_PRESETS: Record<string, GradientBackground> = {
  'gradient-my-custom': {
    type: 'gradient',
    name: 'My Custom Gradient',
    preview: 'linear-gradient(135deg, #ff0000, #00ff00)',
    value: 'linear-gradient(135deg, #ff0000 0%, #00ff00 100%)',
    colors: ['#ff0000', '#00ff00'],
    angle: 135,
    tags: ['custom', 'colorful'],
    isPremium: false, // or true for premium
  },
  // ... rest
}
```

---

## 🐛 Troubleshooting

### Background Not Showing

1. **Check backgroundKey is valid**:
   ```typescript
   const bg = getBackground(backgroundKey)
   console.log(bg) // Should not be undefined
   ```

2. **Check CSS specificity**:
   - Background might be overridden by other styles
   - Use browser DevTools to inspect

3. **Check for TypeScript errors**:
   ```bash
   npm run type-check
   ```

### Animated Background Not Working

1. **Check user has premium**:
   ```typescript
   if (bg?.isPremium && !isPremiumUser) {
     // Show upgrade prompt
   }
   ```

2. **Check component is client-side**:
   - Animated backgrounds require `"use client"`
   - Check for hydration errors

---

## 🚀 Future Enhancements

### Phase 3 (Coming Soon)

- [ ] **Custom Gradient Builder** - Visual gradient editor
- [ ] **Image Upload** - Upload custom background images
- [ ] **Background Marketplace** - Share and sell backgrounds
- [ ] **AI Background Generator** - Generate backgrounds with AI
- [ ] **More Animated Types** - Waves, Stars, Matrix, Fire, etc.
- [ ] **Video Backgrounds** - Support for video backgrounds
- [ ] **3D Backgrounds** - Three.js animated 3D backgrounds

---

## 📞 Support

**Issues?** Create an issue on GitHub with:
- Background key used
- Expected behavior
- Actual behavior
- Screenshots (if visual issue)

**Questions?** Check the [FAQ](#) or contact support.

---

## 📄 License

Part of LinkQ - All Rights Reserved
