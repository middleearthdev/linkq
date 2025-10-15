/**
 * Editor Sidebar Component
 * Contains block library and template settings
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Settings, Palette, Eye } from "lucide-react"
import { BLOCK_REGISTRY } from "@/components/blocks/registry"
import { UserEntitlements } from "@/types"

interface EditorSidebarProps {
  entitlements: UserEntitlements
  onAddBlock: (blockType: string) => void
  onPreview: () => void
}

export function EditorSidebar({ entitlements, onAddBlock, onPreview }: EditorSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const availableBlocks = Object.entries(BLOCK_REGISTRY).filter(([type]) => 
    entitlements.blocks.includes(type)
  )

  const premiumBlocks = Object.entries(BLOCK_REGISTRY).filter(([type]) => 
    !entitlements.blocks.includes(type)
  )

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Site Editor</h2>
          <Button size="sm" variant="outline" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="blocks" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="blocks">Blocks</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="blocks" className="space-y-4 mt-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Available Blocks</h3>
                <div className="space-y-2">
                  {availableBlocks.map(([type, definition]) => (
                    <Card key={type} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{definition.name}</CardTitle>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => onAddBlock(type)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-xs">
                          {definition.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {premiumBlocks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Premium Blocks</h3>
                  <div className="space-y-2">
                    {premiumBlocks.map(([type, definition]) => (
                      <Card key={type} className="opacity-60">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2">
                              {definition.name}
                              <Badge variant="secondary" className="text-xs">
                                {definition.requiredPlan}
                              </Badge>
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="text-xs">
                            {definition.description}
                          </CardDescription>
                          <Button size="sm" variant="outline" className="mt-2 w-full">
                            Upgrade to Add
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="design" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Color Scheme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Color palette options */}
                    <div className="aspect-square bg-blue-500 rounded cursor-pointer border-2 border-transparent hover:border-gray-300" />
                    <div className="aspect-square bg-green-500 rounded cursor-pointer border-2 border-transparent hover:border-gray-300" />
                    <div className="aspect-square bg-purple-500 rounded cursor-pointer border-2 border-transparent hover:border-gray-300" />
                    <div className="aspect-square bg-red-500 rounded cursor-pointer border-2 border-transparent hover:border-gray-300" />
                    <div className="aspect-square bg-yellow-500 rounded cursor-pointer border-2 border-transparent hover:border-gray-300" />
                    <div className="aspect-square bg-pink-500 rounded cursor-pointer border-2 border-transparent hover:border-gray-300" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Typography</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Font Family
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Font Size
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Site Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Site Title
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Description
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Handle/URL
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    SEO Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Advanced</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Custom CSS
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Analytics
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}