/**
 * Admin Seeder Script
 * Creates initial admin user
 */

import { PrismaClient } from '../src/generated/prisma/index.js'

const db = new PrismaClient()

async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'middleearthdev@gmail.com'

    console.log(`Creating admin user: ${adminEmail}`)

    // Check if admin exists
    const existingAdmin = await db.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      // Update existing user to admin
      await db.user.update({
        where: { email: adminEmail },
        data: {
          isAdmin: true,
          plan: 'PRO',
          emailVerified: true
        }
      })
      console.log(`✅ Updated existing user to admin: ${adminEmail}`)
    } else {
      // Create new admin user
      await db.user.create({
        data: {
          email: adminEmail,
          name: 'LinkQ Admin',
          isAdmin: true,
          plan: 'PRO',
          emailVerified: true,
        }
      })
      console.log(`✅ Created new admin user: ${adminEmail}`)
    }

    console.log('🎉 Admin seeding completed successfully!')

  } catch (error) {
    console.error('❌ Failed to seed admin:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

// Run seeder
seedAdmin()