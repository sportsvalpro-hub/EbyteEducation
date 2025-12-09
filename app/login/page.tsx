"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context" //

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const router = useRouter()
  const { login, user, isAuthenticated } = useAuth() // Use the global auth context

  // [Fix] Watch for user state changes and redirect automatically
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role to avoid "Access Denied" on the wrong dashboard
      if (user.role === 'admin') {
        router.push("/admin/dashboard")
      } else if (user.role === 'management') {
        router.push("/management/dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoggingIn(true)

    try {
      // Use the context login function instead of raw supabase calls
      // This ensures all the global state logic in AuthProvider runs correctly
      await login(email, password)
      
      // We do NOT redirect here manually. 
      // The useEffect above will detect the successful login and handle it.
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid credentials"
      console.log("Login failed:", errorMessage)
      setError(errorMessage)
      setIsLoggingIn(false) // Stop loading if error
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 py-20">
        <Card className="w-full max-w-md">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded bg-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold text-xl">ε</span>
              </div>
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground mt-2">Sign in to your eByte account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="p-3 bg-destructive/10 text-destructive rounded text-sm">{error}</div>}

              <Button className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 space-y-4 text-center">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-xs">
                <p className="text-blue-900 dark:text-blue-100 font-medium mb-2">First time here?</p>
                <p className="text-blue-900 dark:text-blue-100 mb-3">
                  Demo accounts: admin@ebyte.edu, manager@ebyte.edu, student@ebyte.edu (all use "password")
                </p>
                <Link href="/api/seed-demo-users/init">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Initialize Demo Users
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </>
  )
}