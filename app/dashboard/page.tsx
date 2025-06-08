import { ProtectedRoute } from "@/components/protected-route"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { AIAssistant } from "@/components/ai-assistant"
import { Messaging } from "@/components/messaging"
import { VideoCall } from "@/components/video-call"
import { WorkflowBuilder } from "@/components/workflow-builder"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">EduEngage Dashboard</h1>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="video">Video Calls</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="ai">
            <AIAssistant />
          </TabsContent>

          <TabsContent value="messaging">
            <Messaging roomId="general" roomName="General Discussion" />
          </TabsContent>

          <TabsContent value="video">
            <VideoCall roomName="Study Session" />
          </TabsContent>

          <TabsContent value="workflows">
            <WorkflowBuilder />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
