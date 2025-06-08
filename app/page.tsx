"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, MessageSquare, Video, Workflow, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to EduEngage Platform</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your complete educational engagement solution with AI assistance, real-time collaboration, and powerful
            analytics.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-3">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Get instant help with your studies from our intelligent AI tutor.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-green-600" />
                Real-time Messaging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Collaborate with classmates and instructors in real-time chat rooms.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-6 w-6 text-purple-600" />
                Video Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Join virtual study sessions and online classes with HD video.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-orange-600" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Track your progress and performance with detailed insights.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-6 w-6 text-red-600" />
                Workflows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Automate your educational processes with custom workflows.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
