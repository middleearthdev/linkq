# LinkQ - Dynamic Bio Link Platform

**LinkQ** adalah platform SaaS bio link yang simple dan user-friendly dengan sistem template dinamis, premium gating, dan fitur analytics lengkap. Dibangun dengan Next.js 15, TypeScript, Prisma, dan Xendit payment integration.

![LinkQ Platform](./docs/images/hero.png)

## ✨ Fitur Utama

### 🎨 **Template Dinamis**
- **Multiple Templates**: User bisa memilih dan mengganti template kapan saja tanpa data loss
- **Premium Gating**: Template dan fitur premium dikunci untuk user berbayar
- **Dynamic Rendering**: Template ter-apply tanpa rebuild atau forking code
- **Template Versioning**: Support multiple versions dan backward compatible

### 🧱 **Block-based Architecture**
- **Modular Design**: Halaman tersusun dari blok modular (Bio, Links, Social, CTA, dll)
- **Drag & Drop**: Visual editor dengan live preview
- **Premium Blocks**: Gallery, Analytics, dan CTA blocks untuk user premium

### 💰 **Premium Features**
- **Subscription Tiers**: FREE, STARTER ($9/bulan), PRO ($29/bulan)
- **Template Marketplace**: One-time purchase template premium
- **Analytics Dashboard**: Track views, clicks, dan engagement
- **Custom Domain**: Domain pribadi untuk branding professional

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + CSS Variables
- **Database**: PostgreSQL + Prisma ORM
- **UI Components**: shadcn/ui
- **Payment**: Xendit (untuk market Indonesia)
- **Type Safety**: TypeScript strict mode
- **Validation**: Zod schemas
- **Icons**: Lucide React

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LinkQ Platform Architecture              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Frontend  │    │   Backend   │    │  Database   │     │
│  │             │    │             │    │             │     │
│  │ - Next.js   │◄──►│ - API Routes│◄──►│ PostgreSQL  │     │
│  │ - React     │    │ - Prisma    │    │ + Prisma    │     │
│  │ - Tailwind  │    │ - TypeScript│    │             │     │
│  │ - shadcn/ui │    │ - Zod       │    │             │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Template    │    │   Block     │    │  Payment    │     │
│  │ System      │    │  Registry   │    │ Integration │     │
│  │             │    │             │    │             │     │
│  │ - Manifests │    │ - Bio       │    │ - Xendit    │     │
│  │ - CSS Vars  │    │ - LinkList  │    │ - Webhooks  │     │
│  │ - Versions  │    │ - Social    │    │ - Invoices  │     │
│  │ - Premium   │    │ - CTA/Gallery│   │             │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Bun (recommended) atau npm/yarn

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/linkq.git
cd linkq
```

### 2. Install Dependencies
```bash
bun install
# atau npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Isi file `.env`:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/linkq"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Xendit (Payment)
XENDIT_SECRET_KEY="your_xendit_secret_key"
XENDIT_WEBHOOK_TOKEN="your_webhook_token"

# Auth (optional)
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Setup Database
```bash
# Generate Prisma client
bunx prisma generate

# Run database migrations
bunx prisma migrate dev --name init

# Seed database (optional)
bunx prisma db seed
```

### 5. Run Development Server
```bash
bun dev
# atau npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📁 Project Structure

```
linkq/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── blocks/         # Template blocks (Bio, Links, etc)
│   │   ├── template/       # Template renderer
│   │   └── ui/             # shadcn/ui components
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript definitions
│   └── templates/          # Template manifests & CSS
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── public/                 # Static assets
└── docs/                  # Documentation
```

## 🎨 Templates

### 1. **Minimal** (Free)
- Simple vertical layout
- Basic bio + 5 links maximum
- Monochrome color scheme
- No animations

### 2. **Aurora** (Premium - $9)
- Glassmorphism design
- Gradient backgrounds
- Smooth animations
- Grid layout support
- Custom fonts

### 3. **Professional** (Pro Plan)
- Corporate/business style
- Analytics integration
- Newsletter signup
- Custom domain support
- Contact form

## 🧱 Block System

### Basic Blocks (Free)
- **BioBlock**: Avatar, name, bio text
- **LinkListBlock**: Daftar link utama (style: pill/underline/card)
- **SocialIconsBlock**: Social media links dengan icon

### Premium Blocks (Starter+)
- **CTABlock**: Call-to-action button (newsletter, contact)

### Pro Blocks (Pro Plan)
- **GalleryBlock**: Image/video gallery
- **AnalyticsBlock**: Click analytics dan metrics

## 💳 Pricing Tiers

| Feature | Free | Starter ($9/mo) | Pro ($29/mo) |
|---------|------|-----------------|--------------|
| Sites | 1 | 3 | 10 |
| Links per site | 5 | 20 | Unlimited |
| Templates | Basic | Premium | All |
| Analytics | ❌ | Basic | Advanced |
| Custom Domain | ❌ | ❌ | ✅ |
| Remove Branding | ❌ | ✅ | ✅ |
| Custom CSS | ❌ | ❌ | ✅ |

## 📊 Database Schema

### Core Models

```typescript
// User & Subscription
User {
  id, email, name, avatar
  plan: FREE | STARTER | PRO
  planExpiry, customerId
}

// Template System
Template {
  id, slug, name, description
  category, status, creator
}

TemplateVersion {
  id, templateId, version
  manifestJson, cssVarsJson
  isPaid, priceCents, requiredPlan
}

// User Sites
UserSite {
  id, userId, handle
  templateVersionId, dataJson
  customDomain, analytics, status
}

// Block Registry
BlockDefinition {
  id, type, name, schemaJson
  isPremium, requiredPlan
}
```

## 🚀 API Routes

```
/api/
├── templates/              # Template management
│   ├── GET /               # List templates
│   ├── GET /[id]          # Get template detail
│   └── POST /purchase     # Purchase template
├── sites/                  # Site management
│   ├── GET /[handle]      # Get public site
│   ├── PATCH /[id]        # Update site
│   └── POST /[id]/publish # Publish changes
├── blocks/                 # Block schemas
│   └── GET /schema/[type] # Get block schema
└── analytics/              # Analytics data
    └── GET /[siteId]      # Get site analytics
```

## 🎯 Usage Examples

### 1. Render Template
```tsx
import { TemplateRenderer } from '@/components/template/TemplateRenderer'

<TemplateRenderer
  manifest={template.manifest}
  cssVars={template.cssVars}
  siteData={userSiteData}
  entitlements={userEntitlements}
/>
```

### 2. Create New Block
```tsx
// 1. Define block component
export function MyCustomBlock({ props, isEditing, isLocked }) {
  // Your block implementation
}

// 2. Register block
export const MY_BLOCK_SCHEMA = {
  type: 'my-block',
  name: 'My Custom Block',
  schema: { /* JSON schema */ },
  isPremium: true,
}

// 3. Add to registry
BLOCK_COMPONENTS['my-block'] = MyCustomBlock
BLOCK_SCHEMAS['my-block'] = MY_BLOCK_SCHEMA
```

### 3. Create New Template
```typescript
export const MY_TEMPLATE = {
  manifest: {
    name: 'My Template',
    version: '1.0.0',
    layout: {
      header: [],
      body: ['bio', 'link-list'],
      footer: ['social-icons'],
    },
    allowedBlocks: ['bio', 'link-list', 'social-icons'],
    defaults: {
      tokens: { /* CSS variables */ },
      blockProps: { /* Default props */ },
    },
  },
  cssVars: { /* CSS custom properties */ },
}
```

## 🔒 Security Features

- ✅ Input validation dengan Zod schemas
- ✅ CSRF protection
- ✅ Rate limiting untuk API endpoints
- ✅ Content Security Policy
- ✅ XSS prevention (sanitize user input)
- ✅ SQL injection prevention (Prisma parameterization)
- ✅ Premium feature access control

## ⚡ Performance Optimizations

- ✅ Edge caching untuk public pages
- ✅ ISR (Incremental Static Regeneration)
- ✅ Image optimization (Next.js Image)
- ✅ CSS variables untuk instant theme switching
- ✅ Lazy loading untuk blocks
- ✅ Bundle splitting
- ✅ Database query optimization dengan Prisma

## 🧪 Testing

```bash
# Run tests
bun test

# Run type checking
bunx tsc --noEmit

# Run linting
bun lint

# Run build test
bun build
```

## 📝 Development

### Adding New Block Type

1. Create block component di `src/components/blocks/`
2. Define schema di registry
3. Add ke `BLOCK_COMPONENTS` dan `BLOCK_SCHEMAS`
4. Update TypeScript types

### Creating New Template

1. Create manifest di `src/templates/`
2. Define CSS variables
3. Add metadata untuk marketplace
4. Test dengan TemplateRenderer

### Database Changes

1. Update `prisma/schema.prisma`
2. Create migration: `bunx prisma migrate dev`
3. Update TypeScript types
4. Regenerate client: `bunx prisma generate`

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables di Vercel dashboard
```

### Docker
```bash
# Build image
docker build -t linkq .

# Run container
docker run -p 3000:3000 linkq
```

### Environment Variables untuk Production
```env
DATABASE_URL="your_production_database_url"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
XENDIT_SECRET_KEY="your_production_xendit_key"
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Submit Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Prisma](https://prisma.io/) - Database ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Xendit](https://xendit.co/) - Payment gateway Indonesia

## 📞 Support

- 📧 Email: support@linkq.app
- 💬 Discord: [Join our community](https://discord.gg/linkq)
- 📖 Documentation: [docs.linkq.app](https://docs.linkq.app)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/yourusername/linkq/issues)

---

**Made with ❤️ for Indonesian creators and entrepreneurs**
