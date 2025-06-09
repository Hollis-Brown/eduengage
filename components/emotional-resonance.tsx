"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useAIService, type EmotionalState } from "@/lib/ai-service"
import { useToast } from "@/hooks/use-toast"

interface EmotionalResonanceProps {
  studentId: string
  sessionId: string
  children: React.ReactNode
}

export function EmotionalResonance({ studentId, sessionId, children }: EmotionalResonanceProps) {
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null)
  const [showEmpathyPulse, setShowEmpathyPulse] = useState(false)
  const [interactions, setInteractions] = useState({
    typingSpeed: 0,
    taskDelay: 0,
    clickRate: 0,
    timeOnPage: 0,
  })
  const { inferEmotionalState, getMotivationalMessage } = useAIService()
  const { toast } = useToast()
  const interactionTimer = useRef<NodeJS.Timeout | null>(null)
  const lastKeystrokeTime = useRef<number | null>(null)
  const keystrokeCount = useRef(0)
  const clickCount = useRef(0)
  const lastTaskTime = useRef<number | null>(null)
  const pageLoadTime = useRef(Date.now())

  // Track user interactions
  useEffect(() => {
    const trackKeystrokes = (e: KeyboardEvent) => {
      keystrokeCount.current += 1

      const now = Date.now()
      if (lastKeystrokeTime.current) {
        const timeDiff = now - lastKeystrokeTime.current
        // Update typing speed (characters per minute)
        if (timeDiff < 5000) {
          // Ignore long pauses
          const speed = 60000 / timeDiff // Convert to chars per minute
          setInteractions((prev) => ({
            ...prev,
            typingSpeed: (prev.typingSpeed + speed) / 2, // Rolling average
          }))
        }
      }
      lastKeystrokeTime.current = now
    }

    const trackClicks = () => {
      clickCount.current += 1
      setInteractions((prev) => ({
        ...prev,
        clickRate: clickCount.current / ((Date.now() - pageLoadTime.current) / 60000), // Clicks per minute
      }))
    }

    const trackTasks = () => {
      const now = Date.now()
      if (lastTaskTime.current) {
        setInteractions((prev) => ({
          ...prev,
          taskDelay: now - lastTaskTime.current,
        }))
      }
      lastTaskTime.current = now
    }

    const updateTimeOnPage = () => {
      setInteractions((prev) => ({
        ...prev,
        timeOnPage: (Date.now() - pageLoadTime.current) / 1000, // Time in seconds
      }))
    }

    // Set up event listeners
    window.addEventListener("keydown", trackKeystrokes)
    window.addEventListener("click", trackClicks)
    window.addEventListener("submit", trackTasks)
    window.addEventListener("change", trackTasks)

    // Update time on page every 5 seconds
    const timeInterval = setInterval(updateTimeOnPage, 5000)

    return () => {
      window.removeEventListener("keydown", trackKeystrokes)
      window.removeEventListener("click", trackClicks)
      window.removeEventListener("submit", trackTasks)
      window.removeEventListener("change", trackTasks)
      clearInterval(timeInterval)
    }
  }, [])

  // Analyze emotional state periodically
  useEffect(() => {
    const analyzeEmotionalState = async () => {
      try {
        const response = await inferEmotionalState(studentId, sessionId, interactions)

        if (response.data) {
          setEmotionalState(response.data)

          // Show empathy pulse for low/frustrated moods
          if (
            (response.data.inferredMood === "low" || response.data.inferredMood === "frustrated") &&
            Math.random() < 0.7 // 70% chance to show
          ) {
            setShowEmpathyPulse(true)

            // Hide after 8 seconds
            setTimeout(() => {
              setShowEmpathyPulse(false)
            }, 8000)

            // Show toast with motivational message
            toast({
              title: "A little encouragement...",
              description: getMotivationalMessage(response.data.inferredMood),
              variant: "default",
            })
          }
        }
      } catch (error) {
        console.error("Error analyzing emotional state:", error)
      }
    }

    // Analyze every 30 seconds
    interactionTimer.current = setInterval(analyzeEmotionalState, 30000)

    // Initial analysis after 10 seconds
    const initialTimer = setTimeout(analyzeEmotionalState, 10000)

    return () => {
      if (interactionTimer.current) clearInterval(interactionTimer.current)
      clearTimeout(initialTimer)
    }
  }, [studentId, sessionId, interactions, inferEmotionalState, getMotivationalMessage, toast])

  // Apply UI adjustments based on emotional state
  const getEmotionalUIClasses = () => {
    if (!emotionalState) return ""

    switch (emotionalState.inferredMood) {
      case "low":
        return "emotional-state-low" // CSS class defined in globals.css
      case "frustrated":
        return "emotional-state-frustrated"
      case "high":
        return "emotional-state-high"
      case "engaged":
        return "emotional-state-engaged"
      default:
        return ""
    }
  }

  return (
    <div className={`relative ${getEmotionalUIClasses()}`}>
      {children}

      <AnimatePresence>
        {showEmpathyPulse && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 max-w-md"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-blue-500 shadow-glow overflow-hidden">
              <CardContent className="p-4 relative">
                <motion.div
                  className="absolute inset-0 bg-blue-500 opacity-10 rounded-lg"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                <p className="text-sm font-medium relative z-10">
                  {emotionalState && getMotivationalMessage(emotionalState.inferredMood)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
