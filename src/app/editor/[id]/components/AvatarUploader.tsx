/**
 * Avatar Uploader Component
 * Upload from media library or select from template pictures
 */

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Image as ImageIcon, Check, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AvatarUploaderProps {
  currentAvatar?: string
  onAvatarChange: (url: string) => void
  onClose: () => void
}

// Template avatar pictures
const TEMPLATE_AVATARS = [
  // Abstract/Geometric
  {
    category: "Abstract",
    avatars: [
      "https://api.dicebear.com/7.x/shapes/svg?seed=avatar1",
      "https://api.dicebear.com/7.x/shapes/svg?seed=avatar2",
      "https://api.dicebear.com/7.x/shapes/svg?seed=avatar3",
      "https://api.dicebear.com/7.x/shapes/svg?seed=avatar4",
    ]
  },
  // Avatars
  {
    category: "Characters",
    avatars: [
      "https://api.dicebear.com/7.x/avataaars/svg?seed=char1",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=char2",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=char3",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=char4",
    ]
  },
  // Initials
  {
    category: "Initials",
    avatars: [
      "https://api.dicebear.com/7.x/initials/svg?seed=JD&backgroundColor=3b82f6",
      "https://api.dicebear.com/7.x/initials/svg?seed=AB&backgroundColor=10b981",
      "https://api.dicebear.com/7.x/initials/svg?seed=CD&backgroundColor=f59e0b",
      "https://api.dicebear.com/7.x/initials/svg?seed=EF&backgroundColor=ef4444",
    ]
  },
  // Fun
  {
    category: "Fun",
    avatars: [
      "https://api.dicebear.com/7.x/bottts/svg?seed=bot1",
      "https://api.dicebear.com/7.x/bottts/svg?seed=bot2",
      "https://api.dicebear.com/7.x/fun-emoji/svg?seed=fun1",
      "https://api.dicebear.com/7.x/fun-emoji/svg?seed=fun2",
    ]
  }
]

export function AvatarUploader({ currentAvatar, onAvatarChange, onClose }: AvatarUploaderProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar || "")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB')
      return
    }

    setUploading(true)
    setUploadError("")

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'avatar')

      const response = await fetch('/api/media-library/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      setSelectedAvatar(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleApply = () => {
    if (selectedAvatar) {
      onAvatarChange(selectedAvatar)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b">
          <h3 className="text-lg font-bold">Choose Profile Picture</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your own image or select from templates
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </TabsTrigger>
              <TabsTrigger value="templates">
                <ImageIcon className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-4">
              {/* Current/Selected Avatar Preview */}
              <div className="flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-dashed bg-secondary/20">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                  {selectedAvatar ? (
                    <img
                      src={selectedAvatar}
                      alt="Selected avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
                  )}
                </div>

                <div className="text-center space-y-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="min-w-[200px]"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WebP • Max 5MB
                  </p>
                </div>

                {uploadError && (
                  <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg">
                    {uploadError}
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              {TEMPLATE_AVATARS.map((category) => (
                <div key={category.category} className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    {category.category}
                  </h4>
                  <div className="grid grid-cols-4 gap-3">
                    {category.avatars.map((avatar, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                          selectedAvatar === avatar
                            ? 'border-primary ring-2 ring-primary/50'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <img
                          src={avatar}
                          alt={`${category.category} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {selectedAvatar === avatar && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="bg-primary rounded-full p-1">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!selectedAvatar || uploading}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}
