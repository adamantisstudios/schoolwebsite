"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"
import { principalNav } from "@/components/dashboard/principal-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [form, setForm] = useState({ name: "", formTeacherId: "" })
  const [assign, setAssign] = useState({ classId: "", courseId: "" })

  async function load() {
    setLoading(true)
    const [cl, co, te] = await Promise.all([
      fetch("/api/classes").then((r) => r.json()),
      fetch("/api/courses").then((r) => r.json()),
      fetch("/api/teachers").then((r) => r.json()),
    ])
    if (cl.ok) setClasses(cl.data)
    if (co.ok) setCourses(co.data)
    if (te.ok) setTeachers(te.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function createClass(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        formTeacherId: form.formTeacherId || null,
      }),
    })
    const json = await res.json()
    setMessage(json.ok ? "Class created." : json.error)
    if (json.ok) {
      setForm({ name: "", formTeacherId: "" })
      load()
    }
  }

  async function assignCourse() {
    if (!assign.classId || !assign.courseId) return
    const res = await fetch("/api/classes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId: assign.classId, courseId: assign.courseId, action: "assign" }),
    })
    const json = await res.json()
    setMessage(json.ok ? "Course linked to class." : json.error)
    if (json.ok) load()
  }

  async function setFormTeacher(classId: string, formTeacherId: string) {
    const res = await fetch("/api/classes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: classId, formTeacherId: formTeacherId || null }),
    })
    const json = await res.json()
    setMessage(json.ok ? "Form teacher updated." : json.error)
    if (json.ok) load()
  }

  return (
    <DashboardShell title="Principal Portal" nav={principalNav}>
      <PageHeader title="Class management" description="Create classes, assign form teachers and courses" />
      {message && <p className="mb-3 text-sm text-emerald-700">{message}</p>}

      <form onSubmit={createClass} className="rounded-xl border bg-white p-4 grid sm:grid-cols-2 gap-3 mb-6 max-w-2xl">
        <div>
          <Label>Class name</Label>
          <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label>Form teacher</Label>
          <select
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={form.formTeacherId}
            onChange={(e) => setForm({ ...form, formTeacherId: e.target.value })}
          >
            <option value="">None</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {(t.profiles as { name?: string })?.name || t.employee_id}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" className="sm:col-span-2 bg-amber-500 hover:bg-amber-600">
          Add class
        </Button>
      </form>

      <div className="rounded-xl border bg-white p-4 mb-6 max-w-2xl flex flex-wrap gap-3 items-end">
        <div>
          <Label>Class</Label>
          <select
            className="border rounded-md px-3 py-2 text-sm min-w-[160px]"
            value={assign.classId}
            onChange={(e) => setAssign({ ...assign, classId: e.target.value })}
          >
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Course</Label>
          <select
            className="border rounded-md px-3 py-2 text-sm min-w-[160px]"
            value={assign.courseId}
            onChange={(e) => setAssign({ ...assign, courseId: e.target.value })}
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={assignCourse} className="bg-amber-500 hover:bg-amber-600">
          Link course
        </Button>
      </div>

      {loading ? (
        <LoadingBlock />
      ) : classes.length === 0 ? (
        <EmptyState message="No classes yet." />
      ) : (
        <div className="space-y-3">
          {classes.map((c) => (
            <div key={c.id} className="rounded-xl border bg-white p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="font-semibold">{c.name}</h2>
                <select
                  className="border rounded-md px-3 py-2 text-sm max-w-xs"
                  value={c.form_teacher_id || ""}
                  onChange={(e) => setFormTeacher(c.id, e.target.value)}
                >
                  <option value="">No form teacher</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {(t.profiles as { name?: string })?.name || t.employee_id}
                    </option>
                  ))}
                </select>
              </div>
              {(c.class_courses || []).length > 0 && (
                <p className="text-sm mt-2 text-muted-foreground">
                  Courses: {(c.class_courses || []).map((cc: any) => cc.courses?.name).filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
