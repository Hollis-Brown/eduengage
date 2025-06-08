import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EduEngage - Transform Education with AI-Powered Engagement",
  description:
    "Elevate student engagement, foster collaborative brilliance, and ensure retention through AI-powered analytics and no-code customization.",
  keywords: "education, student engagement, AI analytics, collaboration, e-learning",
  openGraph: {
    title: "EduEngage - Transform Education with AI-Powered Engagement",
    description: "The future of educational technology is here.",
    type: "website",
    url: "https://eduengage.vercel.app",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
