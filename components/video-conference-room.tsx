"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Users,
  MessageSquare,
  Hand,
  Settings,
  Monitor,
  Camera,
  Maximize,
  Minimize,
  Brain,
  Sparkles,
  RepeatIcon as Record,
  Pause,
} from "lucide-react"

interface VideoConferenceRoomProps {
  isActive: boolean
  onStart: () => void
}

const mockParticipants = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    role: "Instructor",
    avatar: "/placeholder.svg?height=40&width=40",
    isHost: true,
    isMuted: false,
    isVideoOn: true,
    isHandRaised: false,
    isPresenting: false,
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Student",
    avatar: "/placeholder.svg?height=40&width=40",
    isHost: false,
    isMuted: true,
    isVideoOn: true,
    isHandRaised: true,
    isPresenting: false,
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    role: "Student",
    avatar: "/placeholder.svg?height=40&width=40",
    isHost: false,
    isMuted: false,
    isVideoOn: false,
    isHandRaised: false,
    isPresenting: false,
  },
  {
    id: "4",
    name: "Alex Thompson",
    role: "Student",
    avatar: "/placeholder.svg?height=40&width=40",
    isHost: false,
    isMuted: true,
    isVideoOn: true,
    isHandRaised: false,
    isPresenting: false,
  },
  {
    id: "5",
    name: "You",
    role: "Student",
    avatar: "/placeholder.svg?height=40&width=40",
    isHost: false,
    isMuted: false,
    isVideoOn: true,
    isHandRaised: false,
    isPresenting: false,
  },
]

const chatMessages = [
  {
    id: 1,
    user: "Dr. Johnson",
    message: "Welcome everyone! Let's start with today's topic on calculus.",
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
  {
    id: 3,
    user: "Michael",
    message: "Can you explain the derivative concept again?",
    time: "2:03 PM",
    isAI: false,
  },
  {
    id: 4,
    user: "Emma",
    message: "The visual examples are really helpful!",
    time: "2:04 PM",
    isAI: false,
  },
]

export function VideoConferenceRoom({ isActive, onStart }: VideoConferenceRoomProps) {
  const [participants, setParticipants] = useState(mockParticipants)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [isPresenting, setIsPresenting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [messages, setMessages] = useState(chatMessages)
  const [activeTab, setActiveTab] = useState("participants")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState(participants[0])
  const videoRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Add these state variables
  const [roomUrl, setRoomUrl] = useState<string>("")
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [availableRooms, setAvailableRooms] = useState<any[]>([])

  // Add this function to create a room
  const createVideoRoom = async () => {
    setIsCreatingRoom(true)
    try {
      const response = await fetch("/api/video/create-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName: `study-session-${Date.now()}`,
          maxParticipants: 10,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create room")
      }

      const data = await response.json()
      setRoomUrl(data.roomUrl)

      toast({
        title: "Room Created!",
        description: `Video room created successfully. Room: ${data.roomName}`,
      })

      onStart() // Start the conference UI
    } catch (error) {
      console.error("Error creating room:", error)
      toast({
        title: "Error",
        description: "Failed to create video room. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingRoom(false)
    }
  }

  // Add this function to load available rooms
  const loadAvailableRooms = async () => {
    try {
      const response = await fetch("/api/video/rooms")
      if (response.ok) {
        const data = await response.json()
        setAvailableRooms(data.rooms)
      }
    } catch (error) {
      console.error("Error loading rooms:", error)
    }
  }

  // Load rooms on component mount
  useEffect(() => {
    loadAvailableRooms()
  }, [])

  const toggleMute = () => {
    setIsMuted(!isMuted)
    toast({
      title: isMuted ? "Microphone On" : "Microphone Off",
      description: isMuted ? "You are now unmuted" : "You are now muted",
    })
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    toast({
      title: isVideoOn ? "Camera Off" : "Camera On",
      description: isVideoOn ? "Your camera is now off" : "Your camera is now on",
    })
  }

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised)
    toast({
      title: isHandRaised ? "Hand Lowered" : "Hand Raised",
      description: isHandRaised ? "Your hand has been lowered" : "Your hand has been raised",
    })
  }

  const startPresenting = () => {
    setIsPresenting(!isPresenting)
    toast({
      title: isPresenting ? "Stopped Presenting" : "Started Presenting",
      description: isPresenting ? "Screen sharing stopped" : "You are now sharing your screen",
    })
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording ? "Session recording has stopped" : "Session is now being recorded",
    })
  }

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: "You",
        message: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isAI: false,
      }
      setMessages([...messages, newMessage])
      setChatMessage("")

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          user: "AI Assistant",
          message: "That's a great question! Let me provide some additional context...",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isAI: true,
        }
        setMessages((prev) => [...prev, aiResponse])
      }, 2000)
    }
  }

  const leaveCall = () => {
    toast({
      title: "Left Conference",
      description: "You have left the video conference",
    })
  }

  if (!isActive) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-6 w-6 text-blue-600" />
              Video Conference Room
            </CardTitle>
            <CardDescription>Start or join video conferences with AI-powered features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                <Video className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Ready to Connect?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Join or start a video conference with advanced AI features including real-time transcription,
                  engagement tracking, and smart moderation.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                <Button onClick={createVideoRoom} className="h-12" disabled={isCreatingRoom}>
                  <Video className="h-5 w-5 mr-2" />
                  {isCreatingRoom ? "Creating Room..." : "Start Conference"}
                </Button>
                <Button variant="outline" className="h-12">
                  <Users className="h-5 w-5 mr-2" />
                  Join Conference
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conference Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Brain className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">AI Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Intelligent meeting moderation with automatic question detection and engagement monitoring
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Live Transcription</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Real-time speech-to-text with automatic translation and searchable transcripts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Smart Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Participation tracking, comprehension analysis, and personalized insights
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`${isFullscreen ? "fixed inset-0 z-50" : ""} bg-gray-900 rounded-lg overflow-hidden`}
    >
      <div className="h-[700px] flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-white font-semibold">Advanced Mathematics Study Session</h2>
            <Badge className="bg-red-600">
              <Record className="h-3 w-3 mr-1" />
              {isRecording ? "Recording" : "Live"}
            </Badge>
            <Badge variant="secondary">{participants.length} participants</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={toggleRecording}>
              {isRecording ? <Pause className="h-4 w-4" /> : <Record className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="ghost">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Video Area */}
          <div className="flex-1 relative bg-gray-900">
            {/* Main Speaker View */}
            <div className="absolute inset-4 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                {selectedParticipant.isVideoOn ? (
                  <div className="relative">
                    <div className="w-64 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Camera className="h-16 w-16 opacity-50" />
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">
                      {selectedParticipant.name}
                    </div>
                    {selectedParticipant.isMuted && (
                      <div className="absolute top-2 right-2 bg-red-600 p-1 rounded">
                        <MicOff className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src={selectedParticipant.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl">
                        {selectedParticipant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{selectedParticipant.name}</h3>
                    <p className="text-gray-400">{selectedParticipant.role}</p>
                  </div>
                )}
              </div>
            </div>

            {roomUrl && (
              <div className="absolute inset-4 bg-white rounded-lg">
                <iframe
                  src={roomUrl}
                  width="100%"
                  height="100%"
                  allow="camera; microphone; fullscreen; speaker; display-capture"
                  className="rounded-lg"
                />
              </div>
            )}

            {/* Participant Thumbnails */}
            <div className="absolute top-4 right-4 space-y-2 max-h-96 overflow-y-auto">
              {participants
                .filter((p) => p.id !== selectedParticipant.id)
                .map((participant) => (
                  <div
                    key={participant.id}
                    className="w-32 h-24 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors relative"
                    onClick={() => setSelectedParticipant(participant)}
                  >
                    {participant.isVideoOn ? (
                      <Camera className="h-6 w-6 text-gray-400" />
                    ) : (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="absolute bottom-1 left-1 text-xs text-white bg-black/50 px-1 rounded">
                      {participant.name.split(" ")[0]}
                    </div>
                    {participant.isMuted && (
                      <div className="absolute top-1 right-1 bg-red-600 p-0.5 rounded">
                        <MicOff className="h-3 w-3" />
                      </div>
                    )}
                    {participant.isHandRaised && (
                      <div className="absolute top-1 left-1 bg-yellow-600 p-0.5 rounded">
                        <Hand className="h-3 w-3" />
                      </div>
                    )}
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
                  <p className="text-xs">
                    Students are showing 85% engagement. Consider adding an interactive poll to maintain momentum.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Controls Bar */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-3 bg-gray-800 rounded-full px-6 py-3">
                <Button
                  size="sm"
                  variant={isMuted ? "destructive" : "secondary"}
                  onClick={toggleMute}
                  className="rounded-full w-12 h-12"
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                <Button
                  size="sm"
                  variant={!isVideoOn ? "destructive" : "secondary"}
                  onClick={toggleVideo}
                  className="rounded-full w-12 h-12"
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>

                <Button
                  size="sm"
                  variant={isHandRaised ? "default" : "secondary"}
                  onClick={toggleHandRaise}
                  className="rounded-full w-12 h-12"
                >
                  <Hand className="h-5 w-5" />
                </Button>

                <Button
                  size="sm"
                  variant={isPresenting ? "default" : "secondary"}
                  onClick={startPresenting}
                  className="rounded-full w-12 h-12"
                >
                  <Monitor className="h-5 w-5" />
                </Button>

                <Button size="sm" variant="destructive" onClick={leaveCall} className="rounded-full w-12 h-12">
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-white dark:bg-gray-900 border-l">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 m-2">
                <TabsTrigger value="participants">People</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="ai">AI Tools</TabsTrigger>
              </TabsList>

              <TabsContent value="participants" className="flex-1 p-2">
                <div className="space-y-2">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{participant.name}</p>
                        <p className="text-xs text-gray-500">{participant.role}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {participant.isHost && (
                          <Badge variant="secondary" className="text-xs">
                            Host
                          </Badge>
                        )}
                        {participant.isHandRaised && <Hand className="h-4 w-4 text-yellow-500" />}
                        {participant.isMuted ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4 text-green-500" />
                        )}
                        {!participant.isVideoOn && <VideoOff className="h-4 w-4 text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="chat" className="flex-1 flex flex-col p-2">
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                  {messages.map((message) => (
                    <div key={message.id} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{message.user}</span>
                        {message.isAI && <Brain className="h-3 w-3 text-blue-500" />}
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-sm">{message.message}</p>
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

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Session Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Engagement:</span>
                        <span className="font-medium text-green-600">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Participation:</span>
                        <span className="font-medium text-blue-600">92%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Questions:</span>
                        <span className="font-medium">12</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
