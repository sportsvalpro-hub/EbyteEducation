import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
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

async function seedDemoUsers() {
  console.log("Starting to seed demo users...")

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
        console.error(`Error creating user ${user.email}:`, authError.message)
        continue
      }

      if (!data.user) {
        console.error(`No user data returned for ${user.email}`)
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
        console.error(`Error creating profile for ${user.email}:`, profileError.message)
      } else {
        console.log(`✓ Created demo user: ${user.email} (${user.role})`)
      }
    } catch (error) {
      console.error(`Unexpected error for ${user.email}:`, error)
    }
  }

  console.log("Demo users seeding complete!")
}

seedDemoUsers()
