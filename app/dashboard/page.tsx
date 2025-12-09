"use client"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

function DashboardContent() {
  const { user } = useAuth()
  const [stats] = useState({
    coursesEnrolled: 5,
    completionRate: 68,
    quizzesTaken: 12,
    averageScore: 82,
    exercisesCompleted: 45,
    currentStreak: 7,
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">Continue your learning journey and reach your goals.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Courses Enrolled</div>
              <div className="text-3xl font-bold">{stats.coursesEnrolled}</div>
              <div className="text-xs text-muted-foreground mt-2">Active courses</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Overall Progress</div>
              <div className="text-3xl font-bold">{stats.completionRate}%</div>
              <div className="w-full bg-muted rounded-full h-2 mt-3">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${stats.completionRate}%` }}></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Learning Streak</div>
              <div className="text-3xl font-bold">{stats.currentStreak} days</div>
              <div className="text-xs text-muted-foreground mt-2">Keep it up!</div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Learning Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Link href="/courses">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      📚 My Courses
                    </Button>
                  </Link>
                  <Link href="/exercises">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      ✏️ Exercises
                    </Button>
                  </Link>
                  <Link href="/quizzes">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      📝 Quizzes
                    </Button>
                  </Link>
                  <Link href="/results">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      📊 AI Results
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {[
                    { title: "Completed Quiz: Python Basics", time: "2 hours ago", type: "quiz" },
                    { title: "Started Exercise: Data Types", time: "1 day ago", type: "exercise" },
                    { title: "Completed Course Module: Intro to Web Dev", time: "3 days ago", type: "course" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Performance */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Quiz Average</span>
                      <span className="font-bold">{stats.averageScore}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${stats.averageScore}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Exercises Done</span>
                      <span className="font-bold">{stats.exercisesCompleted}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">exercises completed</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="text-lg font-bold mb-3">Next Steps</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">→</span>
                    <span>Complete the JavaScript quiz</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">→</span>
                    <span>Practice array methods exercises</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">→</span>
                    <span>Review weak areas in Web Dev</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <DashboardContent />
    </ProtectedRoute>
  )
}
