"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  Phone,
  Video,
  Paperclip,
  Smile,
  MoreVertical,
  Check,
  CheckCheck,
  Brain,
  Sparkles,
  Users,
  ImageIcon,
  File,
  Mic,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MessagingService, type ChatMessage, type Conversation } from "@/lib/messaging-service"

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string>("")
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAISuggestions, setShowAISuggestions] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Subscribe to conversations
  useEffect(() => {
    if (!user?.uid) return

    const unsubscribe = MessagingService.subscribeToConversations(user.uid, (conversations) => {
      setConversations(conversations)
      if (conversations.length > 0 && !selectedConversation) {
        setSelectedConversation(conversations[0].id)
      }
    })

    return unsubscribe
  }, [user?.uid])

  // Subscribe to messages in selected conversation
  useEffect(() => {
    if (!selectedConversation) return

    const unsubscribe = MessagingService.subscribeToMessages(selectedConversation, (messages) => {
      setCurrentMessages(messages)
    })

    return unsubscribe
  }, [selectedConversation])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.uid || !selectedConversation) return

    try {
      setIsTyping(true)

      await MessagingService.sendMessage(
        selectedConversation,
        user.uid,
        user.displayName || user.email || "User",
        newMessage,
      )

      setNewMessage("")

      toast({
        title: "Message Sent",
        description: "Your message has been delivered successfully.",
      })

      // If it's an AI conversation, get AI response
      const currentConv = conversations.find((c) => c.id === selectedConversation)
      if (currentConv?.type === "ai") {
        setTimeout(async () => {
          try {
            const response = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                messages: [{ role: "user", content: newMessage }],
                context: `Student asking: ${newMessage}`,
              }),
            })

            const data = await response.json()

            await MessagingService.sendMessage(
              selectedConversation,
              "ai-assistant",
              "AI Learning Assistant",
              data.response,
            )
          } catch (error) {
            console.error("AI response error:", error)
          }
        }, 1000)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTyping(false)
    }
  }

  const selectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
  }

  const currentConversation = conversations.find((c) => c.id === selectedConversation)

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex">
        {/* Sidebar - Conversations List */}
        <div className="w-80 border-r bg-white dark:bg-gray-900 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Messages
              </h2>
              <Button size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  selectedConversation === conversation.id ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200" : ""
                }`}
                onClick={() => selectConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {conversation.type === "ai"
                          ? "AI"
                          : conversation.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.type === "direct" && conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                    {conversation.type === "ai" && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Brain className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{conversation.name}</h3>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    {conversation.role && <p className="text-xs text-gray-500 mb-1">{conversation.role}</p>}
                    {conversation.participants && (
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {conversation.participants} members
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && <Badge className="bg-blue-600 text-white">{conversation.unread}</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b bg-white dark:bg-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentConversation?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {currentConversation?.type === "ai"
                    ? "AI"
                    : currentConversation?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{currentConversation?.name}</h3>
                {currentConversation?.role && <p className="text-sm text-gray-500">{currentConversation.role}</p>}
                {currentConversation?.participants && (
                  <p className="text-sm text-gray-500">{currentConversation.participants} members</p>
                )}
                {currentConversation?.type === "direct" && currentConversation.online && (
                  <p className="text-xs text-green-600">Online</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentConversation?.type === "ai" && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  AI Assistant
                </Badge>
              )}
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Video className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user?.uid ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] ${message.senderId === user?.uid ? "order-2" : "order-1"}`}>
                  {message.senderId !== user?.uid && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{message.senderName}</span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      message.senderId === user?.uid
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    }`}
                  >
                    {message.type === "text" && <p className="text-sm">{message.content}</p>}
                    {message.type === "file" && (
                      <div className="flex items-center gap-3">
                        <File className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">{message.fileName}</p>
                          <p className="text-xs opacity-70">{message.fileSize}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                  {message.senderId === user?.uid && (
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                      {message.status === "delivered" && <Check className="h-3 w-3 text-gray-400" />}
                      {message.status === "read" && <CheckCheck className="h-3 w-3 text-blue-500" />}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {currentConversation?.type === "ai" ? "AI is thinking..." : "Typing..."}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* AI Suggestions */}
          {currentConversation?.type === "ai" && showAISuggestions && (
            <div className="p-4 border-t bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  AI Suggestions
                </span>
                <Button size="sm" variant="ghost" onClick={() => setShowAISuggestions(false)}>
                  ×
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* TODO: Replace with AI suggestions from Firebase */}
                {/* {messagesData.aiSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => setNewMessage(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))} */}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t bg-white dark:bg-gray-900">
            <div className="flex items-end gap-2">
              <Button size="sm" variant="outline">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  className="min-h-[40px] max-h-32 resize-none pr-12"
                />
                <Button size="sm" variant="ghost" className="absolute right-2 bottom-2">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button size="sm" variant="outline">
                <Mic className="h-4 w-4" />
              </Button>
              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
