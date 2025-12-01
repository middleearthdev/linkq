# 🎨 EDITOR REFACTORING - VISUAL GUIDE

## 📊 BEFORE vs AFTER Architecture

### BEFORE: Monolithic Structure
```
┌─────────────────────────────────────────────────────────────┐
│                 page.tsx (1626 lines)                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • useState hooks (15+)                             │   │
│  │  • useEffect hooks (5+)                             │   │
│  │  • Event handlers (30+)                             │   │
│  │  • JSX rendering (800+ lines)                       │   │
│  │  • Drag & drop logic (200+ lines)                   │   │
│  │  • API calls                                        │   │
│  │  • State management                                 │   │
│  │  • UI components inline                             │   │
│  │  • Business logic mixed with UI                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ❌ Hard to maintain                                        │
│  ❌ Hard to test                                            │
│  ❌ Hard to reuse                                           │
│  ❌ Hard to debug                                           │
└─────────────────────────────────────────────────────────────┘
```

### AFTER: Modular Architecture
```
┌─────────────────────────────────────────────────────────────┐
│              page.refactored.tsx (~250 lines)               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Import Hooks & Components                          │   │
│  │  ├── useSiteData()                                  │   │
│  │  ├── useDragDrop()                                  │   │
│  │  ├── EditorHeader                                   │   │
│  │  ├── EditorSidebar                                  │   │
│  │  ├── EditTab                                        │   │
│  │  └── BlockPicker                                    │   │
│  │                                                      │   │
│  │  Minimal local state (4 variables)                  │   │
│  │  Helper functions (5 functions)                     │   │
│  │  Clean JSX composition                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ✅ Easy to maintain                                        │
│  ✅ Easy to test                                            │
│  ✅ Easy to reuse                                           │
│  ✅ Easy to debug                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Component Hierarchy

```
EditorPage (Main Container)
│
├── EditorSidebar (Desktop Only)
│   ├── Logo & Back Button
│   ├── Navigation Tabs
│   │   ├── Edit Tab Button
│   │   ├── Design Tab Button
│   │   └── Settings Tab Button
│   ├── Quick Stats Card
│   │   ├── Status Badge
│   │   └── Link Count
│   └── Theme Toggle
│
├── EditorHeader (Responsive)
│   ├── Mobile Variant
│   │   ├── Back Button
│   │   ├── Title & Handle
│   │   ├── Preview Toggle
│   │   ├── Save Button
│   │   └── Publish Button
│   │
│   └── Desktop Variant
│       ├── Page Info
│       ├── Site URL Link
│       ├── Save Button
│       └── Publish Button
│
├── MobileTabs (Mobile Only)
│   ├── Edit Tab
│   ├── Design Tab
│   └── Settings Tab
│
├── Main Content Area
│   ├── EditTab (when activeTab === 'edit')
│   │   ├── Profile Preview
│   │   ├── Add Block Button
│   │   ├── Special Features Card
│   │   │   ├── Bio Toggle
│   │   │   └── WhatsApp Toggle
│   │   └── Blocks List
│   │       ├── Block Item (draggable)
│   │       │   ├── Drag Handle
│   │       │   ├── Block Type Label
│   │       │   ├── Block Editor (inline)
│   │       │   └── Delete Button
│   │       └── ...more blocks
│   │
│   ├── DesignTab (when activeTab === 'design')
│   │   ├── Font Picker Card
│   │   └── Template Picker Card
│   │       ├── Current Template Info
│   │       └── Browse Button
│   │
│   └── SettingsTab (when activeTab === 'settings')
│       └── Coming Soon Placeholder
│
├── DeviceSimulator (Desktop Preview - Right Panel)
│   └── iPhone Frame
│       └── DynamicTemplateRenderer
│           └── Rendered Site Preview
│
├── MobilePreview (Mobile Fullscreen)
│   ├── Header
│   │   ├── Preview Icon
│   │   └── Close Button
│   └── Preview Content
│       └── DynamicTemplateRenderer
│
├── BlockPicker (Modal)
│   ├── Modal Header
│   │   ├── Title
│   │   └── Close Button
│   └── Block Categories
│       ├── Basic Blocks
│       │   ├── Links
│       │   ├── Social Icons
│       │   ├── Divider
│       │   └── Footer
│       ├── Media & Content
│       │   ├── Gallery
│       │   └── Analytics
│       └── Indonesia Business
│           ├── Food Delivery
│           ├── E-Commerce Store
│           ├── Product Catalog
│           ├── Location & Map
│           └── QRIS Payment
│
└── TemplatePicker (Fullscreen Modal)
    ├── Template Grid
    └── Template Preview
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  EDITOR PAGE (Main)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  const { siteData, saveSite, updateBlock } =          │  │
│  │    useSiteData(siteId)                                │  │
│  │                                                        │  │
│  │  const blockDragDrop = useDragDrop()                  │  │
│  │  const linkDragDrop = useDragDrop()                   │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ useSiteData │ │ useDragDrop │ │ Components  │
│             │ │             │ │             │
│ • Load      │ │ • Desktop   │ │ • Header    │
│ • Save      │ │ • Mobile    │ │ • Sidebar   │
│ • Update    │ │ • Haptic    │ │ • Tabs      │
│ • Delete    │ │ • Visual    │ │ • Modals    │
└─────────────┘ └─────────────┘ └─────────────┘
        │            │            │
        │            │            │
        ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API / BACKEND                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  GET  /api/sites/by-id/[id]  ← Load site data        │  │
│  │  PATCH /api/sites/[id]        ← Save changes         │  │
│  │  POST  /api/sites/[id]/template ← Switch template    │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (Prisma)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  UserSite Table                                       │  │
│  │  ├── id, userId, handle                               │  │
│  │  ├── dataJson (JSONB) ← Site content                  │  │
│  │  ├── templateVersionId                                │  │
│  │  └── status, timestamps                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 State Management Flow

### Before (Monolithic)
```
┌──────────────────────────────────────────┐
│       Single Component State             │
│                                          │
│  const [siteData, setSiteData]           │
│  const [loading, setLoading]             │
│  const [saving, setSaving]               │
│  const [activeTab, setActiveTab]         │
│  const [draggedIndex, setDraggedIndex]   │
│  const [dragOverIndex, setDragOverIndex] │
│  const [touchStartY, setTouchStartY]     │
│  const [isDragging, setIsDragging]       │
│  ... 10+ more state variables            │
│                                          │
│  ❌ All mixed together                   │
│  ❌ Hard to track                        │
│  ❌ Re-renders entire component          │
└──────────────────────────────────────────┘
```

### After (Modular)
```
┌──────────────────────────────────────────┐
│      Separated Concerns                  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  useSiteData Hook                  │  │
│  │  ├── siteData                      │  │
│  │  ├── loading                       │  │
│  │  ├── saving                        │  │
│  │  └── error                         │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  useDragDrop Hook (Blocks)         │  │
│  │  ├── draggedIndex                  │  │
│  │  ├── dragOverIndex                 │  │
│  │  ├── isDragging                    │  │
│  │  └── touchStartY                   │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  useDragDrop Hook (Links)          │  │
│  │  ├── draggedIndex                  │  │
│  │  ├── dragOverIndex                 │  │
│  │  └── ...                           │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Local UI State                    │  │
│  │  ├── activeTab                     │  │
│  │  ├── showPreview                   │  │
│  │  └── showBlockPicker               │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ✅ Organized by concern                │
│  ✅ Easy to understand                  │
│  ✅ Optimized re-renders                │
└──────────────────────────────────────────┘
```

---

## 🔧 Hook Composition Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                   CUSTOM HOOKS PATTERN                      │
└─────────────────────────────────────────────────────────────┘

1. useSiteData(siteId)
   ┌──────────────────────────────────────┐
   │  Input: siteId (string)              │
   │                                      │
   │  Internal State:                     │
   │  ├── siteData                        │
   │  ├── loading                         │
   │  ├── saving                          │
   │  ├── publishing                      │
   │  └── error                           │
   │                                      │
   │  Side Effects:                       │
   │  └── useEffect → Load site on mount │
   │                                      │
   │  Methods:                            │
   │  ├── saveSite()                      │
   │  ├── publishSite()                   │
   │  ├── updateBlock(id, props)          │
   │  ├── addBlock(type)                  │
   │  └── deleteBlock(id)                 │
   │                                      │
   │  Output: {                           │
   │    siteData, loading, saving,        │
   │    saveSite, publishSite,            │
   │    updateBlock, addBlock, ...        │
   │  }                                   │
   └──────────────────────────────────────┘

2. useDragDrop()
   ┌──────────────────────────────────────┐
   │  Input: none                         │
   │                                      │
   │  Internal State:                     │
   │  ├── draggedIndex                    │
   │  ├── dragOverIndex                   │
   │  ├── isDragging                      │
   │  └── touchStartY                     │
   │                                      │
   │  Methods:                            │
   │  ├── handleDragStart(e, index)       │
   │  ├── handleDragEnd()                 │
   │  ├── handleDrop(e, index, callback)  │
   │  ├── handleTouchStart(e, index)      │
   │  └── handleTouchEnd(callback)        │
   │                                      │
   │  Output: {                           │
   │    draggedIndex, dragOverIndex,      │
   │    handleDragStart, handleDrop,      │
   │    handleTouchStart, ...             │
   │  }                                   │
   └──────────────────────────────────────┘

Usage in Component:
┌──────────────────────────────────────┐
│  const {                             │
│    siteData,                         │
│    saveSite,                         │
│    updateBlock                       │
│  } = useSiteData(id)                 │
│                                      │
│  const blockDragDrop = useDragDrop() │
│  const linkDragDrop = useDragDrop()  │
│                                      │
│  return (                            │
│    <EditTab                          │
│      blocks={siteData.blocks}        │
│      onUpdateBlock={updateBlock}     │
│      {...blockDragDrop}              │
│    />                                │
│  )                                   │
└──────────────────────────────────────┘
```

---

## 📦 Component Props Flow

```
EditorPage
│
├─ Props: { params: Promise<{ id: string }> }
│
├─ Hooks:
│  ├─ useSiteData(id)
│  │  └─ Returns: { siteData, saveSite, updateBlock, ... }
│  │
│  └─ useDragDrop()
│     └─ Returns: { draggedIndex, handleDragStart, ... }
│
└─ Child Components:

   EditorHeader
   ├─ Props: {
   │    handle: string
   │    status: 'DRAFT' | 'PUBLISHED'
   │    saving: boolean
   │    publishing: boolean
   │    showPreview: boolean
   │    onSave: () => void
   │    onPublish: () => void
   │    onTogglePreview: () => void
   │    variant: 'mobile' | 'desktop'
   │  }
   └─ No internal state (Presentational)

   EditorSidebar
   ├─ Props: {
   │    handle: string
   │    status: 'DRAFT' | 'PUBLISHED'
   │    linkCount: number
   │    activeTab: 'edit' | 'design' | 'settings'
   │    onTabChange: (tab) => void
   │  }
   └─ No internal state (Presentational)

   EditTab
   ├─ Props: {
   │    blocks: Block[]
   │    handle: string
   │    bioBlock: Block | undefined
   │    onToggleBioBlock: () => void
   │    onToggleWhatsAppBlock: () => void
   │    onAddBlock: () => void
   │    onUpdateBlock: (id, props) => void
   │    onDeleteBlock: (id) => void
   │    ...dragDropHandlers
   │  }
   └─ No internal state (Presentational)

   BlockPicker
   ├─ Props: {
   │    isOpen: boolean
   │    onClose: () => void
   │    onAddBlock: (type) => void
   │  }
   └─ No internal state (Presentational)
```

---

## 🎨 Responsive Layout Breakdown

### Desktop (≥1024px)
```
┌───────────────────────────────────────────────────────────┐
│  EditorSidebar   │  Main Content   │  DeviceSimulator    │
│  (272px)         │  (flex-1)       │  (420px)            │
│                  │                 │                     │
│  • Logo          │  Desktop Header │  ┌───────────────┐  │
│  • Back Button   │                 │  │  iPhone Frame │  │
│  • Nav Tabs      │  ┌────────────┐ │  │               │  │
│    - Edit        │  │            │ │  │  ┌─────────┐  │  │
│    - Design      │  │   Editor   │ │  │  │ Preview │  │  │
│    - Settings    │  │   Content  │ │  │  │  Area   │  │  │
│                  │  │            │ │  │  └─────────┘  │  │
│  • Quick Stats   │  │            │ │  │               │  │
│    - Status      │  └────────────┘ │  └───────────────┘  │
│    - Link Count  │                 │                     │
│                  │                 │                     │
│  • Theme Toggle  │                 │                     │
└───────────────────────────────────────────────────────────┘
```

### Mobile (<1024px)
```
┌─────────────────────────────────┐
│  Mobile Header                  │
│  • Back | Title | Save | Publish│
├─────────────────────────────────┤
│  Mobile Tabs                    │
│  [ Edit | Design | Settings ]   │
├─────────────────────────────────┤
│                                 │
│                                 │
│      Editor Content             │
│      (Full Width)               │
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘

Preview (Fullscreen when active):
┌─────────────────────────────────┐
│  Preview Header  [X]            │
├─────────────────────────────────┤
│                                 │
│      Site Preview               │
│      (Full Screen)              │
│                                 │
│                                 │
└─────────────────────────────────┘
```

---

## 🚀 Code Reusability

### Before (No Reusability)
```typescript
// All code in one file - can't reuse
// Drag & drop logic: 200+ lines
// API calls: 150+ lines
// UI rendering: 800+ lines

❌ Can't use drag & drop elsewhere
❌ Can't test components in isolation
❌ Can't share state management
```

### After (High Reusability)
```typescript
// Reusable Hooks
import { useSiteData } from '@/hooks/useSiteData'
import { useDragDrop } from '@/hooks/useDragDrop'

// Use in other pages
function AnotherPage() {
  const { siteData, updateBlock } = useSiteData(id)
  const dragDrop = useDragDrop()

  return <DraggableList {...dragDrop} />
}

// Reusable Components
import { EditorHeader } from '@/components/EditorHeader'
import { BlockPicker } from '@/components/BlockPicker'

// Use in other contexts
function TemplateEditor() {
  return (
    <>
      <EditorHeader ... />
      <BlockPicker ... />
    </>
  )
}

✅ Share hooks across pages
✅ Compose components flexibly
✅ Test each part independently
✅ Mix and match as needed
```

---

## 📊 File Size Comparison

```
BEFORE: Single File
┌────────────────────────────────────┐
│  page.tsx                          │
│  ████████████████████████ 1626 L   │
└────────────────────────────────────┘

AFTER: Modular Files
┌────────────────────────────────────┐
│  page.tsx                          │
│  ████ 250 L                        │
├────────────────────────────────────┤
│  useSiteData.ts                    │
│  ██████ 300 L                      │
├────────────────────────────────────┤
│  useDragDrop.ts                    │
│  ███ 150 L                         │
├────────────────────────────────────┤
│  EditorHeader.tsx                  │
│  ███ 150 L                         │
├────────────────────────────────────┤
│  EditorSidebar.tsx                 │
│  ███ 140 L                         │
├────────────────────────────────────┤
│  EditTab.tsx                       │
│  █████ 250 L                       │
├────────────────────────────────────┤
│  DesignTab.tsx                     │
│  ██ 80 L                           │
├────────────────────────────────────┤
│  BlockPicker.tsx                   │
│  ████ 200 L                        │
├────────────────────────────────────┤
│  + 5 more small components         │
│  ██ ~200 L                         │
└────────────────────────────────────┘

Total Lines: ~1720 (slightly more due to module overhead)
But: Each file is FOCUSED and TESTABLE
```

---

**Made with ❤️ for better code architecture**
