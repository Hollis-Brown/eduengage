"use client"

import { useCallback, useState } from "react"

// Types for AI responses
export interface AIResponse<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface PathwayNode {
  id: string
  type: "video" | "quiz" | "reading" | "exercise" | "discussion"
  topic: string
  motivation: string
  title: string
  description: string
  completed?: boolean
  unlocked?: boolean
}

export interface LearningPathway {
  pathwayId: string
  studentId: string
  title: string
  description: string
  nodes: PathwayNode[]
  edges: { source: string; target: string }[]
  createdAt: string
  updatedAt: string
}

export interface EmotionalState {
  studentId: string
  sessionId: string
  inferredMood: "high" | "medium" | "low" | "frustrated" | "engaged" | "neutral"
  confidence: number
  typingSpeed?: number
  taskDelay?: number
  callParticipation?: number
  timestamp: string
}

export interface SynthesisNode {
  id: string
  label: string
  children?: string[]
}

export interface DiscussionSynthesis {
  synthesisId: string
  discussionId: string
  title: string
  summary: string
  keyPoints: string[]
  actionItems: string[]
  questions: string[]
  mindMap: {
    nodes: SynthesisNode[]
    edges: { source: string; target: string }[]
  }
  createdAt: string
}

// Mock AI service (can be replaced with actual Grok 3 API when available)
export const useAIService = () => {
  const [isLoading, setIsLoading] = useState(false)

  // Generate a learning pathway based on student data
  const generateLearningPathway = useCallback(
    async (
      studentId: string,
      strengths: string[],
      weaknesses: string[],
      interests: string[],
      recentActivities: string[],
    ): Promise<AIResponse<LearningPathway>> => {
      setIsLoading(true)

      try {
        // In a real implementation, this would call the Grok 3 API
        // For now, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Generate a unique ID for the pathway
        const pathwayId = `pathway_${Date.now()}`

        // Create nodes based on student strengths and weaknesses
        const nodes: PathwayNode[] = []
        const edges: { source: string; target: string }[] = []

        // Add nodes for weaknesses (areas to improve)
        weaknesses.forEach((weakness, index) => {
          const nodeId = `node_${index}`
          nodes.push({
            id: nodeId,
            type: index % 2 === 0 ? "video" : "quiz",
            topic: weakness,
            motivation: `Build your skills in ${weakness}`,
            title: `Master ${weakness} fundamentals`,
            description: `A personalized lesson to help you improve in ${weakness}`,
            unlocked: index === 0, // First node is unlocked
            completed: false,
          })

          // Connect nodes in sequence
          if (index > 0) {
            edges.push({
              source: `node_${index - 1}`,
              target: nodeId,
            })
          }
        })

        // Add nodes for interests (to maintain engagement)
        interests.forEach((interest, index) => {
          const nodeId = `node_${weaknesses.length + index}`
          const prevNodeId = index === 0 ? `node_${weaknesses.length - 1}` : `node_${weaknesses.length + index - 1}`

          nodes.push({
            id: nodeId,
            type: index % 2 === 0 ? "discussion" : "exercise",
            topic: interest,
            motivation: `Explore your interest in ${interest}`,
            title: `Discover more about ${interest}`,
            description: `An engaging activity related to your interest in ${interest}`,
            unlocked: false,
            completed: false,
          })

          edges.push({
            source: prevNodeId,
            target: nodeId,
          })
        })

        const pathway: LearningPathway = {
          pathwayId,
          studentId,
          title: "Your Personalized Learning Journey",
          description: `A custom pathway designed for your unique learning style, focusing on ${weaknesses[0]} and ${interests[0]}`,
          nodes,
          edges,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        return {
          data: pathway,
          loading: false,
          error: null,
        }
      } catch (error) {
        return {
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to generate learning pathway",
        }
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // Analyze student interactions to infer emotional state
  const inferEmotionalState = useCallback(
    async (
      studentId: string,
      sessionId: string,
      interactions: {
        typingSpeed?: number
        taskDelay?: number
        callParticipation?: number
        clickRate?: number
        timeOnPage?: number
      },
    ): Promise<AIResponse<EmotionalState>> => {
      setIsLoading(true)

      try {
        // In a real implementation, this would call the Grok 3 API
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Simple mock logic to infer mood based on interactions
        const { typingSpeed, taskDelay, callParticipation, clickRate, timeOnPage } = interactions

        let moodScore = 0.5 // Default neutral score

        // Adjust score based on typing speed (faster = more engaged)
        if (typingSpeed !== undefined) {
          moodScore += typingSpeed > 50 ? 0.1 : -0.1
        }

        // Adjust score based on task delay (shorter = more engaged)
        if (taskDelay !== undefined) {
          moodScore += taskDelay < 1000 ? 0.1 : -0.1
        }

        // Adjust score based on call participation (higher = more engaged)
        if (callParticipation !== undefined) {
          moodScore += callParticipation > 0.5 ? 0.15 : -0.15
        }

        // Map score to mood
        let inferredMood: EmotionalState["inferredMood"] = "neutral"
        if (moodScore > 0.7) inferredMood = "engaged"
        else if (moodScore > 0.5) inferredMood = "high"
        else if (moodScore > 0.3) inferredMood = "medium"
        else if (moodScore > 0.2) inferredMood = "low"
        else inferredMood = "frustrated"

        const emotionalState: EmotionalState = {
          studentId,
          sessionId,
          inferredMood,
          confidence: 0.7, // Mock confidence level
          typingSpeed,
          taskDelay,
          callParticipation,
          timestamp: new Date().toISOString(),
        }

        return {
          data: emotionalState,
          loading: false,
          error: null,
        }
      } catch (error) {
        return {
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to infer emotional state",
        }
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // Synthesize ideas from discussions
  const synthesizeDiscussion = useCallback(
    async (
      discussionId: string,
      content: {
        documentContent?: string
        transcript?: string
      },
    ): Promise<AIResponse<DiscussionSynthesis>> => {
      setIsLoading(true)

      try {
        // In a real implementation, this would call the Grok 3 API
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Extract content from document and transcript
        const { documentContent, transcript } = content
        const combinedContent = [documentContent, transcript].filter(Boolean).join(" ")

        // Mock synthesis based on keywords in the content
        const keywords = [
          "energy",
          "solar",
          "renewable",
          "environment",
          "sustainability",
          "innovation",
          "technology",
          "future",
        ]
        const detectedKeywords = keywords.filter((keyword) => combinedContent.toLowerCase().includes(keyword))

        // Generate a mind map based on detected keywords
        const nodes: SynthesisNode[] = []
        const edges: { source: string; target: string }[] = []

        if (detectedKeywords.length > 0) {
          // Create a central node
          const centralTopic = detectedKeywords[0].charAt(0).toUpperCase() + detectedKeywords[0].slice(1)
          nodes.push({
            id: "central",
            label: centralTopic,
            children: [],
          })

          // Create child nodes for other keywords
          detectedKeywords.slice(1).forEach((keyword, index) => {
            const nodeId = `node_${index}`
            const label = keyword.charAt(0).toUpperCase() + keyword.slice(1)

            nodes.push({
              id: nodeId,
              label,
              children: [],
            })

            edges.push({
              source: "central",
              target: nodeId,
            })
          })
        } else {
          // Default mind map if no keywords detected
          nodes.push({
            id: "central",
            label: "Discussion Summary",
            children: [],
          })

          nodes.push({
            id: "node_0",
            label: "Key Point 1",
            children: [],
          })

          edges.push({
            source: "central",
            target: "node_0",
          })
        }

        const synthesis: DiscussionSynthesis = {
          synthesisId: `synthesis_${Date.now()}`,
          discussionId,
          title:
            detectedKeywords.length > 0
              ? `Discussion on ${detectedKeywords[0].charAt(0).toUpperCase() + detectedKeywords[0].slice(1)}`
              : "Discussion Summary",
          summary:
            detectedKeywords.length > 0
              ? `The group discussed topics related to ${detectedKeywords.join(", ")}.`
              : "The group had a productive discussion on various topics.",
          keyPoints: [
            "Focus on innovative solutions",
            "Consider environmental impact",
            "Explore technological applications",
          ],
          actionItems: ["Research current market trends", "Develop prototype concept", "Schedule follow-up discussion"],
          questions: ["How can we measure the impact?", "What resources are needed?", "What are the next steps?"],
          mindMap: {
            nodes,
            edges,
          },
          createdAt: new Date().toISOString(),
        }

        return {
          data: synthesis,
          loading: false,
          error: null,
        }
      } catch (error) {
        return {
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to synthesize discussion",
        }
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // Get a motivational message based on emotional state
  const getMotivationalMessage = useCallback((mood: EmotionalState["inferredMood"]): string => {
    const messages = {
      high: [
        "You're on fire today! Keep up the amazing work!",
        "Your enthusiasm is contagious. What will you accomplish next?",
        "You're making incredible progress. The sky's the limit!",
      ],
      medium: [
        "You're doing great! Keep moving forward.",
        "Steady progress leads to big results. You've got this!",
        "You're on the right track. Keep going!",
      ],
      low: [
        "Remember, every step forward counts, no matter how small.",
        "Learning is a journey with ups and downs. You'll get through this!",
        "It's okay to take a break and come back refreshed.",
      ],
      frustrated: [
        "Feeling stuck? Try breaking the problem into smaller steps.",
        "Even the greatest minds get frustrated. Take a deep breath and try again.",
        "Sometimes a short break can give you a fresh perspective.",
      ],
      engaged: [
        "You're in the zone! Your focus is impressive.",
        "Your dedication is paying off. Keep that momentum going!",
        "You're making connections that will last. Great work!",
      ],
      neutral: [
        "Ready to take on new challenges? You've got what it takes!",
        "What will you discover today? The possibilities are endless.",
        "Every moment is an opportunity to learn something new.",
      ],
    }

    const moodMessages = messages[mood] || messages.neutral
    return moodMessages[Math.floor(Math.random() * moodMessages.length)]
  }, [])

  // Get a curiosity spark message based on topic
  const getCuriositySparkMessage = useCallback((topic: string): string => {
    const messages = [
      `Did you know that ${topic} connects to fields you might not expect?`,
      `Curious about ${topic}? There's a fascinating history behind it!`,
      `Your interest in ${topic} could lead to amazing discoveries!`,
      `What if you applied ${topic} concepts in a completely new way?`,
      `The most innovative ideas in ${topic} often come from unexpected connections.`,
    ]

    return messages[Math.floor(Math.random() * messages.length)]
  }, [])

  return {
    generateLearningPathway,
    inferEmotionalState,
    synthesizeDiscussion,
    getMotivationalMessage,
    getCuriositySparkMessage,
    isLoading,
  }
}
