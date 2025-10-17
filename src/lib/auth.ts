/**
 * Authentication Configuration with Better Auth
 */

import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { db } from "./db"

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieName: "linkq-session",
  },
  advanced: {
    cookiePrefix: "linkq-session"
  },
  user: {
    additionalFields: {
      plan: {
        type: "string",
        defaultValue: "FREE"
      },
      planExpiry: {
        type: "date",
        required: false
      }
    }
  },
  callbacks: {
    async signUp({ user }: { user: any }) {
      // Set default plan for new users
      return {
        ...user,
        plan: "FREE",
        planExpiry: null
      }
    }
  }
})

export type Session = typeof auth.$Infer.Session
// export type User = typeof auth.$Infer.User // User type not available in Better Auth