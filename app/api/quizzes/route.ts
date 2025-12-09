import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET all quizzes or filter by category
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")

    let query = supabase.from("quizzes").select("*, quiz_questions(id)").order("created_at", { ascending: false })

    if (category) {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching quizzes:", error)
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const difficultyMap: Record<string, string> = {
      beginner: "easy",
      intermediate: "medium",
      advanced: "hard",
    }

    const insertData = {
      title: body.title,
      category: body.courseId || body.category || null,
      difficulty: difficultyMap[body.level] || body.difficulty || "medium",
      description: body.description || null,
      duration_minutes: Number.parseInt(body.questions) || 30,
      passing_score: body.passingScore || 60,
      created_by: user.id,
    }

    const { data, error } = await supabase.from("quizzes").insert(insertData).select("*, quiz_questions(id)")

    if (error) {
      throw error
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Error creating quiz:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create quiz" },
      { status: 500 },
    )
  }
}
