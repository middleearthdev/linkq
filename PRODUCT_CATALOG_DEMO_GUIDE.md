# Product Catalog Block Demo Guide

## 🎯 Quick Access

**Demo URL**: `http://localhost:3000/product-catalog-demo`

## 📋 What's Included

The demo page showcases the complete ProductCatalogBlock component with:

### ✨ 6 Beautiful Style Variations

1. **Grid Card** - Clean card layout with shadow and hover effects
2. **Modern Minimal** - Minimalist design with subtle animations
3. **List Horizontal** - Detailed horizontal cards with descriptions
4. **Compact Grid** - Image-focused compact layout
5. **E-Commerce Pro** - Professional e-commerce with gradient effects
6. **Instagram Shop** - Social media inspired design

### 🎮 Interactive Controls

- **Style Switcher** - Test all 6 styles instantly
- **Column Selector** - Switch between 2, 3, or 4 columns
- **Feature Toggles**:
  - Show/Hide Search
  - Show/Hide Categories
  - Show/Hide Stock Indicator
  - Show/Hide Ratings

### 📦 Sample Products

The demo includes 12 Indonesian food products:
- Main Course: Nasi Goreng, Mie Ayam, Soto Ayam, Rendang, Nasi Uduk
- Snacks: Sate Ayam, Pisang Goreng
- Beverages: Es Teh, Es Jeruk
- Desserts: Martabak Manis, Klepon
- Healthy: Gado-Gado

Each product includes:
- High-quality images
- Pricing with discounts
- Stock status (Available/Low/Out)
- Ratings & review counts
- Badges (Hot, Promo, Popular, New, Limited)
- Product variants (where applicable)

## 🚀 How to Use

### 1. Start Development Server

```bash
npm run dev
# or
bun dev
```

### 2. Open Demo Page

Navigate to: `http://localhost:3000/product-catalog-demo`

### 3. Explore Features

1. **Try Different Styles**
   - Click on any of the 6 style cards to switch layouts
   - Each style has unique visual characteristics

2. **Adjust Columns**
   - Click 2, 3, or 4 to change grid columns
   - See how products reflow in different layouts

3. **Toggle Features**
   - Turn search on/off to see the difference
   - Disable categories to simplify UI
   - Hide stock indicators for cleaner look

4. **Test Interactivity**
   - Search for products (e.g., "nasi", "es", "ayam")
   - Filter by category (Main Course, Beverages, Desserts, etc.)
   - Click "Pesan via WhatsApp" to see order integration
   - Click "Quick View" to see product details modal

## 📝 Implementation in Templates

After testing in the demo, you can add the block to your templates:

```typescript
// In your template manifest
{
  type: 'product-catalog',
  allowedBlocks: ['bio', 'product-catalog', 'whatsapp-business'],
  layout: {
    header: ['bio'],
    body: ['product-catalog'],
    footer: ['whatsapp-business']
  },
  defaults: {
    blockProps: {
      'product-catalog': {
        items: [
          {
            id: '1',
            name: 'Product Name',
            image: 'https://example.com/image.jpg',
            price: 25000,
            originalPrice: 30000,
            description: 'Product description',
            category: 'Main Course',
            stock: 'available',
            badges: ['Hot'],
            rating: 4.5,
            reviewCount: 100
          }
          // ... more products
        ],
        style: 'grid-card',
        columns: 2,
        showSearch: true,
        showCategories: true,
        whatsappNumber: '081234567890'
      }
    }
  }
}
```

## 🎨 Styling Tips

### Best Use Cases for Each Style:

1. **Grid Card** ⭐ Best for: Standard food menus, general products
2. **Modern Minimal** ⭐ Best for: Premium products, luxury items
3. **List Horizontal** ⭐ Best for: Detailed product listings, catalogs with descriptions
4. **Compact Grid** ⭐ Best for: Large product inventories, image galleries
5. **E-Commerce Pro** ⭐ Best for: Professional online stores, marketplace
6. **Instagram Shop** ⭐ Best for: Social media style shops, trendy brands

### Column Recommendations:

- **2 Columns**: Mobile-friendly, detailed product cards
- **3 Columns**: Balanced desktop view, standard catalogs
- **4 Columns**: Compact display, large inventories

## 🔧 Customization Options

All options available in the demo:

```typescript
{
  items: ProductItem[]           // Array of products
  style: string                  // 6 style options
  columns: 2 | 3 | 4            // Grid columns
  showSearch: boolean           // Show search bar
  showCategories: boolean       // Show category filter
  showStockIndicator: boolean   // Show stock status
  showRating: boolean           // Show star ratings
  whatsappNumber: string        // Business WhatsApp
  ctaText: string              // Order button text
  spacing: 'none' | 'sm' | 'md' | 'lg'
  rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}
```

## 💡 Pro Tips

1. **Use High-Quality Images** (600x600px recommended)
2. **Keep Product Names Short** (max 50 characters)
3. **Enable Search** for catalogs with 10+ products
4. **Use Categories** to organize diverse product ranges
5. **Add Badges** strategically (Hot, Promo, New, Limited)
6. **Set Stock Status** accurately to drive urgency
7. **Include Variants** for customizable products

## 📱 WhatsApp Integration

When users click "Pesan via WhatsApp", the message format is:

```
Halo, saya tertarik dengan:

*Nasi Goreng Spesial*
Harga: Rp 25.000

[Product description]
```

The message automatically includes:
- Product name
- Price
- Description
- Custom message (if set)

## 🐛 Troubleshooting

### Images Not Loading
- Check image URLs are accessible
- Use HTTPS URLs
- Recommended: Unsplash or CDN-hosted images

### WhatsApp Not Opening
- Ensure whatsappNumber includes country code (e.g., '6281234567890')
- Format: Remove spaces, dashes, and leading zeros

### Styles Not Switching
- Clear browser cache
- Ensure you're clicking the style card, not just hovering

## 📚 Next Steps

1. **Test all 6 styles** to find your favorite
2. **Prepare your product data** (images, prices, descriptions)
3. **Choose your preferred columns** (2, 3, or 4)
4. **Add to your template** using the implementation example
5. **Customize colors** to match your brand

## 🎉 Ready to Launch!

The ProductCatalogBlock is production-ready and perfect for:
- 🍜 Food & Beverage businesses
- 🛍️ UMKM & small shops
- 🎨 Handicraft sellers
- 📦 Dropshippers & resellers
- 🍰 Bakeries & catering
- 🌿 Healthy food sellers

Enjoy creating beautiful product catalogs! 🚀
