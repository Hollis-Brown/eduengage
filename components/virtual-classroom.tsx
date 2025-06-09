"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Users,
  MessageSquare,
  Share,
  Hand,
  Camera,
  PhoneOff,
  Brain,
  Sparkles,
  Plus,
  Clock,
  Calendar,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Classroom {
  id: string
  title: string
  instructor: string
  participants: number
  status: "live" | "starting-soon" | "scheduled"
  subject: string
  startTime: string
}

interface VirtualClassroomProps {
  classrooms: Classroom[]
  userRole?: string
}

export function VirtualClassroom({ classrooms, userRole }: VirtualClassroomProps) {
  const [activeClassroom, setActiveClassroom] = useState<string | null>(null)
  const [isInCall, setIsInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      user: "Dr. Johnson",
      message: "Welcome everyone! Let's start with today's topic.",
      time: "2:01 PM",
      isAI: false,
    },
    {
      id: 2,
      user: "AI Assistant",
      message: "I've prepared some interactive examples for today's lesson.",
      time: "2:02 PM",
      isAI: true,
    },
    { id: 3, user: "Sarah M.", message: "Can you explain the quadratic formula again?", time: "2:03 PM", isAI: false },
  ])
  const { toast } = useToast()

  const joinClassroom = (classroomId: string) => {
    setActiveClassroom(classroomId)
    setIsInCall(true)
    toast({
      title: "Joined Classroom",
      description: "You've successfully joined the virtual classroom!",
    })
  }

  const leaveClassroom = () => {
    setActiveClassroom(null)
    setIsInCall(false)
    setIsMuted(false)
    setIsVideoOff(false)
    setIsHandRaised(false)
    toast({
      title: "Left Classroom",
      description: "You've left the virtual classroom.",
    })
  }

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        user: "You",
        message: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isAI: false,
      }
      setChatMessages([...chatMessages, newMessage])
      setChatMessage("")

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: chatMessages.length + 2,
          user: "AI Assistant",
          message: "That's a great question! Let me provide some additional context...",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isAI: true,
        }
        setChatMessages((prev) => [...prev, aiResponse])
      }, 2000)
    }
  }

  if (isInCall && activeClassroom) {
    const classroom = classrooms.find((c) => c.id === activeClassroom)

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-black"
      >
        {/* Main Video Area */}
        <div className="relative h-full flex">
          {/* Video Grid */}
          <div className="flex-1 relative bg-gray-900">
            {/* Main Speaker View */}
            <div className="absolute inset-4 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold">{classroom?.instructor}</h3>
                <p className="text-gray-400">{classroom?.title}</p>
              </div>
            </div>

            {/* Participant Thumbnails */}
            <div className="absolute top-4 right-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-32 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
              ))}
            </div>

            {/* AI Insights Overlay */}
            <div className="absolute bottom-20 left-4 max-w-sm">
              <Card className="bg-blue-900/80 border-blue-500 text-white">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-blue-300" />
                    <span className="text-sm font-medium">AI Insight</span>
                  </div>
                  <p className="text-xs">Students are showing 85% engagement. Consider adding an interactive poll.</p>
                </CardContent>
              </Card>
            </div>

            {/* Controls Bar */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-3 bg-gray-800 rounded-full px-6 py-3">
                <Button
                  size="sm"
                  variant={isMuted ? "destructive" : "secondary"}
                  onClick={() => setIsMuted(!isMuted)}
                  className="rounded-full w-12 h-12"
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                <Button
                  size="sm"
                  variant={isVideoOff ? "destructive" : "secondary"}
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className="rounded-full w-12 h-12"
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>

                <Button
                  size="sm"
                  variant={isHandRaised ? "default" : "secondary"}
                  onClick={() => setIsHandRaised(!isHandRaised)}
                  className="rounded-full w-12 h-12"
                >
                  <Hand className="h-5 w-5" />
                </Button>

                <Button size="sm" variant="secondary" className="rounded-full w-12 h-12">
                  <Share className="h-5 w-5" />
                </Button>

                <Button size="sm" variant="destructive" onClick={leaveClassroom} className="rounded-full w-12 h-12">
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-white dark:bg-gray-900 border-l">
            <Tabs defaultValue="chat" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 m-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="participants">People</TabsTrigger>
                <TabsTrigger value="ai">AI Tools</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 flex flex-col p-2">
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{msg.user}</span>
                        {msg.isAI && <Brain className="h-3 w-3 text-blue-500" />}
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button onClick={sendMessage}>Send</Button>
                </div>
              </TabsContent>

              <TabsContent value="participants" className="flex-1 p-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">DJ</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{classroom?.instructor}</p>
                      <p className="text-xs text-gray-500">Instructor</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      Host
                    </Badge>
                  </div>

                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">S{i}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Student {i}</p>
                        <p className="text-xs text-gray-500">Participant</p>
                      </div>
                      {i === 2 && <Hand className="h-4 w-4 text-yellow-500 ml-auto" />}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ai" className="flex-1 p-2">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        AI Moderator
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button size="sm" className="w-full justify-start">
                        Generate Quiz
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        Summarize Discussion
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        Check Understanding
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Brain className="h-4 w-4 text-blue-500" />
                        Smart Tools
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        Real-time Transcription
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        Language Translation
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        Accessibility Tools
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Virtual Classrooms</h2>
          <p className="text-gray-600 dark:text-gray-400">Join live sessions or schedule new ones</p>
        </div>
        {userRole === "admin" && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Classroom
          </Button>
        )}
      </div>

      {/* Live Classrooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map((classroom) => (
          <Card key={classroom.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{classroom.title}</CardTitle>
                <Badge
                  variant={
                    classroom.status === "live"
                      ? "default"
                      : classroom.status === "starting-soon"
                        ? "secondary"
                        : "outline"
                  }
                  className={
                    classroom.status === "live"
                      ? "bg-green-600"
                      : classroom.status === "starting-soon"
                        ? "bg-yellow-600"
                        : ""
                  }
                >
                  {classroom.status === "live"
                    ? "LIVE"
                    : classroom.status === "starting-soon"
                      ? "Starting Soon"
                      : "Scheduled"}
                </Badge>
              </div>
              <CardDescription>
                {classroom.instructor} • {classroom.subject}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {classroom.participants} participants
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {classroom.startTime}
                  </span>
                </div>

                {classroom.status === "live" && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-300">AI Features Active</span>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-400">
                      Real-time transcription, smart moderation, and engagement tracking enabled
                    </p>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={() => joinClassroom(classroom.id)}
                  disabled={classroom.status === "scheduled"}
                >
                  {classroom.status === "live" ? (
                    <>
                      <Video className="h-4 w-4 mr-2" />
                      Join Now
                    </>
                  ) : classroom.status === "starting-soon" ? (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Join When Ready
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Scheduled
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Classroom Features */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Classroom Features</CardTitle>
          <CardDescription>Powered by AI for enhanced learning experiences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium">AI Moderation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatic question detection, engagement monitoring, and smart responses
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium">Real-time Transcription</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Live captions, translation, and searchable transcripts for accessibility
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium">Smart Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Participation tracking, comprehension analysis, and personalized insights
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
