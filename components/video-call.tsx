"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff } from "lucide-react"

interface VideoCallProps {
  roomName: string
}

export function VideoCall({ roomName }: VideoCallProps) {
  const [isInCall, setIsInCall] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const callFrameRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Daily.co script
    const script = document.createElement("script")
    script.src = "https://unpkg.com/@daily-co/daily-js"
    script.onload = () => {
      console.log("Daily.co script loaded")
    }
    document.head.appendChild(script)

    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy()
      }
    }
  }, [])

  const joinCall = async () => {
    setIsLoading(true)
    try {
      // Create room via API
      const response = await fetch("/api/video/create-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName }),
      })

      const { roomUrl } = await response.json()

      // Initialize Daily.co call frame
      if (window.DailyIframe && containerRef.current) {
        callFrameRef.current = window.DailyIframe.createFrame(containerRef.current, {
          iframeStyle: {
            width: "100%",
            height: "400px",
            border: "none",
            borderRadius: "8px",
          },
        })

        await callFrameRef.current.join({ url: roomUrl })
        setIsInCall(true)
      }
    } catch (error) {
      console.error("Error joining call:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const leaveCall = async () => {
    if (callFrameRef.current) {
      await callFrameRef.current.leave()
      callFrameRef.current.destroy()
      callFrameRef.current = null
    }
    setIsInCall(false)
  }

  const toggleVideo = () => {
    if (callFrameRef.current) {
      callFrameRef.current.setLocalVideo(!isVideoOn)
      setIsVideoOn(!isVideoOn)
    }
  }

  const toggleAudio = () => {
    if (callFrameRef.current) {
      callFrameRef.current.setLocalAudio(!isAudioOn)
      setIsAudioOn(!isAudioOn)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Call - {roomName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={containerRef} className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
          {!isInCall && (
            <div className="text-center">
              <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Click "Join Call" to start the video session</p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-2">
          {!isInCall ? (
            <Button onClick={joinCall} disabled={isLoading} className="gap-2">
              <Phone className="h-4 w-4" />
              {isLoading ? "Joining..." : "Join Call"}
            </Button>
          ) : (
            <>
              <Button variant={isVideoOn ? "default" : "destructive"} onClick={toggleVideo} size="sm">
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button variant={isAudioOn ? "default" : "destructive"} onClick={toggleAudio} size="sm">
                {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button variant="destructive" onClick={leaveCall} size="sm" className="gap-2">
                <PhoneOff className="h-4 w-4" />
                Leave Call
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
