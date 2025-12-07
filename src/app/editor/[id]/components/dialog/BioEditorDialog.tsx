import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Settings, Upload, Image as ImageIcon, Check } from "lucide-react"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MediaLibraryPicker } from "@/components/media/MediaLibraryPicker"

interface Block {
    id: string
    type: string
    props: any
}

// Template avatar pictures (using DiceBear API for free avatar generation)
const TEMPLATE_AVATARS = [
    // Abstract/Geometric
    {
        category: "Abstract",
        avatars: [
            "https://api.dicebear.com/7.x/shapes/svg?seed=avatar1&backgroundColor=3b82f6",
            "https://api.dicebear.com/7.x/shapes/svg?seed=avatar2&backgroundColor=10b981",
            "https://api.dicebear.com/7.x/shapes/svg?seed=avatar3&backgroundColor=f59e0b",
            "https://api.dicebear.com/7.x/shapes/svg?seed=avatar4&backgroundColor=ef4444",
            "https://api.dicebear.com/7.x/shapes/svg?seed=avatar5&backgroundColor=8b5cf6",
            "https://api.dicebear.com/7.x/shapes/svg?seed=avatar6&backgroundColor=ec4899",
        ]
    },
    // Characters
    {
        category: "Characters",
        avatars: [
            "https://api.dicebear.com/7.x/avataaars/svg?seed=char1",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=char2",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=char3",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=char4",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=char5",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=char6",
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
            "https://api.dicebear.com/7.x/initials/svg?seed=GH&backgroundColor=8b5cf6",
            "https://api.dicebear.com/7.x/initials/svg?seed=IJ&backgroundColor=ec4899",
        ]
    },
    // Fun
    {
        category: "Fun",
        avatars: [
            "https://api.dicebear.com/7.x/bottts/svg?seed=bot1",
            "https://api.dicebear.com/7.x/bottts/svg?seed=bot2",
            "https://api.dicebear.com/7.x/bottts/svg?seed=bot3",
            "https://api.dicebear.com/7.x/fun-emoji/svg?seed=fun1",
            "https://api.dicebear.com/7.x/fun-emoji/svg?seed=fun2",
            "https://api.dicebear.com/7.x/fun-emoji/svg?seed=fun3",
        ]
    },
    // Personas
    {
        category: "Personas",
        avatars: [
            "https://api.dicebear.com/7.x/personas/svg?seed=person1",
            "https://api.dicebear.com/7.x/personas/svg?seed=person2",
            "https://api.dicebear.com/7.x/personas/svg?seed=person3",
            "https://api.dicebear.com/7.x/personas/svg?seed=person4",
            "https://api.dicebear.com/7.x/personas/svg?seed=person5",
            "https://api.dicebear.com/7.x/personas/svg?seed=person6",
        ]
    }
]

// Bio Editor Dialog - Enhanced with Media Library
export default function BioEditorDialog({
    bioBlock,
    onUpdateBlock,
    onClose,
    userPlan = 'FREE'
}: {
    bioBlock: Block
    onUpdateBlock: (blockId: string, newProps: any) => void
    onClose: () => void
    userPlan?: 'FREE' | 'STARTER' | 'PRO'
}) {
    const [selectedAvatar, setSelectedAvatar] = useState<string>(bioBlock.props.avatar || "")
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)

    // Check if user can upload images (STARTER or PRO)
    const canUploadImages = userPlan === 'STARTER' || userPlan === 'PRO'

    const updateBioField = (field: string, value: any) => {
        onUpdateBlock(bioBlock.id, {
            ...bioBlock.props,
            [field]: value
        })
    }

    // Update avatar immediately when selected
    const handleAvatarSelect = (avatarUrl: string) => {
        setSelectedAvatar(avatarUrl)
        updateBioField('avatar', avatarUrl)
    }

    // Handle Media Library selection
    const handleMediaLibrarySelect = (imageUrl: string) => {
        setSelectedAvatar(imageUrl)
        updateBioField('avatar', imageUrl)
        setIsMediaLibraryOpen(false)
    }

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault()
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onClose])

    return (
        <>
            <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex-shrink-0 border-b bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5">
                    <div className="px-4 py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0">
                                <Settings className="h-5 w-5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="font-bold text-base sm:text-lg truncate">Bio Editor</h2>
                                <p className="text-xs text-muted-foreground">
                                    Edit your profile information
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-9 w-9 p-0 flex-shrink-0"
                            title="Close (Esc)"
                        >
                            <Copy className="h-4 w-4 rotate-45" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
                        {/* Avatar Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-muted-foreground">Profile Picture</h3>
                                {!canUploadImages && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 font-medium">
                                        STARTER or PRO to upload
                                    </span>
                                )}
                            </div>

                            {/* Tabs for Avatar Selection */}
                            <Tabs defaultValue={canUploadImages ? "upload" : "templates"} className="w-full">
                                <TabsList className={`grid w-full ${canUploadImages ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                    {canUploadImages && (
                                        <TabsTrigger value="upload">
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload Image
                                        </TabsTrigger>
                                    )}
                                    <TabsTrigger value="templates">
                                        <ImageIcon className="h-4 w-4 mr-2" />
                                        Template Pictures
                                    </TabsTrigger>
                                </TabsList>

                                {/* Upload Tab (STARTER/PRO only) */}
                                {canUploadImages && (
                                    <TabsContent value="upload" className="space-y-4 mt-4">
                                        {/* Avatar Preview */}
                                        <div className="flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-dashed bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                                                {selectedAvatar ? (
                                                    <img
                                                        src={selectedAvatar}
                                                        alt="Selected avatar"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-16 w-16 text-blue-500/50" />
                                                )}
                                            </div>

                                            <div className="text-center space-y-2 w-full">
                                                <Button
                                                    onClick={() => setIsMediaLibraryOpen(true)}
                                                    className="min-w-[200px]"
                                                >
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Choose from Library
                                                </Button>
                                                <p className="text-xs text-muted-foreground">
                                                    Upload or select from your Media Library
                                                </p>
                                                {selectedAvatar && (
                                                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                        ✓ Image selected and saved
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="text-xs text-muted-foreground space-y-1 p-4 rounded-lg bg-secondary/30">
                                            <p>✅ Upload new images or reuse existing ones</p>
                                            <p>✅ Images are automatically compressed</p>
                                            <p>✅ Saved to your Media Library</p>
                                            <p>✅ Can be reused across your site</p>
                                        </div>
                                    </TabsContent>
                                )}

                                {/* Templates Tab */}
                                <TabsContent value="templates" className="space-y-6 mt-4">
                                    <div className="text-sm text-muted-foreground mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                                        💡 <strong>Free for all users!</strong> Click any avatar below to select it.
                                    </div>

                                    {TEMPLATE_AVATARS.map((category) => (
                                        <div key={category.category} className="space-y-3">
                                            <h4 className="text-sm font-semibold text-muted-foreground">
                                                {category.category}
                                            </h4>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                                {category.avatars.map((avatar, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleAvatarSelect(avatar)}
                                                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${selectedAvatar === avatar
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

                            {/* Show Avatar Toggle */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border">
                                <div>
                                    <span className="text-sm font-medium">Show Avatar</span>
                                    <p className="text-xs text-muted-foreground">Display profile picture on your page</p>
                                </div>
                                <button
                                    onClick={() => updateBioField('showAvatar', !bioBlock.props.showAvatar)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${bioBlock.props.showAvatar ? 'bg-primary' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${bioBlock.props.showAvatar ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Name Section */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground">Name</h3>
                            <Input
                                value={bioBlock.props.name || ''}
                                onChange={(e) => updateBioField('name', e.target.value)}
                                placeholder="Your Name"
                                className="h-11 text-base"
                            />
                        </div>

                        {/* Bio Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-muted-foreground">Bio</h3>
                                <span className="text-xs text-muted-foreground">
                                    {(bioBlock.props.bio || '').length} / 160
                                </span>
                            </div>
                            <textarea
                                value={bioBlock.props.bio || ''}
                                onChange={(e) => updateBioField('bio', e.target.value)}
                                placeholder="Tell people about yourself..."
                                className="w-full h-32 px-4 py-3 text-sm rounded-lg border bg-background resize-none"
                                maxLength={160}
                            />
                            <p className="text-xs text-muted-foreground">
                                A short description about yourself (max 160 characters)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 border-t bg-card p-4">
                    <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
                        <p className="text-xs text-muted-foreground">
                            Press <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs">Esc</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs">⌘S</kbd> to close
                        </p>
                        <Button onClick={onClose} className="min-w-[100px]">
                            Done
                        </Button>
                    </div>
                </div>
            </div>

            {/* Media Library Picker */}
            {canUploadImages && (
                <MediaLibraryPicker
                    isOpen={isMediaLibraryOpen}
                    onClose={() => setIsMediaLibraryOpen(false)}
                    onSelect={handleMediaLibrarySelect}
                    category="avatar"
                    referenceId={`bio:${bioBlock.id}:avatar`}
                    currentImage={selectedAvatar}
                    title="Choose Profile Picture"
                />
            )}
        </>
    )
}
