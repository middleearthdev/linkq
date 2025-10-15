# Prompt: Build Dynamic Template System untuk Bio Link Platform

## Context & Requirements

Saya ingin membangun platform bio link seperti Linktree dengan sistem template dinamis yang memiliki karakteristik dan mengutamakan tamplikan yang memudahkan customer awam (simple /user frienly first) dan lainnya sebaai berikut:

### Core Features

1. **Multiple Templates** - User bisa memilih dan mengganti template kapan saja
2. **Premium Gating** - Beberapa template/fitur dikunci untuk user berbayar
3. **Dynamic Rendering** - Template bisa ter-apply tanpa rebuild atau forking code
4. **Block-based Architecture** - Halaman tersusun dari blok modular (Bio, Links, Social, CTA, dll)
5. **Template Versioning** - Support multiple versions, backward compatible

### Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + CSS Variables
- **Database**: PostgreSQL + Prisma ORM
- **UI Components**: shadcn/ui
- **Payment**: xendit (untuk unlock premium features)
- **Type Safety**: TypeScript strict mode

---

## Architecture Requirements

### 1. Data Structure (Prisma Schema)

Buatkan schema lengkap untuk:

**Template Management:**

- `Template` - Master template (id, slug, name, status)
- `TemplateVersion` - Versioned releases (manifestJson, cssVarsJson, isPaid, priceCents)
- `BlockDefinition` - Registry blok yang tersedia (type, schemaJson)

**User Sites:**

- `User` - User account dengan subscription tier
- `UserSite` - Halaman bio user (handle, templateVersionId, dataJson, premiumEntitlements)
- `UserTemplatePurchase` - One-time template purchases (optional)

**Relationships yang dibutuhkan:**

- Template 1:N TemplateVersion
- UserSite N:1 TemplateVersion
- UserSite N:1 User
- UserTemplatePurchase N:1 User & Template

### 2. Template Manifest Structure

Setiap template version memiliki `manifestJson` dengan struktur:

```typescript
{
  name: string;
  version: string;
  layout: {
    header: string[];    // block types in header
    body: string[];      // block types in body
    footer: string[];    // block types in footer
  };
  allowedBlocks: string[];
  defaults: {
    tokens: Record<string, string>;     // CSS variables
    blockProps: Record<string, any>;    // Default props per block
  };
  requiredFeatures?: string[];  // ["analytics", "custom-domain"]
}
```

### 3. Block Registry System

Buat registry untuk blok-blok UI yang reusable:

**Blok yang dibutuhkan:**

- `BioBlock` - Avatar, name, bio text
- `LinkListBlock` - Daftar link utama (style: pill/underline/card)
- `SocialIconsBlock` - Social media links dengan icon
- `CTABlock` - Call-to-action button (newsletter, contact)
- `GalleryBlock` - Image/video gallery (premium)
- `AnalyticsBlock` - Click analytics (premium)

**Requirements:**

- Setiap blok punya JSON schema untuk validasi props
- Support `locked` state untuk premium features
- Responsive & accessible

### 4. Template Renderer Component

Core component yang me-render template secara dinamis:

```typescript
<TemplateRenderer
  manifest={TemplateManifest}
  cssVars={Record<string, string>}
  siteData={UserSiteData}
  entitlements={UserEntitlements}
/>
```

**Renderer harus:**

- Inject CSS variables ke root element
- Render blok sesuai layout manifest
- Handle premium gating (show locked state dengan upgrade CTA)
- Support live preview untuk editor
- SEO-friendly (meta tags, structured data)

### 5. Editor Interface

Visual editor untuk user mengatur halaman mereka:

**Features:**

- Drag & drop untuk reorder blok
- Form generator dari JSON schema untuk edit props
- Live preview side-by-side
- Template switcher dengan preview thumbnail
- "Upgrade to unlock" CTA untuk premium templates/blocks

### 6. Premium Gating Logic

**Two-tier gating:**

A. **Plan-based** (SaaS tiers):

```typescript
{
  plan: "FREE" | "STARTER" | "PRO";
  features: string[];  // ["analytics", "custom-domain", "remove-branding"]
}
```

B. **Template marketplace**:

- One-time purchase untuk template premium
- Creator revenue split (70/30)
- Trial dengan watermark

**Implementation:**

- Middleware untuk check entitlements
- Ghost state UI (blurred + lock icon)
- Graceful fallback untuk non-entitled users

---

## Deliverables

Tolong buatkan:

### 1. Complete Prisma Schema

- Semua models dengan proper relations
- Indexes untuk performa
- Enums untuk status/tiers
- Comments untuk dokumentasi

### 2. Core Components & Types

**TypeScript interfaces:**

- `TemplateManifest`
- `BlockSchema`
- `UserSiteData`
- `UserEntitlements`

**React Components:**

- `TemplateRenderer` - Main renderer
- `BlockRegistry` - Block component mapping
- `TemplateEditor` - Visual editor
- `TemplatePicker` - Template selection UI

### 3. Sample Templates

Buat 3 contoh template siap pakai:

**Template 1: "Minimal"** (Free)

- Simple vertical layout
- Basic bio + 5 links
- Monochrome color scheme
- No animations

**Template 2: "Aurora"** (Premium - $9)

- Glassmorphism design
- Gradient backgrounds
- Smooth animations
- Grid layout support
- Custom fonts

**Template 3: "Professional"** (Pro Plan)

- Corporate/business style
- Analytics integration
- Newsletter signup
- Custom domain support
- Contact form

### 4. API Routes Structure

```
app/api/
├── templates/
│   ├── route.ts              // GET list templates
│   ├── [id]/route.ts         // GET template detail
│   └── purchase/route.ts     // POST buy template
├── sites/
│   ├── [handle]/route.ts     // GET public site data
│   └── [id]/
│       ├── route.ts          // PATCH update site
│       └── publish/route.ts  // POST publish changes
└── blocks/
    └── schema/[type]/route.ts // GET block schema
```

### 5. Security & Best Practices

**Harus include:**

- Input validation dengan Zod
- CSRF protection
- Rate limiting untuk API
- Content Security Policy
- XSS prevention (sanitize user input)
- SQL injection prevention (Prisma parameterization)

### 6. Performance Optimizations

- Edge caching untuk public pages
- ISR (Incremental Static Regeneration)
- Image optimization (Next.js Image)
- CSS variables untuk instant theme switching
- Lazy loading untuk blocks
- Bundle splitting

### 7. Documentation

- README dengan setup instructions
- Architecture diagram
- API documentation
- Template creation guide
- Block development guide

---

## Bonus Features (Optional)

Jika memungkinkan, tambahkan:

1. **A/B Testing** - Test 2 template variants
2. **Template Inheritance** - Extend existing template
3. **Custom CSS Injection** - Pro users bisa add custom CSS
4. **White Label** - Remove branding untuk enterprise
5. **Analytics Dashboard** - Click tracking, visitor stats
6. **Webhook Integration** - Connect dengan tools eksternal
7. **Export/Import** - Backup site data sebagai JSON
8. **Collaboration** - Multiple users manage satu site

---

## Success Criteria

Sistem dianggap sukses jika:

✅ User bisa ganti template **tanpa** rebuild atau data loss
✅ Premium features ter-lock dengan jelas dan bisa di-unlock
✅ Template baru bisa ditambahkan **hanya** dengan JSON config (no code change)
✅ Editor real-time preview bekerja smooth (< 100ms latency)
✅ Public pages load cepat (< 1s FCP)
✅ Type-safe di semua layer (database → API → UI)
✅ Security best practices implemented
✅ Scalable untuk 10K+ users

---

## Example Usage Flow

```typescript
// 1. User membuat site
const site = await createUserSite({
  userId: "user_123",
  handle: "johndoe",
  templateVersionId: "minimal_v1.0.0"
});

// 2. User edit blok
await updateSiteData(site.id, {
  blocks: [
    { type: "bio", props: { name: "John Doe", bio: "Developer" } },
    { type: "link-list", props: { items: [...] } }
  ]
});

// 3. User upgrade & ganti template
await upgradeUserPlan("user_123", "PRO");
await applySiteTemplate(site.id, "aurora_v1.2.0");

// 4. Render public page
const publicData = await getPublicSite("johndoe");
return <TemplateRenderer {...publicData} />;
```

---

## Questions to Address

1. Bagaimana handle **migration** saat template version update?
2. Bagaimana **preview** template sebelum apply (tanpa commit)?
3. Bagaimana **revenue split** untuk marketplace creators?
4. Bagaimana handle **custom domain** mapping?
5. Bagaimana **backup/restore** site data?

---

## Output Format

Tolong deliver dalam bentuk:

1. **Artifact 1**: Complete Prisma Schema
2. **Artifact 2**: TypeScript types & interfaces
3. **Artifact 3**: TemplateRenderer component
4. **Artifact 4**: Sample template manifests (3 templates)
5. **Artifact 5**: API routes structure (tRPC atau REST)
6. **Artifact 6**: README dengan architecture overview

Prioritas: **Production-ready code** dengan proper error handling, TypeScript strict mode, dan comprehensive comments.
