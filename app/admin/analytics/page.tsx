"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface AnalyticsData {
  activeUsers: number
  totalUsers: number
  managementCount: number
  newUsersCount: number
  avgScore: number
  totalQuizzesTaken: number
  topCourses: { name: string; students: number }[]
  performanceByDifficulty: { level: string; score: number }[]
  recentUsers: any[] // Added this field
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics")
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fallback defaults
  const stats = data || {
    activeUsers: 0,
    totalUsers: 0,
    managementCount: 0,
    newUsersCount: 0,
    avgScore: 0,
    totalQuizzesTaken: 0,
    topCourses: [],
    performanceByDifficulty: [],
    recentUsers: []
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Analytics & Reports</h1>
              <p className="text-muted-foreground">View platform-wide analytics and user activity.</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Key Metrics */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <Card className="p-6">
                    <div className="text-sm text-muted-foreground mb-1">Active Students</div>
                    <div className="text-3xl font-bold">{stats.activeUsers}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Of {stats.totalUsers} total users
                    </p>
                  </Card>
                  <Card className="p-6">
                    <div className="text-sm text-muted-foreground mb-1">Avg Quiz Score</div>
                    <div className="text-3xl font-bold">{stats.avgScore}%</div>
                  </Card>
                  <Card className="p-6">
                    <div className="text-sm text-muted-foreground mb-1">Quizzes Taken</div>
                    <div className="text-3xl font-bold">{stats.totalQuizzesTaken}</div>
                  </Card>
                  <Card className="p-6">
                    <div className="text-sm text-muted-foreground mb-1">Staff Count</div>
                    <div className="text-3xl font-bold text-blue-600">{stats.managementCount}</div>
                    <p className="text-xs text-muted-foreground mt-2">Admins & Managers</p>
                  </Card>
                </div>

                {/* Analytics Sections */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Popular Categories</h2>
                    <div className="space-y-3 text-sm">
                      {/* FIX: Use optional chaining here */}
                      {stats.topCourses?.length > 0 ? (
                        stats.topCourses.map((course, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span>{course.name}</span>
                            <span className="font-bold">{course.students} attempts</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No quiz activity yet.</p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Registrations</h2>
                    <div className="space-y-3">
                      {stats.recentUsers?.length > 0 ? (
                        stats.recentUsers.map((user: any) => (
                          <div key={user.id} className="flex justify-between items-center pb-2 border-b last:border-0">
                            <div>
                              <div className="font-medium text-sm">{user.first_name} {user.last_name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded capitalize ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'management' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No recent users.</p>
                      )}
                    </div>
                  </Card>
                </div>
              </>
            )}
          </div>
        </main>
        <Footer />
      </>
    </ProtectedRoute>
  )
}