"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function UserListPage() {
  const [users, setUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user: currentUser } = useAuth()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all users - filtering happens on client side for search, 
        // but we could also pass params to API: /api/users?role=${roleFilter}
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
    fetchUsers()
  }, [])

  const filtered = users.filter((u) => {
    const fullName = `${u.first_name || ""} ${u.last_name || ""}`.trim().toLowerCase()
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || u.status === statusFilter
    const matchesRole = !roleFilter || u.role === roleFilter
    
    return matchesSearch && matchesStatus && matchesRole
  })

  return (
    <ProtectedRoute allowedRoles={["management", "admin"]}>
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">User List</h1>
              <p className="text-muted-foreground">View and manage users. Use filters to find Managers or Students.</p>
            </div>

            <Card className="p-6">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {/* Status Filter */}
                  <select
                    value={statusFilter || ""}
                    onChange={(e) => setStatusFilter(e.target.value || null)}
                    className="px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  {/* Role Filter - The feature you requested */}
                  <select
                    value={roleFilter || ""}
                    onChange={(e) => setRoleFilter(e.target.value || null)}
                    className="px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="">All Roles</option>
                    <option value="user">Students</option>
                    <option value="management">Management</option>
                    {currentUser?.role === 'admin' && (
                      <option value="admin">Admins</option>
                    )}
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-left py-4 px-4 font-semibold">Name</th>
                          <th className="text-left py-4 px-4 font-semibold">Email</th>
                          <th className="text-left py-4 px-4 font-semibold">Role</th>
                          <th className="text-left py-4 px-4 font-semibold">Status</th>
                          <th className="text-left py-4 px-4 font-semibold">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-muted-foreground">
                              No users found matching your filters.
                            </td>
                          </tr>
                        ) : (
                          filtered.map((user) => (
                            <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                              <td className="py-4 px-4 font-medium">
                                {user.first_name} {user.last_name}
                              </td>
                              <td className="py-4 px-4 text-muted-foreground">{user.email}</td>
                              <td className="py-4 px-4">
                                <span className={`text-xs px-2 py-1 rounded capitalize ${
                                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                  user.role === 'management' ? 'bg-purple-100 text-purple-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {user.role === 'user' ? 'Student' : user.role}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span
                                  className={`text-xs px-3 py-1 rounded font-medium capitalize ${
                                    user.status === "active" ? "bg-green-100 text-green-800" : 
                                    user.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {user.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-sm text-muted-foreground">
                                {new Date(user.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    Showing {filtered.length} users
                  </div>
                </>
              )}
            </Card>
          </div>
        </main>
        <Footer />
      </>
    </ProtectedRoute>
  )
}