export type UserRole =
  | "TEACHER"
  | "SECURITY"
  | "PARENT"
  | "ACCOUNTANT"
  | "PRINCIPAL"

export type SessionUser = {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string | null
}

export const ROLE_HOME: Record<UserRole, string> = {
  TEACHER: "/dashboard/teacher",
  SECURITY: "/dashboard/security",
  PARENT: "/dashboard/parent",
  ACCOUNTANT: "/dashboard/accountant",
  PRINCIPAL: "/dashboard/principal",
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  TEACHER: [
    "attendance:read",
    "attendance:write",
    "performance:read",
    "performance:write",
    "students:read_assigned",
    "reports:teacher",
  ],
  SECURITY: [
    "visitors:read",
    "visitors:write",
    "students:lookup",
    "reports:visitors",
  ],
  PARENT: [
    "children:read_own",
    "fees:read_own",
    "shop:browse",
    "shop:order",
    "orders:read_own",
  ],
  ACCOUNTANT: [
    "fees:read",
    "fees:write",
    "finance:read",
    "finance:write",
    "reports:finance",
  ],
  PRINCIPAL: [
    "attendance:read",
    "performance:read",
    "students:read",
    "visitors:read",
    "fees:read",
    "finance:read",
    "shop:browse",
    "users:manage",
    "classes:manage",
    "courses:manage",
    "academic:manage",
    "reports:all",
    "audit:read",
  ],
}

export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function canAccessPath(role: UserRole, pathname: string): boolean {
  if (pathname.startsWith("/dashboard/teacher")) return role === "TEACHER"
  if (pathname.startsWith("/dashboard/security")) return role === "SECURITY"
  if (pathname.startsWith("/dashboard/parent")) return role === "PARENT"
  if (pathname.startsWith("/dashboard/accountant")) return role === "ACCOUNTANT"
  if (pathname.startsWith("/dashboard/principal")) return role === "PRINCIPAL"
  if (pathname.startsWith("/dashboard")) return true
  return true
}
