"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function AdminDashboardPage() {
  // Simple stats state
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingValidation: 0,
  })

  // Fetch quick stats on load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/analytics")
        if (response.ok) {
          const data = await response.json()
          setStats({
            totalUsers: data.totalUsers,
            activeUsers: data.activeUsers,
            pendingValidation: data.totalUsers - data.activeUsers - (data.managementCount || 0) // Approximation
          })
        }
      } catch (e) {
        console.error("Failed to load dashboard stats")
      }
    }
    fetchStats()
  }, [])

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Admin Control Panel</h1>
              <p className="text-muted-foreground">Manage the entire eByte Education platform.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-1">Total Users</div>
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-2">{stats.activeUsers} active students</p>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-1">System Status</div>
                <div className="text-3xl font-bold text-green-600">Healthy</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-1">Platform Access</div>
                <div className="text-3xl font-bold text-primary">Admin</div>
              </Card>
            </div>

            {/* Admin Actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">User Management</h2>
                <div className="space-y-3">
                  <Link href="/admin/validate-users" className="block">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      ✓ Validate New Signups
                    </Button>
                  </Link>
                  <Link href="/admin/add-users" className="block">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      ➕ Add Management/Staff
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Content Management</h2>
                <div className="space-y-3">
                  <Link href="/admin/quiz-builder" className="block">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      📝 Quiz Builder
                    </Button>
                  </Link>
                  <Link href="/admin/learning-materials" className="block">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      📚 Learning Materials
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Analytics & Reports</h2>
                <div className="space-y-3">
                  <Link href="/admin/analytics" className="block">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      📊 View Platform Analytics
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </>
    </ProtectedRoute>
  )
}