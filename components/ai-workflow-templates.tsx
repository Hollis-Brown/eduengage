"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Star,
  Download,
  Eye,
  Clock,
  Users,
  Brain,
  Mail,
  FileText,
  BarChart3,
  Settings,
  CheckCircle,
  Play,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  complexity: "Simple" | "Medium" | "Advanced"
  estimatedTime: string
  features: string[]
  rating: number
  downloads: number
  preview?: string
  nodes?: number
  aiPowered?: boolean
}

interface AIWorkflowTemplatesProps {
  templates: WorkflowTemplate[]
}

const allTemplates: WorkflowTemplate[] = [
  {
    id: "t1",
    name: "Student Onboarding",
    description: "Automated workflow for new student registration and setup",
    category: "Onboarding",
    complexity: "Simple",
    estimatedTime: "5 minutes",
    features: ["Email notifications", "Account setup", "Welcome materials"],
    rating: 4.8,
    downloads: 1247,
    nodes: 6,
    aiPowered: false,
  },
  {
    id: "t2",
    name: "Assignment Distribution",
    description: "Automatically distribute assignments based on student level and progress",
    category: "Assessment",
    complexity: "Medium",
    estimatedTime: "10 minutes",
    features: ["AI matching", "Deadline management", "Progress tracking"],
    rating: 4.9,
    downloads: 892,
    nodes: 8,
    aiPowered: true,
  },
  {
    id: "t3",
    name: "Parent Communication",
    description: "Automated progress reports and communication with parents",
    category: "Communication",
    complexity: "Advanced",
    estimatedTime: "15 minutes",
    features: ["Report generation", "Email automation", "Custom templates"],
    rating: 4.7,
    downloads: 634,
    nodes: 12,
    aiPowered: false,
  },
  {
    id: "t4",
    name: "AI-Powered Grading",
    description: "Intelligent assignment grading with personalized feedback",
    category: "Assessment",
    complexity: "Advanced",
    estimatedTime: "20 minutes",
    features: ["AI grading", "Feedback generation", "Plagiarism detection"],
    rating: 4.9,
    downloads: 1156,
    nodes: 10,
    aiPowered: true,
  },
  {
    id: "t5",
    name: "Attendance Monitoring",
    description: "Track student attendance and send automated alerts",
    category: "Analytics",
    complexity: "Simple",
    estimatedTime: "8 minutes",
    features: ["Real-time tracking", "Alert system", "Parent notifications"],
    rating: 4.6,
    downloads: 743,
    nodes: 5,
    aiPowered: false,
  },
  {
    id: "t6",
    name: "Learning Path Optimization",
    description: "AI-driven personalized learning path recommendations",
    category: "AI Learning",
    complexity: "Advanced",
    estimatedTime: "25 minutes",
    features: ["AI recommendations", "Progress analysis", "Adaptive content"],
    rating: 4.8,
    downloads: 567,
    nodes: 15,
    aiPowered: true,
  },
  {
    id: "t7",
    name: "Exam Scheduling",
    description: "Automated exam scheduling and room allocation",
    category: "Scheduling",
    complexity: "Medium",
    estimatedTime: "12 minutes",
    features: ["Conflict detection", "Room optimization", "Student notifications"],
    rating: 4.5,
    downloads: 423,
    nodes: 9,
    aiPowered: false,
  },
  {
    id: "t8",
    name: "Content Recommendation Engine",
    description: "AI-powered content suggestions based on student performance",
    category: "AI Learning",
    complexity: "Advanced",
    estimatedTime: "30 minutes",
    features: ["ML algorithms", "Performance analysis", "Content matching"],
    rating: 4.9,
    downloads: 789,
    nodes: 18,
    aiPowered: true,
  },
]

const categories = ["All", "Onboarding", "Assessment", "Communication", "Analytics", "AI Learning", "Scheduling"]
const complexityLevels = ["All", "Simple", "Medium", "Advanced"]

export function AIWorkflowTemplates({ templates: propTemplates }: AIWorkflowTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedComplexity, setSelectedComplexity] = useState("All")
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)
  const { toast } = useToast()

  const useTemplate = (template: WorkflowTemplate) => {
    toast({
      title: "Template Applied",
      description: `"${template.name}" template has been loaded into the workflow builder.`,
    })
  }

  const previewTemplate = (template: WorkflowTemplate) => {
    setSelectedTemplate(template)
  }

  const downloadTemplate = (template: WorkflowTemplate) => {
    const templateData = {
      ...template,
      downloadedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${template.name.replace(/\s+/g, "_")}_template.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Template Downloaded",
      description: `"${template.name}" template has been downloaded.`,
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Onboarding":
        return Users
      case "Assessment":
        return FileText
      case "Communication":
        return Mail
      case "Analytics":
        return BarChart3
      case "AI Learning":
        return Brain
      case "Scheduling":
        return Clock
      default:
        return Settings
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Simple":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  // Use provided templates or fallback to all templates
  const templates = propTemplates.length > 0 ? propTemplates : allTemplates

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    const matchesComplexity = selectedComplexity === "All" || template.complexity === selectedComplexity

    return matchesSearch && matchesCategory && matchesComplexity
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            AI Workflow Templates
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Pre-built workflows powered by artificial intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-4 lg:grid-cols-7">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Complexity</label>
          <Tabs value={selectedComplexity} onValueChange={setSelectedComplexity}>
            <TabsList className="grid grid-cols-4">
              {complexityLevels.map((level) => (
                <TabsTrigger key={level} value={level} className="text-xs">
                  {level}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => {
          const CategoryIcon = getCategoryIcon(template.category)

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="h-5 w-5 text-blue-600" />
                      {template.aiPowered && <Brain className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {template.rating}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-sm">{template.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <Badge className={getComplexityColor(template.complexity)}>{template.complexity}</Badge>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      {template.estimatedTime}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {template.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {template.downloads} downloads
                    </div>
                    <div className="flex items-center gap-1">
                      <Settings className="h-3 w-3" />
                      {template.nodes} nodes
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1" onClick={() => useTemplate(template)}>
                      <Play className="h-4 w-4 mr-1" />
                      Use Template
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => previewTemplate(template)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => downloadTemplate(template)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No templates found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or browse all templates.
          </p>
        </div>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedTemplate.aiPowered && <Brain className="h-5 w-5 text-purple-600" />}
                    {selectedTemplate.name}
                  </CardTitle>
                  <CardDescription>{selectedTemplate.description}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Category:</span> {selectedTemplate.category}
                </div>
                <div>
                  <span className="font-medium">Complexity:</span> {selectedTemplate.complexity}
                </div>
                <div>
                  <span className="font-medium">Estimated Time:</span> {selectedTemplate.estimatedTime}
                </div>
                <div>
                  <span className="font-medium">Nodes:</span> {selectedTemplate.nodes}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Features:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedTemplate.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={() => {
                    useTemplate(selectedTemplate)
                    setSelectedTemplate(null)
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Use This Template
                </Button>
                <Button variant="outline" onClick={() => downloadTemplate(selectedTemplate)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
