"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, User } from "lucide-react"

interface Task {
  id: string
  title: string
  status: "todo" | "in-progress" | "completed"
  assignedTo: string
  dueDate: string
  priority: "low" | "medium" | "high"
}

interface TaskBoardProps {
  tasks: Task[]
}

const statusColumns = [
  { id: "todo", title: "To Do", color: "bg-gray-100 dark:bg-gray-800" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-100 dark:bg-blue-900" },
  { id: "completed", title: "Completed", color: "bg-green-100 dark:bg-green-900" },
]

export function TaskBoard({ tasks }: TaskBoardProps) {
  const [taskList, setTaskList] = useState(tasks)

  const getTasksByStatus = (status: string) => {
    return taskList.filter((task) => task.status === status)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusColumns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
            <Badge variant="secondary">{getTasksByStatus(column.id).length}</Badge>
          </div>

          <div className={`min-h-[400px] p-4 rounded-lg ${column.color}`}>
            <AnimatePresence>
              {getTasksByStatus(column.id).map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="mb-3"
                >
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                          <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                            {task.priority}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                          <User className="h-3 w-3" />
                          <span>{task.assignedTo}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3" />
                          <span>Due: {task.dueDate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {column.id === "todo" && (
              <Button
                variant="ghost"
                className="w-full mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
