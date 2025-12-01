/**
 * Video Background Presets (Premium Feature)
 * Video backgrounds for immersive experiences
 */

import { VideoBackground } from '../types'

export const VIDEO_PRESETS: Record<string, VideoBackground> = {
  'video-custom': {
    type: 'video',
    name: 'Custom Video',
    preview: '/placeholder-video-preview.jpg', // Placeholder
    value: '', // Will be set by user upload
    overlay: 'rgba(0, 0, 0, 0.3)',
    loop: true,
    muted: true,
    playbackRate: 1.0,
    isPremium: false,
    tags: ['custom', 'video', 'upload'],
  },
  // Example presets (would require actual video files)
  // Users can add their own via upload
}

// Note: Video backgrounds are primarily user-uploaded
// The 'video-custom' preset serves as a template
// Actual video URLs are set via the upload API and stored in the database
