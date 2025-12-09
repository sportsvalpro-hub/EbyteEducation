import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 py-20">
        <Card className="w-full max-w-md text-center p-8">
          <div className="text-6xl font-bold text-primary mb-4">403</div>
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page. Please contact an administrator if you believe this is a
            mistake.
          </p>
          <Link href="/">
            <Button className="w-full">Go Home</Button>
          </Link>
        </Card>
      </main>
      <Footer />
    </>
  )
}
