"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart3, LineChartIcon, PieChart } from "lucide-react"

interface AdvancedAnalyticsChartProps {
  data: any[]
  type?: string
}

export function AdvancedAnalyticsChart({ data, type = "engagement" }: AdvancedAnalyticsChartProps) {
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line")
  const [timeRange, setTimeRange] = useState("7d")

  // Determine which keys to display based on the chart type
  const getChartKeys = () => {
    switch (type) {
      case "engagement":
        return ["students", "engagement", "completion"]
      case "performance":
        return ["students", "completion", "retention"]
      default:
        return Object.keys(data[0]).filter((key) => key !== "date" && key !== "week" && key !== "day")
    }
  }

  const chartKeys = getChartKeys()

  // Get the domain key (x-axis)
  const domainKey = data[0].date ? "date" : data[0].week ? "week" : "day"

  // Color mapping for different metrics
  const colorMap: Record<string, string> = {
    students: "var(--color-students, hsl(var(--chart-1)))",
    engagement: "var(--color-engagement, hsl(var(--chart-2)))",
    completion: "var(--color-completion, hsl(var(--chart-3)))",
    retention: "var(--color-retention, hsl(var(--chart-4)))",
    aiUsage: "var(--color-aiUsage, hsl(var(--chart-5)))",
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={chartType === "line" ? "default" : "outline"}
            onClick={() => setChartType("line")}
            className="h-8 w-8 p-0"
          >
            <LineChartIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={chartType === "bar" ? "default" : "outline"}
            onClick={() => setChartType("bar")}
            className="h-8 w-8 p-0"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={chartType === "area" ? "default" : "outline"}
            onClick={() => setChartType("area")}
            className="h-8 w-8 p-0"
          >
            <PieChart className="h-4 w-4" />
          </Button>
        </div>
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
      </div>

      <ChartContainer
        config={{
          students: {
            label: "Students",
            color: "hsl(var(--chart-1))",
          },
          engagement: {
            label: "Engagement",
            color: "hsl(var(--chart-2))",
          },
          completion: {
            label: "Completion",
            color: "hsl(var(--chart-3))",
          },
          retention: {
            label: "Retention",
            color: "hsl(var(--chart-4))",
          },
          aiUsage: {
            label: "AI Usage",
            color: "hsl(var(--chart-5))",
          },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={domainKey} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {chartKeys.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colorMap[key]}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          ) : chartType === "bar" ? (
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={domainKey} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {chartKeys.map((key, index) => (
                <Bar key={key} dataKey={key} fill={colorMap[key]} />
              ))}
            </BarChart>
          ) : (
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={domainKey} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {chartKeys.map((key) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colorMap[key]}
                  fill={colorMap[key]}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
