"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, Pause, Trash2, Settings } from "lucide-react"
import { createWorkflow, getWorkflows, updateWorkflow, deleteWorkflow, type Workflow } from "@/lib/workflows"

export function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newWorkflowName, setNewWorkflowName] = useState("")

  useEffect(() => {
    loadWorkflows()
  }, [])

  const loadWorkflows = async () => {
    try {
      const data = await getWorkflows()
      setWorkflows(data)
    } catch (error) {
      console.error("Failed to load workflows:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateWorkflow = async () => {
    if (!newWorkflowName.trim()) return

    try {
      const id = await createWorkflow({
        name: newWorkflowName,
        description: "New workflow",
        steps: [],
        isActive: false,
      })

      setNewWorkflowName("")
      loadWorkflows()
    } catch (error) {
      console.error("Failed to create workflow:", error)
    }
  }

  const toggleWorkflow = async (workflow: Workflow) => {
    try {
      await updateWorkflow(workflow.id, { isActive: !workflow.isActive })
      loadWorkflows()
    } catch (error) {
      console.error("Failed to toggle workflow:", error)
    }
  }

  const handleDeleteWorkflow = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workflow?")) return

    try {
      await deleteWorkflow(id)
      loadWorkflows()
    } catch (error) {
      console.error("Failed to delete workflow:", error)
    }
  }

  if (isLoading) {
    return <div>Loading workflows...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Workflow name..."
              value={newWorkflowName}
              onChange={(e) => setNewWorkflowName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateWorkflow()}
            />
            <Button onClick={handleCreateWorkflow} disabled={!newWorkflowName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{workflow.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={workflow.isActive ? "default" : "secondary"}>
                    {workflow.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => toggleWorkflow(workflow)}>
                    {workflow.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteWorkflow(workflow.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">{workflow.steps.length} steps configured</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {workflows.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No workflows created yet. Create your first workflow above!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
