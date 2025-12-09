"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const ADMIN_STATS = {
  totalUsers: 365,
  activeUsers: 342,
  pendingValidation: 8,
  totalCourses: 25,
  totalQuizzes: 128,
  averageScore: 81,
}

export default function AdminDashboardPage() {
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
                <div className="text-3xl font-bold">{ADMIN_STATS.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-2">{ADMIN_STATS.activeUsers} active</p>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-1">Pending Validation</div>
                <div className="text-3xl font-bold text-yellow-600">{ADMIN_STATS.pendingValidation}</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-1">Platform Health</div>
                <div className="text-3xl font-bold text-green-600">98%</div>
              </Card>
            </div>

            {/* Admin Actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">User Management</h2>
                <div className="space-y-3">
                  <Link href="/admin/validate-users" className="block">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      ✓ Validate Users ({ADMIN_STATS.pendingValidation})
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
                      📊 Analytics & Reports
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">System Stats</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Courses</span>
                    <span className="font-bold">{ADMIN_STATS.totalCourses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Quizzes</span>
                    <span className="font-bold">{ADMIN_STATS.totalQuizzes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Student Score</span>
                    <span className="font-bold">{ADMIN_STATS.averageScore}%</span>
                  </div>
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
