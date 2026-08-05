import { getSupabaseAdmin } from "./supabase-admin"
import type { UserRole } from "./roles"

type AuditInput = {
  actorId?: string | null
  actorEmail?: string | null
  actorRole?: UserRole | null
  action: string
  resource: string
  resourceId?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  details?: Record<string, unknown>
  severity?: "INFO" | "WARNING" | "CRITICAL"
}

/**
 * Append-only security audit log. Failures are swallowed so auth flows are not blocked,
 * but critical severity failures are console-error logged for ops.
 */
export async function writeAuditLog(input: AuditInput): Promise<void> {
  if (process.env.AUDIT_LOG_ENABLED === "false") return

  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from("audit_logs").insert({
      actor_id: input.actorId ?? null,
      actor_email: input.actorEmail ?? null,
      actor_role: input.actorRole ?? null,
      action: input.action,
      resource: input.resource,
      resource_id: input.resourceId ?? null,
      ip_address: input.ipAddress ?? null,
      user_agent: input.userAgent ?? null,
      details: input.details ?? {},
      severity: input.severity ?? "INFO",
    })

    if (error) {
      console.error("[audit] insert failed:", error.message)
    }
  } catch (err) {
    console.error("[audit] unexpected error:", err)
  }
}

export function getRequestMeta(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"
  const userAgent = req.headers.get("user-agent") || "unknown"
  return { ip, userAgent }
}
