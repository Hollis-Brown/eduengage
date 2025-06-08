"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalyticsChart } from "@/components/analytics-chart"
import { TaskBoard } from "@/components/task-board"
import { RecentActivity } from "@/components/recent-activity"
import { VirtualClassroom } from "@/components/virtual-classroom"
import { AIAssistant } from "@/components/ai-assistant"
import { useAuth } from "@/components/auth-provider"
import {
  BarChart3,
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  MessageSquare,
  Video,
  FileText,
  Plus,
  Brain,
  Sparkles,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Enhanced mock data with real functionality
const mockAnalytics = {
  totalStudents: 1247,
  activeToday: 892,
  completionRate: 87,
  engagementScore: 94,
  dropoutRisk: 23,
  participationTrend: [65, 72, 78, 85, 89, 92, 94],
  weeklyActivity: [
    { day: "Mon", students: 234, assignments: 45, engagement: 78 },
    { day: "Tue", students: 267, assignments: 52, engagement: 82 },
    { day: "Wed", students: 298, assignments: 38, engagement: 85 },
    { day: "Thu", students: 312, assignments: 61, engagement: 88 },
    { day: "Fri", students: 289, assignments: 43, engagement: 84 },
    { day: "Sat", students: 156, assignments: 12, engagement: 65 },
    { day: "Sun", students: 134, assignments: 8, engagement: 58 },
  ],
  liveClassrooms: 12,
  activeDiscussions: 34,
  aiInteractions: 156,
}

const mockTasks = [
  {
    id: "1",
    title: "Math Assignment - Algebra Basics",
    status: "in-progress",
    assignedTo: "Grade 9A",
    dueDate: "2024-06-10",
    priority: "high",
    progress: 65,
    aiSuggestions: ["Focus on quadratic equations", "Review factoring methods"],
  },
  {
    id: "2",
    title: "Science Project - Solar System",
    status: "completed",
    assignedTo: "Grade 8B",
    dueDate: "2024-06-08",
    priority: "medium",
    progress: 100,
    aiSuggestions: ["Excellent work on planetary distances"],
  },
  {
    id: "3",
    title: "English Essay - Shakespeare",
    status: "todo",
    assignedTo: "Grade 11C",
    dueDate: "2024-06-15",
    priority: "low",
    progress: 0,
    aiSuggestions: ["Start with character analysis", "Consider themes of power"],
  },
]

const liveClassrooms = [
  {
    id: "1",
    title: "Advanced Mathematics",
    instructor: "Dr. Sarah Johnson",
    participants: 24,
    status: "live",
    subject: "Calculus",
    startTime: "2:00 PM",
  },
  {
    id: "2",
    title: "Physics Lab Session",
    instructor: "Prof. Michael Chen",
    participants: 18,
    status: "starting-soon",
    subject: "Quantum Mechanics",
    startTime: "3:30 PM",
  },
  {
    id: "3",
    title: "Literature Discussion",
    instructor: "Ms. Emily Rodriguez",
    participants: 32,
    status: "scheduled",
    subject: "Modern Poetry",
    startTime: "4:00 PM",
  },
]

export default function DashboardPage() {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getDashboardContent = () => {
    switch (userRole) {
      case "admin":
        return <AdminDashboard />
      case "student":
        return <StudentDashboard />
      case "parent":
        return <ParentDashboard />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.displayName || "User"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {userRole === "admin" && "Here's what's happening in your institution today."}
                {userRole === "student" && "Ready to continue your learning journey?"}
                {userRole === "parent" && "Track your child's progress and engagement."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1">
                {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)} Account
              </Badge>
              <Button onClick={() => setShowAIAssistant(true)} className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Assistant
              </Button>
            </div>
          </div>
        </motion.div>

        {getDashboardContent()}

        {/* AI Assistant Modal */}
        {showAIAssistant && (
          <AIAssistant isOpen={showAIAssistant} onClose={() => setShowAIAssistant(false)} userRole={userRole} />
        )}
      </div>
    </DashboardLayout>
  )

  function AdminDashboard() {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="classrooms">Virtual Classrooms</TabsTrigger>
          <TabsTrigger value="workflows">AI Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Enhanced Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveTab("analytics")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.totalStudents.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+12%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveTab("classrooms")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Live Classrooms</CardTitle>
                  <Video className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.liveClassrooms}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">3 starting soon</span>
                  </p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveTab("collaboration")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Discussions</CardTitle>
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.activeDiscussions}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-blue-600">+8 new today</span>
                  </p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveTab("workflows")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
                  <Brain className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.aiInteractions}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-orange-600">+23 this hour</span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump into your most used features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col gap-2" onClick={() => setActiveTab("classrooms")}>
                    <Video className="h-6 w-6" />
                    <span>Start Classroom</span>
                  </Button>
                  <Button
                    className="h-20 flex flex-col gap-2"
                    variant="outline"
                    onClick={() => setShowAIAssistant(true)}
                  >
                    <Brain className="h-6 w-6" />
                    <span>AI Assistant</span>
                  </Button>
                  <Button
                    className="h-20 flex flex-col gap-2"
                    variant="outline"
                    onClick={() => setActiveTab("analytics")}
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span>View Analytics</span>
                  </Button>
                  <Button className="h-20 flex flex-col gap-2" variant="outline" asChild>
                    <Link href="/ai-features">
                      <Sparkles className="h-6 w-6" />
                      <span>AI Features</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
                <CardDescription>Student participation over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart data={mockAnalytics.weeklyActivity} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest student interactions and submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </motion.div>

          {/* Detailed Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>AI-powered analytics and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Completion Rate</h4>
                  <div className="text-2xl font-bold text-green-600">{mockAnalytics.completionRate}%</div>
                  <Progress value={mockAnalytics.completionRate} className="h-2" />
                  <p className="text-sm text-muted-foreground">Above target by 7%</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Engagement Score</h4>
                  <div className="text-2xl font-bold text-blue-600">{mockAnalytics.engagementScore}%</div>
                  <Progress value={mockAnalytics.engagementScore} className="h-2" />
                  <p className="text-sm text-muted-foreground">Excellent engagement</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">At-Risk Students</h4>
                  <div className="text-2xl font-bold text-red-600">{mockAnalytics.dropoutRisk}</div>
                  <p className="text-sm text-muted-foreground">Need immediate attention</p>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card>
              <CardHeader>
                <CardTitle>Active Tasks & Projects</CardTitle>
                <CardDescription>Manage and track assignment progress with AI insights</CardDescription>
              </CardHeader>
              <CardContent>
                <TaskBoard tasks={mockTasks} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Collaboration Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle>Smart Document Editor</CardTitle>
                <CardDescription>AI-powered collaborative editing with real-time suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Document
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle>Discussion Forums</CardTitle>
                <CardDescription>AI-moderated discussions with automatic summarization</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Start Discussion
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Brain className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle>AI Study Groups</CardTitle>
                <CardDescription>Automatically formed groups based on learning patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Join Group
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="classrooms" className="space-y-6">
          <VirtualClassroom classrooms={liveClassrooms} userRole={userRole} />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    AI Learning Pathways
                  </CardTitle>
                  <CardDescription>Personalized learning journeys powered by advanced AI</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Active Pathways</span>
                    <Badge>247</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completion Rate</span>
                    <Badge variant="secondary">89%</Badge>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/ai-features">
                      <Brain className="h-4 w-4 mr-2" />
                      Manage Pathways
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-500" />
                    Emotional Intelligence
                  </CardTitle>
                  <CardDescription>Real-time mood detection and adaptive responses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Students Monitored</span>
                    <Badge>1,247</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Interventions Today</span>
                    <Badge variant="secondary">23</Badge>
                  </div>
                  <Button className="w-full" onClick={() => setShowAIAssistant(true)}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    View Insights
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* AI Workflow Builder */}
          <Card>
            <CardHeader>
              <CardTitle>AI Workflow Builder</CardTitle>
              <CardDescription>Create custom educational workflows with drag-and-drop simplicity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <h4 className="font-medium mb-2">Auto-Grading Workflow</h4>
                  <p className="text-sm text-muted-foreground">AI-powered assignment grading with detailed feedback</p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <h4 className="font-medium mb-2">Engagement Monitoring</h4>
                  <p className="text-sm text-muted-foreground">Real-time student engagement tracking and alerts</p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <h4 className="font-medium mb-2">Content Generation</h4>
                  <p className="text-sm text-muted-foreground">
                    AI-generated quizzes, assignments, and study materials
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    )
  }

  function StudentDashboard() {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Student Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments Due</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 due this week</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Study Sessions</CardTitle>
              <Brain className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Grade</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">A-</div>
              <p className="text-xs text-muted-foreground">+0.2 from last week</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
        </div>

        {/* Student Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Classrooms</CardTitle>
              <CardDescription>Join your scheduled classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {liveClassrooms.slice(0, 2).map((classroom) => (
                  <div key={classroom.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{classroom.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {classroom.instructor} • {classroom.startTime}
                      </p>
                    </div>
                    <Button size="sm" className={classroom.status === "live" ? "bg-green-600" : ""}>
                      {classroom.status === "live" ? "Join Now" : "Starting Soon"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Tools</CardTitle>
              <CardDescription>Enhance your learning with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-20 flex flex-col gap-2" onClick={() => setShowAIAssistant(true)}>
                  <Brain className="h-6 w-6" />
                  <span>AI Tutor</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline" asChild>
                  <Link href="/ai-features">
                    <Sparkles className="h-6 w-6" />
                    <span>Learning Path</span>
                  </Link>
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <MessageSquare className="h-6 w-6" />
                  <span>Study Group</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <FileText className="h-6 w-6" />
                  <span>Smart Notes</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Assignments with AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Smart Assignment Tracker</CardTitle>
            <CardDescription>AI-powered insights for your upcoming tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs">Progress</span>
                        <Badge variant="outline">{task.progress}%</Badge>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                    {task.aiSuggestions && (
                      <div className="mt-2">
                        <p className="text-xs text-blue-600 flex items-center gap-1">
                          <Brain className="h-3 w-3" />
                          AI Suggestion: {task.aiSuggestions[0]}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>{task.priority}</Badge>
                    <Button size="sm">{task.status === "completed" ? "Review" : "Continue"}</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  function ParentDashboard() {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Parent Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <Progress value={92} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
              <Brain className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
              <BookOpen className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">B+</div>
              <p className="text-xs text-muted-foreground">Above average</p>
            </CardContent>
          </Card>
        </div>

        {/* Parent-specific features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Learning Insights</CardTitle>
              <CardDescription>Personalized recommendations for your child</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">AI Recommendation</span>
                  </div>
                  <p className="text-sm">
                    Your child shows strong aptitude in mathematics. Consider enrolling in advanced algebra courses.
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-sm">Study Pattern</span>
                  </div>
                  <p className="text-sm">Peak learning time: 3-5 PM. Schedule important subjects during this window.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communication Hub</CardTitle>
              <CardDescription>Messages and updates from teachers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Ms. Johnson</h4>
                    <span className="text-xs text-muted-foreground">Math Teacher</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Great improvement in algebra! The AI tutor sessions are really helping.
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">AI Learning System</h4>
                    <span className="text-xs text-muted-foreground">Yesterday</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Weekly progress report: 3 assignments completed, 2 AI study sessions attended.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    )
  }
}
