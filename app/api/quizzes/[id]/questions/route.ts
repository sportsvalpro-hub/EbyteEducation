import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id: quizId } = await params

    const { data, error } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("order_num", { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id: quizId } = await params

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { question_text, question_type, options, correct_answer, explanation } = body

    // Get the current max order_num for this quiz
    const { data: existingQuestions } = await supabase
      .from("quiz_questions")
      .select("order_num")
      .eq("quiz_id", quizId)
      .order("order_num", { ascending: false })
      .limit(1)

    const nextOrder = existingQuestions && existingQuestions.length > 0 ? (existingQuestions[0].order_num || 0) + 1 : 1

    const { data, error } = await supabase
      .from("quiz_questions")
      .insert({
        quiz_id: quizId,
        question_text,
        question_type: question_type || "multiple_choice",
        options: options || null,
        correct_answer,
        explanation: explanation || null,
        order_num: nextOrder,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error creating question:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create question" },
      { status: 500 },
    )
  }
}
