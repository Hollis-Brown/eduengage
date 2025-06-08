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
import { useAuth } from "@/components/auth-provider"
import {
  BarChart3,
  Users,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  Video,
  FileText,
  Plus,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data for demonstration
const mockAnalytics = {
  totalStudents: 1247,
  activeToday: 892,
  completionRate: 87,
  engagementScore: 94,
  dropoutRisk: 23,
  participationTrend: [65, 72, 78, 85, 89, 92, 94],
  weeklyActivity: [
    { day: "Mon", students: 234, assignments: 45 },
    { day: "Tue", students: 267, assignments: 52 },
    { day: "Wed", students: 298, assignments: 38 },
    { day: "Thu", students: 312, assignments: 61 },
    { day: "Fri", students: 289, assignments: 43 },
    { day: "Sat", students: 156, assignments: 12 },
    { day: "Sun", students: 134, assignments: 8 },
  ],
}

const mockTasks = [
  {
    id: "1",
    title: "Math Assignment - Algebra Basics",
    status: "in-progress",
    assignedTo: "Grade 9A",
    dueDate: "2024-06-10",
    priority: "high",
  },
  {
    id: "2",
    title: "Science Project - Solar System",
    status: "completed",
    assignedTo: "Grade 8B",
    dueDate: "2024-06-08",
    priority: "medium",
  },
  {
    id: "3",
    title: "English Essay - Shakespeare",
    status: "todo",
    assignedTo: "Grade 11C",
    dueDate: "2024-06-15",
    priority: "low",
  },
]

export default function DashboardPage() {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

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
            <Badge variant="secondary" className="px-3 py-1">
              {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)} Account
            </Badge>
          </div>
        </motion.div>

        {getDashboardContent()}
      </div>
    </DashboardLayout>
  )
}

function AdminDashboard() {
  return (
    <Tabs defaultValue="analytics" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        <TabsTrigger value="retention">Retention</TabsTrigger>
        <TabsTrigger value="workflows">Workflows</TabsTrigger>
      </TabsList>

      <TabsContent value="analytics" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
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

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.activeToday.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8%</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.completionRate}%</div>
                <Progress value={mockAnalytics.completionRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{mockAnalytics.dropoutRisk}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">-3</span> from last week
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
      </TabsContent>

      <TabsContent value="collaboration" className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle>Document Editor</CardTitle>
                <CardDescription>Collaborative real-time editing</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  New Document
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Video className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle>Video Conference</CardTitle>
                <CardDescription>Host virtual classrooms</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Start Meeting
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle>Task Management</CardTitle>
                <CardDescription>Organize assignments and projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Tasks</CardTitle>
              <CardDescription>Manage and track assignment progress</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskBoard tasks={mockTasks} />
            </CardContent>
          </Card>
        </motion.div>
      </TabsContent>

      <TabsContent value="retention" className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Progress</CardTitle>
                <CardDescription>New student completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Account Setup</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <Progress value={95} />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">First Assignment</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Profile Complete</span>
                    <span className="text-sm font-medium">82%</span>
                  </div>
                  <Progress value={82} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Scores</CardTitle>
                <CardDescription>Student feedback ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">4.7</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded-full ${i < 4 ? "bg-yellow-400" : "bg-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Based on 1,247 responses</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automated Nudges</CardTitle>
                <CardDescription>Engagement reminders sent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Assignment Reminders</span>
                    <Badge variant="secondary">234</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Login Encouragement</span>
                    <Badge variant="secondary">89</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Progress Celebrations</span>
                    <Badge variant="secondary">156</Badge>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Configure Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </TabsContent>

      <TabsContent value="workflows" className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle>No-Code Workflow Builder</CardTitle>
              <CardDescription>Create custom dashboards and learning experiences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Workflow Builder Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Drag-and-drop interface to create custom educational workflows
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments Due</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Grade</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">A-</div>
            <p className="text-xs text-muted-foreground">+0.2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>Your next tasks and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                  <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>{task.priority}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump into your learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 flex flex-col">
                <FileText className="h-6 w-6 mb-2" />
                <span>Join Study Group</span>
              </Button>
              <Button className="h-20 flex flex-col" variant="outline">
                <Video className="h-6 w-6 mb-2" />
                <span>Virtual Classroom</span>
              </Button>
              <Button className="h-20 flex flex-col" variant="outline">
                <MessageSquare className="h-6 w-6 mb-2" />
                <span>Ask Question</span>
              </Button>
              <Button className="h-20 flex flex-col" variant="outline">
                <BarChart3 className="h-6 w-6 mb-2" />
                <span>View Progress</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/10</div>
            <p className="text-xs text-muted-foreground">Completed this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your child's latest learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Completed Math Assignment</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Joined Science Study Group</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Submitted English Essay</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communication</CardTitle>
            <CardDescription>Messages from teachers and school</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Ms. Johnson</h4>
                  <span className="text-xs text-muted-foreground">Math Teacher</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Great improvement in algebra! Keep up the excellent work.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">School Administration</h4>
                  <span className="text-xs text-muted-foreground">Yesterday</span>
                </div>
                <p className="text-sm text-muted-foreground">Parent-teacher conferences scheduled for next week.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
