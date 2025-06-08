"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PathwayGraph } from "@/components/pathway-graph"
import { EmotionalResonance } from "@/components/emotional-resonance"
import { useAIService, type LearningPathway, type DiscussionSynthesis } from "@/lib/ai-service"
import { useAuth } from "@/components/auth-provider"
import { Sparkles, Brain, Lightbulb, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AIFeaturesPage() {
  const [activeTab, setActiveTab] = useState("pathways")
  const [pathway, setPathway] = useState<LearningPathway | null>(null)
  const [synthesis, setSynthesis] = useState<DiscussionSynthesis | null>(null)
  const [loading, setLoading] = useState({
    pathway: false,
    synthesis: false,
  })
  
  const { user, userRole } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { generateLearningPathway, synthesizeDiscussion } = useAIService()

  // Generate sample data when the component mounts
  useEffect(() => {
    if (!user) return
    
    const generateSampleData = async () => {
      // Generate a learning pathway
      setLoading(prev => ({ ...prev, pathway: true }))
      try {
        const response = await generateLearningPathway(
          user.uid,
          ["mathematics", "critical thinking"],
          ["literature", "history"],
          ["science", "technology", "art"],
          ["completed algebra quiz", "watched history video"]
        )
        
        if (response.data) {
          setPathway(response.data)
        }
      } catch (error) {
        console.error("Error generating pathway:", error)
      } finally {
        setLoading(prev => ({ ...prev, pathway: false }))
      }
      
      // Generate a discussion synthesis
      setLoading(prev => ({ ...prev, synthesis: true }))
      try {
        const response = await synthesizeDiscussion(
          "discussion_123",
          {
            documentContent: "Our group discussed renewable energy solutions, focusing on solar power and its applications in urban environments. We explored cost factors, efficiency improvements, and potential integration with existing infrastructure. Several innovative ideas were proposed, including solar-powered public transportation and energy-generating building materials.",
            transcript: "Student A: I think solar energy has the most potential for immediate impact.\nStudent B: Yes, but we need to consider storage solutions.\nStudent C: What about combining solar with other renewable sources?\nStudent A: That's a good point. A hybrid approach might be more effective."
          }
        )
        
        if (response.data) {
          setSynthesis(response.data)
        }
      } catch (error) {
        console.error("Error generating synthesis:", error)
      } finally {
        setLoading(prev => ({ ...prev, synthesis: false }))
      }
    }
    
    generateSampleData()
  }, [user, generateLearningPathway, synthesizeDiscussion])

  // Handle pathway updates
  const handlePathwayUpdate = (updatedPathway: LearningPathway) => {
    setPathway(updatedPathway)
    
    // In a real app, you would save this to Firestore
    toast({
      title: "Pathway Updated",
      description: "Your learning pathway has been updated with your progress.",
    })
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <EmotionalResonance studentId={user.uid} sessionId={`session_${Date.now()}`}>
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-blue-500" />
                  AI-Powered Features
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Experience the future of education with our advanced AI capabilities
                </p>
              </div>
            </div>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pathways" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>Learning Pathways</span>
              </TabsTrigger>
              <TabsTrigger value="emotional" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Emotional Resonance</span>
              </TabsTrigger>
              <TabsTrigger value="synthesis" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span>Idea Synthesis</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pathways" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>The Oracle's Compass</CardTitle>
                  <CardDescription>
                    AI-generated personalized learning pathways based on your strengths, weaknesses, and interests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading.pathway ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                        <p className="text-sm text-gray-500">Generating your personalized learning pathway...</p>
                      </div>
                    </div>
                  ) : pathway ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h3 className="font-medium text-lg mb-1">{pathway.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{pathway.description}</p>
                      </div>
                      
                      <PathwayGraph 
                        pathway={pathway} 
                        onPathwayUpdate={handlePathwayUpdate} 
                      />
                      
                      <div className="flex justify-end">
                        <Button>
                          Save Progress
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No pathway available. Please try again later.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emotional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>The Empathic Mentor</CardTitle>
                  <CardDescription>
                    AI that detects your emotional state through interaction patterns and adjusts to boost engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h3 className="font-medium text-lg mb-1">How It Works</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Our Emotional Resonance Engine analyzes your interaction patterns (typing speed, task completion time, etc.) to detect your emotional state and provide personalized support when you need it most.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Try It Out</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Interact with the page for a while (type in the box below, click around) and you might receive an empathic nudge when the AI detects you could use some encouragement.
                          </p>
                          
                          <div className="space-y-4">
                            <textarea 
                              className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Type here to simulate user interaction..."
                            />
                            
                            <div className="flex gap-2">
                              <Button variant="outline">Click Me</Button>
                              <Button variant="outline">And Me</Button>
                              <Button variant="outline">Me Too</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Benefits</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <div className="\
