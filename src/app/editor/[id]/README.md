# 📝 Editor Page - Refactored Architecture

## 🎯 Overview

This directory contains the **refactored version** of the LinkQ bio link editor. The monolithic 1626-line component has been split into modular, testable, and maintainable pieces.

## 📁 Directory Structure

```
editor/[id]/
├── page.tsx                    # Original file (1626 lines) - LEGACY
├── page.refactored.tsx         # NEW: Refactored main file (~250 lines)
│
├── hooks/                      # Custom React Hooks
│   ├── useSiteData.ts         # Site data management
│   └── useDragDrop.ts         # Drag & drop logic
│
├── components/                 # UI Components
│   ├── EditorHeader.tsx       # Header (mobile + desktop)
│   ├── EditorSidebar.tsx      # Desktop sidebar
│   ├── MobileTabs.tsx         # Mobile navigation
│   ├── EditTab.tsx            # Edit tab content
│   ├── DesignTab.tsx          # Design tab content
│   ├── SettingsTab.tsx        # Settings tab content
│   ├── BlockPicker.tsx        # Block picker modal
│   └── MobilePreview.tsx      # Mobile preview
│
└── README.md                   # This file
```

## 🚀 Quick Start

### For Development

```typescript
// Use the refactored version by default
import EditorPage from './page.refactored'

// Or test both versions
import LegacyEditor from './page'
import RefactoredEditor from './page.refactored'
```

### Migration Status

- ✅ **Hooks created** - useSiteData, useDragDrop
- ✅ **Components extracted** - 8 modular components
- ✅ **Main file refactored** - ~250 lines
- ⏳ **Testing** - In progress
- ⏳ **Production deployment** - Pending

## 📦 Custom Hooks

### 1. `useSiteData(siteId: string)`

Manages all site data operations.

**Usage:**
```typescript
const {
  siteData,      // Current site data
  loading,       // Loading state
  saving,        // Saving state
  publishing,    // Publishing state
  error,         // Error message
  saveSite,      // Save function
  publishSite,   // Publish/unpublish
  updateBlock,   // Update block props
  addBlock,      // Add new block
  deleteBlock    // Delete block
} = useSiteData(siteId)
```

**Features:**
- Auto-loads site data on mount
- Handles all CRUD operations
- Manages loading/error states
- Generates default block props

---

### 2. `useDragDrop()`

Handles drag & drop for both desktop and mobile.

**Usage:**
```typescript
const {
  draggedIndex,      // Currently dragging index
  dragOverIndex,     // Hover target index
  isDragging,        // Is actively dragging
  handleDragStart,   // Desktop drag start
  handleDragEnd,     // Desktop drag end
  handleDrop,        // Desktop drop
  handleTouchStart,  // Mobile touch start
  handleTouchMove,   // Mobile touch move
  handleTouchEnd     // Mobile touch end
} = useDragDrop()
```

**Features:**
- Desktop mouse drag & drop
- Mobile touch drag & drop
- Haptic feedback on mobile
- Visual feedback during drag
- Reusable for any draggable list

## 🎨 Components

### EditorHeader

**Variants:** Mobile & Desktop

**Props:**
```typescript
{
  handle: string
  status: 'DRAFT' | 'PUBLISHED'
  saving: boolean
  publishing: boolean
  showPreview: boolean
  onSave: () => void
  onPublish: () => void
  onTogglePreview: () => void
  variant?: 'mobile' | 'desktop'
}
```

**Features:**
- Save button with loading state
- Publish/unpublish toggle
- Preview toggle
- Back to dashboard link

---

### EditorSidebar

**Desktop only**

**Props:**
```typescript
{
  handle: string
  status: 'DRAFT' | 'PUBLISHED'
  linkCount: number
  activeTab: 'edit' | 'design' | 'settings'
  onTabChange: (tab) => void
}
```

**Features:**
- Navigation tabs
- Quick stats
- Theme toggle
- Back button

---

### EditTab

**Main editing interface**

**Props:**
```typescript
{
  blocks: Block[]
  handle: string
  bioBlock: Block | undefined
  onToggleBioBlock: () => void
  onToggleWhatsAppBlock: () => void
  onAddBlock: () => void
  onUpdateBlock: (id, props) => void
  onDeleteBlock: (id) => void
  // Drag & drop handlers
  draggedBlockIndex: number | null
  dragOverBlockIndex: number | null
  onBlockDragStart: (e, index) => void
  onBlockDragEnd: (e) => void
  onBlockDragOver: (e, index) => void
  onBlockDrop: (e, index) => void
  onBlockTouchStart: (e, index) => void
  onBlockTouchMove: (e) => void
  onBlockTouchEnd: () => void
}
```

**Features:**
- Bio section toggle
- WhatsApp Business toggle
- Block list with inline editing
- Drag & drop reordering
- Add/delete blocks

---

### BlockPicker

**Modal for adding blocks**

**Props:**
```typescript
{
  isOpen: boolean
  onClose: () => void
  onAddBlock: (type: string) => void
}
```

**Block Categories:**
- **Basic Blocks:** Links, Social Icons, Divider, Footer
- **Media & Content:** Gallery, Analytics
- **Indonesia Business:** Delivery, Marketplace, Products, Location, QRIS

---

## 🔄 Data Flow

```
User Interaction
     ↓
EditorPage (Main Component)
     ↓
useSiteData Hook
     ↓
API Routes
     ↓
Database (Prisma)
```

**State Management:**
```
┌─────────────────────────────────────┐
│  useSiteData Hook                   │
│  ├── siteData (from API)            │
│  ├── loading/saving states          │
│  └── CRUD methods                   │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  EditorPage Component               │
│  ├── UI state (activeTab, etc)     │
│  ├── useDragDrop hooks              │
│  └── Helper functions               │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Child Components                   │
│  ├── EditorHeader                   │
│  ├── EditTab                        │
│  ├── BlockPicker                    │
│  └── ...                            │
└─────────────────────────────────────┘
```

## 🧪 Testing

### Unit Tests

```typescript
// Test hooks
import { renderHook } from '@testing-library/react'
import { useSiteData } from './hooks/useSiteData'

test('should load site data', async () => {
  const { result } = renderHook(() => useSiteData('test-id'))
  await waitFor(() => {
    expect(result.current.siteData).toBeDefined()
  })
})

// Test components
import { render, screen } from '@testing-library/react'
import { EditorHeader } from './components/EditorHeader'

test('should render save button', () => {
  render(<EditorHeader {...mockProps} />)
  expect(screen.getByText('Save')).toBeInTheDocument()
})
```

### Integration Tests

```typescript
test('should add new block', async () => {
  render(<EditorPage params={{ id: 'test-id' }} />)

  fireEvent.click(screen.getByText('Add Block'))
  fireEvent.click(screen.getByText('Links'))

  expect(screen.getByText('Link List')).toBeInTheDocument()
})
```

## 🚀 Deployment

### Step 1: Backup

```bash
cp src/app/editor/[id]/page.tsx src/app/editor/[id]/page.tsx.backup
```

### Step 2: Deploy Refactored Version

```bash
mv src/app/editor/[id]/page.refactored.tsx src/app/editor/[id]/page.tsx
```

### Step 3: Test Thoroughly

- [ ] Load editor
- [ ] Add/delete blocks
- [ ] Drag & drop
- [ ] Save changes
- [ ] Publish site
- [ ] Mobile preview

### Step 4: Monitor

```bash
# Watch for errors
tail -f logs/error.log

# Monitor performance
npm run lighthouse
```

## 📊 Metrics

| Metric | Before | After |
|--------|--------|-------|
| Main File | 1626 lines | ~250 lines |
| Components | 1 | 13 |
| Custom Hooks | 0 | 2 |
| Testability | Hard | Easy |
| Maintainability | Low | High |

## 🎓 Best Practices

1. **Single Responsibility** - Each component does ONE thing
2. **DRY** - Logic extracted into reusable hooks
3. **Composition** - Build complex UI from simple parts
4. **Props Down, Events Up** - Clear data flow
5. **Custom Hooks** - Separate business logic from UI

## 🔮 Future Improvements

- [ ] Add unit tests for all hooks
- [ ] Add integration tests
- [ ] Implement auto-save with debouncing
- [ ] Add undo/redo functionality
- [ ] Keyboard shortcuts
- [ ] Real-time collaboration

## 📚 Resources

- [Refactoring Guide](../../../REFACTORING_GUIDE.md)
- [Visual Guide](../../../REFACTORING_VISUAL.md)
- [React Hooks Docs](https://react.dev/reference/react)
- [Testing Library](https://testing-library.com/react)

## 🤝 Contributing

When adding new features:

1. **New Hook?** → Add to `hooks/` directory
2. **New Component?** → Add to `components/` directory
3. **Modifying Tab?** → Update specific tab component
4. **New Block Type?** → Update `BlockPicker.tsx`

Example:
```typescript
// 1. Create hook
// hooks/useNewFeature.ts
export function useNewFeature() { ... }

// 2. Create component
// components/NewComponent.tsx
export function NewComponent() { ... }

// 3. Use in main page
import { useNewFeature } from './hooks/useNewFeature'
import { NewComponent } from './components/NewComponent'
```

---

**Made with ❤️ for better code quality**
