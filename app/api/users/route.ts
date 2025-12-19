import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

// GET users
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const role = searchParams.get("role")

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    if (!["admin", "management"].includes(profile?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // UPDATED QUERY: Fetch user AND their manager's details (institute_name)
    // We use the foreign key 'fk_profiles_added_by_profile' we created in SQL
    let query = supabase
      .from("profiles")
      .select("*, manager:profiles!fk_profiles_added_by_profile(first_name, last_name, institute_name)")
      .order("created_at", { ascending: false })

    if (status) query = query.eq("status", status)
    if (role && role !== "all") query = query.eq("role", role)

    // Management users only see their own students
    if (profile.role === 'management') {
       query = query.eq('added_by', user.id)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST: Create User
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data: { user: requester } } = await supabase.auth.getUser()
    if (!requester) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", requester.id).single()
    if (!["admin", "management"].includes(profile?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const nameParts = (body.name || "").split(" ")
    
    // Construct metadata
    const userMetadata: any = {
      first_name: nameParts[0] || "",
      last_name: nameParts.slice(1).join(" ") || "",
      role: body.role || "user",
      status: "pending",
      added_by: requester.id
    }

    // If creating a manager, save the institute name
    if (body.role === 'management' && body.institute_name) {
      userMetadata.institute_name = body.institute_name
    }

    const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
      email: body.email,
      password: body.password || Math.random().toString(36).slice(-8),
      email_confirm: true,
      user_metadata: userMetadata,
    })

    if (authError) throw authError

    return NextResponse.json({ success: true, userId: authData.user.id }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}