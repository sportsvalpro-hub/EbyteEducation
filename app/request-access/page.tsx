"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function RequestAccessPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { requestAccess } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await requestAccess(email, name)
      setSubmitted(true)
      setEmail("")
      setName("")
    } finally {
      setIsLoading(false)
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
              <h1 className="text-2xl font-bold">Request Access</h1>
              <p className="text-muted-foreground mt-2">Join eByte Education</p>
            </div>

            {submitted ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-800 dark:text-green-200 font-medium">Request submitted successfully!</p>
                  <p className="text-green-700 dark:text-green-300 text-sm mt-2">
                    Our team will review your request and get back to you soon.
                  </p>
                </div>
                <Link href="/">
                  <Button className="w-full bg-transparent" variant="outline">
                    Back to Home
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Request Access"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have access?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign In
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
