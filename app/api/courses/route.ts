import { NextRequest } from "next/server"
import { z } from "zod"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"
import { getRequestMeta, writeAuditLog } from "@/lib/audit"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, {
    roles: ["TEACHER", "PRINCIPAL", "ACCOUNTANT"],
  })
  if (!isAuthResult(auth)) return auth

  const supabase = getSupabaseAdmin()
  const includeAssignments = new URL(req.url).searchParams.get("assignments") === "1"

  let query = supabase.from("courses").select("*").order("name")
  if (includeAssignments && auth.user.role === "PRINCIPAL") {
    query = supabase
      .from("courses")
      .select("*, teacher_courses(id, teacher_id, teachers(id, employee_id, profiles:user_id(name))), class_courses(id, class_id, classes(id, name))")
      .order("name")
  }

  const { data, error } = await query
  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}

const createSchema = z.object({
  name: z.string().min(2).max(120),
  code: z.string().min(2).max(20),
  description: z.string().max(500).optional(),
})

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL"], permission: "courses:manage" })
  if (!isAuthResult(auth)) return auth

  const parsed = createSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid course payload", 400)

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("courses")
    .insert({
      name: parsed.data.name,
      code: parsed.data.code.toUpperCase(),
      description: parsed.data.description ?? null,
    })
    .select()
    .single()

  if (error) return jsonError(error.message, 500)

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "COURSE_CREATE",
    resource: "courses",
    resourceId: data.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  })

  return jsonOk(data, 201)
}

const patchSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(120).optional(),
  code: z.string().min(2).max(20).optional(),
  description: z.string().max(500).optional().nullable(),
})

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL"], permission: "courses:manage" })
  if (!isAuthResult(auth)) return auth

  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid course update", 400)

  const updates: Record<string, unknown> = {}
  if (parsed.data.name) updates.name = parsed.data.name
  if (parsed.data.code) updates.code = parsed.data.code.toUpperCase()
  if (parsed.data.description !== undefined) updates.description = parsed.data.description

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("courses")
    .update(updates)
    .eq("id", parsed.data.id)
    .select()
    .single()

  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}

const assignTeacherSchema = z.object({
  courseId: z.string().uuid(),
  teacherId: z.string().uuid(),
  action: z.enum(["assign", "unassign"]).default("assign"),
})

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL"], permission: "courses:manage" })
  if (!isAuthResult(auth)) return auth

  const parsed = assignTeacherSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid assignment payload", 400)

  const supabase = getSupabaseAdmin()

  if (parsed.data.action === "unassign") {
    const { error } = await supabase
      .from("teacher_courses")
      .delete()
      .eq("course_id", parsed.data.courseId)
      .eq("teacher_id", parsed.data.teacherId)
    if (error) return jsonError(error.message, 500)
    return jsonOk({ unassigned: true })
  }

  const { data, error } = await supabase
    .from("teacher_courses")
    .upsert({ course_id: parsed.data.courseId, teacher_id: parsed.data.teacherId })
    .select()
    .single()

  if (error) return jsonError(error.message, 500)

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "TEACHER_COURSE_ASSIGN",
    resource: "teacher_courses",
    resourceId: data.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    details: { courseId: parsed.data.courseId, teacherId: parsed.data.teacherId },
  })

  return jsonOk(data)
}
