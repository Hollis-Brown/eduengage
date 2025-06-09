"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Brain, Clock, Activity, AlertTriangle, Zap, RefreshCw } from "lucide-react"

interface RealTimeMetricsProps {
  isActive: boolean
}

export function RealTimeMetrics({ isActive = true }: RealTimeMetricsProps) {
  const [metrics, setMetrics] = useState({
    activeUsers: 342,
    aiInteractions: 87,
    averageEngagement: 78,
    alertCount: 3,
    responseTime: 1.2,
    cpuUsage: 42,
    memoryUsage: 38,
    networkLatency: 120,
  })

  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setMetrics((prev) => ({
        activeUsers: Math.max(300, Math.min(400, prev.activeUsers + Math.floor(Math.random() * 11) - 5)),
        aiInteractions: Math.max(70, Math.min(100, prev.aiInteractions + Math.floor(Math.random() * 7) - 3)),
        averageEngagement: Math.max(70, Math.min(90, prev.averageEngagement + Math.floor(Math.random() * 5) - 2)),
        alertCount: Math.max(
          0,
          Math.min(10, prev.alertCount + (Math.random() > 0.8 ? 1 : Math.random() > 0.8 ? -1 : 0)),
        ),
        responseTime: Math.max(0.8, Math.min(2.0, prev.responseTime + (Math.random() * 0.2 - 0.1))),
        cpuUsage: Math.max(30, Math.min(70, prev.cpuUsage + Math.floor(Math.random() * 7) - 3)),
        memoryUsage: Math.max(30, Math.min(60, prev.memoryUsage + Math.floor(Math.random() * 5) - 2)),
        networkLatency: Math.max(80, Math.min(200, prev.networkLatency + Math.floor(Math.random() * 21) - 10)),
      }))
      setLastUpdated(new Date())
    }, 3000)

    return () => clearInterval(interval)
  }, [isActive])

  const refreshData = () => {
    setMetrics({
      activeUsers: Math.floor(Math.random() * 100) + 300,
      aiInteractions: Math.floor(Math.random() * 30) + 70,
      averageEngagement: Math.floor(Math.random() * 20) + 70,
      alertCount: Math.floor(Math.random() * 5),
      responseTime: Math.random() + 1,
      cpuUsage: Math.floor(Math.random() * 40) + 30,
      memoryUsage: Math.floor(Math.random() * 30) + 30,
      networkLatency: Math.floor(Math.random() * 120) + 80,
    })
    setLastUpdated(new Date())
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-Time Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Live metrics updated every few seconds • Last update: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isActive ? "default" : "outline"} className={isActive ? "bg-green-600" : ""}>
            {isActive ? "Live" : "Paused"}
          </Badge>
          <Button size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Activity</TabsTrigger>
          <TabsTrigger value="ai">AI Performance</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeUsers}</div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>Target: 350</span>
                  <span className={metrics.activeUsers >= 350 ? "text-green-600" : "text-yellow-600"}>
                    {metrics.activeUsers >= 350 ? "Above target" : "Below target"}
                  </span>
                </div>
                <Progress value={(metrics.activeUsers / 400) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  Engagement Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.averageEngagement}%</div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>Target: 75%</span>
                  <span className={metrics.averageEngagement >= 75 ? "text-green-600" : "text-yellow-600"}>
                    {metrics.averageEngagement >= 75 ? "Above target" : "Below target"}
                  </span>
                </div>
                <Progress value={metrics.averageEngagement} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.alertCount}</div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>Target: &lt;5</span>
                  <span className={metrics.alertCount < 5 ? "text-green-600" : "text-red-600"}>
                    {metrics.alertCount < 5 ? "Within limit" : "Above limit"}
                  </span>
                </div>
                <Progress value={(metrics.alertCount / 10) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Live User Activity</CardTitle>
              <CardDescription>Real-time user interactions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "Joined virtual classroom",
                    user: "Sarah M.",
                    time: "Just now",
                    details: "Advanced Mathematics",
                  },
                  {
                    action: "Submitted assignment",
                    user: "Michael C.",
                    time: "1 minute ago",
                    details: "Physics Lab Report",
                  },
                  {
                    action: "Started AI tutoring session",
                    user: "Emma L.",
                    time: "2 minutes ago",
                    details: "Calculus Derivatives",
                  },
                  {
                    action: "Created study group",
                    user: "David W.",
                    time: "5 minutes ago",
                    details: "Literature Discussion",
                  },
                  {
                    action: "Completed quiz",
                    user: "Jessica T.",
                    time: "7 minutes ago",
                    details: "Chemistry Fundamentals",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                    <Badge variant="outline">{activity.details}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  AI Interactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.aiInteractions}/min</div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>Target: 80/min</span>
                  <span className={metrics.aiInteractions >= 80 ? "text-green-600" : "text-yellow-600"}>
                    {metrics.aiInteractions >= 80 ? "Above target" : "Below target"}
                  </span>
                </div>
                <Progress value={(metrics.aiInteractions / 100) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.responseTime.toFixed(1)}s</div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>Target: &lt;1.5s</span>
                  <span className={metrics.responseTime < 1.5 ? "text-green-600" : "text-yellow-600"}>
                    {metrics.responseTime < 1.5 ? "Within target" : "Above target"}
                  </span>
                </div>
                <Progress value={(metrics.responseTime / 2) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  AI Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.7%</div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>Target: 90%</span>
                  <span className="text-green-600">Above target</span>
                </div>
                <Progress value={94.7} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Model Performance</CardTitle>
              <CardDescription>Real-time performance metrics for AI models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    model: "Learning Path Optimizer",
                    status: "Operational",
                    accuracy: "96.3%",
                    load: "Medium",
                  },
                  {
                    model: "Content Generator",
                    status: "Operational",
                    accuracy: "94.8%",
                    load: "High",
                  },
                  {
                    model: "Engagement Analyzer",
                    status: "Operational",
                    accuracy: "92.5%",
                    load: "Low",
                  },
                  {
                    model: "Auto-Grader",
                    status: "Operational",
                    accuracy: "95.1%",
                    load: "Medium",
                  },
                  {
                    model: "Emotional Intelligence",
                    status: "Operational",
                    accuracy: "89.7%",
                    load: "Low",
                  },
                ].map((model, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{model.model}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy: {model.accuracy}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          model.load === "High"
                            ? "text-yellow-600 border-yellow-600"
                            : model.load === "Medium"
                              ? "text-blue-600 border-blue-600"
                              : "text-green-600 border-green-600"
                        }
                      >
                        {model.load} Load
                      </Badge>
                      <Badge className="bg-green-600">Online</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.cpuUsage}%</div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>Target: &lt;60%</span>
                  <span className={metrics.cpuUsage < 60 ? "text-green-600" : "text-yellow-600"}>
                    {metrics.cpuUsage < 60 ? "Within limit" : "High usage"}
                  </span>
                </div>
                <Progress
                  value={metrics.cpuUsage}
                  className={`h-2 mt-2 ${metrics.cpuUsage > 70 ? "bg-red-200" : ""}`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.memoryUsage}%</div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>Target: &lt;50%</span>
                  <span className={metrics.memoryUsage < 50 ? "text-green-600" : "text-yellow-600"}>
                    {metrics.memoryUsage < 50 ? "Within limit" : "High usage"}
                  </span>
                </div>
                <Progress
                  value={metrics.memoryUsage}
                  className={`h-2 mt-2 ${metrics.memoryUsage > 60 ? "bg-red-200" : ""}`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Network Latency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.networkLatency} ms</div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>Target: &lt;150ms</span>
                  <span className={metrics.networkLatency < 150 ? "text-green-600" : "text-yellow-600"}>
                    {metrics.networkLatency < 150 ? "Good" : "High latency"}
                  </span>
                </div>
                <Progress
                  value={(metrics.networkLatency / 200) * 100}
                  className={`h-2 mt-2 ${metrics.networkLatency > 150 ? "bg-red-200" : ""}`}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current status of all system components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    component: "Database Cluster",
                    status: "Operational",
                    uptime: "99.99%",
                    lastIncident: "None",
                  },
                  {
                    component: "API Gateway",
                    status: "Operational",
                    uptime: "99.98%",
                    lastIncident: "3 days ago",
                  },
                  {
                    component: "Authentication Service",
                    status: "Operational",
                    uptime: "100%",
                    lastIncident: "None",
                  },
                  {
                    component: "Storage Service",
                    status: "Operational",
                    uptime: "99.95%",
                    lastIncident: "1 week ago",
                  },
                  {
                    component: "AI Processing Cluster",
                    status: "Operational",
                    uptime: "99.97%",
                    lastIncident: "2 days ago",
                  },
                ].map((component, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{component.component}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Uptime: {component.uptime}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Last incident: {component.lastIncident}</span>
                      <Badge className="bg-green-600">{component.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
