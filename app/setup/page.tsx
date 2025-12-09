import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SetupPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">eByte Education - Setup Guide</h1>
          <p className="text-muted-foreground">Follow these steps to get your platform running</p>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <Card className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">Run Database Migrations</h2>
                <p className="text-muted-foreground mb-4">
                  Execute the SQL migration scripts in your Supabase dashboard in this order:
                </p>
                <ul className="space-y-2 text-sm font-mono bg-muted p-3 rounded mb-4">
                  <li>1. scripts/001_create_profiles.sql</li>
                  <li>2. scripts/002_create_quizzes.sql</li>
                  <li>3. scripts/003_create_profile_trigger.sql</li>
                </ul>
                <p className="text-xs text-muted-foreground">
                  Go to Supabase Dashboard → SQL Editor → Create new query → Paste each script and run
                </p>
              </div>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">Seed Demo Users</h2>
                <p className="text-muted-foreground mb-4">Run the seed script to create demo users for testing:</p>
                <div className="bg-muted p-3 rounded mb-4 text-sm font-mono">npm run seed</div>
                <p className="text-xs text-muted-foreground">
                  This creates three demo accounts: admin@ebyte.edu, manager@ebyte.edu, and student@ebyte.edu (all with
                  password: password)
                </p>
              </div>
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">Login</h2>
                <p className="text-muted-foreground mb-4">
                  Once the migrations and seeding are complete, you can login with:
                </p>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="bg-muted p-2 rounded">
                    <span className="font-semibold">Admin:</span> admin@ebyte.edu / password
                  </li>
                  <li className="bg-muted p-2 rounded">
                    <span className="font-semibold">Manager:</span> manager@ebyte.edu / password
                  </li>
                  <li className="bg-muted p-2 rounded">
                    <span className="font-semibold">Student:</span> student@ebyte.edu / password
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Verify Environment Variables */}
          <Card className="p-6 border-blue-500 bg-blue-50">
            <h3 className="font-semibold mb-2 text-blue-900">⚠️ Prerequisites</h3>
            <p className="text-sm text-blue-900 mb-3">
              Make sure these environment variables are set in your Vercel project:
            </p>
            <ul className="space-y-1 text-xs font-mono text-blue-900">
              <li>✓ NEXT_PUBLIC_SUPABASE_URL</li>
              <li>✓ NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>✓ SUPABASE_SERVICE_ROLE_KEY</li>
              <li>✓ NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL (for development)</li>
            </ul>
          </Card>

          {/* Ready to Go */}
          <div className="text-center pt-6">
            <Link href="/login">
              <Button size="lg">Go to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
