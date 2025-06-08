"use client"

import { UserButton, SignInButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  const { isSignedIn, user } = useUser()

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          EduEngage Platform
        </Link>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <span className="text-sm text-gray-600">Welcome, {user?.firstName || "User"}!</span>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}
