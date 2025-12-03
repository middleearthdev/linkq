# 📚 MEDIA LIBRARY SYSTEM - MASTER CONTEXT

> **CRITICAL**: This is the single source of truth for Media Library implementation across LinkQ.
> All features using image/media upload MUST follow this pattern for consistency and cost optimization.

**Version:** 1.0.0
**Last Updated:** 2025-12-02
**Author:** LinkQ Team

---

## 🎯 CORE CONCEPT

### **The Hybrid Approach**

LinkQ uses a **"Smart Media Library with Auto-Cleanup"** system that combines:
1. **Reusable Asset Storage** - Upload once, use everywhere
2. **Reference Counting** - Track where assets are used
3. **Automatic Cleanup** - Delete unused assets after grace period
4. **Deduplication** - Same file = same hash = no duplicate storage

### **Philosophy**

```
┌─────────────────────────────────────────────────────┐
│  "Every uploaded image is a shared asset           │
│   that can be reused across the entire site,       │
│   with automatic cleanup to prevent waste"         │
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    USER UPLOADS IMAGE                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  1. CLIENT-SIDE COMPRESSION (Browser)                       │
│     - Resize to optimal dimensions                          │
│     - Convert to WebP                                        │
│     - Quality: 85%                                           │
│     → Savings: 70-90% bandwidth                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. HASH GENERATION (Server)                                │
│     - SHA-256 hash of file buffer                           │
│     - First 16 chars as unique ID                           │
│     → Check if already exists                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────┴───────┐
                    ↓               ↓
            ┌───────────┐   ┌──────────────┐
            │  EXISTS?  │   │  NEW FILE?   │
            └───────────┘   └──────────────┘
                    │               │
                    ↓               ↓
        ┌───────────────────┐  ┌──────────────────┐
        │ Return cached URL │  │ Process & Upload │
        │ Increment usage   │  │ Save to library  │
        └───────────────────┘  └──────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. USAGE TRACKING                                           │
│     - Track which blocks/links use this asset               │
│     - Maintain usage count                                   │
│     - Update lastUsedAt timestamp                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. LIFECYCLE MANAGEMENT                                     │
│     - When usage drops to 0: Mark for deletion             │
│     - Grace period: 30 days                                 │
│     - Auto-cleanup via cron job                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 DATABASE SCHEMA

### **Core Table: `MediaLibrary`**

```prisma
model MediaLibrary {
  id        String   @id @default(cuid())
  userId    String   // Owner of the asset

  // 🔑 FILE IDENTITY
  hash      String   // SHA-256 hash (first 16 chars)
  url       String   // CDN URL
  filename  String   // Original filename

  // 📏 FILE METADATA
  size      Int      // Bytes
  width     Int?     // Pixels
  height    Int?     // Pixels
  type      String   // MIME type (image/webp, etc)

  // 🎨 OPTIONAL METADATA
  title     String?  // User-defined name
  altText   String?  // Accessibility text
  tags      String[] @default([]) // ["logo", "product", etc]

  // 📊 USAGE TRACKING (Critical!)
  usageCount  Int      @default(0)     // Number of places using this
  usedIn      String[] @default([])    // Array of reference IDs

  // 🗑️ CLEANUP MANAGEMENT
  markedForDeletion Boolean  @default(false)
  deleteAfter       DateTime? // Grace period expiry

  // ⏱️ TIMESTAMPS
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  lastUsedAt DateTime?

  // 🔍 INDEXES
  @@unique([userId, hash]) // Same user can't have duplicate
  @@index([userId])
  @@index([markedForDeletion, deleteAfter]) // For cleanup job
  @@index([hash]) // For deduplication lookup
}
```

### **Reference ID Format**

**CRITICAL**: All `usedIn` references MUST follow this format:

```typescript
type ReferenceId = `${BlockType}:${BlockId}:${FieldName}`

// Examples:
"link-list:block-abc123:thumbnail"
"bio:block-xyz789:avatar"
"gallery:block-def456:image-2"
"product-catalog:block-ghi012:items.0.image"
```

**Why?** This allows us to:
- Track exactly where an asset is used
- Update/cleanup when blocks are deleted
- Provide usage analytics to users

---

## 🔧 CORE UTILITIES

### **1. Image Compression (Client-Side)**

**File:** `src/lib/media/compress-image.ts`

```typescript
export interface CompressionOptions {
  maxWidth?: number      // Default: 800
  maxHeight?: number     // Default: 800
  quality?: number       // Default: 0.85 (85%)
  format?: 'webp' | 'jpeg' | 'png' // Default: 'webp'
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<Blob>

// Usage:
const compressed = await compressImage(file, {
  maxWidth: 400,
  quality: 0.85,
  format: 'webp'
})
```

### **2. Hash Generation**

**File:** `src/lib/media/hash.ts`

```typescript
import crypto from 'crypto'

export function generateImageHash(buffer: Buffer): string {
  return crypto
    .createHash('sha256')
    .update(buffer)
    .digest('hex')
    .slice(0, 16) // First 16 chars sufficient
}
```

### **3. Usage Tracking**

**File:** `src/lib/media/usage-tracker.ts`

```typescript
export interface TrackUsageParams {
  action: 'add' | 'remove' | 'change'
  imageUrl: string
  oldImageUrl?: string  // For 'change' action
  referenceId: string   // Format: "blockType:blockId:field"
  userId: string
}

export async function trackImageUsage(params: TrackUsageParams): Promise<void>
```

---

## 🌐 API ENDPOINTS

### **1. Upload Image**

```
POST /api/media-library/upload
Authorization: Required
Content-Type: multipart/form-data

Body:
  - file: File (required)
  - category?: string (optional: 'avatar' | 'thumbnail' | 'gallery' | 'product')
  - referenceId?: string (optional: for immediate tracking)

Response:
{
  success: true,
  item: {
    id: "clx...",
    url: "https://cdn.../media-library/user123/abc123.webp",
    hash: "abc123...",
    size: 45678,
    width: 800,
    height: 600,
    usageCount: 1
  },
  cached: false, // true if file already existed
  savings: "87.5%" // compression savings
}
```

### **2. List Media Library**

```
GET /api/media-library
Authorization: Required

Query Params:
  - search?: string
  - tags?: string[] (comma-separated)
  - unused?: boolean (show only unused=0)
  - limit?: number (default: 50)
  - offset?: number (default: 0)

Response:
{
  success: true,
  items: MediaLibrary[],
  total: 123,
  totalSize: 12345678, // bytes
  pagination: {
    limit: 50,
    offset: 0,
    hasMore: true
  }
}
```

### **3. Track Usage**

```
POST /api/media-library/track-usage
Authorization: Required
Content-Type: application/json

Body:
{
  action: "add" | "remove" | "change",
  imageUrl: "https://cdn.../image.webp",
  oldImageUrl?: "https://cdn.../old-image.webp", // for 'change'
  referenceId: "link-list:block-abc:thumbnail"
}

Response:
{
  success: true,
  updatedImages: [
    {
      url: "...",
      usageCount: 3,
      markedForDeletion: false
    }
  ]
}
```

### **4. Delete Image (Manual)**

```
DELETE /api/media-library/:imageId
Authorization: Required

Response:
{
  success: true,
  message: "Image deleted",
  freedSpace: 156789 // bytes
}

Note: Only allows deletion if usageCount === 0
```

### **5. Cleanup (Cron)**

```
GET /api/cron/cleanup-media
Authorization: Bearer ${CRON_SECRET}

Response:
{
  success: true,
  deleted: 42,
  failed: 0,
  totalSizeSaved: "12.5 MB"
}
```

---

## 🎨 UI COMPONENTS

### **1. MediaLibraryPicker**

**File:** `src/components/media/MediaLibraryPicker.tsx`

**Purpose:** Unified image picker for ALL features

**Props:**
```typescript
interface MediaLibraryPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (imageUrl: string, metadata?: MediaMetadata) => void

  // Context
  category?: 'avatar' | 'thumbnail' | 'gallery' | 'product'
  referenceId?: string // Auto-track usage on select

  // Filtering
  allowedTypes?: string[] // Default: all image types
  maxSize?: number // Default: 5MB

  // UI
  currentImage?: string
  title?: string
  multiple?: boolean // For gallery uploads
}
```

**Usage Example:**
```typescript
<MediaLibraryPicker
  isOpen={showPicker}
  onClose={() => setShowPicker(false)}
  onSelect={(url) => {
    onUpdateBlock(blockId, { thumbnail: url })
  }}
  category="thumbnail"
  referenceId={`link-list:${blockId}:thumbnail`}
  currentImage={block.props.thumbnail}
/>
```

### **2. MediaLibraryCard**

**File:** `src/components/media/MediaLibraryCard.tsx`

**Purpose:** Display individual media item in grid/list

**Shows:**
- Image preview
- Usage count badge
- Deletion warning (if marked)
- Quick actions (use, delete)

### **3. MediaUploadZone**

**File:** `src/components/media/MediaUploadZone.tsx`

**Purpose:** Drag & drop upload zone

**Features:**
- Drag & drop
- Click to browse
- Multiple file support
- Upload progress
- Client-side compression preview

---

## 📋 INTEGRATION CHECKLIST

When adding Media Library to a NEW feature, follow these steps:

### **Step 1: Identify Upload Points**

```typescript
// ❌ OLD WAY (Direct upload, no tracking)
const handleUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch('/api/upload/thumbnail', {
    method: 'POST',
    body: formData
  })
  const { url } = await response.json()
  updateData({ image: url })
}

// ✅ NEW WAY (Via Media Library)
const handleUpload = async (file: File) => {
  // 1. Compress client-side
  const compressed = await compressImage(file, {
    maxWidth: 800,
    quality: 0.85,
    format: 'webp'
  })

  // 2. Upload via Media Library
  const formData = new FormData()
  formData.append('file', compressed)
  formData.append('category', 'thumbnail')
  formData.append('referenceId', `${blockType}:${blockId}:${fieldName}`)

  const response = await fetch('/api/media-library/upload', {
    method: 'POST',
    body: formData
  })

  const { item } = await response.json()
  updateData({ image: item.url })
}
```

### **Step 2: Track Usage on Change**

```typescript
// When user changes image
const handleImageChange = async (newUrl: string) => {
  const oldUrl = currentData.image

  // 1. Update data
  await updateData({ image: newUrl })

  // 2. Track usage change
  await trackImageUsage({
    action: 'change',
    imageUrl: newUrl,
    oldImageUrl: oldUrl,
    referenceId: `${blockType}:${blockId}:${fieldName}`,
    userId: user.id
  })
}
```

### **Step 3: Cleanup on Delete**

```typescript
// When block/item is deleted
const handleDelete = async (blockId: string) => {
  const block = blocks.find(b => b.id === blockId)

  // 1. Track image removal for ALL images in block
  if (block.props.thumbnail) {
    await trackImageUsage({
      action: 'remove',
      imageUrl: block.props.thumbnail,
      referenceId: `${block.type}:${blockId}:thumbnail`,
      userId: user.id
    })
  }

  // 2. Delete block
  await deleteBlock(blockId)
}
```

### **Step 4: Use MediaLibraryPicker**

```typescript
// Replace custom upload UI with unified picker
<MediaLibraryPicker
  isOpen={showImagePicker}
  onClose={() => setShowImagePicker(false)}
  onSelect={(url) => {
    // Picker handles upload + tracking automatically
    onUpdateBlock(blockId, { thumbnail: url })
  }}
  category="thumbnail"
  referenceId={`link-list:${blockId}:thumbnail`}
  currentImage={block.props.thumbnail}
/>
```

---

## 🎯 USAGE PATTERNS BY FEATURE

### **Pattern A: Single Image Field**

**Use Case:** Link thumbnail, bio avatar, product image

```typescript
// Example: Link List Block
const LinkEditor = () => {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <>
      <Button onClick={() => setShowPicker(true)}>
        Change Thumbnail
      </Button>

      <MediaLibraryPicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(url) => {
          onUpdateBlock(blockId, { thumbnail: url })
        }}
        category="thumbnail"
        referenceId={`link-list:${blockId}:thumbnail`}
        currentImage={block.props.thumbnail}
      />
    </>
  )
}
```

### **Pattern B: Multiple Images (Array)**

**Use Case:** Gallery block, product catalog

```typescript
// Example: Gallery Block
const GalleryEditor = () => {
  const handleAddImages = async (urls: string[]) => {
    const newImages = urls.map((url, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      url,
      caption: ''
    }))

    // Track each image
    for (const [idx, url] of urls.entries()) {
      await trackImageUsage({
        action: 'add',
        imageUrl: url,
        referenceId: `gallery:${blockId}:images.${images.length + idx}`,
        userId: user.id
      })
    }

    onUpdateBlock(blockId, {
      images: [...images, ...newImages]
    })
  }

  return (
    <MediaLibraryPicker
      isOpen={showPicker}
      onClose={() => setShowPicker(false)}
      onSelect={handleAddImages}
      category="gallery"
      multiple={true}
    />
  )
}
```

### **Pattern C: Nested Fields**

**Use Case:** Product catalog items with images

```typescript
// Example: Product with image
const ProductEditor = () => {
  const handleImageChange = (productIndex: number, newUrl: string) => {
    const oldUrl = products[productIndex].image

    // Update product
    const updatedProducts = [...products]
    updatedProducts[productIndex].image = newUrl

    onUpdateBlock(blockId, { items: updatedProducts })

    // Track usage
    trackImageUsage({
      action: 'change',
      imageUrl: newUrl,
      oldImageUrl: oldUrl,
      referenceId: `product-catalog:${blockId}:items.${productIndex}.image`,
      userId: user.id
    })
  }

  return (
    <MediaLibraryPicker
      referenceId={`product-catalog:${blockId}:items.${index}.image`}
      onSelect={(url) => handleImageChange(index, url)}
    />
  )
}
```

---

## ⚠️ CRITICAL RULES

### **DO's ✅**

1. **ALWAYS** use `MediaLibraryPicker` for image uploads
2. **ALWAYS** provide `referenceId` when selecting images
3. **ALWAYS** call `trackImageUsage` when:
   - Adding image to field
   - Changing image in field
   - Deleting block/item with image
4. **ALWAYS** compress images client-side before upload
5. **ALWAYS** use the format `blockType:blockId:fieldName` for referenceId

### **DON'Ts ❌**

1. **NEVER** upload directly to S3 without going through Media Library
2. **NEVER** delete images from S3 manually (let cleanup job handle it)
3. **NEVER** skip usage tracking (causes orphaned files)
4. **NEVER** use different reference ID formats
5. **NEVER** store duplicate images (always check hash first)

---

## 🔍 DEBUGGING GUIDE

### **Issue: Unused images not getting deleted**

**Check:**
```sql
-- Find images marked for deletion but still present
SELECT * FROM "MediaLibrary"
WHERE "markedForDeletion" = true
AND "deleteAfter" < NOW()

-- Verify usage count is 0
SELECT * FROM "MediaLibrary"
WHERE "usageCount" != array_length("usedIn", 1)
```

### **Issue: Image showing as "used" but can't find where**

**Debug:**
```typescript
const image = await prisma.mediaLibrary.findUnique({
  where: { id: imageId }
})

console.log('Used in:', image.usedIn)
// Output: ["link-list:block-abc:thumbnail", "bio:block-xyz:avatar"]

// Parse to find blocks
const blockIds = image.usedIn.map(ref => ref.split(':')[1])
const blocks = await prisma.block.findMany({
  where: { id: { in: blockIds } }
})
```

### **Issue: Storage growing despite cleanup**

**Audit:**
```typescript
// Run audit report
const stats = await prisma.mediaLibrary.groupBy({
  by: ['userId'],
  _count: true,
  _sum: { size: true },
  where: { markedForDeletion: false }
})

console.table(stats)
```

---

## 📈 ANALYTICS & MONITORING

### **Key Metrics to Track**

```typescript
// Dashboard queries
const metrics = {
  // Storage efficiency
  totalStorage: await getTotalStorageUsed(),
  unusedStorage: await getUnusedStorageSize(),
  deduplicationSavings: await getDeduplicationSavings(),

  // Usage patterns
  avgImagesPerUser: await getAvgImagesPerUser(),
  mostReusedImages: await getMostReusedImages(),

  // Cleanup effectiveness
  imagesDeleted30d: await getImagesDeletedLast30Days(),
  storageFreed30d: await getStorageFreedLast30Days(),
}
```

---

## 🚀 ROLLOUT PLAN

### **Phase 1: Foundation (Week 1)**
- ✅ Prisma schema
- ✅ Core API endpoints
- ✅ Client-side compression utility
- ✅ Basic MediaLibraryPicker component

### **Phase 2: Integration (Week 2)**
- ✅ Link List thumbnails
- ✅ Bio avatars
- ✅ Gallery images
- ✅ Usage tracking hooks

### **Phase 3: Automation (Week 3)**
- ✅ Cleanup cron job
- ✅ Grace period alerts
- ✅ Admin dashboard
- ✅ Usage analytics

### **Phase 4: Optimization (Week 4)**
- ✅ Responsive image variants
- ✅ Blur placeholders
- ✅ Lazy loading
- ✅ CDN optimization

---

## 📚 RELATED DOCUMENTATION

- [API Reference](./docs/api/media-library.md)
- [Component Guide](./docs/components/media-library.md)
- [Migration Guide](./docs/migration/to-media-library.md)
- [Cost Analysis](./docs/analytics/storage-costs.md)

---

## 🤝 CONTRIBUTING

When adding new features that use images:

1. **Read this context first**
2. **Follow the patterns exactly**
3. **Test usage tracking thoroughly**
4. **Update this doc if pattern changes**
5. **Get review from team lead**

---

## ✅ CHECKLIST FOR AI ASSISTANTS

When implementing Media Library for a new feature:

- [ ] Read this entire context document
- [ ] Identify all image upload points in the feature
- [ ] Use `MediaLibraryPicker` component
- [ ] Implement usage tracking (add, change, remove)
- [ ] Use proper `referenceId` format
- [ ] Handle cleanup on block/item deletion
- [ ] Add client-side compression
- [ ] Test the full lifecycle (upload → use → change → delete)
- [ ] Verify no orphaned files created
- [ ] Update feature documentation with Media Library usage

---

**Last Updated:** 2025-12-02
**Maintainer:** LinkQ Team
**Version:** 1.0.0

