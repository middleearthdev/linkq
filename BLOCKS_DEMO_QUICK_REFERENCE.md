# 🎨 Unified Blocks Demo - Quick Reference Card

## 🚀 Quick Start

```bash
# Start dev server
bun run dev

# Access demo
http://localhost:3001/blocks-demo
```

---

## 📦 All 13 Blocks At a Glance

### **Basic Blocks (FREE)** - 5 blocks

| Block | Icon | Key Features | Plan |
|-------|------|--------------|------|
| **Bio** | 👤 | 6 avatar styles • 10 name typography • 5 bio styles | FREE |
| **Link List** | 🔗 | 3 link styles • Icons • Drag & drop | FREE |
| **Social Icons** | 📱 | 20+ platforms • 10 styles • Color modes | FREE |
| **Divider** | ➖ | 8 styles • Gradients • Icons • Animated | FREE |
| **Footer** | 🔚 | 4 layouts • Social links • Copyright | FREE |

### **Premium Blocks** - 3 blocks

| Block | Icon | Key Features | Plan |
|-------|------|--------------|------|
| **Gallery** | 🖼️ | 6 layouts • Filters • Lightbox • Masonry | PRO |
| **Analytics** | 📊 | Views/clicks/visitors • 3 styles • Time periods | PRO |
| **Product Catalog** | 🛍️ | 4 Instagram styles • Search • WhatsApp order | FREE |

### **Indonesia Blocks** - 5 blocks

| Block | Icon | Key Features | Plan |
|-------|------|--------------|------|
| **WhatsApp Business** | 💬 | FAB • Phone formatting • Pre-filled messages | FREE |
| **Food Delivery** | 🍽️ | GoFood • GrabFood • ShopeeFood • Ratings | FREE |
| **E-Commerce** | 🏪 | Tokopedia • Shopee • TikTok Shop • Badges | FREE |
| **Location & Map** | 📍 | Google Maps • Opening hours • Directions | FREE |
| **QRIS Payment** | 💳 | QR code • E-wallets • Preset amounts | STARTER |

---

## 🎛️ Controls Reference

### Device Types
```typescript
Mobile   (375px)  ← iPhone 8 size
Tablet   (672px)  ← iPad portrait (same as DynamicTemplateRenderer)
Desktop  (1280px) ← Full desktop view
```

### Navigation
```
Sidebar → Select any block (instant switch, no URL change)
Top Bar → Device type selector
Bottom Tabs → Usage • Props • Features
```

### Actions
```
📋 Copy Code   → Copy button in Usage tab
🔄 Switch Block → Click sidebar item
📱 Change Device → Click device type button
```

---

## 💻 Code Snippets

### Basic Usage
```typescript
<BioBlock
  props={{
    name: 'Your Name',
    bio: 'Your bio text',
    avatar: '/avatar.jpg',
    avatarStyle: 'circle',
    nameStyle: 'default'
  }}
/>
```

### With Device Adaptation
```typescript
<ProductCatalogBlock
  props={{
    items: products,
    columns: deviceType === 'mobile' ? 'small' : 'medium',
    forceViewport: deviceType === 'mobile' ? 'mobile' : 'tablet'
  }}
/>
```

### WhatsApp Integration
```typescript
<WhatsAppBusinessBlock
  props={{
    phoneNumber: '081234567890',  // Auto-converts to +628xxx
    message: 'Halo, saya tertarik...',
    fabPosition: 'bottom-right',
    enablePulse: true
  }}
/>
```

---

## 🎨 Design Tokens

### Colors
```css
/* Category Colors */
--basic-blue: #3B82F6
--premium-purple: #A855F7
--indonesia-green: #10B981

/* Device Frame */
--frame-border: #1F2937
--frame-notch: #111827
--frame-bg: linear-gradient(to-br, #F9FAFB, #F3F4F6)
```

### Spacing
```css
/* Device Widths */
--mobile: 375px
--tablet: 672px  /* Same as max-w-2xl */
--desktop: 1280px

/* Heights */
--mobile-height: 667px
--tablet-height: 800px
--desktop-height: 900px
```

---

## 📊 Feature Matrix

| Feature | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| **Bio Block** | ✅ | ✅ | ✅ |
| **Gallery Grid** | 2 cols | 3 cols | 4 cols |
| **Product Catalog** | 2 cols | 3 cols | 4 cols |
| **Analytics Charts** | Stacked | Grid | Grid |
| **Device Frame** | 375px | 672px | 1280px |

---

## 🔥 Hot Keys (Future)

```
Cmd/Ctrl + 1 → Switch to Mobile
Cmd/Ctrl + 2 → Switch to Tablet
Cmd/Ctrl + 3 → Switch to Desktop
Cmd/Ctrl + C → Copy code
Cmd/Ctrl + K → Quick search blocks
```

---

## 🐛 Quick Troubleshooting

### Problem: Block not rendering
```typescript
// Solution 1: Check imports
import { BlockName } from '@/components/blocks/BlockName'

// Solution 2: Verify props type
const props: BlockNameProps = { ... }

// Solution 3: Check console for errors
console.log('Block rendering:', blockId)
```

### Problem: Device frame broken
```bash
# Solution: Clear cache and rebuild
rm -rf .next
bun run dev
```

### Problem: Copy button not working
```typescript
// Solution: Check clipboard permissions
navigator.permissions.query({ name: 'clipboard-write' })
```

---

## 📈 Performance Tips

### Fast Block Switching
```typescript
// Already optimized with React state
// No re-mount, just prop changes
setActiveBlock('bio') // Instant!
```

### Lazy Loading (Future)
```typescript
// Implement code splitting
const BioBlock = lazy(() => import('@/components/blocks/BioBlock'))
```

### Image Optimization
```typescript
// Use Next.js Image
import Image from 'next/image'
<Image src={avatar} width={400} height={400} />
```

---

## 🎯 Use Cases

### For Development
```
✓ Test all blocks quickly
✓ Compare responsive behavior
✓ Copy implementation code
✓ Validate props
```

### For Design Review
```
✓ Show stakeholders all blocks
✓ A/B test different styles
✓ Export screenshots
✓ Validate UX flow
```

### For Documentation
```
✓ Generate code examples
✓ Create tutorials
✓ Build component library docs
✓ Training materials
```

---

## 📚 Related Files

```
Main Demo Page:
├── /src/app/blocks-demo/page.tsx

Documentation:
├── /BLOCKS_DEMO_GUIDE.md (Complete guide)
├── /UNIFIED_BLOCKS_DEMO_SUMMARY.md (Implementation summary)
└── /BLOCKS_DEMO_QUICK_REFERENCE.md (This file)

Components:
├── /src/components/blocks/*.tsx
├── /src/components/blocks/registry.tsx
└── /src/types/index.ts
```

---

## 🎓 Learning Path

### Beginner
1. Visit `/blocks-demo`
2. Click through all blocks
3. Test device preview
4. Copy basic code examples

### Intermediate
5. Understand block props
6. Modify example data
7. Test responsive behavior
8. Review component source

### Advanced
9. Create custom blocks
10. Add to registry
11. Implement new features
12. Contribute improvements

---

## 🔗 Quick Links

| Link | Description |
|------|-------------|
| `/blocks-demo` | Main demo page |
| `/bio-demo` | Original Bio demo (legacy) |
| `/product-catalog-demo` | Original Product Catalog demo |
| `/indonesia-blocks-demo` | Original Indonesia blocks demo |

---

## 📞 Support

**Questions?** Check:
1. `BLOCKS_DEMO_GUIDE.md` - Full documentation
2. `UNIFIED_BLOCKS_DEMO_SUMMARY.md` - Technical details
3. Component source code - Inline comments

**Issues?** Run:
```bash
# Type check
bunx tsc --noEmit

# Restart server
bun run dev

# Clear cache
rm -rf .next && bun run dev
```

---

## ✅ Checklist for First Use

- [ ] Visit `http://localhost:3001/blocks-demo`
- [ ] Test all 13 blocks
- [ ] Switch between mobile/tablet/desktop
- [ ] Copy at least one code example
- [ ] Check responsive behavior
- [ ] Read `BLOCKS_DEMO_GUIDE.md`
- [ ] Try modifying a block's props
- [ ] Test WhatsApp Business FAB

---

**Last Updated:** 2024-01-22
**Version:** 1.0.0
**Status:** ✅ Production Ready
