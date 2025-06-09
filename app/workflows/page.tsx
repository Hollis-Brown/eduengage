"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard-layout"
import { WorkflowBuilder } from "@/components/workflow-builder"
import { AIWorkflowTemplates } from "@/components/ai-workflow-templates"
import { WorkflowAutomation } from "@/components/workflow-automation"
import { useAuth } from "@/components/auth-provider"
import {
  Plus,
  Search,
  Play,
  Pause,
  Settings,
  Brain,
  Sparkles,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Target,
  Workflow,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const workflowData = {
  active: [
    {
      id: "1",
      name: "Auto-Grade Assignments",
      description: "Automatically grade and provide feedback on student submissions",
      status: "running",
      trigger: "File Upload",
      actions: 3,
      lastRun: "2 minutes ago",
      successRate: 98.5,
      category: "Assessment",
    },
    {
      id: "2",
      name: "Engagement Monitoring",
      description: "Track student engagement and send alerts for at-risk students",
      status: "running",
      trigger: "Real-time Data",
      actions: 5,
      lastRun: "5 minutes ago",
      successRate: 94.2,
      category: "Analytics",
    },
    {
      id: "3",
      name: "Content Generation",
      description: "Generate personalized study materials based on student performance",
      status: "paused",
      trigger: "Weekly Schedule",
      actions: 4,
      lastRun: "1 hour ago",
      successRate: 91.8,
      category: "Content",
    },
  ],
  templates: [
    {
      id: "t1",
      name: "Student Onboarding",
      description: "Automated workflow for new student registration and setup",
      category: "Onboarding",
      complexity: "Simple",
      estimatedTime: "5 minutes",
      features: ["Email notifications", "Account setup", "Welcome materials"],
    },
    {
      id: "t2",
      name: "Assignment Distribution",
      description: "Automatically distribute assignments based on student level and progress",
      category: "Assessment",
      complexity: "Medium",
      estimatedTime: "10 minutes",
      features: ["AI matching", "Deadline management", "Progress tracking"],
    },
    {
      id: "t3",
      name: "Parent Communication",
      description: "Automated progress reports and communication with parents",
      category: "Communication",
      complexity: "Advanced",
      estimatedTime: "15 minutes",
      features: ["Report generation", "Email automation", "Custom templates"],
    },
  ],
  analytics: {
    totalWorkflows: 24,
    activeWorkflows: 18,
    totalExecutions: 15847,
    successRate: 96.3,
    timeSaved: "342 hours",
    costSavings: "$12,450",
  },
}

export default function WorkflowsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const { toast } = useToast()

  const toggleWorkflow = (workflowId: string, currentStatus: string) => {
    const newStatus = currentStatus === "running" ? "paused" : "running"
    toast({
      title: `Workflow ${newStatus === "running" ? "Started" : "Paused"}`,
      description: `The workflow has been ${newStatus === "running" ? "activated" : "paused"} successfully.`,
    })
  }

  const createWorkflow = () => {
    toast({
      title: "Workflow Builder Opened",
      description: "Create your custom workflow with our drag-and-drop builder.",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Workflow className="h-8 w-8 text-blue-600" />
                AI Workflow Automation
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create, manage, and optimize intelligent educational workflows
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button onClick={createWorkflow}>
                <Plus className="h-4 w-4 mr-2" />
                Create Workflow
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Analytics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Workflow className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Workflows</p>
                    <p className="text-2xl font-bold">{workflowData.analytics.activeWorkflows}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                    <p className="text-2xl font-bold">{workflowData.analytics.successRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Time Saved</p>
                    <p className="text-2xl font-bold">{workflowData.analytics.timeSaved}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Executions</p>
                    <p className="text-2xl font-bold">{workflowData.analytics.totalExecutions.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Active Workflows */}
            <Card>
              <CardHeader>
                <CardTitle>Active Workflows</CardTitle>
                <CardDescription>Currently running automated processes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflowData.active.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            workflow.status === "running" ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                          }`}
                        ></div>
                        <div>
                          <h4 className="font-medium">{workflow.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{workflow.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Trigger: {workflow.trigger}</span>
                            <span>Actions: {workflow.actions}</span>
                            <span>Last run: {workflow.lastRun}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Badge variant="outline">{workflow.category}</Badge>
                          <p className="text-sm text-green-600 mt-1">{workflow.successRate}% success</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleWorkflow(workflow.id, workflow.status)}
                        >
                          {workflow.status === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={createWorkflow}>
                <CardHeader className="text-center">
                  <Plus className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle>Create New Workflow</CardTitle>
                  <CardDescription>Build custom automation with our visual editor</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Get Started</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Brain className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle>AI Suggestions</CardTitle>
                  <CardDescription>Get intelligent workflow recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    View Suggestions
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>Analyze workflow efficiency and impact</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            <WorkflowBuilder />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <AIWorkflowTemplates templates={workflowData.templates} />
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <WorkflowAutomation />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Performance</CardTitle>
                  <CardDescription>Success rates and execution times</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workflowData.active.map((workflow) => (
                      <div key={workflow.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{workflow.name}</span>
                          <span className="text-sm text-green-600">{workflow.successRate}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-green-600 rounded-full"
                            style={{ width: `${workflow.successRate}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Savings</CardTitle>
                  <CardDescription>Time and money saved through automation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{workflowData.analytics.costSavings}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total cost savings</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{workflowData.analytics.timeSaved}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Time saved this month</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="font-bold text-lg">
                          {workflowData.analytics.totalExecutions.toLocaleString()}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">Total Executions</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="font-bold text-lg">{workflowData.analytics.totalWorkflows}</div>
                        <div className="text-gray-600 dark:text-gray-400">Total Workflows</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  AI Workflow Insights
                </CardTitle>
                <CardDescription>Intelligent recommendations for workflow optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-300">Optimization</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Your auto-grading workflow could be 15% faster with parallel processing enabled.
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800 dark:text-yellow-300">Alert</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Content generation workflow has 8% failure rate. Consider adding error handling.
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800 dark:text-blue-300">Suggestion</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Create a workflow for automated parent notifications to improve communication.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
