"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"
import { principalNav } from "@/components/dashboard/principal-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [form, setForm] = useState({ name: "", code: "", description: "" })
  const [assign, setAssign] = useState<{ courseId: string; teacherId: string }>({ courseId: "", teacherId: "" })

  async function load() {
    setLoading(true)
    const [c, t] = await Promise.all([
      fetch("/api/courses?assignments=1").then((r) => r.json()),
      fetch("/api/teachers").then((r) => r.json()),
    ])
    if (c.ok) setCourses(c.data)
    if (t.ok) setTeachers(t.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function createCourse(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const json = await res.json()
    setMessage(json.ok ? "Course created." : json.error)
    if (json.ok) {
      setForm({ name: "", code: "", description: "" })
      load()
    }
  }

  async function assignTeacher() {
    if (!assign.courseId || !assign.teacherId) return
    const res = await fetch("/api/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: assign.courseId, teacherId: assign.teacherId, action: "assign" }),
    })
    const json = await res.json()
    setMessage(json.ok ? "Teacher assigned." : json.error)
    if (json.ok) load()
  }

  return (
    <DashboardShell title="Principal Portal" nav={principalNav}>
      <PageHeader title="Course management" description="Create courses and assign teachers" />
      {message && <p className="mb-3 text-sm text-emerald-700">{message}</p>}

      <form onSubmit={createCourse} className="rounded-xl border bg-white p-4 grid sm:grid-cols-3 gap-3 mb-6 max-w-4xl">
        <div>
          <Label>Name</Label>
          <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label>Code</Label>
          <Input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        </div>
        <div>
          <Label>Description</Label>
          <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <Button type="submit" className="sm:col-span-3 bg-amber-500 hover:bg-amber-600">
          Add course
        </Button>
      </form>

      <div className="rounded-xl border bg-white p-4 mb-6 max-w-4xl flex flex-wrap gap-3 items-end">
        <div>
          <Label>Course</Label>
          <select
            className="border rounded-md px-3 py-2 text-sm min-w-[180px]"
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
        <div>
          <Label>Teacher</Label>
          <select
            className="border rounded-md px-3 py-2 text-sm min-w-[180px]"
            value={assign.teacherId}
            onChange={(e) => setAssign({ ...assign, teacherId: e.target.value })}
          >
            <option value="">Select teacher</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {(t.profiles as { name?: string })?.name || t.employee_id}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={assignTeacher} className="bg-amber-500 hover:bg-amber-600">
          Assign teacher
        </Button>
      </div>

      {loading ? (
        <LoadingBlock />
      ) : courses.length === 0 ? (
        <EmptyState message="No courses yet." />
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <div key={c.id} className="rounded-xl border bg-white p-4">
              <div className="flex justify-between gap-3">
                <div>
                  <h2 className="font-semibold">
                    {c.name} <span className="text-muted-foreground text-sm">({c.code})</span>
                  </h2>
                  {c.description && <p className="text-sm text-muted-foreground mt-1">{c.description}</p>}
                </div>
              </div>
              {(c.teacher_courses || []).length > 0 && (
                <p className="text-sm mt-2">
                  Teachers:{" "}
                  {(c.teacher_courses || [])
                    .map((tc: any) => (tc.teachers?.profiles as { name?: string })?.name || tc.teachers?.employee_id)
                    .join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
