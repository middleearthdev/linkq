import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, MessageCircle } from "lucide-react"
import { useEffect } from "react"

interface Block {
    id: string
    type: string
    props: any
}

// WhatsApp Editor Dialog - Fullscreen
export default function WhatsAppEditorDialog({
    whatsappBlock,
    onUpdateBlock,
    onClose
}: {
    whatsappBlock: Block
    onUpdateBlock: (blockId: string, newProps: any) => void
    onClose: () => void
}) {
    // Auto-format phone number untuk Indonesia
    const formatPhoneNumber = (phone: string): string => {
        // Remove all non-numeric characters
        const cleaned = phone.replace(/\D/g, '')

        // Handle empty input
        if (!cleaned) return ''

        // Auto-format berdasarkan pattern
        if (cleaned.startsWith('08')) {
            // 08xxx → +628xxx
            return '+62' + cleaned.substring(1)
        } else if (cleaned.startsWith('628')) {
            // 628xxx → +628xxx
            return '+' + cleaned
        } else if (cleaned.startsWith('62')) {
            // 62xxx → +62xxx
            return '+' + cleaned
        } else if (cleaned.startsWith('8')) {
            // 8xxx → +628xxx
            return '+62' + cleaned
        }

        // Return as is with + prefix if doesn't match pattern
        return cleaned.startsWith('+') ? cleaned : '+' + cleaned
    }

    const updateField = (field: string, value: any) => {
        // Auto-format phone number on blur
        if (field === 'phoneNumber' && value) {
            value = formatPhoneNumber(value)
        }

        onUpdateBlock(whatsappBlock.id, {
            ...whatsappBlock.props,
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
            <div className="flex-shrink-0 border-b bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5">
                <div className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex-shrink-0">
                            <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="font-bold text-base sm:text-lg truncate">WhatsApp Business</h2>
                            <p className="text-xs text-muted-foreground">
                                Configure your floating chat button
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
                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Phone Number</label>
                        <Input
                            value={whatsappBlock.props.phoneNumber || ''}
                            onChange={(e) => onUpdateBlock(whatsappBlock.id, { ...whatsappBlock.props, phoneNumber: e.target.value })}
                            onBlur={(e) => updateField('phoneNumber', e.target.value)}
                            placeholder="081234567890"
                            className="h-10"
                        />
                        <p className="text-xs text-muted-foreground">
                            Type 08xxx and it will auto-format to +628xxx when you finish typing
                        </p>
                    </div>

                    {/* Pre-filled Message */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Pre-filled Message (Optional)</label>
                        <textarea
                            value={whatsappBlock.props.message || ''}
                            onChange={(e) => updateField('message', e.target.value)}
                            placeholder="Hello! I have a question..."
                            className="w-full h-24 px-3 py-2 text-sm rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <p className="text-xs text-muted-foreground">
                            This message will be pre-filled when users click the button
                        </p>
                    </div>

                    {/* Button Text */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Button Text</label>
                        <Input
                            value={whatsappBlock.props.buttonText || 'Chat via WhatsApp'}
                            onChange={(e) => updateField('buttonText', e.target.value)}
                            placeholder="Chat via WhatsApp"
                            className="h-10"
                        />
                    </div>

                    {/* Business Name (Optional) */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Business Name (Optional)</label>
                        <Input
                            value={whatsappBlock.props.businessName || ''}
                            onChange={(e) => updateField('businessName', e.target.value)}
                            placeholder="Your Business"
                            className="h-10"
                        />
                        <p className="text-xs text-muted-foreground">
                            Shows as a badge above the button
                        </p>
                    </div>

                    {/* FAB Position */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Button Position</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => updateField('fabPosition', 'bottom-right')}
                                className={`p-3 rounded-lg border-2 transition-all ${whatsappBlock.props.fabPosition === 'bottom-right' || !whatsappBlock.props.fabPosition
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-border/80'
                                    }`}
                            >
                                <div className="text-sm font-medium">Bottom Right</div>
                                <div className="text-xs text-muted-foreground mt-1">Default position</div>
                            </button>
                            <button
                                onClick={() => updateField('fabPosition', 'bottom-left')}
                                className={`p-3 rounded-lg border-2 transition-all ${whatsappBlock.props.fabPosition === 'bottom-left'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-border/80'
                                    }`}
                            >
                                <div className="text-sm font-medium">Bottom Left</div>
                                <div className="text-xs text-muted-foreground mt-1">Alternative position</div>
                            </button>
                        </div>
                    </div>

                    {/* Enable Pulse Animation */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border">
                        <div>
                            <span className="text-sm font-medium">Pulse Animation</span>
                            <p className="text-xs text-muted-foreground">Animated ring to attract attention</p>
                        </div>
                        <button
                            onClick={() => updateField('enablePulse', !whatsappBlock.props.enablePulse)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${whatsappBlock.props.enablePulse !== false ? 'bg-primary' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${whatsappBlock.props.enablePulse !== false ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t bg-secondary/30 p-4">
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