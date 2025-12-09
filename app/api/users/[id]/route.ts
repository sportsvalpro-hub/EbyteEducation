import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// 1. Change the type definition to Promise
// 2. Await the params before using them
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const supabase = await createClient()
    
    // FIX: Await the params object to get the actual ID
    const { id } = await params
    
    const body = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ status: body.status, role: body.role })
      .eq("id", id) // Use the awaited 'id' variable here
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}