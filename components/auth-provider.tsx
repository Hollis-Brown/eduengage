"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { auth } from "../lib/firebase"
import { initializeDefaultConversations } from "@/lib/init-conversations"

type AuthContextType = {
  user: any
  loading: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
  updateUserDisplayName: (displayName: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

type Props = {
  children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (user && !loading) {
      // Initialize default conversations for new users
      initializeDefaultConversations(user.uid, user.displayName || user.email || "User").catch(console.error)
    }
  }, [user, loading])

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(auth.currentUser!, { displayName })
      setUser(auth.currentUser)
    } catch (error) {
      console.error("Signup failed", error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Signin failed", error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error("Google Sign-in failed", error)
      throw error
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Signout failed", error)
      throw error
    }
  }

  const updateUserDisplayName = async (displayName: string) => {
    try {
      await updateProfile(auth.currentUser!, {
        displayName: displayName,
      })
      setUser({ ...auth.currentUser, displayName: displayName }) // Update local state
    } catch (error) {
      console.error("Failed to update display name", error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOutUser,
    updateUserDisplayName,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
