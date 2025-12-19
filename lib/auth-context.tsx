"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export type UserRole = "admin" | "management" | "user"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: "active" | "pending" | "rejected"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  requestAccess: (email: string, name: string) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  
  // FIX: Create the client only once when the component mounts
  const [supabase] = useState(() => createClient())

  // Helper to fetch and format user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error fetching profile:", error)
        return null
      }

      if (profile) {
        return {
          id: profile.id,
          email: profile.email,
          name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
          role: profile.role as UserRole,
          status: profile.status,
        } as User
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err)
    }
    return null
  }

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const userData = await fetchUserProfile(session.user.id)
          if (mounted && userData) {
            setUser(userData)
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          const userData = await fetchUserProfile(session.user.id)
          if (mounted && userData) setUser(userData)
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUser(null)
          router.push("/login")
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const login = async (email: string, password: string) => {
    try {
      // 1. Perform the sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // 2. FORCE update state immediately (don't wait for event listener)
      if (data.user) {
        const userData = await fetchUserProfile(data.user.id)
        if (userData) {
          setUser(userData)
          // Optional: Return true or resolve to indicate success
          return
        }
      }
      
      throw new Error("Login successful but profile not found")
    } catch (err) {
      console.error("Login error:", err)
      throw err
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/login")
  }

  const requestAccess = async (email: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-8),
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: name.split(" ")[0],
            last_name: name.split(" ")[1] || "",
          },
        },
      })

      if (error) throw error
    } catch (err) {
      console.error("Error requesting access:", err)
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        requestAccess,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}