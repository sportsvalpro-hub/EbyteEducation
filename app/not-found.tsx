import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 py-20">
        <Card className="w-full max-w-md text-center p-8">
          <div className="text-6xl font-bold text-primary mb-4">404</div>
          <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist or has been moved.</p>
          <Link href="/">
            <Button className="w-full">Go Home</Button>
          </Link>
        </Card>
      </main>
      <Footer />
    </>
  )
}
