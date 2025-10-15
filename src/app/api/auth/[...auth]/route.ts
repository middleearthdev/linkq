/**
 * Better Auth API Routes
 * Handles all authentication endpoints
 */

import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

const handler = toNextJsHandler(auth)

export const { GET, POST } = handler