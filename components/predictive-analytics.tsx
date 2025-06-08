"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, AlertTriangle, Lightbulb, BarChart3, Calendar, RefreshCw } from "lucide-react"

interface PredictiveAnalyticsProps {
  data: {
    nextWeekEngagement: number
    riskStudents: number
    recommendedInterventions: number
    expectedGrowth: number
  }
}

export function PredictiveAnalytics({ data }: PredictiveAnalyticsProps) {
  const [predictionHorizon, setPredictionHorizon] = useState("1w")
  const [confidenceLevel, setConfidenceLevel] = useState("medium")

  // Adjust predictions based on selected horizon
  const getAdjustedPredictions = () => {
    const multiplier = predictionHorizon === "1w" ? 1 : predictionHorizon === "1m" ? 1.2 : 1.5
    return {
      nextWeekEngagement: Math.min(100, data.nextWeekEngagement * multiplier),
      riskStudents: Math.round(
        data.riskStudents * (predictionHorizon === "1w" ? 1 : predictionHorizon === "1m" ? 1.5 : 2.2),
      ),
      recommendedInterventions: Math.round(
        data.recommendedInterventions * (predictionHorizon === "1w" ? 1 : predictionHorizon === "1m" ? 1.8 : 2.5),
      ),
      expectedGrowth: data.expectedGrowth * (predictionHorizon === "1w" ? 1 : predictionHorizon === "1m" ? 1.3 : 1.7),
    }
  }

  const adjustedPredictions = getAdjustedPredictions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Predictive Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Machine learning-powered predictions and recommendations</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={predictionHorizon} onValueChange={setPredictionHorizon}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1w">Next Week</SelectItem>
              <SelectItem value="1m">Next Month</SelectItem>
              <SelectItem value="3m">Next Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Predicted Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adjustedPredictions.nextWeekEngagement.toFixed(1)}%</div>
            <div className="flex items-center justify-between mt-2 text-sm">
              <span>Current: {data.nextWeekEngagement.toFixed(1)}%</span>
              <span
                className={
                  adjustedPredictions.nextWeekEngagement > data.nextWeekEngagement ? "text-green-600" : "text-red-600"
                }
              >
                {adjustedPredictions.nextWeekEngagement > data.nextWeekEngagement ? "↑" : "↓"}{" "}
                {Math.abs(adjustedPredictions.nextWeekEngagement - data.nextWeekEngagement).toFixed(1)}%
              </span>
            </div>
            <Progress value={adjustedPredictions.nextWeekEngagement} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              At-Risk Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adjustedPredictions.riskStudents}</div>
            <div className="flex items-center justify-between mt-2 text-sm">
              <span>Current: {data.riskStudents}</span>
              <span className="text-red-600">↑ {adjustedPredictions.riskStudents - data.riskStudents} students</span>
            </div>
            <Progress value={(adjustedPredictions.riskStudents / 100) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              Recommended Interventions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adjustedPredictions.recommendedInterventions}</div>
            <div className="flex items-center justify-between mt-2 text-sm">
              <span>Priority: High</span>
              <span className="text-yellow-600">Requires attention</span>
            </div>
            <Progress value={(adjustedPredictions.recommendedInterventions / 50) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              Expected Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adjustedPredictions.expectedGrowth.toFixed(1)}%</div>
            <div className="flex items-center justify-between mt-2 text-sm">
              <span>Target: 5.0%</span>
              <span className={adjustedPredictions.expectedGrowth >= 5.0 ? "text-green-600" : "text-yellow-600"}>
                {adjustedPredictions.expectedGrowth >= 5.0 ? "On target" : "Below target"}
              </span>
            </div>
            <Progress value={(adjustedPredictions.expectedGrowth / 15) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="interventions">Recommended Interventions</TabsTrigger>
          <TabsTrigger value="models">Prediction Models</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>AI-generated insights based on predictive analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Engagement Trend</h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Student engagement is predicted to{" "}
                    {adjustedPredictions.nextWeekEngagement > data.nextWeekEngagement ? "increase" : "decrease"} by{" "}
                    {Math.abs(adjustedPredictions.nextWeekEngagement - data.nextWeekEngagement).toFixed(1)}% over the{" "}
                    {predictionHorizon === "1w"
                      ? "next week"
                      : predictionHorizon === "1m"
                        ? "next month"
                        : "next quarter"}
                    . This is primarily driven by increased AI tutoring sessions and interactive content.
                  </p>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h3 className="font-medium">Risk Assessment</h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {adjustedPredictions.riskStudents} students are predicted to be at risk of falling behind or
                    dropping out. The primary factors include decreased participation in Mathematics and Science
                    courses, and lower engagement with collaborative activities.
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">Growth Opportunities</h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Expected growth of {adjustedPredictions.expectedGrowth.toFixed(1)}% can be further improved by
                    implementing more interactive virtual classrooms and personalized learning paths. AI analysis
                    suggests focusing on collaborative projects could increase growth by an additional 2.3%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interventions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Interventions</CardTitle>
              <CardDescription>AI-suggested actions to improve outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Targeted Tutoring Sessions",
                    description:
                      "Schedule additional AI-powered tutoring sessions for the 15 students struggling with calculus concepts.",
                    impact: "High",
                    effort: "Medium",
                    deadline: "Next 7 days",
                  },
                  {
                    title: "Engagement Intervention",
                    description:
                      "Implement gamification elements in the Physics and Chemistry courses to boost participation.",
                    impact: "Medium",
                    effort: "Medium",
                    deadline: "Next 14 days",
                  },
                  {
                    title: "Content Optimization",
                    description:
                      "Restructure the Literature course content based on AI analysis of engagement patterns.",
                    impact: "Medium",
                    effort: "High",
                    deadline: "Next 30 days",
                  },
                  {
                    title: "At-Risk Student Outreach",
                    description:
                      "Conduct personalized check-ins with the 23 students showing early signs of disengagement.",
                    impact: "High",
                    effort: "High",
                    deadline: "Next 3 days",
                  },
                  {
                    title: "Learning Path Adjustment",
                    description:
                      "Modify the Computer Science learning path to include more interactive coding exercises.",
                    impact: "Medium",
                    effort: "Low",
                    deadline: "Next 10 days",
                  },
                ].map((intervention, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{intervention.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{intervention.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {intervention.deadline}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <Badge
                        variant="outline"
                        className={
                          intervention.impact === "High"
                            ? "border-green-500 text-green-700 dark:text-green-400"
                            : "border-yellow-500 text-yellow-700 dark:text-yellow-400"
                        }
                      >
                        {intervention.impact} Impact
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          intervention.effort === "Low"
                            ? "border-green-500 text-green-700 dark:text-green-400"
                            : intervention.effort === "Medium"
                              ? "border-yellow-500 text-yellow-700 dark:text-yellow-400"
                              : "border-red-500 text-red-700 dark:text-red-400"
                        }
                      >
                        {intervention.effort} Effort
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Models</CardTitle>
              <CardDescription>AI models used for predictive analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Confidence Level</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Adjust the confidence level of predictions
                    </p>
                  </div>
                  <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (80%)</SelectItem>
                      <SelectItem value="medium">Medium (90%)</SelectItem>
                      <SelectItem value="high">High (95%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      name: "Student Engagement Predictor",
                      type: "Gradient Boosting",
                      accuracy: "92.7%",
                      lastTrained: "2 days ago",
                      features: ["Historical engagement", "Content interaction", "Peer collaboration"],
                    },
                    {
                      name: "Dropout Risk Classifier",
                      type: "Random Forest",
                      accuracy: "89.3%",
                      lastTrained: "1 day ago",
                      features: ["Attendance patterns", "Assignment completion", "Quiz performance"],
                    },
                    {
                      name: "Learning Path Optimizer",
                      type: "Neural Network",
                      accuracy: "94.1%",
                      lastTrained: "3 days ago",
                      features: ["Learning style", "Performance history", "Content preferences"],
                    },
                    {
                      name: "Growth Predictor",
                      type: "Time Series LSTM",
                      accuracy: "91.8%",
                      lastTrained: "1 week ago",
                      features: ["Historical growth", "Intervention effects", "Seasonal patterns"],
                    },
                  ].map((model, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{model.name}</h3>
                        <Badge variant="outline">{model.type}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Accuracy</p>
                          <p className="font-medium">{model.accuracy}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Last Trained</p>
                          <p className="font-medium">{model.lastTrained}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Key Features</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {model.features.map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
