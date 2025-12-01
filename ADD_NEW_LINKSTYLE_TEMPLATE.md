# Template: Menambah Link Style Baru ke LinkListBlock

## 📋 CHECKLIST SEBELUM MULAI

Sebelum menambah style baru, pastikan:
- [ ] Nama style unique dan descriptive (contoh: 'neon-glow', 'paper-torn', 'glass-frost')
- [ ] Sudah pilih kategori: 'basic' | 'modern' | 'creative' | 'game' | 'culinary'
- [ ] Punya konsep visual yang jelas
- [ ] Tahu color palette yang akan digunakan

---

## 🎨 STEP 1: Tambahkan Type Definition

**File:** `src/lib/link-list-styles.ts`

**Lokasi:** Line ~7-22 (LinkListStyle type)

```typescript
export type LinkListStyle =
  | 'pill' | 'underline' | 'card' | 'modern' | 'modern-cream' | 'vintage'
  // ... existing styles
  | 'YOUR_NEW_STYLE_NAME'  // ⬅️ TAMBAHKAN DI SINI
```

---

## 🎨 STEP 2: Tambahkan ke STYLE_TEMPLATES

**File:** `src/lib/link-list-styles.ts`

**Lokasi:** Line ~126+ (STYLE_TEMPLATES array)

```typescript
export const STYLE_TEMPLATES: StyleTemplate[] = [
  // ... existing templates
  {
    id: 'YOUR_NEW_STYLE_NAME',
    name: 'Display Name',
    preview: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg',
    category: 'creative', // basic | modern | creative | game | culinary
    description: 'Short description of this style (optional)'
  },
]
```

---

## 🎨 STEP 3: Tambahkan Implementation ke LinkListBlock

**File:** `src/components/blocks/LinkListBlock.tsx`

**Lokasi:** Setelah existing styles (~line 5000+)

### ⚠️ MOBILE-FIRST STANDARDS (WAJIB!)

```typescript
// YOUR_NEW_STYLE - Description of the style
if (style === 'YOUR_NEW_STYLE_NAME') {
  return (
    <button
      key={item.id || index}
      className={cn(
        baseClasses,
        // ✅ RESPONSIVE HEIGHT (mobile-first)
        'h-12 sm:h-16',              // 48px mobile → 64px desktop

        // ✅ RESPONSIVE PADDING (mobile-first)
        'px-4 sm:px-8',              // 16px mobile → 32px desktop

        // ✅ LAYOUT & STYLING
        'relative group overflow-hidden rounded-lg',

        // ✅ TRANSITIONS
        'transition-all duration-300 hover:scale-105 active:scale-95'
      )}
      onClick={() => handleLinkClick(item)}
      disabled={isEditing}
    >
      {/* ===== BACKGROUND LAYER ===== */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          // ✅ USE CUSTOM COLORS dari customColors
          background: customColors
            ? `linear-gradient(to right, ${customColors.primary}, ${customColors.secondary})`
            : 'linear-gradient(to right, #3b82f6, #8b5cf6)',

          // ✅ USE CUSTOM BORDER
          borderColor: customColors?.border || '#3b82f6',

          // ✅ USE CUSTOM SHADOW
          boxShadow: customColors
            ? `0 4px 15px ${customColors.glow}40`
            : '0 4px 15px rgba(59, 130, 246, 0.25)'
        }}
      />

      {/* ===== DECORATIVE EFFECTS (Optional) ===== */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(circle at center, ${customColors?.highlight || '#ffffff'}20, transparent 70%)`
        }}
      />

      {/* ===== CONTENT LAYER ===== */}
      <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 h-full">
        {/* ✅ THUMBNAIL (from content variable - auto included) */}
        {item.thumbnail && (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* ✅ ICON - RESPONSIVE SIZE */}
        {item.icon && (
          <span
            className="text-lg sm:text-2xl transform group-hover:scale-110 transition-transform"
            style={{
              // ✅ WAJIB USE VAR(--custom-text-color)
              color: 'var(--custom-text-color)',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >{item.icon}</span>
        )}

        {/* ✅ TITLE - RESPONSIVE SIZE + TRUNCATE */}
        <span
          className="text-sm sm:text-base font-bold tracking-wide truncate"
          style={{
            // ✅ WAJIB USE VAR(--custom-text-color)
            color: 'var(--custom-text-color)',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {item.title}
        </span>

        {/* ✅ EXTERNAL LINK ICON (optional) */}
        <ExternalLink
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70 flex-shrink-0"
          style={{ color: 'var(--custom-text-color)' }}
        />
      </div>
    </button>
  )
}
```

---

## ✅ RESPONSIVE SIZE STANDARDS

### **Button Heights**
```typescript
// Small buttons
'h-12 sm:h-14'     // 48px → 56px

// Medium buttons (most common)
'h-12 sm:h-16'     // 48px → 64px

// Large buttons
'h-14 sm:h-20'     // 56px → 80px

// Extra large buttons
'h-16 sm:h-24'     // 64px → 96px
```

### **Horizontal Padding**
```typescript
'px-4 sm:px-6'     // Compact
'px-4 sm:px-8'     // Standard (most common)
'px-5 sm:px-10'    // Spacious
```

### **Icon Sizes**
```typescript
'text-base sm:text-lg'    // Small icons
'text-lg sm:text-xl'      // Medium icons (most common)
'text-lg sm:text-2xl'     // Large icons
'text-xl sm:text-3xl'     // Extra large icons
```

### **Title Text Sizes**
```typescript
'text-sm sm:text-base'    // Standard (most common)
'text-base sm:text-lg'    // Larger
'text-lg sm:text-xl'      // Extra large
```

### **Gaps**
```typescript
'gap-2 sm:gap-3'          // Standard (most common)
'gap-2 sm:gap-4'          // Spacious
```

---

## 🎨 CUSTOM COLORS - PROPERTI YANG TERSEDIA

Gunakan custom colors untuk semua styling:

```typescript
customColors.primary      // Main color
customColors.secondary    // Supporting color
customColors.text         // Text color (USE var(--custom-text-color)!)
customColors.accent       // Accent/highlight color
customColors.background   // Background color

// Extended properties
customColors.tertiary     // 3rd gradient color
customColors.quaternary   // 4th gradient color
customColors.glow         // Glow/shadow effects
customColors.highlight    // Shine/reflection effects
customColors.shadow       // Drop shadow color
customColors.border       // Border color

// Gradient config
customColors.gradientType      // 'linear' | 'radial' | 'conic'
customColors.gradientDirection // 'to right', '45deg', etc
```

---

## ⚠️ WAJIB - TEXT COLOR STANDARDIZATION

**SELALU gunakan CSS variable untuk text color:**

```typescript
// ✅ CORRECT
style={{ color: 'var(--custom-text-color)' }}

// ❌ WRONG - Jangan hardcode!
style={{ color: customColors?.text || '#ffffff' }}
style={{ color: '#ffffff' }}
```

**Exception:** Untuk effects yang butuh actual color value:
```typescript
// ✅ OK - untuk shadow/filter effects
textShadow: `0 0 10px ${customColors?.text || '#ffffff'}80`
filter: `drop-shadow(0 0 8px ${customColors?.text || '#ffffff'})`
```

---

## 🎯 FALLBACK COLORS

Selalu provide fallback untuk saat customColors tidak ada:

```typescript
background: customColors
  ? `linear-gradient(to right, ${customColors.primary}, ${customColors.secondary})`
  : 'linear-gradient(to right, #3b82f6, #8b5cf6)',  // ⬅️ Default fallback

borderColor: customColors?.border || '#3b82f6',

boxShadow: customColors
  ? `0 4px 15px ${customColors.glow}40`
  : '0 4px 15px rgba(59, 130, 246, 0.25)',
```

---

## 🎨 EXAMPLE: Complete New Style

```typescript
// Neon Pulse - Cyberpunk-style pulsing neon button
if (style === 'neon-pulse') {
  return (
    <button
      key={item.id || index}
      className={cn(
        baseClasses,
        'h-12 sm:h-16 px-4 sm:px-8 relative group overflow-visible rounded-md',
        'transition-all duration-300 hover:scale-105 active:scale-95'
      )}
      onClick={() => handleLinkClick(item)}
      disabled={isEditing}
    >
      {/* Neon glow background */}
      <div
        className="absolute inset-0 rounded-md"
        style={{
          background: customColors?.background || '#0a0a0a',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: customColors?.primary || '#00fff0',
          boxShadow: customColors
            ? `0 0 20px ${customColors.glow}, 0 0 40px ${customColors.glow}60, inset 0 0 10px ${customColors.glow}40`
            : '0 0 20px #00fff0, 0 0 40px #00fff060, inset 0 0 10px #00fff040'
        }}
      />

      {/* Pulse animation */}
      <div
        className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"
        style={{
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: customColors?.accent || '#ff00ff',
          filter: 'blur(4px)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 h-full">
        {item.icon && (
          <span
            className="text-lg sm:text-2xl"
            style={{
              color: 'var(--custom-text-color)',
              filter: `drop-shadow(0 0 8px ${customColors?.text || '#ffffff'})`
            }}
          >{item.icon}</span>
        )}
        <span
          className="text-sm sm:text-base font-bold uppercase tracking-wider truncate"
          style={{
            color: 'var(--custom-text-color)',
            textShadow: `0 0 10px ${customColors?.text || '#ffffff'}80`
          }}
        >
          {item.title}
        </span>
      </div>
    </button>
  )
}
```

---

## ✅ TESTING CHECKLIST

Setelah implementasi, test:

- [ ] **Mobile (320px)** - iPhone SE, elements tidak terlalu besar
- [ ] **Mobile (375px)** - iPhone 12/13, text readable
- [ ] **Tablet (768px)** - iPad, scaling proper
- [ ] **Desktop (1280px+)** - Full size, semua effects terlihat
- [ ] **Hover effects** - Smooth transitions
- [ ] **Custom colors** - Apply via color picker
- [ ] **Thumbnail** - Ditampilkan jika ada
- [ ] **Icon** - Ditampilkan jika ada
- [ ] **Long text** - Title truncates properly
- [ ] **Text visibility** - Text jelas terbaca di semua backgrounds

---

## 📝 COMMIT MESSAGE FORMAT

```bash
git add .
git commit -m "feat(linkstyle): add [STYLE_NAME] link style

- Add [style-name] to LinkListStyle type
- Add template to STYLE_TEMPLATES array
- Implement mobile-first responsive design
- Support all 13 custom color properties
- Use standardized text color variable
- Category: [basic|modern|creative|game|culinary]
"
```

---

## 🚀 QUICK REFERENCE

**Minimum Requirements:**
1. ✅ Mobile-first responsive (h-, px-, text- sizes)
2. ✅ Use `var(--custom-text-color)` for all text
3. ✅ Support all customColors properties
4. ✅ Fallback colors when customColors undefined
5. ✅ Truncate long text with `truncate`
6. ✅ Touch-friendly (min 48px height on mobile)
7. ✅ Smooth transitions and hover effects

**Best Practices:**
- Use `group` and `group-hover:` for interactive effects
- Use `relative` + `absolute` for layered designs
- Use `z-10` for content layer to stay on top
- Use `flex-shrink-0` for icons/thumbnails
- Use `transform` for scale/rotate effects
- Use `transition-all duration-300` for smooth animations

---

## 💡 INSPIRATION CATEGORIES

**Basic Styles:**
- Simple, clean, minimal
- Focus on readability
- Subtle effects

**Modern Styles:**
- Gradients, shadows
- Glass morphism, neumorphism
- Contemporary design trends

**Creative Styles:**
- Unique visual effects
- Artistic elements
- Playful animations

**Game Styles:**
- Gaming aesthetics (RPG, FPS, etc)
- Bold, energetic
- Thematic decorations

**Culinary Styles:**
- Food & beverage themes
- Warm, inviting colors
- Thematic icons/decorations

---

**Status:** Ready to use! 🎨✨

Copy template ini setiap kali mau add style baru untuk ensure consistency!
