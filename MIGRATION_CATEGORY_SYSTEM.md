# 🔄 Category System Migration Guide

**Date**: 2025-11-18
**Type**: Database Schema Update
**Impact**: Non-breaking (additive changes only)

---

## 📋 Changes Made

### **1. Database Schema** (`prisma/schema.prisma`)

Added new fields to `Template` model:

```prisma
// New fields added:
primaryCategory   String?  // 'creator', 'umkm', 'fnb', etc.
subCategory       String?  // 'beauty-creator', 'fashion-umkm', etc.
industryTags      String[] // ['food', 'instagram', 'ecommerce']
targetAudience    String[] // ['influencer', 'small-business']
localizedName     Json?    // { en: '...', id: '...' }
localizedDesc     Json?    // { en: '...', id: '...' }
recommendedFor    String[] // Use cases
includesFeatures  String[] // ['whatsapp', 'gallery']
```

All fields are **optional** (nullable) - existing templates won't break!

---

## 🚀 Migration Steps

### **Step 1: Generate Prisma Migration**

```bash
# Generate migration
npx prisma migrate dev --name add_template_categories

# This will:
# 1. Create migration SQL file
# 2. Apply to database
# 3. Regenerate Prisma Client
```

### **Step 2: Verify Migration**

```bash
# Check database schema
npx prisma db pull

# Run TypeScript check
npx tsc --noEmit
```

### **Step 3: Update Seed Data** (Next phase)

The seed.ts will be updated to add category data to existing templates.

---

## 📊 Migration SQL (Preview)

The migration will generate SQL similar to:

```sql
-- AlterTable
ALTER TABLE "templates" ADD COLUMN "primaryCategory" TEXT;
ALTER TABLE "templates" ADD COLUMN "subCategory" TEXT;
ALTER TABLE "templates" ADD COLUMN "industryTags" TEXT[];
ALTER TABLE "templates" ADD COLUMN "targetAudience" TEXT[];
ALTER TABLE "templates" ADD COLUMN "localizedName" JSONB;
ALTER TABLE "templates" ADD COLUMN "localizedDesc" JSONB;
ALTER TABLE "templates" ADD COLUMN "recommendedFor" TEXT[];
ALTER TABLE "templates" ADD COLUMN "includesFeatures" TEXT[];

-- CreateIndex
CREATE INDEX "templates_primaryCategory_idx" ON "templates"("primaryCategory");
CREATE INDEX "templates_subCategory_idx" ON "templates"("subCategory");
```

---

## ✅ Backward Compatibility

**All changes are backward compatible:**
- ✅ Existing templates continue to work
- ✅ All new fields are optional
- ✅ Old `category` field ("free", "premium", "pro") still exists
- ✅ No data loss
- ✅ No breaking changes

---

## 🧪 Testing After Migration

```bash
# 1. Start dev server
npm run dev

# 2. Test existing templates still work
# Visit: http://localhost:3000/templates

# 3. Check database
npx prisma studio
# Verify new columns exist in templates table

# 4. Run seed (after seed.ts is updated)
npx prisma db seed
```

---

## ⚠️ Important Notes

1. **Backup database** before migration (production)
2. **Run on development first** to verify
3. New fields will be `null` for existing templates until seed.ts updated
4. Migration is **additive only** - safe to rollback if needed

---

## 🔄 Rollback (if needed)

If you need to rollback:

```bash
# Revert last migration
npx prisma migrate resolve --rolled-back [migration-name]

# Or restore from backup (production)
```

---

**Status**: Ready to migrate ✅
**Risk Level**: Low (additive changes only)
**Estimated Time**: 1-2 minutes
