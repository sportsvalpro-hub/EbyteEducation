"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"

interface SeedResult {
  email: string
  success: boolean
  message: string
}

export default function InitPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SeedResult[] | null>(null)
  const [error, setError] = useState("")

  const handleSeedUsers = async () => {
    setIsLoading(true)
    setError("")
    setResults(null)

    try {
      const response = await fetch("/api/seed-demo-users", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to seed demo users")
        return
      }

      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to seed demo users")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Initialize Demo Users</h1>
            <p className="text-muted-foreground">
              Click the button below to create the demo user accounts in your Supabase database
            </p>
          </div>

          <Card className="p-8 mb-6">
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Prerequisites</h3>
                <p className="text-sm text-blue-900 dark:text-blue-100 mb-3">
                  Before initializing users, make sure you've completed these steps:
                </p>
                <ol className="space-y-2 text-sm text-blue-900 dark:text-blue-100 list-decimal list-inside">
                  <li>Run the SQL migrations in your Supabase dashboard (see setup guide)</li>
                  <li>Verify environment variables are set in your Vercel project</li>
                </ol>
              </div>

              {/* Seed Button */}
              <div>
                <Button onClick={handleSeedUsers} disabled={isLoading} className="w-full" size="lg">
                  {isLoading ? "Creating Demo Users..." : "Initialize Demo Users"}
                </Button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm text-destructive font-medium">Error: {error}</p>
                </div>
              )}

              {/* Results */}
              {results && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Seeding Results:</h3>
                  {results.map((result, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        result.success
                          ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                          : "bg-destructive/10 border-destructive/20"
                      }`}
                    >
                      <p
                        className={`text-sm font-medium ${
                          result.success ? "text-green-900 dark:text-green-100" : "text-destructive"
                        }`}
                      >
                        {result.success ? "✓" : "✗"} {result.email}
                      </p>
                      <p
                        className={`text-xs ${
                          result.success ? "text-green-800 dark:text-green-200" : "text-destructive/80"
                        }`}
                      >
                        {result.message}
                      </p>
                    </div>
                  ))}

                  {results.every((r) => r.success) && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-green-900 dark:text-green-100 font-semibold mb-2">Success!</p>
                      <p className="text-sm text-green-900 dark:text-green-100 mb-4">
                        Demo users have been created. You can now login with:
                      </p>
                      <ul className="space-y-1 text-sm text-green-900 dark:text-green-100 font-mono mb-4">
                        <li>• admin@ebyte.edu / password</li>
                        <li>• manager@ebyte.edu / password</li>
                        <li>• student@ebyte.edu / password</li>
                      </ul>
                      <Link href="/login">
                        <Button className="w-full" variant="default">
                          Go to Login
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Help Links */}
          <div className="flex gap-4 justify-center">
            <Link href="/setup">
              <Button variant="outline">View Setup Guide</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Back to Login</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
