"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AdvancedAnalyticsChart } from "@/components/advanced-analytics-chart"
import { RealTimeMetrics } from "@/components/real-time-metrics"
import { PredictiveAnalytics } from "@/components/predictive-analytics"
import { StudentEngagementHeatmap } from "@/components/student-engagement-heatmap"
import { useAuth } from "@/components/auth-provider"
import {
  BarChart3,
  TrendingUp,
  Users,
  Brain,
  Download,
  Filter,
  AlertTriangle,
  Sparkles,
  Lightbulb,
  FileText,
} from "lucide-react"

const analyticsData = {
  overview: {
    totalStudents: 1247,
    activeToday: 892,
    completionRate: 87.3,
    engagementScore: 94.2,
    averageSessionTime: 45.6,
    dropoutRisk: 23,
    aiInteractions: 2847,
    virtualClassroomHours: 156.7,
  },
  trends: {
    daily: [
      { date: "2024-01-01", students: 234, engagement: 78, completion: 85, aiUsage: 45 },
      { date: "2024-01-02", students: 267, engagement: 82, completion: 87, aiUsage: 52 },
      { date: "2024-01-03", students: 298, engagement: 85, completion: 89, aiUsage: 58 },
      { date: "2024-01-04", students: 312, engagement: 88, completion: 91, aiUsage: 63 },
      { date: "2024-01-05", students: 289, engagement: 84, completion: 88, aiUsage: 59 },
      { date: "2024-01-06", students: 156, engagement: 65, completion: 72, aiUsage: 34 },
      { date: "2024-01-07", students: 134, engagement: 58, completion: 68, aiUsage: 28 },
    ],
    weekly: [
      { week: "Week 1", students: 1890, engagement: 82, completion: 86, retention: 94 },
      { week: "Week 2", students: 1945, engagement: 84, completion: 88, retention: 95 },
      { week: "Week 3", students: 2012, engagement: 87, completion: 90, retention: 96 },
      { week: "Week 4", students: 2089, engagement: 89, completion: 92, retention: 97 },
    ],
  },
  subjects: [
    { name: "Mathematics", students: 456, engagement: 92, completion: 89, difficulty: "High" },
    { name: "Science", students: 398, engagement: 88, completion: 91, difficulty: "Medium" },
    { name: "Literature", students: 234, engagement: 85, completion: 94, difficulty: "Low" },
    { name: "History", students: 189, engagement: 79, completion: 87, difficulty: "Medium" },
    { name: "Computer Science", students: 167, engagement: 96, completion: 85, difficulty: "High" },
  ],
  predictions: {
    nextWeekEngagement: 91.5,
    riskStudents: 34,
    recommendedInterventions: 12,
    expectedGrowth: 8.3,
  },
}

export default function AnalyticsPage() {
  const { user, userRole } = useAuth()
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("engagement")
  const [isRealTime, setIsRealTime] = useState(true)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                Advanced Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                AI-powered insights and predictive analytics for educational excellence
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Real-time Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Real-time Analytics Active</span>
                  <Badge variant="secondary">Live Data</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                  <Button size="sm" variant="outline" onClick={() => setIsRealTime(!isRealTime)}>
                    {isRealTime ? "Pause" : "Resume"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overview.totalStudents.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12.3%</span> from last month
                </p>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-600 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overview.engagementScore}%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+5.2%</span> from last week
                </p>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-600 rounded-full" style={{ width: "94%" }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
                <Brain className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overview.aiInteractions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-purple-600">+28.7%</span> this week
                </p>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-purple-600 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{analyticsData.overview.dropoutRisk}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">-3</span> from last week
                </p>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-red-600 rounded-full" style={{ width: "23%" }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Trends</CardTitle>
                  <CardDescription>Student participation over time with AI insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <AdvancedAnalyticsChart data={analyticsData.trends.daily} type="engagement" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Completion rates and engagement by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.subjects.map((subject, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{subject.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{subject.students} students</Badge>
                            <Badge
                              variant={
                                subject.difficulty === "High"
                                  ? "destructive"
                                  : subject.difficulty === "Medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {subject.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Engagement</span>
                              <span>{subject.engagement}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-blue-600 rounded-full"
                                style={{ width: `${subject.engagement}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Completion</span>
                              <span>{subject.completion}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-green-600 rounded-full"
                                style={{ width: `${subject.completion}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights Panel */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  AI-Generated Insights
                </CardTitle>
                <CardDescription>Automated analysis and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-300">Positive Trend</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Mathematics engagement increased 15% after implementing AI tutoring sessions.
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800 dark:text-yellow-300">Attention Needed</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      23 students showing early signs of disengagement. Recommend intervention.
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800 dark:text-blue-300">Recommendation</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Schedule more interactive sessions during 2-4 PM for optimal engagement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <StudentEngagementHeatmap />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Detailed performance analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <AdvancedAnalyticsChart data={analyticsData.trends.weekly} type="performance" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Current grade distribution across all subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { grade: "A", count: 234, percentage: 28.5, color: "bg-green-600" },
                      { grade: "B", count: 312, percentage: 38.1, color: "bg-blue-600" },
                      { grade: "C", count: 189, percentage: 23.1, color: "bg-yellow-600" },
                      { grade: "D", count: 67, percentage: 8.2, color: "bg-orange-600" },
                      { grade: "F", count: 18, percentage: 2.1, color: "bg-red-600" },
                    ].map((item) => (
                      <div key={item.grade} className="flex items-center gap-4">
                        <div className="w-8 text-center font-bold">{item.grade}</div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.count} students</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div
                              className={`h-2 ${item.color} rounded-full`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <PredictiveAnalytics data={analyticsData.predictions} />
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <RealTimeMetrics isActive={isRealTime} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Create custom reports for stakeholders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-24 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Student Progress Report</span>
                  </Button>
                  <Button className="h-24 flex flex-col gap-2" variant="outline">
                    <BarChart3 className="h-6 w-6" />
                    <span>Engagement Analytics</span>
                  </Button>
                  <Button className="h-24 flex flex-col gap-2" variant="outline">
                    <Brain className="h-6 w-6" />
                    <span>AI Insights Summary</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
