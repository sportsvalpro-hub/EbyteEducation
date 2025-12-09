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

  // Fallback/Placeholder if data fails or is empty
  const stats = data || {
    activeUsers: 0,
    totalUsers: 0,
    managementCount: 0,
    newUsersCount: 0,
    avgScore: 0,
    totalQuizzesTaken: 0,
    topCourses: [],
    performanceByDifficulty: [],
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Analytics & Reports</h1>
              <p className="text-muted-foreground">View platform-wide analytics and real-time insights.</p>
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
                    <p className="text-xs text-muted-foreground mt-2">Across all attempts</p>
                  </Card>
                  <Card className="p-6">
                    <div className="text-sm text-muted-foreground mb-1">Quizzes Taken</div>
                    <div className="text-3xl font-bold">{stats.totalQuizzesTaken}</div>
                    <p className="text-xs text-muted-foreground mt-2">Total completions</p>
                  </Card>
                  <Card className="p-6">
                    <div className="text-sm text-muted-foreground mb-1">New Users</div>
                    <div className="text-3xl font-bold">+{stats.newUsersCount}</div>
                    <p className="text-xs text-muted-foreground mt-2">This month</p>
                  </Card>
                </div>

                {/* Analytics Sections */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">User Growth</h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Active Students</span>
                          <span>{stats.activeUsers}</span>
                        </div>
                        <div className="w-full bg-muted rounded h-2">
                          <div 
                            className="bg-primary h-2 rounded transition-all duration-500" 
                            style={{ width: `${stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Showing proportion of active students vs total registered profiles.
                      </p>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Popular Categories</h2>
                    <div className="space-y-3 text-sm">
                      {stats.topCourses.length > 0 ? (
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
                </div>

                {/* Reports */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Performance Summary</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Average Score by Difficulty</h3>
                      <div className="space-y-3 text-sm">
                        {stats.performanceByDifficulty.map((item) => (
                          <div key={item.level} className="flex justify-between items-center">
                            <span className="capitalize text-muted-foreground">{item.level}</span>
                            <span className="font-bold">{item.score}%</span>
                          </div>
                        ))}
                        {stats.performanceByDifficulty.length === 0 && (
                          <p className="text-muted-foreground">No performance data available.</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">User Distribution</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Students</span>
                          <span className="font-bold">{stats.activeUsers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Staff (Admin/Mgmt)</span>
                          <span className="font-bold">{stats.managementCount}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 mt-2">
                          <span className="text-muted-foreground">Total Profiles</span>
                          <span className="font-bold">{stats.totalUsers}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </main>
        <Footer />
      </>
    </ProtectedRoute>
  )
}