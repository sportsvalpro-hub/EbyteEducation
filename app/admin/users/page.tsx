// app/admin/users/page.tsx

"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { Loader2, Search, Pencil, Check, X } from "lucide-react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  status: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch users on load
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch users", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: editingUser.first_name,
          last_name: editingUser.last_name,
          role: editingUser.role,
          status: editingUser.status,
        }),
      })

      if (response.ok) {
        // Update local state
        setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)))
        setEditingUser(null)
      } else {
        alert("Failed to update user")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      alert("An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const searchString = searchTerm.toLowerCase()
    return (
      user.email.toLowerCase().includes(searchString) ||
      user.first_name?.toLowerCase().includes(searchString) ||
      user.last_name?.toLowerCase().includes(searchString)
    )
  })

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-6">
              <Link href="/admin/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
              </Link>
              <h1 className="text-4xl font-bold mb-2">Manage Users</h1>
              <p className="text-muted-foreground">View and edit all registered users on the platform.</p>
            </div>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50 text-left">
                        <th className="py-3 px-4 font-semibold text-sm">Name</th>
                        <th className="py-3 px-4 font-semibold text-sm">Email</th>
                        <th className="py-3 px-4 font-semibold text-sm">Role</th>
                        <th className="py-3 px-4 font-semibold text-sm">Status</th>
                        <th className="py-3 px-4 font-semibold text-sm text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-muted-foreground">
                            No users found.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-border hover:bg-muted/30">
                            <td className="py-3 px-4 font-medium">
                              {user.first_name} {user.last_name}
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2 py-1 rounded capitalize ${
                                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                user.role === 'management' ? 'bg-purple-100 text-purple-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role === 'user' ? 'Student' : user.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2 py-1 rounded capitalize ${
                                user.status === 'active' ? 'bg-green-100 text-green-800' :
                                user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => setEditingUser(user)}
                              >
                                <Pencil className="w-4 h-4 text-muted-foreground hover:text-primary" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </main>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            
            {editingUser && (
              <form onSubmit={handleSaveUser} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input 
                      value={editingUser.first_name} 
                      onChange={(e) => setEditingUser({...editingUser, first_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input 
                      value={editingUser.last_name} 
                      onChange={(e) => setEditingUser({...editingUser, last_name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input value={editingUser.email} disabled className="bg-muted" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <select
                      className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    >
                      <option value="user">Student</option>
                      <option value="management">Management</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                      value={editingUser.status}
                      onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <Footer />
      </>
    </ProtectedRoute>
  )
}