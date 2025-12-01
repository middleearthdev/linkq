# Background Migration Mapping

## Template Background Mapping (Old → New)

| Line | Old Background | New Background Key | Template |
|------|---------------|-------------------|----------|
| 330 | `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)` | `gradient-soft-clouds` | Classic |
| 380 | `linear-gradient(135deg, #3A3A3A 0%, #2A2A2A 100%)` | `gradient-carbon-fiber` | Dark Mode |
| 445 | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` | `gradient-ocean-breeze` | Aurora |
| 497 | `linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)` | `gradient-pearl-white` | Minimal |
| 553 | `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)` | `gradient-aurora-borealis` | Neon |
| 620 | `linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)` | `gradient-dark-ocean` | Cyberpunk |
| 683 | `linear-gradient(135deg, #1a0028 0%, #4c0080 50%, #ff0080 100%)` | `gradient-cyberpunk-night` | Vaporwave |
| 717 | `linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 50%, #34d399 100%)` | `gradient-mint-fresh` | Nature |
| 751 | `linear-gradient(135deg, #f0f9ff 0%, #7dd3fc 50%, #0ea5e9 100%)` | `gradient-aqua-splash` | Ocean |
| 785 | `linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #f97316 100%)` | `gradient-peachy-keen` | Sunset |
| 819 | `linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f23 100%)` | `gradient-space-void` | Retro Gaming |
| 853 | `linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)` | `gradient-pearl-white` | Elegant |
| 887 | `linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)` | `gradient-lavender-dream` | Sakura |
| 921 | `linear-gradient(135deg, #0a0a0a 0%, #7c2d12 50%, #facc15 100%)` | `gradient-electric-violet` | Electric Music |
| 955 | `linear-gradient(135deg, #f0f9ff 0%, #bae6fd 50%, #06b6d4 100%)` | `gradient-pastel-sky` | Sky Blue |
| 989 | `linear-gradient(135deg, #fef2f2 0%, #fecaca 50%, #dc2626 100%)` | `gradient-cherry-blossom` | Coral Red |
| 1023 | `linear-gradient(135deg, #0c0a1e 0%, #1e1b4b 50%, #312e81 100%)` | `gradient-midnight-city` | Royal Blue |
| 1057 | `linear-gradient(135deg, #fef7ed 0%, #fed7aa 50%, #fdba74 100%)` | `gradient-desert-sand` | Warm Peach |
| 1091 | `linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #e5e7eb 100%)` | `gradient-pearl-white` | Minimalist Pro |
| 1125 | `linear-gradient(135deg, #ecfeff 0%, #67e8f9 50%, #22d3ee 100%)` | `gradient-aqua-splash` | Cyan Dream |
| 1159 | `url("...")` | `image-custom` + `backgroundImage` | Mountain Escape |
| 1199 | `linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)` | `gradient-pastel-sky` | Student Portfolio |
| 1259 | `linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)` | `gradient-desert-sand` | Entrepreneur Startup |
| 1318 | `linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)` | `gradient-cherry-blossom` | Restaurant Menu |
| 1388 | `linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)` | `gradient-lavender-dream` | Wedding Event |
| 1457 | `linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)` | `gradient-space-void` | Developer Tech |

## Migration Pattern

### OLD Format:
```typescript
defaults: {
  tokens: {
    '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '--primary-color': '#667eea',
    // ... other tokens
  }
}
```

### NEW Format:
```typescript
defaults: {
  backgroundKey: 'gradient-ocean-breeze',
  tokens: {
    '--primary-color': '#667eea',
    // ... other tokens (no --background)
  }
}
```

## Special Case: Image Background (Mountain Escape)

### OLD:
```typescript
'--background': 'url("https://images.unsplash.com/...") center/cover fixed',
'--background-overlay': 'rgba(0, 0, 0, 0.3)',
```

### NEW:
```typescript
backgroundKey: 'image-custom',
backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
tokens: {
  '--background-overlay': 'rgba(0, 0, 0, 0.3)',
  // ... other tokens
}
```
