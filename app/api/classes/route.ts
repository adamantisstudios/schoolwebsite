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
  const type = new URL(req.url).searchParams.get("type") || "classes"

  if (type === "courses") {
    const { data, error } = await supabase.from("courses").select("*").order("name")
    if (error) return jsonError(error.message, 500)
    return jsonOk(data)
  }

  if (auth.user.role === "TEACHER") {
    const { data: teacher } = await supabase.from("teachers").select("id").eq("user_id", auth.user.id).single()
    if (!teacher) return jsonError("Teacher profile not found", 404)

    const { data: formClasses } = await supabase.from("classes").select("id, name").eq("form_teacher_id", teacher.id)
    const { data: taught } = await supabase
      .from("class_courses")
      .select("class_id, classes(id, name), courses!inner(teacher_courses!inner(teacher_id))")
      .eq("courses.teacher_courses.teacher_id", teacher.id)

    const map = new Map<string, { id: string; name: string }>()
    for (const c of formClasses || []) map.set(c.id, c)
    for (const t of taught || []) {
      const raw = t.classes as { id: string; name: string } | { id: string; name: string }[] | null
      const cls = Array.isArray(raw) ? raw[0] : raw
      if (cls?.id) map.set(cls.id, cls)
    }
    return jsonOk(Array.from(map.values()))
  }

  const { data, error } = await supabase
    .from("classes")
    .select(
      "id, name, form_teacher_id, teachers(id, employee_id, profiles:user_id(name)), class_courses(id, course_id, courses(id, name, code))"
    )
    .order("name")
  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}

const createSchema = z.object({
  name: z.string().min(2).max(120),
  formTeacherId: z.string().uuid().optional().nullable(),
  courseIds: z.array(z.string().uuid()).optional(),
})

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL"], permission: "classes:manage" })
  if (!isAuthResult(auth)) return auth

  const parsed = createSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid class payload", 400)

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("classes")
    .insert({
      name: parsed.data.name,
      form_teacher_id: parsed.data.formTeacherId ?? null,
    })
    .select()
    .single()

  if (error) return jsonError(error.message, 500)

  if (parsed.data.courseIds?.length) {
    await supabase.from("class_courses").insert(
      parsed.data.courseIds.map((courseId) => ({ class_id: data.id, course_id: courseId }))
    )
  }

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "CLASS_CREATE",
    resource: "classes",
    resourceId: data.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  })

  return jsonOk(data, 201)
}

const patchSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(120).optional(),
  formTeacherId: z.string().uuid().optional().nullable(),
})

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL"], permission: "classes:manage" })
  if (!isAuthResult(auth)) return auth

  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid class update", 400)

  const updates: Record<string, unknown> = {}
  if (parsed.data.name) updates.name = parsed.data.name
  if (parsed.data.formTeacherId !== undefined) updates.form_teacher_id = parsed.data.formTeacherId

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("classes")
    .update(updates)
    .eq("id", parsed.data.id)
    .select()
    .single()

  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}

const assignCourseSchema = z.object({
  classId: z.string().uuid(),
  courseId: z.string().uuid(),
  action: z.enum(["assign", "unassign"]).default("assign"),
})

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PRINCIPAL"], permission: "classes:manage" })
  if (!isAuthResult(auth)) return auth

  const parsed = assignCourseSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid class-course assignment", 400)

  const supabase = getSupabaseAdmin()

  if (parsed.data.action === "unassign") {
    const { error } = await supabase
      .from("class_courses")
      .delete()
      .eq("class_id", parsed.data.classId)
      .eq("course_id", parsed.data.courseId)
    if (error) return jsonError(error.message, 500)
    return jsonOk({ unassigned: true })
  }

  const { data, error } = await supabase
    .from("class_courses")
    .upsert({ class_id: parsed.data.classId, course_id: parsed.data.courseId })
    .select()
    .single()

  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}
