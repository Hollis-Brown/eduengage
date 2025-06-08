"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Palette,
  Pen,
  Square,
  Circle,
  Type,
  Eraser,
  Undo,
  Redo,
  Download,
  Share,
  Users,
  Zap,
  Brain,
  MousePointer,
  Move,
  Trash2,
  Upload,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DrawingTool {
  id: string
  name: string
  icon: any
  color?: string
}

interface Collaborator {
  id: string
  name: string
  avatar: string
  color: string
  cursor: { x: number; y: number }
  isActive: boolean
}

const drawingTools: DrawingTool[] = [
  { id: "pen", name: "Pen", icon: Pen },
  { id: "eraser", name: "Eraser", icon: Eraser },
  { id: "rectangle", name: "Rectangle", icon: Square },
  { id: "circle", name: "Circle", icon: Circle },
  { id: "text", name: "Text", icon: Type },
  { id: "select", name: "Select", icon: MousePointer },
  { id: "move", name: "Move", icon: Move },
]

const colors = [
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#800080",
  "#FFC0CB",
]

const mockCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "Sarah M.",
    avatar: "/placeholder.svg?height=32&width=32",
    color: "#FF6B6B",
    cursor: { x: 150, y: 200 },
    isActive: true,
  },
  {
    id: "2",
    name: "Mike C.",
    avatar: "/placeholder.svg?height=32&width=32",
    color: "#4ECDC4",
    cursor: { x: 300, y: 150 },
    isActive: true,
  },
  {
    id: "3",
    name: "Dr. Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    color: "#45B7D1",
    cursor: { x: 450, y: 300 },
    isActive: false,
  },
]

export function CollaborativeWhiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTool, setSelectedTool] = useState("pen")
  const [selectedColor, setSelectedColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(3)
  const [isDrawing, setIsDrawing] = useState(false)
  const [collaborators, setCollaborators] = useState(mockCollaborators)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Set default styles
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = selectedColor
    ctx.lineWidth = brushSize

    // Clear canvas with white background
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool !== "pen") return
    setIsDrawing(true)

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedTool !== "pen") return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = selectedColor
    ctx.lineWidth = brushSize
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    toast({
      title: "Canvas Cleared",
      description: "The whiteboard has been cleared for all collaborators.",
    })
  }

  const saveWhiteboard = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "whiteboard.png"
    link.href = canvas.toDataURL()
    link.click()

    toast({
      title: "Whiteboard Saved",
      description: "Your whiteboard has been downloaded as an image.",
    })
  }

  const enableAIAssistant = () => {
    setShowAIAssistant(!showAIAssistant)
    toast({
      title: showAIAssistant ? "AI Assistant Disabled" : "AI Assistant Enabled",
      description: showAIAssistant
        ? "AI suggestions are now disabled."
        : "AI will now provide drawing suggestions and improvements.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Palette className="h-6 w-6 text-purple-600" />
            Collaborative Whiteboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time collaborative drawing with AI assistance</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {collaborators.filter((c) => c.isActive).length} active
          </Badge>
          <Button variant="outline" size="sm" onClick={enableAIAssistant}>
            <Brain className="h-4 w-4 mr-2" />
            {showAIAssistant ? "Disable" : "Enable"} AI
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tools Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Drawing Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {drawingTools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTool(tool.id)}
                    className="flex flex-col gap-1 h-16"
                  >
                    <tool.icon className="h-4 w-4" />
                    <span className="text-xs">{tool.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? "border-gray-900 dark:border-white" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Brush Size */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brush Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">Size: {brushSize}px</div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                <Undo className="h-4 w-4 mr-2" />
                Undo
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Redo className="h-4 w-4 mr-2" />
                Redo
              </Button>
              <Button variant="outline" size="sm" className="w-full" onClick={saveWhiteboard}>
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Load
              </Button>
              <Button variant="destructive" size="sm" className="w-full" onClick={clearCanvas}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </CardContent>
          </Card>

          {/* Collaborators */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Collaborators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {collaborator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          collaborator.isActive ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{collaborator.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: collaborator.color }} />
                        <span className="text-xs text-gray-500">{collaborator.isActive ? "Drawing" : "Viewing"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Drawing Canvas</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  {showAIAssistant && (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <Zap className="h-3 w-3 mr-1" />
                      AI Active
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-2 h-full">
              <div className="relative w-full h-full bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />

                {/* Collaborator Cursors */}
                {collaborators
                  .filter((c) => c.isActive)
                  .map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className="absolute pointer-events-none z-10"
                      style={{
                        left: collaborator.cursor.x,
                        top: collaborator.cursor.y,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                        style={{ backgroundColor: collaborator.color }}
                      />
                      <div
                        className="absolute top-5 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs text-white shadow-lg whitespace-nowrap"
                        style={{ backgroundColor: collaborator.color }}
                      >
                        {collaborator.name}
                      </div>
                    </div>
                  ))}

                {/* AI Suggestions Overlay */}
                {showAIAssistant && (
                  <div className="absolute top-4 right-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 max-w-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">AI Suggestion</span>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Try adding some geometric shapes to organize your ideas better!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Assistant Panel */}
      {showAIAssistant && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI Drawing Assistant
              </CardTitle>
              <CardDescription>Get intelligent suggestions and improvements for your whiteboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="suggestions" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>

                <TabsContent value="suggestions" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Organization</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Consider grouping related concepts with boxes or circles
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Clarity</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Add labels to your diagrams for better understanding
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Flow</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        Use arrows to show relationships and processes
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">Drawing Complexity</span>
                      <Badge>Medium</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">Collaboration Score</span>
                      <Badge className="bg-green-600">High</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">Educational Value</span>
                      <Badge className="bg-blue-600">Excellent</Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="templates" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      "Mind Map",
                      "Flowchart",
                      "Venn Diagram",
                      "Timeline",
                      "Concept Map",
                      "Process Flow",
                      "Org Chart",
                      "Brainstorm",
                    ].map((template) => (
                      <Button key={template} variant="outline" className="h-20 flex flex-col gap-2">
                        <Square className="h-6 w-6" />
                        <span className="text-xs">{template}</span>
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
