"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  FileText,
  Users,
  Save,
  Share2,
  History,
  MessageSquare,
  Eye,
  Bold,
  Italic,
  Underline,
  Code,
  Quote,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  Brain,
  Sparkles,
  Zap,
} from "lucide-react"

const documentData = {
  activeDocuments: [
    {
      id: "1",
      title: "Calculus Study Notes",
      type: "notes",
      collaborators: [
        {
          name: "Sarah M.",
          avatar: "/placeholder.svg?height=32&width=32",
          status: "editing",
          cursor: { x: 45, y: 12 },
        },
        { name: "Mike C.", avatar: "/placeholder.svg?height=32&width=32", status: "viewing", cursor: { x: 78, y: 25 } },
        {
          name: "Emma L.",
          avatar: "/placeholder.svg?height=32&width=32",
          status: "commenting",
          cursor: { x: 23, y: 67 },
        },
      ],
      lastEdited: "2 minutes ago",
      wordCount: 1247,
      status: "editing",
      aiSuggestions: 3,
    },
    {
      id: "2",
      title: "Physics Lab Report",
      type: "report",
      collaborators: [
        {
          name: "Dr. Johnson",
          avatar: "/placeholder.svg?height=32&width=32",
          status: "reviewing",
          cursor: { x: 56, y: 34 },
        },
        { name: "Alex R.", avatar: "/placeholder.svg?height=32&width=32", status: "editing", cursor: { x: 89, y: 45 } },
      ],
      lastEdited: "15 minutes ago",
      wordCount: 2156,
      status: "review",
      aiSuggestions: 1,
    },
    {
      id: "3",
      title: "Group Project Presentation",
      type: "presentation",
      collaborators: [
        {
          name: "Team Alpha",
          avatar: "/placeholder.svg?height=32&width=32",
          status: "editing",
          cursor: { x: 67, y: 78 },
        },
      ],
      lastEdited: "1 hour ago",
      wordCount: 892,
      status: "draft",
      aiSuggestions: 5,
    },
  ],
  recentChanges: [
    {
      id: 1,
      user: "Sarah M.",
      action: "Added equation for quadratic formula",
      time: "2 minutes ago",
      type: "addition",
    },
    {
      id: 2,
      user: "AI Assistant",
      action: "Suggested grammar improvements",
      time: "5 minutes ago",
      type: "suggestion",
    },
    {
      id: 3,
      user: "Mike C.",
      action: "Added comment on methodology",
      time: "8 minutes ago",
      type: "comment",
    },
    {
      id: 4,
      user: "Emma L.",
      action: "Fixed formatting in conclusion",
      time: "12 minutes ago",
      type: "edit",
    },
  ],
  comments: [
    {
      id: 1,
      user: "Dr. Johnson",
      comment: "Great analysis! Consider adding more examples.",
      time: "10 minutes ago",
      resolved: false,
      position: { line: 45, character: 12 },
    },
    {
      id: 2,
      user: "AI Assistant",
      comment: "This section could benefit from a clearer transition.",
      time: "15 minutes ago",
      resolved: false,
      position: { line: 67, character: 8 },
      isAI: true,
    },
    {
      id: 3,
      user: "Sarah M.",
      comment: "Thanks for the feedback! I'll add more examples.",
      time: "8 minutes ago",
      resolved: true,
      position: { line: 45, character: 12 },
    },
  ],
}

export function RealTimeDocumentEditor() {
  const [selectedDocument, setSelectedDocument] = useState(documentData.activeDocuments[0])
  const [editorContent, setEditorContent] = useState(`# ${selectedDocument.title}

## Introduction

This document represents a collaborative effort to understand and explore the fundamental concepts of calculus. Through real-time collaboration and AI-assisted learning, we aim to create comprehensive study materials that benefit all participants.

## Key Concepts

### Derivatives
The derivative of a function represents the rate of change at any given point. For a function f(x), the derivative f'(x) can be calculated using the limit definition:

f'(x) = lim(h→0) [f(x+h) - f(x)] / h

### Integrals
Integration is the reverse process of differentiation. The fundamental theorem of calculus connects these two operations:

∫[a to b] f'(x) dx = f(b) - f(a)

## Applications

Calculus has numerous real-world applications including:
- Physics: Motion, acceleration, and force calculations
- Economics: Optimization problems and marginal analysis
- Engineering: Design optimization and system analysis
- Biology: Population growth models and rate of change

## Collaborative Notes

*[Sarah M. - 2 min ago]: Added the quadratic formula example below*

The quadratic formula: x = (-b ± √(b²-4ac)) / 2a

*[Mike C. - 5 min ago]: Great explanation of the fundamental theorem!*

## Conclusion

Through collaborative learning and AI assistance, we can deepen our understanding of calculus concepts and their practical applications.`)

  const [isEditing, setIsEditing] = useState(true)
  const [showComments, setShowComments] = useState(true)
  const [showAISuggestions, setShowAISuggestions] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("editor")
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  const saveDocument = () => {
    toast({
      title: "Document Saved",
      description: "Your changes have been saved successfully.",
    })
  }

  const shareDocument = () => {
    toast({
      title: "Document Shared",
      description: "Share link copied to clipboard!",
    })
  }

  const applyFormatting = (format: string) => {
    if (!editorRef.current) return

    const textarea = editorRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = editorContent.substring(start, end)

    let formattedText = selectedText
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        break
      case "italic":
        formattedText = `*${selectedText}*`
        break
      case "underline":
        formattedText = `<u>${selectedText}</u>`
        break
      case "code":
        formattedText = `\`${selectedText}\``
        break
      case "quote":
        formattedText = `> ${selectedText}`
        break
    }

    const newContent = editorContent.substring(0, start) + formattedText + editorContent.substring(end)
    setEditorContent(newContent)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start, start + formattedText.length)
    }, 0)
  }

  const insertAISuggestion = (suggestion: string) => {
    const cursorPosition = editorRef.current?.selectionStart || editorContent.length
    const newContent =
      editorContent.substring(0, cursorPosition) +
      `\n\n*[AI Suggestion]: ${suggestion}*\n\n` +
      editorContent.substring(cursorPosition)

    setEditorContent(newContent)
    toast({
      title: "AI Suggestion Added",
      description: "The AI suggestion has been inserted into your document.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Real-Time Document Editor
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Collaborative editing with AI assistance and live feedback
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Document
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Document Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Active Documents
            </CardTitle>
            <CardDescription>Select a document to edit collaboratively</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {documentData.activeDocuments.map((doc) => (
                <Card
                  key={doc.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedDocument.id === doc.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{doc.title}</h3>
                          <p className="text-sm text-gray-500 capitalize">{doc.type}</p>
                        </div>
                        <Badge
                          variant={
                            doc.status === "editing" ? "default" : doc.status === "review" ? "secondary" : "outline"
                          }
                          className={
                            doc.status === "editing" ? "bg-green-600" : doc.status === "review" ? "bg-yellow-600" : ""
                          }
                        >
                          {doc.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {doc.collaborators.slice(0, 3).map((collaborator, index) => (
                            <Avatar key={index} className="h-6 w-6 border-2 border-white">
                              <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {collaborator.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {doc.collaborators.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white flex items-center justify-center">
                              <span className="text-xs">+{doc.collaborators.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{doc.collaborators.length} collaborators</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{doc.wordCount} words</span>
                        <span>{doc.lastEdited}</span>
                      </div>

                      {doc.aiSuggestions > 0 && (
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <Brain className="h-3 w-3" />
                          <span>{doc.aiSuggestions} AI suggestions</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Editor */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Editor */}
            <div className="lg:col-span-3">
              <Card className="h-[700px] flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{selectedDocument.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {selectedDocument.collaborators.length} active
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => applyFormatting("bold")}>
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => applyFormatting("italic")}>
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => applyFormatting("underline")}>
                        <Underline className="h-4 w-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button size="sm" variant="outline" onClick={() => applyFormatting("code")}>
                        <Code className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => applyFormatting("quote")}>
                        <Quote className="h-4 w-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button size="sm" onClick={saveDocument}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={shareDocument}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <div className="relative h-full">
                    <textarea
                      ref={editorRef}
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                      className="w-full h-full p-6 border-0 resize-none focus:outline-none bg-transparent font-mono text-sm leading-relaxed"
                      placeholder="Start typing your document..."
                    />

                    {/* Live Cursors */}
                    {selectedDocument.collaborators.map((collaborator, index) => (
                      <div
                        key={index}
                        className="absolute pointer-events-none"
                        style={{
                          left: `${collaborator.cursor.x}%`,
                          top: `${collaborator.cursor.y}%`,
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="w-0.5 h-4 bg-blue-500 animate-pulse"></div>
                          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {collaborator.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Collaborators */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Active Collaborators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedDocument.collaborators.map((collaborator, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {collaborator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{collaborator.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{collaborator.status}</p>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          collaborator.status === "editing"
                            ? "bg-green-500"
                            : collaborator.status === "viewing"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                        }`}
                      ></div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* AI Suggestions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm">
                          Consider adding a visual diagram to illustrate the derivative concept.
                        </p>
                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() =>
                            insertAISuggestion("Consider adding a visual diagram to illustrate the derivative concept.")
                          }
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm">The conclusion could be strengthened with a summary of key takeaways.</p>
                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() =>
                            insertAISuggestion("The conclusion could be strengthened with a summary of key takeaways.")
                          }
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button size="sm" className="w-full" variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    Get More Suggestions
                  </Button>
                </CardContent>
              </Card>

              {/* Document Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Document Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Words:</span>
                    <span className="font-medium">{selectedDocument.wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Characters:</span>
                    <span className="font-medium">{editorContent.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paragraphs:</span>
                    <span className="font-medium">{editorContent.split("\n\n").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reading time:</span>
                    <span className="font-medium">{Math.ceil(selectedDocument.wordCount / 200)} min</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="h-[700px]">
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
              <CardDescription>Live preview of your formatted document</CardDescription>
            </CardHeader>
            <CardContent className="h-full overflow-y-auto">
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: editorContent.replace(/\n/g, "<br>") }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments & Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {documentData.comments.map((comment) => (
                  <div key={comment.id} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {comment.isAI
                            ? "AI"
                            : comment.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.user}</span>
                          {comment.isAI && <Brain className="h-3 w-3 text-blue-500" />}
                          <span className="text-xs text-gray-500">{comment.time}</span>
                          {comment.resolved ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm">{comment.comment}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            Reply
                          </Button>
                          {!comment.resolved && (
                            <Button size="sm" variant="outline">
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Comment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Select text position</label>
                    <p className="text-xs text-gray-500">Click on the editor to select where to add your comment</p>
                  </div>
                  <textarea
                    className="w-full h-24 p-3 border rounded-lg resize-none"
                    placeholder="Add your comment or suggestion..."
                  />
                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Changes
              </CardTitle>
              <CardDescription>Track all document modifications and collaborator activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentData.recentChanges.map((change) => (
                  <div key={change.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        change.type === "addition"
                          ? "bg-green-500"
                          : change.type === "suggestion"
                            ? "bg-blue-500"
                            : change.type === "comment"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{change.user}</span> {change.action}
                      </p>
                      <p className="text-xs text-gray-500">{change.time}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
