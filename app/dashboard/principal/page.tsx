"use client"

import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader, StatCard } from "@/components/dashboard/ui"
import { principalNav } from "@/components/dashboard/principal-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const COLORS = ["#059669", "#f59e0b"]

export default function PrincipalDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/principal/overview")
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setData(j.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const feePie = data
    ? [
        { name: "Paid", value: data.totals.feesPaid },
        { name: "Outstanding", value: data.totals.feesOutstanding },
      ]
    : []

  return (
    <DashboardShell title="Principal Portal" nav={principalNav}>
      <PageHeader
        title="School overview"
        description="Live snapshot across academics, gate, and finance"
        actions={
          <Button asChild variant="outline">
            <Link href="/dashboard/principal/reports">Print centre</Link>
          </Button>
        }
      />

      {loading ? (
        <LoadingBlock />
      ) : !data ? (
        <EmptyState message="Unable to load overview." />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Students" value={data.totals.students} />
            <StatCard label="Staff" value={data.totals.staff} />
            <StatCard label="Attendance today" value={`${data.totals.attendanceTodayPct}%`} />
            <StatCard label="Fee collection" value={`${data.totals.feeCollectionPct}%`} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <section className="rounded-xl border bg-white p-5 h-80">
              <h2 className="font-serif font-semibold mb-4">Attendance by class</h2>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={data.attendanceByClass}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#059669" name="Present" />
                  <Bar dataKey="total" fill="#d1d5db" name="Total marked" />
                </BarChart>
              </ResponsiveContainer>
            </section>
            <section className="rounded-xl border bg-white p-5 h-80">
              <h2 className="font-serif font-semibold mb-4">Fee collection</h2>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie data={feePie} dataKey="value" nameKey="name" outerRadius={90} label>
                    {feePie.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </section>
          </div>

          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-serif font-semibold mb-3">Recent visitors</h2>
            {(data.recentVisitors || []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent visitors.</p>
            ) : (
              <ul className="text-sm divide-y">
                {data.recentVisitors.map((v: any) => (
                  <li key={v.id} className="py-2 flex justify-between gap-3">
                    <span>
                      {v.visitor_name} — {v.purpose}
                    </span>
                    <span className="text-muted-foreground">{new Date(v.check_in).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </DashboardShell>
  )
}
