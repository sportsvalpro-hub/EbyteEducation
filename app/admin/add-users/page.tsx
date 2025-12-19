"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AdminAddUsersPage() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    role: "management", 
    password: "",
    institute_name: "" // New field
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSubmitted(false)

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add user")
      }

      setSubmitted(true)
      // Reset form but keep role
      setFormData(prev => ({ 
        name: "", 
        email: "", 
        role: prev.role, 
        password: "",
        institute_name: "" 
      }))
      
      setTimeout(() => setSubmitted(false), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-6">
              <Link href="/admin/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
              </Link>
              <h1 className="text-4xl font-bold mb-2">Create Users</h1>
              <p className="text-muted-foreground">
                Create new accounts. Define Institutes for Managers.
              </p>
            </div>

            <Card className="p-6">
              <form onSubmit={handleAddUser} className="space-y-4 max-w-xl">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="user">Student</option>
                      <option value="management">Manager (Institute)</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                {/* Show Institute Name field ONLY for Management role */}
                {formData.role === 'management' && (
                  <div className="bg-primary/5 p-4 rounded-md border border-primary/20">
                    <label className="block text-sm font-medium mb-2 text-primary">Institute Name</label>
                    <Input
                      value={formData.institute_name}
                      onChange={(e) => setFormData({ ...formData, institute_name: e.target.value })}
                      placeholder="e.g. Science Academy"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This name will be associated with all students added by this manager.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@ebyte.edu"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password (Optional)</label>
                  <Input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Leave empty to auto-generate"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded text-sm">
                    {error}
                  </div>
                )}

                {submitted && (
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded text-sm">
                    User created successfully!
                  </div>
                )}

                <div className="pt-2">
                  <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create User"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    </ProtectedRoute>
  )
}