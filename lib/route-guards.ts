import type { UserRole } from "./auth-context"

export const roleBasedRoutes: Record<UserRole, string[]> = {
  admin: [
    "/admin",
    "/admin/dashboard",
    "/admin/validate-users",
    "/admin/quiz-builder",
    "/admin/learning-materials",
    "/admin/analytics",
    "/dashboard",
  ],
  management: ["/management", "/management/dashboard", "/management/add-users", "/management/user-list", "/dashboard"],
  user: ["/dashboard", "/courses", "/exercises", "/quizzes", "/results"],
}

export function canAccessRoute(role: UserRole, route: string): boolean {
  const allowedRoutes = roleBasedRoutes[role]
  return allowedRoutes.some((allowed) => route.startsWith(allowed))
}
