"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // FIX: Make this async and await the logout action
  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login") // Redirect only after logout completes
      setMobileMenuOpen(false)
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return null
    }

    if (user?.role === "admin") {
      return [
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Validate Users", href: "/admin/validate-users" },
        { label: "Quiz Builder", href: "/admin/quiz-builder" },
        { label: "Materials", href: "/admin/learning-materials" },
        { label: "Analytics", href: "/admin/analytics" },
      ]
    }

    if (user?.role === "management") {
      return [
        { label: "Dashboard", href: "/management/dashboard" },
        { label: "Add Users", href: "/management/add-users" },
        { label: "User List", href: "/management/user-list" },
      ]
    }

    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Courses", href: "/courses" },
      { label: "Exercises", href: "/exercises" },
      { label: "Quizzes", href: "/quizzes" },
      { label: "Results", href: "/results" },
    ]
  }

  const navLinks = getNavLinks()

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href={
              isAuthenticated
                ? user?.role === "admin"
                  ? "/admin/dashboard"
                  : user?.role === "management"
                    ? "/management/dashboard"
                    : "/dashboard"
                : "/"
            }
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">ε</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline text-foreground">eByte</span>
          </Link>

          {isAuthenticated && navLinks && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isAuthenticated && navLinks && (
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:block text-sm">
                  <p className="font-medium text-foreground">{user?.name}</p>
                  <p className="text-muted-foreground text-xs capitalize">{user?.role}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/request-access">
                  <Button size="sm">Request Access</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && isAuthenticated && navLinks && (
          <div className="md:hidden pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}