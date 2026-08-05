import { NextResponse } from "next/server"
import { getSessionFromCookies } from "./auth"
import { hasPermission, type SessionUser, type UserRole } from "./roles"
import { getRequestMeta, writeAuditLog } from "./audit"

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status })
}

export function jsonError(message: string, status = 400, code?: string) {
  return NextResponse.json({ ok: false, error: message, code }, { status })
}

export async function requireAuth(
  req: Request,
  options?: { roles?: UserRole[]; permission?: string }
): Promise<{ user: SessionUser } | NextResponse> {
  const user = await getSessionFromCookies()
  const meta = getRequestMeta(req)

  if (!user) {
    await writeAuditLog({
      action: "UNAUTHORIZED",
      resource: new URL(req.url).pathname,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      severity: "WARNING",
    })
    return jsonError("Authentication required", 401, "UNAUTHENTICATED")
  }

  if (options?.roles && !options.roles.includes(user.role)) {
    await writeAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "FORBIDDEN_ROLE",
      resource: new URL(req.url).pathname,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      severity: "CRITICAL",
      details: { requiredRoles: options.roles },
    })
    return jsonError("You do not have permission to access this resource", 403, "FORBIDDEN")
  }

  if (options?.permission && !hasPermission(user.role, options.permission)) {
    await writeAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "FORBIDDEN_PERMISSION",
      resource: new URL(req.url).pathname,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      severity: "CRITICAL",
      details: { permission: options.permission },
    })
    return jsonError("Missing required permission", 403, "FORBIDDEN")
  }

  return { user }
}

export function isAuthResult(
  result: { user: SessionUser } | NextResponse
): result is { user: SessionUser } {
  return "user" in result
}
