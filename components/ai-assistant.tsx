"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Send,
  X,
  Sparkles,
  Calculator,
  Globe,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  FileText,
  Video,
  Mic,
  MicOff,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  userRole?: string
}

interface Message {
  id: number
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

export function AIAssistant({ isOpen, onClose, userRole }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm your AI learning assistant. I can help you with studies, answer questions, create learning plans, and much more. What would you like to explore today?",
      timestamp: new Date(),
      suggestions: [
        "Help me understand calculus",
        "Create a study schedule",
        "Explain quantum physics",
        "Generate practice questions",
      ],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage)
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase()

    let response = ""
    let suggestions: string[] = []

    if (input.includes("math") || input.includes("calculus") || input.includes("algebra")) {
      response =
        "I'd be happy to help with mathematics! I can explain concepts step-by-step, solve problems, and create practice exercises. What specific topic would you like to explore?"
      suggestions = [
        "Explain derivatives",
        "Solve quadratic equations",
        "Create practice problems",
        "Show graphing techniques",
      ]
    } else if (input.includes("study") || input.includes("schedule") || input.includes("plan")) {
      response =
        "Let me help you create an effective study plan! Based on your learning patterns and upcoming deadlines, I can suggest an optimized schedule. What subjects are you focusing on?"
      suggestions = ["Create weekly schedule", "Set study reminders", "Track progress", "Optimize study times"]
    } else if (input.includes("science") || input.includes("physics") || input.includes("chemistry")) {
      response =
        "Science is fascinating! I can help explain complex concepts with interactive examples and visual aids. Which area of science interests you most?"
      suggestions = [
        "Explain atomic structure",
        "Show physics simulations",
        "Create lab reports",
        "Generate quiz questions",
      ]
    } else if (input.includes("write") || input.includes("essay") || input.includes("paper")) {
      response =
        "I can assist with writing! From brainstorming ideas to structuring arguments and polishing your prose. What type of writing project are you working on?"
      suggestions = ["Outline an essay", "Improve grammar", "Generate ideas", "Check citations"]
    } else {
      response =
        "That's an interesting question! I'm here to help with any academic topic. I can provide explanations, create study materials, answer questions, and even help with creative projects. How can I assist you further?"
      suggestions = ["Ask about any subject", "Get homework help", "Create flashcards", "Practice presentations"]
    }

    return {
      id: messages.length + 2,
      type: "ai",
      content: response,
      timestamp: new Date(),
      suggestions,
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    if (!isListening) {
      toast({
        title: "Voice Input Active",
        description: "Speak now... (This is a demo feature)",
      })
      // Simulate voice input
      setTimeout(() => {
        setIsListening(false)
        setInputMessage("How do I solve quadratic equations?")
      }, 3000)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl h-[80vh] bg-white dark:bg-gray-900 rounded-lg shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Learning Assistant</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your intelligent study companion</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 flex">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-4 m-4 mb-0">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="tools">AI Tools</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="help">Quick Help</TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="flex-1 flex flex-col p-4 pt-2">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>

                          {message.suggestions && (
                            <div className="mt-3 space-y-2">
                              <p className="text-xs font-medium opacity-80">Suggestions:</p>
                              <div className="flex flex-wrap gap-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    size="sm"
                                    variant="outline"
                                    className="text-xs h-7"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
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
                            <span className="text-sm text-gray-500">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Ask me anything about your studies..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        className="pr-12"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={toggleVoiceInput}
                      >
                        {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button onClick={sendMessage} disabled={!inputMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="tools" className="flex-1 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="text-center pb-2">
                        <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <CardTitle className="text-lg">Math Solver</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Step-by-step solutions for any math problem
                        </p>
                        <Button className="w-full">Open Calculator</Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="text-center pb-2">
                        <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <CardTitle className="text-lg">Essay Helper</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Writing assistance and grammar checking
                        </p>
                        <Button className="w-full">Start Writing</Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="text-center pb-2">
                        <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <CardTitle className="text-lg">Language Tutor</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Practice conversations and translations
                        </p>
                        <Button className="w-full">Practice Now</Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="text-center pb-2">
                        <Lightbulb className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <CardTitle className="text-lg">Study Planner</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">AI-optimized study schedules</p>
                        <Button className="w-full">Create Plan</Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="flex-1 p-4">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          Learning Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>Mathematics</span>
                            <Badge variant="secondary">85% Complete</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Science</span>
                            <Badge variant="secondary">72% Complete</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Literature</span>
                            <Badge variant="secondary">91% Complete</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-blue-600" />
                          AI Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm font-medium">Focus Area</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Spend more time on calculus derivatives - you're close to mastery!
                            </p>
                          </div>
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm font-medium">Strength</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Excellent progress in essay writing. Consider advanced topics.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="help" className="flex-1 p-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Quick Commands</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { command: "Explain [topic]", description: "Get detailed explanations on any subject" },
                        { command: "Solve [problem]", description: "Step-by-step problem solving" },
                        { command: "Create quiz on [topic]", description: "Generate practice questions" },
                        { command: "Summarize [text]", description: "Get concise summaries" },
                        { command: "Help with homework", description: "Guided homework assistance" },
                        { command: "Study plan for [subject]", description: "Personalized study schedules" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        >
                          <p className="font-medium text-sm">{item.command}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="w-64 border-l p-4 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Questions Asked</span>
                    <Badge variant="outline">47</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Problems Solved</span>
                    <Badge variant="outline">23</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Study Hours</span>
                    <Badge variant="outline">12.5</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Recent Topics</h3>
                <div className="space-y-2">
                  {["Calculus", "Physics", "Essay Writing", "Chemistry"].map((topic) => (
                    <div
                      key={topic}
                      className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {topic}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">AI Capabilities</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-yellow-500" />
                    <span>Real-time explanations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-3 w-3 text-blue-500" />
                    <span>Adaptive learning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-3 w-3 text-green-500" />
                    <span>Natural conversation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-3 w-3 text-purple-500" />
                    <span>Visual demonstrations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
