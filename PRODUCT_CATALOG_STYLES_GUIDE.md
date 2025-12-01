# Product Catalog Block - Style Comparison Guide

## 🎨 All 6 Styles Overview

### 1. Grid Card ⭐ (Default)
**Best for**: Standard food menus, general product catalogs

**Visual Characteristics**:
- Clean card layout with subtle shadows
- Prominent product images (square aspect ratio)
- Hover effect: elevated shadow and image zoom
- Clear price display with discount badges
- Stock indicators with color coding
- Rating stars below product name
- Full-width "Order" button at bottom

**Layout**:
```
┌─────────────────────┐
│                     │
│   [Product Image]   │ ← Hover zoom effect
│                     │
├─────────────────────┤
│ Product Name        │
│ ⭐⭐⭐⭐⭐ (128)      │
│                     │
│ Rp 25.000 [30.000] │ ← Price with discount
│ 📦 20 tersedia      │
│                     │
│ [Order WhatsApp]   │ ← Green button
└─────────────────────┘
```

**Code**:
```typescript
{ style: 'grid-card', columns: 2 }
```

---

### 2. Modern Minimal 🎯
**Best for**: Premium products, luxury items, clean aesthetics

**Visual Characteristics**:
- Minimalist design with lots of white space
- Subtle border instead of heavy shadows
- Delicate hover animations (scale + border color change)
- Centered text alignment
- Understated badges (outline style)
- Small, elegant typography
- Monochrome color scheme with accent colors

**Layout**:
```
┌─────────────────────┐
│                     │
│   [Product Image]   │ ← Subtle scale on hover
│                     │
├─────────────────────┤
│   Product Name      │ ← Centered
│   ⭐⭐⭐⭐⭐         │
│                     │
│    Rp 25.000       │
│   [Promo] [Hot]    │ ← Outline badges
│                     │
│   [Quick View]     │ ← Ghost button
└─────────────────────┘
```

**Code**:
```typescript
{ style: 'modern-minimal', columns: 3 }
```

---

### 3. List Horizontal 📋
**Best for**: Detailed catalogs, product comparisons, desktop views

**Visual Characteristics**:
- Horizontal card layout (image left, content right)
- More space for descriptions (2 lines visible)
- Full product details in one view
- Larger images (landscape aspect ratio)
- Stock and rating side-by-side
- Two CTAs: Quick View + Order
- Better for longer product names

**Layout**:
```
┌──────────────┬────────────────────────────────┐
│              │ Product Name                   │
│  [Product]   │ ⭐⭐⭐⭐⭐ (128) • 20 tersedia   │
│   [Image]    │                                │
│              │ Full description text here     │
│   Landscape  │ with multiple lines visible    │
│              │                                │
│              │ Rp 25.000  [Quick View] [Order]│
└──────────────┴────────────────────────────────┘
```

**Code**:
```typescript
{ style: 'list-horizontal', columns: 1 }
```

---

### 4. Compact Grid 📦
**Best for**: Large inventories, image galleries, many products

**Visual Characteristics**:
- Image-first design (minimal text)
- Smaller cards, more products visible
- Quick scan browsing experience
- Price overlay on image (bottom)
- Minimal information shown
- Clean, Instagram-feed style
- Fast loading, optimized for mobile

**Layout**:
```
┌──────────┐ ┌──────────┐ ┌──────────┐
│          │ │          │ │          │
│ [Image]  │ │ [Image]  │ │ [Image]  │
│          │ │          │ │          │
│  Rp 25K  │ │  Rp 20K  │ │  Rp 22K  │
└──────────┘ └──────────┘ └──────────┘
Product Name  Product Name  Product Name
⭐⭐⭐⭐⭐      ⭐⭐⭐⭐⭐      ⭐⭐⭐⭐⭐
```

**Code**:
```typescript
{ style: 'compact-grid', columns: 4 }
```

---

### 5. E-Commerce Pro 💎
**Best for**: Professional online stores, marketplace sellers

**Visual Characteristics**:
- Premium design with gradient accents
- Enhanced shadows and depth
- Multiple badges (Hot, Promo, New, etc.)
- Prominent discount percentage display
- Professional product card layout
- Stock urgency indicators ("Only 3 left!")
- Enhanced hover effects (lift + glow)
- WooCommerce/Shopify inspired

**Layout**:
```
┌─────────────────────┐
│ [-17%] [HOT]       │ ← Gradient badges
│                     │
│   [Product Image]   │ ← Enhanced shadow
│                     │
├─────────────────────┤
│ Product Name        │
│ ⭐⭐⭐⭐⭐ (128)      │
│                     │
│ Rp 25.000  30.000  │ ← Crossed original
│ 🔥 Only 3 left!    │ ← Urgency message
│                     │
│ [🛒 Order Now]     │ ← Gradient button
└─────────────────────┘
```

**Code**:
```typescript
{ style: 'ecommerce-pro', columns: 3 }
```

---

### 6. Instagram Shop 📱
**Best for**: Social media style shops, trendy brands, Gen Z audience

**Visual Characteristics**:
- Social media feed aesthetic
- Clean, modern, mobile-first
- Rounded corners everywhere
- Playful badges and emojis
- Heart/like button styling
- Instagram story-like design
- Bright, vibrant colors
- Engagement-focused UI

**Layout**:
```
┌─────────────────────┐
│  ╭─────────────╮    │ ← Rounded image
│  │             │    │
│  │  [Product]  │    │
│  │   [Image]   │    │
│  │             │    │
│  ╰─────────────╯    │
│                     │
│ Product Name  💝    │ ← Like button
│ Rp 25.000 ✨       │
│ ⭐⭐⭐⭐⭐           │
│                     │
│ 〔 Order Now 〕     │ ← Rounded button
└─────────────────────┘
```

**Code**:
```typescript
{ style: 'instagram-shop', columns: 2 }
```

---

## 📊 Quick Comparison Table

| Style | Best For | Columns | Info Density | Mobile | Desktop |
|-------|----------|---------|--------------|--------|---------|
| Grid Card | General use | 2-3 | Medium | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Modern Minimal | Premium | 3-4 | Low | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| List Horizontal | Detailed | 1-2 | High | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Compact Grid | Many products | 3-4 | Very Low | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| E-Commerce Pro | Online stores | 2-3 | High | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Instagram Shop | Social media | 2 | Medium | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🎯 Use Case Recommendations

### Food & Beverage
- **Restaurant Menu**: Grid Card (2 columns)
- **Bakery Products**: Modern Minimal (3 columns)
- **Street Food**: Instagram Shop (2 columns)
- **Catering Packages**: List Horizontal (1 column)
- **Cloud Kitchen**: E-Commerce Pro (2 columns)

### UMKM & Retail
- **Handicrafts**: Modern Minimal (3 columns)
- **Fashion/Thrift**: Compact Grid (4 columns)
- **Home Goods**: Grid Card (3 columns)
- **Marketplace Seller**: E-Commerce Pro (2 columns)
- **Dropshipper**: Instagram Shop (2 columns)

### Specialized
- **Premium Products**: Modern Minimal
- **High-Volume Inventory**: Compact Grid
- **Detailed Specifications**: List Horizontal
- **Social Media Integration**: Instagram Shop
- **Professional Store**: E-Commerce Pro

## 🎨 Customization Matrix

### Spacing Options
```typescript
spacing: 'none' | 'sm' | 'md' | 'lg'
```
- `none`: 0px gap (very compact)
- `sm`: 8px gap (tight)
- `md`: 16px gap (default, balanced)
- `lg`: 24px gap (spacious)

### Rounded Corners
```typescript
rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl'
```
- `none`: Sharp corners (modern, professional)
- `sm`: 4px (subtle)
- `md`: 8px (default, friendly)
- `lg`: 12px (playful)
- `xl`: 16px (very rounded, Instagram style)

### Column Breakpoints
```typescript
columns: 2 | 3 | 4
```

Responsive behavior:
- **2 columns**: Mobile 1, Tablet 2, Desktop 2
- **3 columns**: Mobile 1, Tablet 2, Desktop 3
- **4 columns**: Mobile 2, Tablet 3, Desktop 4

## 💡 Pro Tips for Each Style

### Grid Card
✅ Enable all features (search, categories, stock, ratings)
✅ Use for diverse product ranges
✅ Great default choice for most businesses

### Modern Minimal
✅ Disable excessive badges
✅ Use high-quality, professional photos
✅ Best with white/light backgrounds
✅ Keep product names short

### List Horizontal
✅ Write detailed descriptions
✅ Use landscape images (16:9)
✅ Perfect for desktop browsing
✅ 1-2 columns maximum

### Compact Grid
✅ Use square images (1:1)
✅ Keep names very short
✅ Best with 20+ products
✅ 3-4 columns recommended

### E-Commerce Pro
✅ Add all badges and promotions
✅ Use discount pricing aggressively
✅ Enable stock urgency messages
✅ Professional product photography

### Instagram Shop
✅ Vibrant, colorful images
✅ Use emojis in product names
✅ Enable all social features
✅ 2 columns for best effect

## 🚀 Migration Guide

Switching between styles is easy:

```typescript
// From Grid Card
{ style: 'grid-card', columns: 2 }

// To Modern Minimal
{ style: 'modern-minimal', columns: 3 }

// To E-Commerce Pro
{ style: 'ecommerce-pro', columns: 2 }
```

All product data remains the same - just change the `style` property!

## 📱 Mobile Optimization

All styles are mobile-responsive by default:

- **Automatic column collapse** on small screens
- **Touch-friendly** buttons and spacing
- **Optimized images** for faster loading
- **Swipeable categories** on mobile
- **Native WhatsApp** integration

## 🎬 Try It Live!

Visit the demo page to see all styles in action:
```
http://localhost:3000/product-catalog-demo
```

Switch between styles instantly and find your perfect match! 🎨
