import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/courses", "/exercises", "/quizzes", "/results", "/admin", "/management"]

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // For client-side auth check, allow all routes to load
  // Auth will be checked in ProtectedRoute component
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
