"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export default function AddUsersPage() {
  const [formData, setFormData] = useState({ name: "", email: "", role: "user" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const { user: currentUser } = useAuth()

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

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add user")
      }

      setSubmitted(true)
      setFormData({ name: "", email: "", role: "user" })
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["management"]}>
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Add New Users</h1>
              <p className="text-muted-foreground">
                Add students to the platform. Admin will validate new registrations.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Add User Form */}
              <div className="lg:col-span-1">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Add User</h2>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-md"
                      >
                        <option value="user">Student</option>
                        <option value="management">Manager</option>
                      </select>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-100 text-red-800 rounded text-sm">{error}</div>
                    )}

                    {submitted && (
                      <div className="p-3 bg-green-100 text-green-800 rounded text-sm">
                        User added successfully! Status is pending approval.
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add User"}
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Instructions Panel */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">How it works</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      As a manager, you can register new users to the eByte Education platform.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>New users are created with a <strong>Pending</strong> status.</li>
                      <li>Admins must review and <strong>Validate</strong> these accounts before they can access the platform.</li>
                      <li>A temporary password is generated automatically. Users should reset it upon first login.</li>
                    </ul>
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Note:</strong> You can view the status of all users in the <a href="/management/user-list" className="underline hover:text-blue-600">User List</a>.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    </ProtectedRoute>
  )
}