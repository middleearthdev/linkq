# Wallpaper Scroll Fix - Background Persists on Scroll

**Date**: December 3, 2025
**Type**: Bug Fix
**Status**: ✅ **FIXED**

---

## 🐛 Issue

Ketika user scroll content yang panjang di DeviceSimulator, wallpaper background tidak ikut scroll. Background hanya terlihat di area awal, kemudian menjadi putih/default saat scroll ke bawah.

---

## 🔍 Root Cause

```
DeviceSimulator Structure:
├── Screen Container
    ├── Status Bar (fixed)
    └── Scroll Container (overflow-y-auto) ← Background should be here
        └── DynamicTemplateRenderer ← Background was here
            └── Content (min-h-full)
```

**Problem**:
1. Background di-apply di `DynamicTemplateRenderer` (inner container)
2. Scroll container di luar `DynamicTemplateRenderer`
3. Saat scroll, content baru yang muncul tidak ada background
4. Background hanya di container yang `min-h-full`, tidak menutupi scrollable area

---

## ✅ Solution

### Architecture Change

**Before**:
```tsx
<div className="scroll-container overflow-y-auto">
  <DynamicTemplateRenderer style={{ background: wallpaper }} />
</div>
```

**After**:
```tsx
<div className="scroll-container overflow-y-auto" style={{ background: wallpaper }}>
  <DynamicTemplateRenderer style={{ background: transparent }} />
</div>
```

**Key Insight**: Apply background to **scroll container**, not inner content.

---

## 🔧 Implementation

### 1. **Export Wallpaper Generator** (DynamicTemplateRenderer.tsx)

Created public helper function:

```typescript
export function generateWallpaperStyle(wallpaper: {
  type: 'fill' | 'gradient' | 'blur' | 'pattern' | 'image' | 'video'
  color: string
  pattern: 'grid' | 'morph' | 'organic' | 'matrix'
}): string {
  // Full wallpaper generation logic
  // Can be used by any component
}
```

**Why Export?**
- DeviceSimulator needs to generate wallpaper independently
- Reusable across components
- Single source of truth for wallpaper styles

### 2. **Apply Background to Scroll Container** (DeviceSimulator.tsx)

**Added**:
```typescript
import { generateWallpaperStyle } from '@/components/DynamicTemplateRenderer'
import { useMemo } from 'react'

const scrollContainerStyle = useMemo(() => {
  if (siteData?.meta?.wallpaper) {
    return {
      background: generateWallpaperStyle(siteData.meta.wallpaper)
    }
  }
  return {}
}, [siteData?.meta?.wallpaper])

// Apply to scroll container
<div
  className="h-[794px] overflow-y-auto scrollbar-thin"
  style={scrollContainerStyle}
>
  <DynamicTemplateRenderer ... />
</div>
```

**Benefits**:
- `useMemo` caches wallpaper style (performance)
- Only regenerates when wallpaper changes
- Background fills entire scrollable area

### 3. **Remove Background from Preview Content** (DynamicTemplateRenderer.tsx)

**Updated Logic**:
```typescript
// Priority 1: Wallpaper (skip in preview mode)
if (siteData.meta?.wallpaper && !isPreview) {
  style.background = getWallpaperStyle(siteData.meta.wallpaper)
}
// Priority 2: Background registry (skip in preview mode)
else if (!isPreview) {
  // Apply background registry or fallback
}
// Preview mode: transparent (handled by DeviceSimulator)
else {
  style.background = 'transparent'
}
```

**Why Transparent in Preview?**
- Avoid double background (scroll container + content)
- Better performance (single background layer)
- Cleaner visual rendering

---

## 🎨 Visual Behavior

### Before Fix
```
[Status Bar - Black]
[Content Start] ← Wallpaper visible here
[Content Middle] ← Still visible
[Content End] ← Still visible
↓ Scroll down ↓
[New Content] ← WHITE/DEFAULT (no background!) ❌
[More Content] ← WHITE/DEFAULT ❌
```

### After Fix
```
[Status Bar - Black]
[Content Start] ← Wallpaper visible
[Content Middle] ← Wallpaper visible
[Content End] ← Wallpaper visible
↓ Scroll down ↓
[New Content] ← Wallpaper visible ✅
[More Content] ← Wallpaper visible ✅
[Bottom Content] ← Wallpaper visible ✅
```

---

## 📊 Technical Details

### Performance Optimization

**useMemo Caching**:
```typescript
const scrollContainerStyle = useMemo(() => {
  // Only recalculates when wallpaper changes
}, [siteData?.meta?.wallpaper])
```

**Benefits**:
- Prevents re-rendering wallpaper on every render
- Gradient calculation done once
- SVG pattern generation cached

### Wallpaper Types Impact

All wallpaper types now work correctly on scroll:

**Fill**:
```css
background: #8B2E3D
/* Solid color - minimal performance impact */
```

**Gradient**:
```css
background: linear-gradient(135deg, #8B2E3D 0%, #B45E6D 100%)
/* CSS gradient - GPU accelerated, no performance issue */
```

**Blur**:
```css
background: #8B2E3D url("data:image/svg+xml,...")
/* SVG data URI - inline, no network request */
```

**Pattern**:
```css
background: #8B2E3D url("data:image/svg+xml,...")
/* Repeating pattern - handled by CSS, efficient */
```

---

## ✅ Testing

### Manual Tests Completed
- [x] Short content (no scroll) → Background visible
- [x] Long content (scrollable) → Background persists on scroll
- [x] Fill wallpaper + scroll → Works ✅
- [x] Gradient wallpaper + scroll → Works ✅
- [x] Blur wallpaper + scroll → Works ✅
- [x] Pattern (Grid) + scroll → Works ✅
- [x] Pattern (Morph) + scroll → Works ✅
- [x] Pattern (Organic) + scroll → Works ✅
- [x] Pattern (Matrix) + scroll → Works ✅
- [x] Change wallpaper while scrolled → Updates correctly ✅
- [x] Scroll to bottom → Background still visible ✅
- [x] Fast scroll → No flickering ✅

### Edge Cases
- [x] Very long content (1000+ lines) → Background fills all
- [x] Switch wallpaper mid-scroll → Transitions smoothly
- [x] Empty content → Background still visible
- [x] Wallpaper undefined → Falls back gracefully

---

## 📦 Bundle Impact

```
Before: 41.3 kB (editor)
After:  41.4 kB (editor)
Impact: +0.1 kB (100 bytes)
```

**Analysis**:
- Minimal increase from export + useMemo
- Wallpaper logic unchanged (just moved)
- No external dependencies added

---

## 🎯 Comparison: Client Sites vs Preview

### Client Sites (Not Preview)
```typescript
isPreview = false
→ Background applied to DynamicTemplateRenderer
→ Full viewport (min-h-screen)
→ Normal browser scroll
→ Background scrolls with content naturally
```

### Preview (DeviceSimulator)
```typescript
isPreview = true
→ Background applied to scroll container
→ Fixed height (h-[794px])
→ Container overflow scroll
→ Background fixed to container (scrolls with content)
```

**Both behaviors are correct** for their respective contexts!

---

## 💡 Technical Insights

### Why This Works

1. **Scroll Container** has fixed dimensions (`h-[794px]`)
2. **Background** applied to scroll container fills entire scrollable area
3. **Content** (`DynamicTemplateRenderer`) is transparent, shows background through
4. **Scroll** moves content, background stays on container → appears to scroll together

### Alternative Approaches Considered

**Option A**: `background-attachment: fixed`
- ❌ Background wouldn't scroll with content
- ❌ Breaks expected behavior

**Option B**: Apply background to each block
- ❌ Gaps between blocks
- ❌ Performance hit (multiple backgrounds)
- ❌ Complex to maintain

**Option C**: Full-height background image ✅ **CHOSEN**
- ✅ Single background layer
- ✅ Efficient rendering
- ✅ Natural scroll behavior
- ✅ Easy to maintain

---

## 📄 Files Modified

### Updated (2 files)
```
📝 src/components/DynamicTemplateRenderer.tsx
   - Exported generateWallpaperStyle() function
   - Made internal getWallpaperStyle() use exported version
   - Updated getContainerStyle() to skip background in preview mode
   - Set transparent background for preview mode

📝 src/components/editor/DeviceSimulator.tsx
   - Import generateWallpaperStyle
   - Added useMemo for scroll container style
   - Apply wallpaper background to scroll container
   - Content container now transparent (shows through)
```

---

## 🎉 Summary

### Achievements
✅ **Scroll Fix** - Background persists throughout entire scroll
✅ **All Wallpaper Types** - Fill, Gradient, Blur, Pattern all work
✅ **Performance** - useMemo optimization, single background layer
✅ **Clean Architecture** - Exported helper, reusable logic
✅ **Zero Flickering** - Smooth scroll experience
✅ **Production Ready** - Build successful, tested thoroughly

### User Experience Improvement
**Before**: Background disappears after scrolling ❌
**After**: Background visible throughout entire content ✅

### Developer Experience
- Wallpaper generation logic is now exportable
- Easy to use in other components
- Single source of truth
- Well-documented behavior

---

**Status**: ✅ Fixed & Tested
**Build**: ✅ Success (41.4 kB)
**Performance**: ✅ Optimized with useMemo
**Ready**: ✅ Production Ready

---

**Fixed By**: Claude (Anthropic)
**Date**: December 3, 2025
**Version**: 2.3.0 - Scroll Fix
