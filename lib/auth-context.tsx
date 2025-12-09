"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

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
  const supabase = createClient()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Fetch user profile from database
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (error) {
            console.log("[v0] Error fetching profile:", error)
            throw error
          }

          if (profile) {
            console.log("[v0] Profile loaded, setting user:", profile.email)
            setUser({
              id: profile.id,
              email: profile.email,
              name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
              role: profile.role,
              status: profile.status,
            })
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state changed:", event, session?.user?.email)

      if (session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (!error && profile) {
            console.log("[v0] Auth listener: setting user from profile")
            setUser({
              id: profile.id,
              email: profile.email,
              name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
              role: profile.role,
              status: profile.status,
            })
          }
        } catch (err) {
          console.error("[v0] Error fetching profile on auth change:", err)
        }
      } else {
        console.log("[v0] Auth listener: clearing user")
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  const login = async (email: string, password: string) => {
    console.log("[v0] Starting login for:", email)
    try {
      const { error: authError, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.log("[v0] Auth error:", authError.message)
        throw authError
      }

      console.log("[v0] Auth successful, user:", data.user?.email)

      // Give it up to 2 seconds to complete
      let attempts = 0
      while (!user && attempts < 20) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        attempts++
      }

      console.log("[v0] Login complete, user state:", user?.email)
    } catch (err) {
      console.error("[v0] Login error:", err)
      throw err
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const requestAccess = async (email: string, name: string) => {
    // This would be handled through the sign-up flow
    // Users sign up and their profile is created with pending status
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-8),
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
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
        isAuthenticated: user !== null,
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
