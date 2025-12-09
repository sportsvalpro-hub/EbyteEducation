"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function AddUsersPage() {
  const [formData, setFormData] = useState({ name: "", email: "", role: "user" })
  const [users, setUsers] = useState<any[]>([])
  const [submitted, setSubmitted] = useState(false)

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser = {
      id: Date.now(),
      ...formData,
      status: "pending",
      addedDate: new Date().toLocaleDateString(),
    }
    setUsers([newUser, ...users])
    setFormData({ name: "", email: "", role: "user" })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
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

                    <Button type="submit" className="w-full">
                      Add User
                    </Button>

                    {submitted && (
                      <div className="p-3 bg-green-100 text-green-800 rounded text-sm">User added successfully!</div>
                    )}
                  </form>
                </Card>
              </div>

              {/* Added Users List */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Recently Added Users</h2>
                  {users.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No users added yet. Add your first user to get started.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold">Name</th>
                            <th className="text-left py-3 px-4 font-semibold">Email</th>
                            <th className="text-left py-3 px-4 font-semibold">Role</th>
                            <th className="text-left py-3 px-4 font-semibold">Status</th>
                            <th className="text-left py-3 px-4 font-semibold">Date Added</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                              <td className="py-3 px-4">{user.name}</td>
                              <td className="py-3 px-4">{user.email}</td>
                              <td className="py-3 px-4 capitalize">{user.role}</td>
                              <td className="py-3 px-4">
                                <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">Pending</span>
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">{user.addedDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
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
