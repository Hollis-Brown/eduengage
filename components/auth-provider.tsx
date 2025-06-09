"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  userRole: "admin" | "student" | "parent" | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userRole: null,
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<"admin" | "student" | "parent" | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        // In a real app, you'd fetch the user role from Firestore
        // For demo purposes, we'll simulate role assignment
        const email = user.email || ""
        if (email.includes("admin") || email.includes("teacher")) {
          setUserRole("admin")
        } else if (email.includes("parent")) {
          setUserRole("parent")
        } else {
          setUserRole("student")
        }
      } else {
        setUserRole(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  return <AuthContext.Provider value={{ user, loading, userRole }}>{children}</AuthContext.Provider>
}
