import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const demoUsers = [
  {
    email: "admin@ebyte.edu",
    password: "password",
    first_name: "Admin",
    last_name: "User",
    role: "admin",
    status: "active",
  },
  {
    email: "manager@ebyte.edu",
    password: "password",
    first_name: "Manager",
    last_name: "User",
    role: "management",
    status: "active",
  },
  {
    email: "student@ebyte.edu",
    password: "password",
    first_name: "Student",
    last_name: "User",
    role: "user",
    status: "active",
  },
]

export async function POST() {
  try {
    const results = []

    for (const user of demoUsers) {
      try {
        // Create auth user
        const { data, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            status: user.status,
          },
        })

        if (authError) {
          results.push({
            email: user.email,
            success: false,
            message: authError.message,
          })
          continue
        }

        if (!data.user) {
          results.push({
            email: user.email,
            success: false,
            message: "No user data returned",
          })
          continue
        }

        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          status: user.status,
        })

        if (profileError) {
          results.push({
            email: user.email,
            success: false,
            message: `Profile error: ${profileError.message}`,
          })
        } else {
          results.push({
            email: user.email,
            success: true,
            message: `Created ${user.role} user`,
          })
        }
      } catch (error) {
        results.push({
          email: user.email,
          success: false,
          message: `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
        })
      }
    }

    return NextResponse.json({ success: true, results }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
