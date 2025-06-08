"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Brain,
  Zap,
  Camera,
  Save,
  Download,
  Upload,
  Trash2,
  Key,
  Smartphone,
  Mail,
  Lock,
  Monitor,
  Volume2,
  Sparkles,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [settings, setSettings] = useState({
    profile: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      bio: "Passionate about learning and education technology.",
      institution: "University of Technology",
      role: "Student",
      timezone: "UTC-5",
      language: "English",
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      assignmentReminders: true,
      gradeUpdates: true,
      classroomInvites: true,
      aiSuggestions: true,
      weeklyReports: true,
      marketingEmails: false,
    },
    privacy: {
      profileVisibility: "public",
      showOnlineStatus: true,
      allowDirectMessages: true,
      shareAnalytics: true,
      dataCollection: true,
      thirdPartyIntegrations: true,
    },
    ai: {
      aiAssistant: true,
      personalizedRecommendations: true,
      autoGrading: true,
      smartNotifications: true,
      learningPathOptimization: true,
      emotionalAnalysis: false,
      voiceInteraction: true,
      aiModerationLevel: "medium",
    },
    appearance: {
      theme: "light",
      fontSize: "medium",
      colorScheme: "blue",
      compactMode: false,
      animations: true,
      soundEffects: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: "30",
      loginAlerts: true,
      deviceManagement: true,
      passwordExpiry: "90",
    },
  })
  const { toast } = useToast()

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  const exportData = () => {
    toast({
      title: "Data Export Started",
      description: "Your data export will be ready for download shortly.",
    })
  }

  const deleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="h-8 w-8 text-blue-600" />
                Settings & Preferences
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Customize your EduEngage experience and manage your account
              </p>
            </div>
            <Button onClick={saveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </motion.div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="ai">AI Settings</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-2xl">
                      {settings.profile.firstName[0]}
                      {settings.profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button>
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <Button variant="outline">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={settings.profile.firstName}
                      onChange={(e) => updateSetting("profile", "firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={settings.profile.lastName}
                      onChange={(e) => updateSetting("profile", "lastName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateSetting("profile", "email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={settings.profile.institution}
                      onChange={(e) => updateSetting("profile", "institution", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.profile.timezone}
                      onValueChange={(value) => updateSetting("profile", "timezone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.profile.language}
                      onValueChange={(value) => updateSetting("profile", "language", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={settings.profile.bio}
                    onChange={(e) => updateSetting("profile", "bio", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how and when you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notification Channels */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.emailNotifications}
                        onCheckedChange={(checked) => updateSetting("notifications", "emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive push notifications in your browser
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.pushNotifications}
                        onCheckedChange={(checked) => updateSetting("notifications", "pushNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Receive important alerts via SMS</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.smsNotifications}
                        onCheckedChange={(checked) => updateSetting("notifications", "smsNotifications", checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Types */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  <div className="space-y-4">
                    {[
                      {
                        key: "assignmentReminders",
                        title: "Assignment Reminders",
                        description: "Get reminded about upcoming assignments and deadlines",
                      },
                      {
                        key: "gradeUpdates",
                        title: "Grade Updates",
                        description: "Notifications when grades are posted or updated",
                      },
                      {
                        key: "classroomInvites",
                        title: "Classroom Invites",
                        description: "Invitations to join virtual classrooms and study groups",
                      },
                      {
                        key: "aiSuggestions",
                        title: "AI Suggestions",
                        description: "Personalized learning recommendations from AI",
                      },
                      {
                        key: "weeklyReports",
                        title: "Weekly Reports",
                        description: "Summary of your weekly progress and achievements",
                      },
                      {
                        key: "marketingEmails",
                        title: "Marketing Emails",
                        description: "Updates about new features and educational content",
                      },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                        <Switch
                          checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                          onCheckedChange={(checked) => updateSetting("notifications", item.key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Data
                </CardTitle>
                <CardDescription>Control your privacy settings and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Who can see your profile information</p>
                    </div>
                    <Select
                      value={settings.privacy.profileVisibility}
                      onValueChange={(value) => updateSetting("privacy", "profileVisibility", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="institution">Institution Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {[
                    {
                      key: "showOnlineStatus",
                      title: "Show Online Status",
                      description: "Let others see when you're online",
                    },
                    {
                      key: "allowDirectMessages",
                      title: "Allow Direct Messages",
                      description: "Allow other users to send you direct messages",
                    },
                    {
                      key: "shareAnalytics",
                      title: "Share Analytics",
                      description: "Share anonymized learning analytics to improve the platform",
                    },
                    {
                      key: "dataCollection",
                      title: "Data Collection",
                      description: "Allow collection of usage data for personalization",
                    },
                    {
                      key: "thirdPartyIntegrations",
                      title: "Third-party Integrations",
                      description: "Allow integration with external educational tools",
                    },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                      </div>
                      <Switch
                        checked={settings.privacy[item.key as keyof typeof settings.privacy] as boolean}
                        onCheckedChange={(checked) => updateSetting("privacy", item.key, checked)}
                      />
                    </div>
                  ))}
                </div>

                {/* Data Management */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-medium">Data Management</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" onClick={exportData}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                    <Button variant="destructive" onClick={deleteAccount}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI & Automation
                </CardTitle>
                <CardDescription>Configure AI features and automation preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      key: "aiAssistant",
                      title: "AI Assistant",
                      description: "Enable the AI learning assistant for personalized help",
                      icon: Brain,
                    },
                    {
                      key: "personalizedRecommendations",
                      title: "Personalized Recommendations",
                      description: "Get AI-powered learning path suggestions",
                      icon: Sparkles,
                    },
                    {
                      key: "autoGrading",
                      title: "Automatic Grading",
                      description: "Allow AI to grade assignments and provide feedback",
                      icon: CheckCircle,
                    },
                    {
                      key: "smartNotifications",
                      title: "Smart Notifications",
                      description: "AI-optimized notification timing and content",
                      icon: Bell,
                    },
                    {
                      key: "learningPathOptimization",
                      title: "Learning Path Optimization",
                      description: "Automatically adjust learning paths based on progress",
                      icon: Zap,
                    },
                    {
                      key: "emotionalAnalysis",
                      title: "Emotional Analysis",
                      description: "Analyze engagement patterns to provide emotional support",
                      icon: AlertTriangle,
                    },
                    {
                      key: "voiceInteraction",
                      title: "Voice Interaction",
                      description: "Enable voice commands and speech recognition",
                      icon: Volume2,
                    },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.ai[item.key as keyof typeof settings.ai] as boolean}
                        onCheckedChange={(checked) => updateSetting("ai", item.key, checked)}
                      />
                    </div>
                  ))}
                </div>

                {/* AI Moderation Level */}
                <div className="space-y-2">
                  <Label>AI Moderation Level</Label>
                  <Select
                    value={settings.ai.aiModerationLevel}
                    onValueChange={(value) => updateSetting("ai", "aiModerationLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Minimal AI intervention</SelectItem>
                      <SelectItem value="medium">Medium - Balanced AI assistance</SelectItem>
                      <SelectItem value="high">High - Maximum AI guidance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance & Display
                </CardTitle>
                <CardDescription>Customize the look and feel of your interface</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
                    </div>
                    <Select
                      value={settings.appearance.theme}
                      onValueChange={(value) => updateSetting("appearance", "theme", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Font Size</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Adjust text size for readability</p>
                    </div>
                    <Select
                      value={settings.appearance.fontSize}
                      onValueChange={(value) => updateSetting("appearance", "fontSize", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Color Scheme</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Choose your accent color</p>
                    </div>
                    <Select
                      value={settings.appearance.colorScheme}
                      onValueChange={(value) => updateSetting("appearance", "colorScheme", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {[
                    {
                      key: "compactMode",
                      title: "Compact Mode",
                      description: "Use a more compact interface layout",
                    },
                    {
                      key: "animations",
                      title: "Animations",
                      description: "Enable smooth animations and transitions",
                    },
                    {
                      key: "soundEffects",
                      title: "Sound Effects",
                      description: "Play sounds for notifications and interactions",
                    },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                      </div>
                      <Switch
                        checked={settings.appearance[item.key as keyof typeof settings.appearance] as boolean}
                        onCheckedChange={(checked) => updateSetting("appearance", item.key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security & Authentication
                </CardTitle>
                <CardDescription>Manage your account security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {settings.security.twoFactorAuth ? (
                        <Badge className="bg-green-600">Enabled</Badge>
                      ) : (
                        <Badge variant="outline">Disabled</Badge>
                      )}
                      <Switch
                        checked={settings.security.twoFactorAuth}
                        onCheckedChange={(checked) => updateSetting("security", "twoFactorAuth", checked)}
                      />
                    </div>
                  </div>

                  {/* Session Settings */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Session Timeout</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Automatically log out after inactivity</p>
                    </div>
                    <Select
                      value={settings.security.sessionTimeout}
                      onValueChange={(value) => updateSetting("security", "sessionTimeout", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {[
                    {
                      key: "loginAlerts",
                      title: "Login Alerts",
                      description: "Get notified of new login attempts",
                    },
                    {
                      key: "deviceManagement",
                      title: "Device Management",
                      description: "Track and manage logged-in devices",
                    },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                      </div>
                      <Switch
                        checked={settings.security[item.key as keyof typeof settings.security] as boolean}
                        onCheckedChange={(checked) => updateSetting("security", item.key, checked)}
                      />
                    </div>
                  ))}
                </div>

                {/* Password Settings */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-medium">Password & Recovery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Update Recovery Email
                    </Button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-medium">Active Sessions</h3>
                  <div className="space-y-3">
                    {[
                      {
                        device: "Chrome on Windows",
                        location: "New York, NY",
                        lastActive: "Current session",
                        current: true,
                      },
                      {
                        device: "Safari on iPhone",
                        location: "New York, NY",
                        lastActive: "2 hours ago",
                        current: false,
                      },
                      {
                        device: "Firefox on Mac",
                        location: "Boston, MA",
                        lastActive: "1 day ago",
                        current: false,
                      },
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Monitor className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium">{session.device}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {session.location} • {session.lastActive}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.current && <Badge className="bg-green-600">Current</Badge>}
                          {!session.current && (
                            <Button size="sm" variant="outline">
                              Revoke
                            </Button>
                          )}
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
    </DashboardLayout>
  )
}
