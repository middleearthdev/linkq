/**
 * Block Editor Component
 * Edit individual block properties
 */

"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Save } from "lucide-react"
import { Block } from "@/types"
import { BLOCK_REGISTRY } from "@/components/blocks/registry"

interface BlockEditorProps {
  block: Block | null
  onSave: (blockId: string, props: any) => void
  onClose: () => void
}

export function BlockEditor({ block, onSave, onClose }: BlockEditorProps) {
  const [isLoading, setIsLoading] = useState(false)

  const blockDefinition = block ? BLOCK_REGISTRY[block.type] : null
  const schema = blockDefinition?.schema

  const form = useForm({
    // TODO: Convert JSON Schema to Zod schema for proper validation
    // resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: block?.props || {}
  })

  useEffect(() => {
    if (block?.props) {
      form.reset(block.props)
    }
  }, [block, form])

  if (!block || !blockDefinition) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Select a block to edit</p>
      </div>
    )
  }

  const handleSave = async (data: any) => {
    setIsLoading(true)
    try {
      onSave(block.id, data)
      onClose()
    } catch (error) {
      console.error("Failed to save block:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderField = (fieldName: string, fieldSchema: any) => {
    const fieldType = fieldSchema.type || fieldSchema._def?.typeName

    switch (fieldType) {
      case 'string':
      case 'ZodString':
        if (fieldSchema._def?.checks?.some((check: any) => check.kind === 'email')) {
          return (
            <Input
              type="email"
              {...form.register(fieldName)}
              placeholder={`Enter ${fieldName}`}
            />
          )
        }
        if (fieldSchema._def?.checks?.some((check: any) => check.kind === 'url')) {
          return (
            <Input
              type="url"
              {...form.register(fieldName)}
              placeholder={`Enter ${fieldName}`}
            />
          )
        }
        if (fieldName.toLowerCase().includes('bio') || fieldName.toLowerCase().includes('description')) {
          return (
            <Textarea
              {...form.register(fieldName)}
              placeholder={`Enter ${fieldName}`}
              rows={3}
            />
          )
        }
        return (
          <Input
            {...form.register(fieldName)}
            placeholder={`Enter ${fieldName}`}
          />
        )

      case 'boolean':
      case 'ZodBoolean':
        return (
          <Switch
            checked={form.watch(fieldName)}
            onCheckedChange={(checked) => form.setValue(fieldName, checked)}
          />
        )

      case 'number':
      case 'ZodNumber':
        return (
          <Input
            type="number"
            {...form.register(fieldName, { valueAsNumber: true })}
            placeholder={`Enter ${fieldName}`}
          />
        )

      case 'array':
      case 'ZodArray':
        return (
          <div className="space-y-2">
            <Textarea
              {...form.register(fieldName)}
              placeholder="Enter items, one per line"
              rows={4}
            />
            <p className="text-xs text-gray-500">
              Add multiple items, one per line
            </p>
          </div>
        )

      default:
        return (
          <Input
            {...form.register(fieldName)}
            placeholder={`Enter ${fieldName}`}
          />
        )
    }
  }

  const getSchemaFields = (schema: any): Record<string, any> => {
    if (schema._def?.shape) {
      return schema._def.shape
    }
    if (schema.shape) {
      return schema.shape
    }
    return {}
  }

  const schemaFields = schema ? getSchemaFields(schema) : {}

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit {blockDefinition.name}</h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {blockDefinition.description}
        </p>
      </div>

      {/* Form */}
      <ScrollArea className="flex-1">
        <form onSubmit={form.handleSubmit(handleSave)} className="p-4 space-y-4">
          {Object.entries(schemaFields).map(([fieldName, fieldSchema]) => (
            <div key={fieldName} className="space-y-2">
              <Label htmlFor={fieldName} className="text-sm font-medium capitalize">
                {fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </Label>
              {renderField(fieldName, fieldSchema)}
              {form.formState.errors[fieldName] && (
                <p className="text-xs text-red-600">
                  {form.formState.errors[fieldName]?.message as string}
                </p>
              )}
            </div>
          ))}

          {/* Save Button */}
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </ScrollArea>
    </div>
  )
}