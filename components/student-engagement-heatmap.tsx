"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Filter, Download } from "lucide-react"

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
            hour: `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? "AM" : "PM"}`,
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
          <p className="text-gray-600 dark:text-gray-400">Visualize engagement patterns across time periods</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Weekly Engagement Patterns</CardTitle>
          <CardDescription>Student engagement levels throughout the week (higher is better)</CardDescription>
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
                        hour.engagement,
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
    </div>
  )
}
