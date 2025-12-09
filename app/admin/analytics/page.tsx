"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Analytics & Reports</h1>
              <p className="text-muted-foreground">View platform-wide analytics and insights.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-1">Active Users</div>
                <div className="text-3xl font-bold">342</div>
                <p className="text-xs text-muted-foreground mt-2">+12% this week</p>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-1">Avg Quiz Score</div>
                <div className="text-3xl font-bold">81%</div>
                <p className="text-xs text-muted-foreground mt-2">↑ 3% from last week</p>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-1">Exercises Completed</div>
                <div className="text-3xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground mt-2">This month</p>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-1">Course Completion</div>
                <div className="text-3xl font-bold">65%</div>
                <p className="text-xs text-muted-foreground mt-2">Average rate</p>
              </Card>
            </div>

            {/* Analytics Sections */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">User Growth</h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>This Month</span>
                      <span>+45 users</span>
                    </div>
                    <div className="w-full bg-muted rounded h-2">
                      <div className="bg-primary h-2 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Last Month</span>
                      <span>+28 users</span>
                    </div>
                    <div className="w-full bg-muted rounded h-2">
                      <div className="bg-primary h-2 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Top Courses</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>The Complete JavaScript</span>
                    <span className="font-bold">2,345 students</span>
                  </div>
                  <div className="flex justify-between">
                    <span>React - The Complete Guide</span>
                    <span className="font-bold">1,876 students</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Python for Data Science</span>
                    <span className="font-bold">1,543 students</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Web Design for Beginners</span>
                    <span className="font-bold">987 students</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Reports */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Performance Summary</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">By Difficulty</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Beginner Quizzes</span>
                      <span className="font-bold">86%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Intermediate Quizzes</span>
                      <span className="font-bold">79%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Advanced Quizzes</span>
                      <span className="font-bold">72%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">By User Type</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Students</span>
                      <span className="font-bold">342</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Managers</span>
                      <span className="font-bold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Admins</span>
                      <span className="font-bold">3</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    </ProtectedRoute>
  )
}
