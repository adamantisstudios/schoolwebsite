"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader, StatCard } from "@/components/dashboard/ui"
import { Button } from "@/components/ui/button"

const nav = [
  { href: "/dashboard/parent", label: "Children" },
  { href: "/dashboard/parent/shop", label: "School shop" },
  { href: "/dashboard/parent/orders", label: "Orders" },
]

export default function ParentDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/parent/overview")
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setData(j.data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardShell title="Parent Portal" nav={nav}>
      <PageHeader
        title="My children"
        description="Attendance, grades, and fee status for your children only"
        actions={
          <Button asChild className="bg-amber-500 hover:bg-amber-600">
            <Link href="/dashboard/parent/shop">Shop uniforms & books</Link>
          </Button>
        }
      />

      {loading ? (
        <LoadingBlock />
      ) : !data?.children?.length ? (
        <EmptyState message="No children linked to this account." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {data.children.map((child: any) => (
            <Link
              key={child.id}
              href={`/dashboard/parent/child/${child.id}`}
              className="rounded-xl border bg-white p-5 hover:border-amber-300 transition-colors"
            >
              <h2 className="font-serif text-xl font-semibold">
                {child.first_name} {child.last_name}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {child.classes?.name} · {child.student_id}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <StatCard label="Attendance" value={child.attendanceRate != null ? `${child.attendanceRate}%` : "—"} />
                <StatCard label="Avg grade" value={child.gradeAverage != null ? `${child.gradeAverage}%` : "—"} />
                <StatCard label="Fees due" value={`GHS ${child.outstandingFees || 0}`} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
