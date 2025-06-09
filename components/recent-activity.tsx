"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, FileText, MessageSquare, Video, Clock } from "lucide-react"

const activities = [
  {
    id: 1,
    user: "Sarah Johnson",
    action: "completed",
    target: "Math Assignment #5",
    time: "2 minutes ago",
    type: "assignment",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    user: "Mike Chen",
    action: "joined",
    target: "Science Study Group",
    time: "15 minutes ago",
    type: "collaboration",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    user: "Emily Davis",
    action: "submitted",
    target: "English Essay Draft",
    time: "1 hour ago",
    type: "submission",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    user: "Alex Rodriguez",
    action: "started",
    target: "Chemistry Lab Session",
    time: "2 hours ago",
    type: "lab",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    user: "Lisa Wang",
    action: "commented on",
    target: "History Discussion",
    time: "3 hours ago",
    type: "discussion",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "assignment":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "collaboration":
      return <Video className="h-4 w-4 text-blue-600" />
    case "submission":
      return <FileText className="h-4 w-4 text-purple-600" />
    case "discussion":
      return <MessageSquare className="h-4 w-4 text-orange-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case "assignment":
      return "bg-green-100 dark:bg-green-900"
    case "collaboration":
      return "bg-blue-100 dark:bg-blue-900"
    case "submission":
      return "bg-purple-100 dark:bg-purple-900"
    case "discussion":
      return "bg-orange-100 dark:bg-orange-900"
    default:
      return "bg-gray-100 dark:bg-gray-800"
  }
}

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {activity.user
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <div className={`p-1 rounded-full ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <p className="text-sm text-gray-900 dark:text-white">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
          </div>
        </div>
      ))}

      <div className="text-center pt-4">
        <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">View all activity</button>
      </div>
    </div>
  )
}
