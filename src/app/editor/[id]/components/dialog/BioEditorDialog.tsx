import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Settings } from "lucide-react"
import { useEffect } from "react"

interface Block {
    id: string
    type: string
    props: any
}

// Bio Editor Dialog - Fullscreen
export default function BioEditorDialog({
    bioBlock,
    onUpdateBlock,
    onClose
}: {
    bioBlock: Block
    onUpdateBlock: (blockId: string, newProps: any) => void
    onClose: () => void
}) {
    const updateBioField = (field: string, value: any) => {
        onUpdateBlock(bioBlock.id, {
            ...bioBlock.props,
            [field]: value
        })
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
                        <h3 className="text-sm font-semibold text-muted-foreground">Profile Picture</h3>

                        {/* Avatar Preview */}
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                                {bioBlock.props.avatar ? (
                                    <img
                                        src={bioBlock.props.avatar}
                                        alt={bioBlock.props.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Settings className="h-10 w-10 text-blue-500/50" />
                                )}
                            </div>
                            <div className="flex-1">
                                <Input
                                    value={bioBlock.props.avatar || ''}
                                    onChange={(e) => updateBioField('avatar', e.target.value)}
                                    placeholder="https://example.com/avatar.jpg"
                                    className="h-10"
                                />
                                <p className="text-[10px] text-muted-foreground mt-1.5">
                                    Paste your image URL (JPG, PNG, WebP)
                                </p>
                            </div>
                        </div>

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
                                {(bioBlock.props.description || '').length} / 160
                            </span>
                        </div>
                        <textarea
                            value={bioBlock.props.description || ''}
                            onChange={(e) => updateBioField('description', e.target.value)}
                            placeholder="Tell people about yourself..."
                            className="w-full h-32 px-4 py-3 text-sm rounded-lg border bg-background resize-none"
                            maxLength={160}
                        />
                        <p className="text-xs text-muted-foreground">
                            A short description about yourself (max 160 characters)
                        </p>
                    </div>

                    {/* Preview Card */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">Preview</h3>
                        <div className="p-6 rounded-xl border-2 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                            <div className="flex flex-col items-center text-center space-y-3">
                                {bioBlock.props.showAvatar && (
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                        {bioBlock.props.avatar ? (
                                            <img
                                                src={bioBlock.props.avatar}
                                                alt={bioBlock.props.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                                                <Settings className="h-12 w-12 text-blue-500/50" />
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-xl font-bold">
                                        {bioBlock.props.name || 'Your Name'}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {bioBlock.props.description || 'Tell people about yourself'}
                                    </p>
                                </div>
                            </div>
                        </div>
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
    )
}