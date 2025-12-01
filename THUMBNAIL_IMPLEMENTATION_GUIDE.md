# 📸 Thumbnail Implementation Guide for LinkList

## Overview
This guide explains how to implement thumbnail/preview images for LinkList items. The infrastructure has been prepared to make this implementation straightforward.

---

## ✅ Infrastructure Already in Place

### 1. **Type Definitions** (`src/types/index.ts`)

The `LinkItemSchema` already includes optional `thumbnail` and `description` fields:

```typescript
export const LinkItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
  // Optional fields for future extensibility
  thumbnail: z.string().url().optional(), // ✅ Ready for use!
  description: z.string().optional(),      // ✅ Bonus: also available
})
```

**Type inference** automatically works:
```typescript
type LinkItem = z.infer<typeof LinkItemSchema>
// LinkItem will have thumbnail?: string property
```

---

## 🚀 Implementation Steps

### Step 1: Update LinkListEditor UI

**File**: `src/components/editor/LinkListEditor.tsx`

Add thumbnail upload functionality to the link editor:

```tsx
// Inside the link item form (around line 560-600)
<div className="space-y-3">
  {/* Existing fields: Title, URL, Icon */}

  {/* NEW: Thumbnail Field */}
  <div>
    <Label className="text-sm font-medium">Thumbnail (Optional)</Label>
    <div className="flex gap-2">
      <Input
        type="url"
        placeholder="https://example.com/image.jpg"
        value={item.thumbnail || ''}
        onChange={(e) => handleUpdateLink(item.id, {
          thumbnail: e.target.value || undefined
        })}
      />
      {/* Optional: Add image upload button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => handleUploadThumbnail(item.id)}
      >
        Upload
      </Button>
    </div>

    {/* Preview thumbnail if exists */}
    {item.thumbnail && (
      <div className="mt-2">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-20 h-20 object-cover rounded border"
        />
      </div>
    )}
  </div>

  {/* NEW: Description Field (bonus) */}
  <div>
    <Label className="text-sm font-medium">Description (Optional)</Label>
    <Textarea
      placeholder="Brief description for this link..."
      value={item.description || ''}
      onChange={(e) => handleUpdateLink(item.id, {
        description: e.target.value || undefined
      })}
      rows={2}
    />
  </div>
</div>
```

### Step 2: Add Thumbnail Upload Handler

```typescript
const handleUploadThumbnail = async (itemId: string) => {
  // Use existing upload infrastructure
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'

  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    try {
      // Upload to DigitalOcean Spaces / AWS S3
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'link-thumbnail')

      const response = await fetch('/api/upload/thumbnail', {
        method: 'POST',
        body: formData
      })

      const { url } = await response.json()

      // Update link with thumbnail URL
      handleUpdateLink(itemId, { thumbnail: url })
    } catch (error) {
      console.error('Thumbnail upload failed:', error)
    }
  }

  input.click()
}
```

### Step 3: Create Upload API Endpoint

**File**: `src/app/api/upload/thumbnail/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { nanoid } from 'nanoid'

const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION || 'sgp1',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const filename = `link-thumbnails/${nanoid()}.${ext}`

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to S3/Spaces
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET!,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
        ACL: 'public-read',
      })
    )

    // Generate CDN URL
    const url = `${process.env.DO_SPACES_CDN_URL}/${filename}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Thumbnail upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
```

### Step 4: Update LinkListBlock to Display Thumbnails

**File**: `src/components/blocks/LinkListBlock.tsx`

Add thumbnail rendering to button styles. Example for 'card' style:

```tsx
if (style === 'card') {
  return (
    <button
      key={item.id || index}
      className={cn(baseClasses, '...')}
      onClick={() => handleLinkClick(item)}
      disabled={isEditing}
    >
      {/* NEW: Thumbnail display */}
      {item.thumbnail && (
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-start flex-1">
        <div className="flex items-center gap-2">
          {item.icon && <span className="text-lg">{item.icon}</span>}
          <span className="font-medium">{item.title}</span>
        </div>

        {/* NEW: Description display */}
        {item.description && (
          <p className="text-xs opacity-70 mt-1">{item.description}</p>
        )}
      </div>

      <ExternalLink className="w-4 h-4 opacity-70" />
    </button>
  )
}
```

### Step 5: Add Thumbnail Layout Options

You can create new style variations that emphasize thumbnails:

```typescript
// In link-list-styles.ts, add new styles
export type LinkListStyle =
  | 'pill' | 'card' | ... // existing styles
  | 'card-thumbnail'      // NEW: Card with large thumbnail
  | 'grid-thumbnail'      // NEW: Grid layout with thumbnails
  | 'list-thumbnail'      // NEW: List with side thumbnails
```

Example implementation:

```tsx
if (style === 'card-thumbnail') {
  return (
    <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
      {/* Full-width thumbnail */}
      {item.thumbnail && (
        <div className="w-full h-40 overflow-hidden">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content overlay or below */}
      <div className="p-4 bg-white">
        <div className="flex items-center gap-2">
          {item.icon && <span className="text-xl">{item.icon}</span>}
          <h3 className="font-semibold text-lg">{item.title}</h3>
        </div>

        {item.description && (
          <p className="text-sm text-gray-600 mt-2">{item.description}</p>
        )}
      </div>

      {/* Click overlay */}
      <button
        onClick={() => handleLinkClick(item)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isEditing}
      />
    </div>
  )
}
```

---

## 📝 Environment Variables

Add to `.env`:

```bash
# DigitalOcean Spaces (or AWS S3)
DO_SPACES_ENDPOINT=https://sgp1.digitaloceanspaces.com
DO_SPACES_REGION=sgp1
DO_SPACES_BUCKET=linkq
DO_SPACES_KEY=your_key_here
DO_SPACES_SECRET=your_secret_here
DO_SPACES_CDN_URL=https://linkq.sgp1.cdn.digitaloceanspaces.com
```

---

## 🎨 Design Recommendations

### Thumbnail Sizes
- **Small**: 48x48px (for pill/compact styles)
- **Medium**: 80x80px (for card styles)
- **Large**: 160x160px or 16:9 aspect ratio (for feature styles)

### Image Optimization
Consider using Next.js Image component:

```tsx
import Image from 'next/image'

{item.thumbnail && (
  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
    <Image
      src={item.thumbnail}
      alt={item.title}
      fill
      className="object-cover"
      sizes="48px"
    />
  </div>
)}
```

### Fallback Handling
Always provide fallback for missing thumbnails:

```tsx
{item.thumbnail ? (
  <img src={item.thumbnail} alt={item.title} className="..." />
) : (
  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
    {item.icon || <ImageIcon className="w-6 h-6 text-gray-400" />}
  </div>
)}
```

---

## 🔒 Security Considerations

1. **File validation**: Check file type and size server-side
2. **Rate limiting**: Limit upload requests per user
3. **Image scanning**: Consider malware scanning for uploaded images
4. **CDN security**: Use signed URLs for private thumbnails
5. **Plan gating**: Limit thumbnail feature to PRO users only

---

## 💡 Pro Tips

### Lazy Loading
```tsx
<img
  src={item.thumbnail}
  loading="lazy"
  decoding="async"
/>
```

### Progressive Enhancement
Start with icon, then add thumbnail:
```tsx
<div className="relative">
  {item.icon && <span>{item.icon}</span>}
  {item.thumbnail && (
    <img
      src={item.thumbnail}
      className="absolute inset-0"
      onLoad={(e) => e.currentTarget.previousElementSibling?.remove()}
    />
  )}
</div>
```

### Database Migration
If needed, add migration for existing data:

```sql
-- Already compatible! No migration needed.
-- LinkItem schema is backward compatible.
-- Existing links will have thumbnail = undefined
```

---

## 📊 Testing Checklist

- [ ] Upload thumbnail via editor
- [ ] Thumbnail displays correctly in preview
- [ ] Thumbnail works in all applicable styles
- [ ] Fallback works when thumbnail is missing
- [ ] Image optimization works (lazy loading, responsive)
- [ ] Upload validation works (file type, size)
- [ ] CDN URL is correct and accessible
- [ ] Mobile responsive
- [ ] Accessibility (alt text, ARIA labels)

---

## 🎯 Backward Compatibility

✅ **100% Backward Compatible!**

- Existing links without `thumbnail` field work perfectly
- Schema is optional, no breaking changes
- Default behavior: thumbnails hidden if not provided
- No database migration needed

---

## Summary

The infrastructure is **ready for thumbnail implementation**! Just follow the steps above to:

1. Add UI for thumbnail upload in LinkListEditor
2. Create upload API endpoint
3. Update LinkListBlock to display thumbnails
4. (Optional) Create new thumbnail-focused styles

**Estimated implementation time**: 2-4 hours for basic functionality

Happy coding! 🚀
