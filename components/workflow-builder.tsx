"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Trash2,
  Play,
  Save,
  Download,
  Upload,
  Settings,
  Zap,
  Mail,
  FileText,
  Database,
  Clock,
  Users,
  Brain,
  Workflow,
  ArrowRight,
  ArrowDown,
  CheckCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WorkflowNode {
  id: string
  type: "trigger" | "action" | "condition" | "ai"
  title: string
  description: string
  icon: any
  config: Record<string, any>
  position: { x: number; y: number }
  connections: string[]
}

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  category: string
}

const nodeTypes = {
  trigger: [
    { id: "file_upload", title: "File Upload", description: "Triggered when a file is uploaded", icon: Upload },
    { id: "schedule", title: "Schedule", description: "Triggered at specific times", icon: Clock },
    { id: "student_action", title: "Student Action", description: "Triggered by student activities", icon: Users },
    { id: "form_submit", title: "Form Submit", description: "Triggered when a form is submitted", icon: FileText },
  ],
  action: [
    { id: "send_email", title: "Send Email", description: "Send automated emails", icon: Mail },
    { id: "create_task", title: "Create Task", description: "Create a new task or assignment", icon: Plus },
    { id: "update_database", title: "Update Database", description: "Update student records", icon: Database },
    { id: "generate_report", title: "Generate Report", description: "Create automated reports", icon: FileText },
  ],
  condition: [
    { id: "if_then", title: "If/Then", description: "Conditional logic branching", icon: ArrowRight },
    { id: "grade_check", title: "Grade Check", description: "Check student grades", icon: CheckCircle },
    { id: "attendance_check", title: "Attendance Check", description: "Check attendance status", icon: Users },
  ],
  ai: [
    { id: "ai_grade", title: "AI Grading", description: "Automatically grade assignments", icon: Brain },
    { id: "ai_feedback", title: "AI Feedback", description: "Generate personalized feedback", icon: Brain },
    { id: "ai_recommend", title: "AI Recommendations", description: "Suggest learning paths", icon: Brain },
  ],
}

export function WorkflowBuilder() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [workflowName, setWorkflowName] = useState("")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [activeTab, setActiveTab] = useState("design")
  const [isRunning, setIsRunning] = useState(false)
  const { toast } = useToast()

  const addNode = useCallback((type: keyof typeof nodeTypes, nodeType: any) => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type,
      title: nodeType.title,
      description: nodeType.description,
      icon: nodeType.icon,
      config: {},
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      connections: [],
    }
    setNodes((prev) => [...prev, newNode])
    setSelectedNode(newNode)
  }, [])

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((prev) => prev.filter((node) => node.id !== nodeId))
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null)
      }
    },
    [selectedNode],
  )

  const updateNodeConfig = useCallback((nodeId: string, config: Record<string, any>) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, config: { ...node.config, ...config } } : node)),
    )
  }, [])

  const saveWorkflow = useCallback(() => {
    if (!workflowName.trim()) {
      toast({
        title: "Workflow Name Required",
        description: "Please enter a name for your workflow.",
        variant: "destructive",
      })
      return
    }

    const workflow = {
      name: workflowName,
      description: workflowDescription,
      nodes,
      createdAt: new Date().toISOString(),
    }

    // Save to localStorage for demo
    const savedWorkflows = JSON.parse(localStorage.getItem("workflows") || "[]")
    savedWorkflows.push(workflow)
    localStorage.setItem("workflows", JSON.stringify(savedWorkflows))

    toast({
      title: "Workflow Saved",
      description: `"${workflowName}" has been saved successfully.`,
    })
  }, [workflowName, workflowDescription, nodes, toast])

  const testWorkflow = useCallback(async () => {
    if (nodes.length === 0) {
      toast({
        title: "No Workflow to Test",
        description: "Please add some nodes to your workflow first.",
        variant: "destructive",
      })
      return
    }

    setIsRunning(true)

    // Simulate workflow execution
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsRunning(false)
    toast({
      title: "Workflow Test Complete",
      description: "Your workflow executed successfully with no errors.",
    })
  }, [nodes, toast])

  const exportWorkflow = useCallback(() => {
    const workflow = {
      name: workflowName,
      description: workflowDescription,
      nodes,
      version: "1.0",
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${workflowName || "workflow"}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Workflow Exported",
      description: "Your workflow has been downloaded as a JSON file.",
    })
  }, [workflowName, workflowDescription, nodes, toast])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Input
            placeholder="Enter workflow name..."
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-lg font-semibold"
          />
          <Input
            placeholder="Enter workflow description..."
            value={workflowDescription}
            onChange={(e) => setWorkflowDescription(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportWorkflow}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={testWorkflow} disabled={isRunning}>
            {isRunning ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Test
          </Button>
          <Button onClick={saveWorkflow}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Node Palette */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-sm">Node Palette</CardTitle>
                <CardDescription>Drag and drop to add nodes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(nodeTypes).map(([category, types]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-sm capitalize flex items-center gap-2">
                      {category === "trigger" && <Zap className="h-4 w-4 text-green-600" />}
                      {category === "action" && <Settings className="h-4 w-4 text-blue-600" />}
                      {category === "condition" && <ArrowRight className="h-4 w-4 text-yellow-600" />}
                      {category === "ai" && <Brain className="h-4 w-4 text-purple-600" />}
                      {category}s
                    </h4>
                    <div className="space-y-1">
                      {types.map((nodeType) => (
                        <Button
                          key={nodeType.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-xs h-auto p-2"
                          onClick={() => addNode(category as keyof typeof nodeTypes, nodeType)}
                        >
                          <nodeType.icon className="h-3 w-3 mr-2" />
                          <div className="text-left">
                            <div className="font-medium">{nodeType.title}</div>
                            <div className="text-gray-500 text-xs">{nodeType.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Canvas */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm">Workflow Canvas</CardTitle>
                <CardDescription>{nodes.length} nodes • Click nodes to configure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden">
                  <AnimatePresence>
                    {nodes.map((node, index) => (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute cursor-pointer ${
                          selectedNode?.id === node.id ? "ring-2 ring-blue-500" : ""
                        }`}
                        style={{
                          left: `${node.position.x}px`,
                          top: `${node.position.y}px`,
                        }}
                        onClick={() => setSelectedNode(node)}
                      >
                        <Card className="w-32 shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <node.icon className="h-4 w-4" />
                              <Badge variant="outline" className="text-xs">
                                {node.type}
                              </Badge>
                            </div>
                            <div className="text-xs font-medium">{node.title}</div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-100 hover:bg-red-200"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNode(node.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3 text-red-600" />
                            </Button>
                          </CardContent>
                        </Card>
                        {index < nodes.length - 1 && <ArrowDown className="h-4 w-4 text-gray-400 mx-auto mt-2" />}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {nodes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <Workflow className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Add nodes from the palette to start building</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Properties Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-sm">Properties</CardTitle>
                <CardDescription>
                  {selectedNode ? "Configure selected node" : "Select a node to configure"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedNode ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs">Node Type</Label>
                      <Badge variant="outline" className="mt-1">
                        {selectedNode.type}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={selectedNode.title}
                        onChange={(e) => {
                          const updatedNode = { ...selectedNode, title: e.target.value }
                          setSelectedNode(updatedNode)
                          setNodes((prev) => prev.map((node) => (node.id === selectedNode.id ? updatedNode : node)))
                        }}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={selectedNode.description}
                        onChange={(e) => {
                          const updatedNode = { ...selectedNode, description: e.target.value }
                          setSelectedNode(updatedNode)
                          setNodes((prev) => prev.map((node) => (node.id === selectedNode.id ? updatedNode : node)))
                        }}
                        className="mt-1"
                      />
                    </div>

                    {/* Node-specific configuration */}
                    {selectedNode.type === "trigger" && selectedNode.title.includes("Schedule") && (
                      <div>
                        <Label className="text-xs">Schedule</Label>
                        <Select onValueChange={(value) => updateNodeConfig(selectedNode.id, { schedule: value })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {selectedNode.type === "action" && selectedNode.title.includes("Email") && (
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs">Email Template</Label>
                          <Select onValueChange={(value) => updateNodeConfig(selectedNode.id, { template: value })}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="welcome">Welcome Email</SelectItem>
                              <SelectItem value="reminder">Assignment Reminder</SelectItem>
                              <SelectItem value="grade">Grade Notification</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Recipients</Label>
                          <Select onValueChange={(value) => updateNodeConfig(selectedNode.id, { recipients: value })}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select recipients" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="students">All Students</SelectItem>
                              <SelectItem value="parents">Parents</SelectItem>
                              <SelectItem value="teachers">Teachers</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 text-sm">
                    <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Select a node to view its properties</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Configuration</CardTitle>
              <CardDescription>Configure global workflow settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Execution Mode</Label>
                    <Select defaultValue="automatic">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority Level</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Error Handling</Label>
                    <Select defaultValue="retry">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stop">Stop on Error</SelectItem>
                        <SelectItem value="retry">Retry on Error</SelectItem>
                        <SelectItem value="continue">Continue on Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Notification Settings</Label>
                    <Select defaultValue="errors">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Notifications</SelectItem>
                        <SelectItem value="errors">Errors Only</SelectItem>
                        <SelectItem value="all">All Events</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Preview</CardTitle>
              <CardDescription>Review your workflow before saving</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <h3 className="font-medium">{workflowName || "Untitled Workflow"}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {workflowDescription || "No description provided"}
                    </p>
                  </div>
                  <Badge variant="outline">{nodes.length} nodes</Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Workflow Steps:</h4>
                  {nodes.length > 0 ? (
                    <div className="space-y-2">
                      {nodes.map((node, index) => (
                        <div key={node.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full text-xs font-medium">
                            {index + 1}
                          </div>
                          <node.icon className="h-4 w-4" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{node.title}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{node.description}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {node.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Workflow className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No workflow steps defined</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
