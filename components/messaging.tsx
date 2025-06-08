"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useAuthContext } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageCircle } from "lucide-react"

interface Message {
  id: string
  text: string
  userId: string
  userName: string
  timestamp: Date
  roomId: string
}

interface MessagingProps {
  roomId: string
  roomName: string
}

export function Messaging({ roomId, roomName }: MessagingProps) {
  const { user } = useAuthContext()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Simulate real-time messaging with local state for demo
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    setIsLoading(true)

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      userId: user.uid,
      userName: user.displayName || user.email?.split("@")[0] || "Anonymous",
      timestamp: new Date(),
      roomId,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
    setIsLoading(false)

    // Auto-scroll to bottom
    setTimeout(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
      }
    }, 100)
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Please sign in to participate in the chat.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {roomName}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">No messages yet. Start the conversation!</div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.userId === user.uid ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] ${message.userId === user.uid ? "text-right" : "text-left"}`}>
                  <div className="text-xs text-muted-foreground mb-1">{message.userName}</div>
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      message.userId === user.uid
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
