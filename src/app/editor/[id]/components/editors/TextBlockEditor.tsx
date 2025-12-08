/**
 * Text Block Editor Component
 * Simplified inline editor for text block with minimal formatting options
 */

import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react"

interface Block {
  id: string
  type: string
  props: any
}

interface TextBlockEditorProps {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
}

export function TextBlockEditor({
  block,
  onUpdateBlock
}: TextBlockEditorProps) {
  const updateField = (field: string, value: any) => {
    onUpdateBlock(block.id, {
      ...block.props,
      [field]: value
    })
  }

  const currentAlign = block.props.align || 'left'
  const currentWeight = block.props.weight || 'normal'

  const alignOptions = [
    { value: 'left', icon: AlignLeft, label: 'Left' },
    { value: 'center', icon: AlignCenter, label: 'Center' },
    { value: 'right', icon: AlignRight, label: 'Right' },
    { value: 'justify', icon: AlignJustify, label: 'Justify' }
  ]

  const weightOptions = [
    { value: 'light', label: 'Light' },
    { value: 'normal', label: 'Normal' },
    { value: 'medium', label: 'Medium' },
    { value: 'semibold', label: 'Semibold' },
    { value: 'bold', label: 'Bold' }
  ]

  return (
    <div className="px-3 pb-3">
      <div className="p-4 rounded-lg border-2 border-border bg-card space-y-4">
        {/* Content Textarea */}
        <div className="space-y-2">
          <textarea
            value={block.props.content || ''}
            onChange={(e) => updateField('content', e.target.value)}
            placeholder="Enter your text here..."
            className="w-full h-32 px-3 py-2 text-sm rounded-lg border border-input bg-background resize-y focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        {/* Formatting Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Alignment */}
          <div className="flex-1 space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Text Alignment</label>
            <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-secondary/30 border border-border">
              {alignOptions.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => updateField('align', value)}
                  className={`flex items-center justify-center h-9 rounded-md transition-all ${
                    currentAlign === value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-background/50 text-muted-foreground hover:text-foreground'
                  }`}
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Font Weight */}
          <div className="flex-1 space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Font Weight</label>
            <div className="grid grid-cols-5 gap-1 p-1 rounded-lg bg-secondary/30 border border-border">
              {weightOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => updateField('weight', value)}
                  className={`flex items-center justify-center h-9 px-2 rounded-md transition-all text-xs font-medium ${
                    currentWeight === value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-background/50 text-muted-foreground hover:text-foreground'
                  }`}
                  title={label}
                  style={{ fontWeight: value === 'light' ? 300 : value === 'normal' ? 400 : value === 'medium' ? 500 : value === 'semibold' ? 600 : 700 }}
                >
                  {label.charAt(0)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Character Count */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Simple text formatting</span>
          <span>{(block.props.content || '').length} characters</span>
        </div>
      </div>
    </div>
  )
}
