import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id: quizId } = await params

    console.log("[v0] Fetching quiz with ID:", quizId)

    const { data, error } = await supabase.from("quizzes").select("*, quiz_questions(*)").eq("id", quizId).single()

    if (error) {
      console.log("[v0] Quiz fetch error:", error)
      throw error
    }

    console.log("[v0] Quiz found:", data?.title)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching quiz:", error)
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id: quizId } = await params

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Only admins can delete quizzes" }, { status: 403 })
    }

    const { error } = await supabase.from("quizzes").delete().eq("id", quizId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting quiz:", error)
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 })
  }
}
