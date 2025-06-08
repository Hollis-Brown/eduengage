"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

const LoginPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add actual login logic here
    toast({
      title: "Login Successful",
      description: "Welcome back to EduEngage!",
    })
    // Redirect to dashboard
    window.location.href = "/dashboard"
  }

  return (
    <div className="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">EduEngage</div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">&ldquo;This application has saved me countless hours!&rdquo;</p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login to your account</h1>
            <p className="text-sm text-muted-foreground">Enter your email below to login to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="m@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button className="w-full">Login</Button>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-2 hover:text-brand-600">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-2 hover:text-brand-600">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
