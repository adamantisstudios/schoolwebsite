"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader, StatCard } from "@/components/dashboard/ui"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const nav = [
  { href: "/dashboard/teacher", label: "Overview" },
  { href: "/dashboard/teacher/students", label: "Students" },
  { href: "/dashboard/teacher/attendance", label: "Attendance" },
  { href: "/dashboard/teacher/grades", label: "Grades" },
]

export default function TeacherDashboard() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/teacher/overview")
      .then((r) => r.json())
      .then((j) => {
        if (!j.ok) setError(j.error)
        else setData(j.data)
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardShell title="Teacher Portal" nav={nav}>
      <PageHeader
        title="Teacher Dashboard"
        description="Your classes, attendance, and gradebook shortcuts"
        actions={
          <div className="flex gap-2">
            <Button asChild className="bg-amber-500 hover:bg-amber-600">
              <Link href="/dashboard/teacher/attendance">Mark attendance</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/teacher/grades">Enter grades</Link>
            </Button>
          </div>
        }
      />

      {loading ? (
        <LoadingBlock />
      ) : error ? (
        <EmptyState message={error} />
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <StatCard label="Form classes" value={data.formClasses?.length || 0} />
            <StatCard label="Courses assigned" value={data.courses?.length || 0} />
            <StatCard
              label="Today marked"
              value={`${data.todayAttendance?.present || 0}/${data.todayAttendance?.total || 0}`}
              hint="Present / total recorded today"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <section className="rounded-xl border bg-white p-5">
              <h2 className="font-serif text-lg font-semibold mb-3">Your classes</h2>
              {(data.formClasses || []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No form classes assigned.</p>
              ) : (
                <ul className="space-y-2">
                  {data.formClasses.map((c: any) => (
                    <li key={c.id} className="text-sm flex justify-between border-b py-2">
                      <span>{c.name}</span>
                      <Link className="text-amber-600 hover:underline" href={`/dashboard/teacher/attendance?classId=${c.id}`}>
                        Attendance
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="rounded-xl border bg-white p-5">
              <h2 className="font-serif text-lg font-semibold mb-3">Your courses</h2>
              {(data.courses || []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No courses assigned.</p>
              ) : (
                <ul className="space-y-2">
                  {data.courses.map((c: any) => (
                    <li key={c.id} className="text-sm border-b py-2">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-muted-foreground ml-2">{c.code}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </DashboardShell>
  )
}
