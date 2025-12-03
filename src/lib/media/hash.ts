/**
 * Image Hash Generation Utility
 * For deduplication in Media Library
 *
 * Based on: MEDIA_LIBRARY_CONTEXT.md
 */

import crypto from 'crypto'

/**
 * Generate SHA-256 hash from buffer
 * Uses first 16 characters for filename uniqueness
 *
 * @param buffer - File buffer
 * @returns Hash string (16 chars)
 *
 * @example
 * const hash = generateImageHash(buffer)
 * // => "a1b2c3d4e5f6g7h8"
 */
export function generateImageHash(buffer: Buffer): string {
  return crypto
    .createHash('sha256')
    .update(buffer)
    .digest('hex')
    .slice(0, 16) // First 16 chars sufficient for uniqueness
}

/**
 * Generate full SHA-256 hash (for verification)
 */
export function generateFullHash(buffer: Buffer): string {
  return crypto
    .createHash('sha256')
    .update(buffer)
    .digest('hex')
}

/**
 * Verify if two buffers have the same hash
 */
export function verifyHash(buffer1: Buffer, buffer2: Buffer): boolean {
  const hash1 = generateImageHash(buffer1)
  const hash2 = generateImageHash(buffer2)
  return hash1 === hash2
}
