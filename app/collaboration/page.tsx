"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CollaborativeWhiteboard } from "@/components/collaborative-whiteboard"
import { RealTimeDocumentEditor } from "@/components/real-time-document-editor"
import { VideoConferenceRoom } from "@/components/video-conference-room"
import { useAuth } from "@/components/auth-provider"
import {
  Users,
  MessageSquare,
  FileText,
  Video,
  Plus,
  Search,
  Clock,
  Send,
  Brain,
  Sparkles,
  Palette,
  Code,
  Image,
  Link,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const collaborationData = {
  activeRooms: [
    {
      id: "1",
      name: "Advanced Mathematics Study Group",
      type: "study-group",
      participants: 12,
      status: "active",
      subject: "Mathematics",
      lastActivity: "2 minutes ago",
      creator: "Dr. Sarah Johnson",
      tools: ["whiteboard", "video", "documents"],
    },
    {
      id: "2",
      name: "Science Project Collaboration",
      type: "project",
      participants: 8,
      status: "active",
      subject: "Physics",
      lastActivity: "5 minutes ago",
      creator: "Prof. Michael Chen",
      tools: ["documents", "video", "screen-share"],
    },
    {
      id: "3",
      name: "Literature Discussion Forum",
      type: "discussion",
      participants: 24,
      status: "scheduled",
      subject: "Literature",
      lastActivity: "1 hour ago",
      creator: "Ms. Emily Rodriguez",
      tools: ["chat", "documents"],
    },
  ],
  recentDocuments: [
    {
      id: "1",
      title: "Calculus Study Notes",
      type: "document",
      collaborators: 5,
      lastEdited: "10 minutes ago",
      status: "editing",
    },
    {
      id: "2",
      title: "Physics Lab Report",
      type: "document",
      collaborators: 3,
      lastEdited: "1 hour ago",
      status: "review",
    },
    {
      id: "3",
      title: "Group Project Presentation",
      type: "presentation",
      collaborators: 8,
      lastEdited: "2 hours ago",
      status: "completed",
    },
  ],
  messages: [
    {
      id: 1,
      user: "Sarah M.",
      message: "Can someone help me with the quadratic formula?",
      time: "2:34 PM",
      avatar: "/placeholder.svg?height=32&width=32",
      reactions: ["👍", "❤️"],
    },
    {
      id: 2,
      user: "AI Assistant",
      message: "I can help with that! The quadratic formula is x = (-b ± √(b²-4ac)) / 2a",
      time: "2:35 PM",
      avatar: "/placeholder.svg?height=32&width=32",
      isAI: true,
      reactions: ["🤖", "👍"],
    },
    {
      id: 3,
      user: "Mike C.",
      message: "Thanks! That's exactly what I needed.",
      time: "2:36 PM",
      avatar: "/placeholder.svg?height=32&width=32",
      reactions: ["👍"],
    },
  ],
}

export default function CollaborationPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("rooms")
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isInVideoCall, setIsInVideoCall] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const joinRoom = (roomId: string) => {
    setSelectedRoom(roomId)
    toast({
      title: "Joined Collaboration Room",
      description: "You've successfully joined the collaboration space!",
    })
  }

  const startVideoCall = () => {
    setIsInVideoCall(true)
    toast({
      title: "Video Call Started",
      description: "Connecting to video conference...",
    })
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the group.",
      })
      setNewMessage("")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-600" />
                Collaboration Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Real-time collaboration with AI-powered tools and insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search rooms, documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Room
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Rooms</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Live Documents</p>
                    <p className="text-2xl font-bold">34</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Video className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Video Sessions</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Brain className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI Assists</p>
                    <p className="text-2xl font-bold">156</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
            <TabsTrigger value="video">Video Calls</TabsTrigger>
            <TabsTrigger value="chat">Group Chat</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {collaborationData.activeRooms.map((room) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{room.name}</CardTitle>
                          <CardDescription>{room.subject}</CardDescription>
                        </div>
                        <Badge
                          variant={room.status === "active" ? "default" : "secondary"}
                          className={room.status === "active" ? "bg-green-600" : ""}
                        >
                          {room.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {room.participants} participants
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {room.lastActivity}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Tools:</span>
                          <div className="flex gap-1">
                            {room.tools.includes("whiteboard") && (
                              <Badge variant="outline" className="text-xs">
                                <Palette className="h-3 w-3 mr-1" />
                                Whiteboard
                              </Badge>
                            )}
                            {room.tools.includes("video") && (
                              <Badge variant="outline" className="text-xs">
                                <Video className="h-3 w-3 mr-1" />
                                Video
                              </Badge>
                            )}
                            {room.tools.includes("documents") && (
                              <Badge variant="outline" className="text-xs">
                                <FileText className="h-3 w-3 mr-1" />
                                Docs
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">Created by {room.creator}</div>

                        <Button className="w-full" onClick={() => joinRoom(room.id)}>
                          Join Room
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Create New Room */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Collaboration Room</CardTitle>
                <CardDescription>Set up a new space for group work and discussions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-24 flex flex-col gap-2">
                    <Users className="h-6 w-6" />
                    <span>Study Group</span>
                  </Button>
                  <Button className="h-24 flex flex-col gap-2" variant="outline">
                    <FileText className="h-6 w-6" />
                    <span>Project Room</span>
                  </Button>
                  <Button className="h-24 flex flex-col gap-2" variant="outline">
                    <MessageSquare className="h-6 w-6" />
                    <span>Discussion Forum</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <RealTimeDocumentEditor />
          </TabsContent>

          <TabsContent value="whiteboard" className="space-y-6">
            <CollaborativeWhiteboard />
          </TabsContent>

          <TabsContent value="video" className="space-y-6">
            <VideoConferenceRoom isActive={isInVideoCall} onStart={startVideoCall} />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Messages */}
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Group Discussion
                    </CardTitle>
                    <CardDescription>Real-time chat with AI moderation</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {collaborationData.messages.map((message) => (
                        <div key={message.id} className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {message.isAI
                                ? "AI"
                                : message.user
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{message.user}</span>
                              {message.isAI && <Brain className="h-3 w-3 text-blue-500" />}
                              <span className="text-xs text-gray-500">{message.time}</span>
                            </div>
                            <p className="text-sm">{message.message}</p>
                            {message.reactions && (
                              <div className="flex gap-1 mt-2">
                                {message.reactions.map((reaction, index) => (
                                  <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                    {reaction}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      />
                      <Button onClick={sendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chat Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Online Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "Sarah M.", status: "online", role: "Student" },
                        { name: "Mike C.", status: "online", role: "Student" },
                        { name: "Dr. Johnson", status: "online", role: "Instructor" },
                        { name: "AI Assistant", status: "online", role: "AI" },
                        { name: "Emma L.", status: "away", role: "Student" },
                      ].map((member, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                member.status === "online" ? "bg-green-500" : "bg-yellow-500"
                              }`}
                            ></div>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Moderation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Active</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          AI is monitoring for inappropriate content and providing helpful suggestions.
                        </p>
                      </div>
                      <Button size="sm" className="w-full">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Get AI Summary
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Brain className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle>AI Moderator</CardTitle>
                  <CardDescription>Intelligent discussion moderation and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Enable AI Moderation</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle>Smart Summarizer</CardTitle>
                  <CardDescription>Automatic meeting and discussion summaries</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Generate Summary</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Code className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <CardTitle>Code Collaborator</CardTitle>
                  <CardDescription>AI-assisted coding and debugging</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Coding</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Image className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                  <CardTitle>Visual Generator</CardTitle>
                  <CardDescription>AI-powered diagrams and visualizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Create Visual</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Link className="h-12 w-12 text-red-600 mx-auto mb-2" />
                  <CardTitle>Resource Finder</CardTitle>
                  <CardDescription>AI-curated learning resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Find Resources</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <MessageSquare className="h-12 w-12 text-indigo-600 mx-auto mb-2" />
                  <CardTitle>Translation Hub</CardTitle>
                  <CardDescription>Real-time language translation</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Enable Translation</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
