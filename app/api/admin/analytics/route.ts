import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 1. Verify Role (Allow 'admin' AND 'management')
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!["admin", "management"].includes(profile?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // 2. Fetch User Stats
    // Total users
    const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

    // Active students
    const { count: activeStudents } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "user")
      .eq("status", "active")

    // Pending users (Direct count)
    const { count: pendingUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    // Management/Admins count
    const { count: managementCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .in("role", ["admin", "management"])

    // New users this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const { count: newUsersCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString())

    // 3. Fetch Recent Users (To show who is who)
    const { data: recentUsers } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, role, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5)

    // 4. Fetch Quiz/Activity Stats
    const { data: quizResults, error: resultsError } = await supabase
      .from("quiz_results")
      .select(`
        score,
        created_at,
        quiz:quizzes (
          title,
          category,
          difficulty
        )
      `)

    if (resultsError) throw resultsError

    // Process results
    const totalQuizzesTaken = quizResults?.length || 0
    const totalScore = quizResults?.reduce((acc, curr) => acc + curr.score, 0) || 0
    const avgScore = totalQuizzesTaken > 0 ? Math.round(totalScore / totalQuizzesTaken) : 0

    // Top Courses logic
    const categoryStats: Record<string, number> = {}
    const difficultyStats: Record<string, { total: number; count: number }> = {
      easy: { total: 0, count: 0 },
      medium: { total: 0, count: 0 },
      hard: { total: 0, count: 0 }
    }

    quizResults?.forEach((r: any) => {
      const cat = r.quiz?.category || "Uncategorized"
      categoryStats[cat] = (categoryStats[cat] || 0) + 1

      const diff = r.quiz?.difficulty || "medium"
      if (difficultyStats[diff]) {
        difficultyStats[diff].total += r.score
        difficultyStats[diff].count += 1
      }
    })

    const topCourses = Object.entries(categoryStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([name, count]) => ({ name, students: count }))

    const performanceByDifficulty = Object.entries(difficultyStats).map(([level, stats]) => ({
      level,
      score: stats.count > 0 ? Math.round(stats.total / stats.count) : 0
    }))

    return NextResponse.json({
      activeUsers: activeStudents || 0,
      totalUsers: totalUsers || 0,
      managementCount: managementCount || 0,
      pendingValidation: pendingUsers || 0,
      newUsersCount: newUsersCount || 0,
      avgScore,
      totalQuizzesTaken,
      topCourses: topCourses || [], // Ensure this is always an array
      performanceByDifficulty,
      recentUsers: recentUsers || []
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}