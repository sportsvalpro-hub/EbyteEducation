"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function ManagementDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to load analytics", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  return (
    <ProtectedRoute allowedRoles={["management"]}>
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Management Dashboard</h1>
              <p className="text-muted-foreground">Manage users and monitor platform activity.</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : stats ? (
              <>
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <Card className="p-6">
                    <div className="text-sm text-muted-foreground mb-1">Total Users</div>
                    <div className="text-3xl font-bold">{stats.totalUsers}</div>
                  </Card>
                  <Card className="p-6">
                    <div className="text-sm text-muted-foreground mb-1">Active Students</div>
                    <div className="text-3xl font-bold">{stats.activeUsers}</div>
                  </Card>
                  <Card className="p-6">
                    <div className="text-sm text-muted-foreground mb-1">Pending Validation</div>
                    <div className="text-3xl font-bold text-yellow-600">{stats.pendingValidation}</div>
                  </Card>
                </div>

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
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Recently Added Users</h2>
                    <div className="space-y-3">
                      {stats.recentUsers && stats.recentUsers.length > 0 ? (
                        stats.recentUsers.map((user: any) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between pb-3 border-b border-border last:border-0"
                          >
                            <div>
                              <p className="font-medium text-sm">{user.first_name} {user.last_name || ''}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded capitalize ${
                                user.status === "active" ? "bg-green-100 text-green-800" : 
                                user.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No recent users found.</p>
                      )}
                    </div>
                  </Card>
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-red-500">Failed to load dashboard data.</div>
            )}
          </div>
        </main>
        <Footer />
      </>
    </ProtectedRoute>
  )
}