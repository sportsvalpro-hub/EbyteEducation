"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const MOCK_USERS = [
  { id: 1, name: "John Smith", email: "john@example.com", role: "user", status: "active", joinDate: "2025-11-15" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", role: "user", status: "active", joinDate: "2025-11-14" },
  { id: 3, name: "Mike Davis", email: "mike@example.com", role: "user", status: "pending", joinDate: "2025-12-01" },
  { id: 4, name: "Emma Wilson", email: "emma@example.com", role: "user", status: "active", joinDate: "2025-11-10" },
  { id: 5, name: "Alex Brown", email: "alex@example.com", role: "user", status: "active", joinDate: "2025-11-08" },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa@example.com",
    role: "management",
    status: "active",
    joinDate: "2025-10-15",
  },
]

export default function UserListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filtered = MOCK_USERS.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || u.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <ProtectedRoute allowedRoles={["management"]}>
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">User List</h1>
              <p className="text-muted-foreground">View and manage all users on the platform.</p>
            </div>

            <Card className="p-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={statusFilter || ""}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                  className="px-3 py-2 border border-border rounded-md"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-4 px-4 font-semibold">Name</th>
                      <th className="text-left py-4 px-4 font-semibold">Email</th>
                      <th className="text-left py-4 px-4 font-semibold">Role</th>
                      <th className="text-left py-4 px-4 font-semibold">Status</th>
                      <th className="text-left py-4 px-4 font-semibold">Join Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-4 font-medium">{user.name}</td>
                        <td className="py-4 px-4 text-muted-foreground">{user.email}</td>
                        <td className="py-4 px-4 capitalize text-sm">{user.role}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-xs px-3 py-1 rounded font-medium ${
                              user.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">{user.joinDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filtered.length} of {MOCK_USERS.length} users
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    </ProtectedRoute>
  )
}
