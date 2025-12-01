# Quick Prompt: Tambah Link Style Baru

Copy prompt ini dan ganti [PLACEHOLDER] dengan value yang sesuai:

---

## 📋 PROMPT UNTUK AI/DEVELOPER:

```
Tambahkan link style baru ke LinkListBlock dengan spesifikasi berikut:

**Style Name:** [NAMA_STYLE]
**Display Name:** [Display Name]
**Category:** [basic/modern/creative/game/culinary]
**Description:** [Deskripsi singkat style ini]

**Visual Concept:**
[Jelaskan konsep visual - contoh: "Neon cyberpunk style dengan glow effect dan pulsing animation"]

**Color Palette:**
- Primary: [#hex_color]
- Secondary: [#hex_color]
- Accent: [#hex_color]
- (optional) Additional colors...

**Key Features:**
- [Feature 1 - contoh: "Glowing border with pulsing animation"]
- [Feature 2 - contoh: "Gradient background"]
- [Feature 3 - contoh: "Scale on hover"]

**REQUIREMENTS:**
✅ Mobile-first responsive design
✅ Button height: h-12 sm:h-[14/16/20/24] (pilih sesuai design)
✅ Padding: px-4 sm:px-[6/8/10] (pilih sesuai design)
✅ Icon size: text-lg sm:text-[xl/2xl/3xl] (pilih sesuai design)
✅ Title size: text-sm sm:text-[base/lg/xl] (pilih sesuai design)
✅ Use var(--custom-text-color) untuk semua text
✅ Support all 13 customColors properties
✅ Fallback colors jika customColors undefined
✅ Truncate text dengan class "truncate"
✅ Min 48px touch target di mobile

**Implementation Steps:**
1. Tambah type ke LinkListStyle (src/lib/link-list-styles.ts ~line 7-22)
2. Tambah template ke STYLE_TEMPLATES array (~line 126+)
3. Tambah implementation ke LinkListBlock.tsx (~line 5000+)
4. Follow mobile-first standards dari ADD_NEW_LINKSTYLE_TEMPLATE.md
5. Test di mobile (320px, 375px), tablet (768px), desktop (1280px+)
```

---

## 🎯 CONTOH LENGKAP:

```
Tambahkan link style baru ke LinkListBlock dengan spesifikasi berikut:

**Style Name:** paper-torn
**Display Name:** Paper Torn
**Category:** creative
**Description:** Rustic paper-torn edge effect with vintage aesthetics

**Visual Concept:**
Hand-torn paper effect dengan edges yang irregular, shadow untuk depth, dan vintage color palette. Hover menambah slight lift effect.

**Color Palette:**
- Primary: #d4a574 (warm tan)
- Secondary: #8b7355 (brown)
- Accent: #f5e6d3 (cream)
- Background: #faf8f5 (off-white)

**Key Features:**
- Torn paper edges menggunakan clip-path atau SVG
- Subtle shadow untuk paper lift effect
- Vintage color palette
- Hover: slight scale dan shadow increase
- Text shadow untuk depth

**REQUIREMENTS:**
✅ Mobile-first responsive design
✅ Button height: h-12 sm:h-16
✅ Padding: px-4 sm:px-8
✅ Icon size: text-lg sm:text-xl
✅ Title size: text-sm sm:text-base
✅ Use var(--custom-text-color) untuk semua text
✅ Support all 13 customColors properties
✅ Fallback colors jika customColors undefined
✅ Truncate text dengan class "truncate"
✅ Min 48px touch target di mobile

**Implementation Steps:**
1. Tambah 'paper-torn' ke LinkListStyle type
2. Tambah template ke STYLE_TEMPLATES dengan category 'creative'
3. Implement di LinkListBlock.tsx dengan torn edge effect
4. Use clip-path atau pseudo-elements untuk irregular edges
5. Test responsiveness dan text visibility
```

---

## ⚡ ULTRA QUICK TEMPLATE:

Untuk style simple, gunakan template singkat ini:

```
Add new link style: [STYLE_NAME]
- Category: [basic/modern/creative/game/culinary]
- Concept: [Brief description]
- Colors: Primary #[hex], Secondary #[hex]
- Features: [List 2-3 key visual features]
- Size: h-12 sm:h-[?] px-4 sm:px-[?]
- Effects: [hover/animation effects]

Requirements: Mobile-first, use var(--custom-text-color), support customColors, truncate text
```

---

## 📱 SIZE QUICK REFERENCE:

**Copy yang sesuai kebutuhan:**

### Compact Style (Small)
```typescript
'h-12 sm:h-14 px-4 sm:px-6'
'text-base sm:text-lg'  // icon
'text-sm sm:text-base'  // title
```

### Standard Style (Medium) - MOST COMMON
```typescript
'h-12 sm:h-16 px-4 sm:px-8'
'text-lg sm:text-xl'     // icon
'text-sm sm:text-base'   // title
```

### Bold Style (Large)
```typescript
'h-14 sm:h-20 px-4 sm:px-8'
'text-lg sm:text-2xl'    // icon
'text-base sm:text-lg'   // title
```

### Statement Style (Extra Large)
```typescript
'h-16 sm:h-24 px-5 sm:px-10'
'text-xl sm:text-3xl'    // icon
'text-lg sm:text-xl'     // title
```

---

## 🎨 COLOR USAGE QUICK REFERENCE:

**Copy patterns ini:**

### Solid Background
```typescript
background: customColors?.primary || '#3b82f6'
```

### Gradient Background
```typescript
background: customColors
  ? `linear-gradient(to right, ${customColors.primary}, ${customColors.secondary})`
  : 'linear-gradient(to right, #3b82f6, #8b5cf6)'
```

### Border
```typescript
borderColor: customColors?.border || customColors?.primary || '#3b82f6'
```

### Box Shadow / Glow
```typescript
boxShadow: customColors
  ? `0 4px 15px ${customColors.glow}40`
  : '0 4px 15px rgba(59, 130, 246, 0.25)'
```

### Text (ALWAYS USE VAR!)
```typescript
color: 'var(--custom-text-color)'
```

### Text Shadow / Effects
```typescript
textShadow: `0 2px 4px ${customColors?.shadow || 'rgba(0, 0, 0, 0.3)'}`
filter: `drop-shadow(0 0 8px ${customColors?.text || '#ffffff'})`
```

---

## ✅ TESTING COMMAND:

Setelah implement, test dengan:

```bash
# 1. Check compilation
bun run dev

# 2. Open browser
# http://localhost:3001/test/linklist-editor

# 3. Test checklist:
- [ ] Style muncul di dropdown
- [ ] Tampilan di mobile (resize browser ke 320px)
- [ ] Tampilan di desktop (resize ke 1280px+)
- [ ] Apply custom colors via color picker
- [ ] Hover effects smooth
- [ ] Text readable di semua backgrounds
- [ ] Long text truncates properly
- [ ] Icon dan thumbnail terlihat
```

---

**File Referensi Lengkap:** `/ADD_NEW_LINKSTYLE_TEMPLATE.md`

Copy prompt di atas, isi [PLACEHOLDER], dan jalankan! 🚀
