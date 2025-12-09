"use client"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const MOCK_STATS = {
  totalUsers: 145,
  addedUsers: 28,
  pendingValidation: 5,
  activeUsers: 142,
  coursesEnrolled: 185,
}

const RECENT_USERS = [
  { id: 1, name: "John Smith", email: "john@example.com", status: "pending", date: "2025-12-01" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", status: "active", date: "2025-11-28" },
  { id: 3, name: "Mike Davis", email: "mike@example.com", status: "pending", date: "2025-11-25" },
  { id: 4, name: "Emma Wilson", email: "emma@example.com", status: "active", date: "2025-11-22" },
]

function ManagementDashboardContent() {
  const { user } = useAuth()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Management Dashboard</h1>
            <p className="text-muted-foreground">Manage users and monitor platform activity.</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Total Users</div>
              <div className="text-3xl font-bold">{MOCK_STATS.totalUsers}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Added This Month</div>
              <div className="text-3xl font-bold">{MOCK_STATS.addedUsers}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Pending Validation</div>
              <div className="text-3xl font-bold text-yellow-600">{MOCK_STATS.pendingValidation}</div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/management/add-users" className="block">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    ➕ Add New Users
                  </Button>
                </Link>
                <Link href="/management/user-list" className="block">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    👥 View All Users
                  </Button>
                </Link>
                <Link href="/admin/validate-users" className="block">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    ✓ Validate Users (Admin)
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Recently Added Users</h2>
              <div className="space-y-3">
                {RECENT_USERS.slice(0, 4).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between pb-3 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        user.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ManagementDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["management"]}>
      <ManagementDashboardContent />
    </ProtectedRoute>
  )
}
