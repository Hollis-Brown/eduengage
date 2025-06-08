"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Filter, Download, Users, Brain } from "lucide-react"

export function StudentEngagementHeatmap() {
  const [subject, setSubject] = useState("all")
  const [timeframe, setTimeframe] = useState("week")

  // Generate heatmap data
  const generateHeatmapData = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

    return days.map((day) => {
      return {
        day,
        hours: hours.map((hour) => {
          // Generate random engagement score between 0-100
          const baseEngagement = Math.floor(Math.random() * 60) + 20
          
          // Adjust based on patterns (weekdays higher, mid-day higher)
          let adjustedEngagement = baseEngagement
          
          // Weekday boost
          if (day !== "Saturday" && day !== "Sunday") {
            adjustedEngagement += 15
          }
          
          // Mid-day boost (11 AM - 3 PM)
          if (hour >= 11 && hour <= 15) {
            adjustedEngagement += 10
          }
          
          // Evening drop (after 5 PM)
          if (hour >= 17) {
            adjustedEngagement -= 15
          }
          
          // Cap at 100
          const finalEngagement = Math.min(100, Math.max(0, adjustedEngagement))
          
          return {
            hour: `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? 'AM' : 'PM'}`,
            engagement: finalEngagement,
            activeUsers: Math.floor((finalEngagement / 100) * 350),
          }
        }),
      }
    })
  }

  const heatmapData = generateHeatmapData()

  // Get color based on engagement level
  const getHeatColor = (value: number) => {
    if (value >= 80) return "bg-green-600"
    if (value >= 60) return "bg-green-500"
    if (value >= 40) return "bg-yellow-500"
    if (value >= 20) return "bg-orange-500"
    return "bg-red-500"
  }

  // Get text color based on engagement level
  const getTextColor = (value: number) => {
    if (value >= 40) return "text-white"
    return "text-gray-900"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Student Engagement Heatmap</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize engagement patterns across time periods
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="literature">Literature</SelectItem>
              <SelectItem value="history">History</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="heatmap" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="heatmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Engagement Patterns</CardTitle>
              <CardDescription>
                Student engagement levels throughout the week (higher is better)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Hours header */}
                  <div className="flex">
                    <div className="w-24 shrink-0"></div>
                    {heatmapData[0].hours.map((hour, i) => (
                      <div key={i} className="flex-1 text-center text-sm font-medium py-2">
                        {hour.hour}
                      </div>
                    ))}
                  </div>

                  {/* Days and heatmap cells */}
                  {heatmapData.map((day, dayIndex) => (
                    <div key={dayIndex} className="flex">
                      <div className="w-24 shrink-0 py-3 font-medium">{day.day}</div>
                      {day.hours.map((hour, hourIndex) => (
                        <div
                          key={hourIndex}
                          className={`flex-1 m-1 p-2 rounded-md ${getHeatColor(hour.engagement)} ${getTextColor(
                            hour.engagement
                          )} text-center cursor-pointer hover:opacity-90 transition-opacity`}
                          title={`${day.day} at ${hour.hour}: ${hour.engagement}% engagement, ${hour.activeUsers} active users`}
                        >
                          {hour.engagement}%
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Engagement Level:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-xs">Low</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-xs">Below Average</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-xs">Average</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-xs">Good</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-600 rounded"></div>
                    <span className="text-xs">Excellent</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">May 1 - May 7, 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Peak Engagement Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Tuesday, 2PM</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  87% engagement rate, 304 active users
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Recommended for important content</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Lowest Engagement Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Sunday, 8AM</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  23% engagement rate, 81 active users
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Clock className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Avoid scheduling important activities</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">62.4%</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Across all time periods
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm">218 average active users</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI-Generated Engagement Insights
              </CardTitle>
              <CardDescription>Machine learning analysis of engagement patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-medium mb-2">Weekday Patterns</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Engagement is significantly higher on weekdays (average 72.3%) compared to weekends (average 41.8%). Tuesday and Wednesday show the highest engagement levels, suggesting these are optimal days for introducing new concepts or scheduling important activities.
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="font-medium mb-2">Time of Day Analysis</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Peak engagement occurs between 11AM and 3PM, with a notable drop after 5PM. Morning sessions (8AM-10AM) show moderate engagement (54.2%) but with high focus metrics, making them suitable for complex topics requiring concentration.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h3 className="font-medium mb-2">Subject-Specific Insights</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Mathematics shows highest engagement in morning hours (9AM-11AM), while Literature and History perform better in afternoon sessions (1PM-4PM). Science engagement is consistently high throughout the day but peaks at 2PM.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h3 className="font-medium mb-2">Engagement Anomalies</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Unusual engagement spikes detected on Thursday at 4PM (92.1%) correlating with interactive virtual classroom sessions. Saturday at 11AM shows unexpectedly high engagement (68.3%) for weekend hours, suggesting potential for scheduled weekend activities at this time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
              <CardDescription>AI-suggested actions to improve engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Schedule Critical Content Optimally",
                    description:
                      "Schedule important lectures and assessments on Tuesdays and Wednesdays between 11AM-2PM when engagement is highest.",
                    impact: "High",
                    effort: "Low",
                    tags: ["Scheduling", "Content Delivery"],
                  },
                  {
                    title: "Enhance Weekend Engagement",
                    description:
                      "Implement interactive, gamified content for weekend hours to boost the currently low engagement levels.",
                    impact: "Medium",
                    effort: "Medium",
                    tags: ["Gamification", "Weekend Strategy"],
                  },
                  {
                    title: "Subject-Specific Timing",
                    description:
                      "Reschedule Mathematics sessions to morning hours and Literature/History to afternoons based on engagement patterns.",
                    impact: "High",
                    effort: "Medium",
                    tags: ["Scheduling", "Subject Optimization"],
                  },
                  {
                    title: "Evening Engagement Boost",
                    description:
                      "Add short, high-interest content and AI-guided study sessions during evening hours (5PM-7PM) to improve the current drop in engagement.",
                    impact: "Medium",
                    effort: "High",
                    tags: ["Content Strategy", "AI Integration"],
                  },
                  {
                    title: "Replicate Thursday Success",
                    description:
                      "Analyze and replicate the interactive elements from Thursday 4PM sessions across other time slots.",
                    impact: "High",
                    effort: "Medium",
                    tags: ["Best Practices", "Interactive Learning"],
                  },
                ].map((recommendation, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{recommendation.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {recommendation.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {recommendation.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <Badge
                        variant="outline"
                        className={
                          recommendation.impact
