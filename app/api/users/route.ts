import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

// GET users (with optional status AND role filter)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const role = searchParams.get("role") // New param

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!["admin", "management"].includes(profile?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    let query = supabase.from("profiles").select("*").order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }
    
    if (role && role !== "all") {
      query = query.eq("role", role)
    }

    // Security: If requester is Management, prevent seeing Admins
    if (profile.role === 'management') {
       // Management can only see Users and other Management, not Admins
       query = query.neq('role', 'admin')
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST remains the same as your previous code...
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      data: { user: requester },
    } = await supabase.auth.getUser()

    if (!requester) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", requester.id).single()

    if (!["admin", "management"].includes(profile?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const nameParts = (body.name || "").split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
      email: body.email,
      password: body.password || Math.random().toString(36).slice(-8),
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        role: body.role || "user",
        status: "pending",
        added_by: requester.email
      },
    })

    if (authError) throw authError

    return NextResponse.json({ success: true, userId: authData.user.id }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}