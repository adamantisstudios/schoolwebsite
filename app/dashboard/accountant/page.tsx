"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader, StatCard } from "@/components/dashboard/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const nav = [
  { href: "/dashboard/accountant", label: "Overview" },
  { href: "/dashboard/accountant/fees", label: "Student fees" },
  { href: "/dashboard/accountant/ledger", label: "Ledger" },
]

export default function AccountantDashboard() {
  const [fees, setFees] = useState<any[]>([])
  const [tx, setTx] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetch("/api/fees").then((r) => r.json()), fetch("/api/finance").then((r) => r.json())]).then(
      ([f, t]) => {
        if (f.ok) setFees(f.data)
        if (t.ok) setTx(t.data)
        setLoading(false)
      }
    )
  }, [])

  const paid = fees.filter((f) => f.paid).reduce((s, f) => s + f.amount, 0)
  const outstanding = fees.filter((f) => !f.paid).reduce((s, f) => s + f.amount, 0)
  const income = tx.filter((t) => t.type === "INCOME" || t.type === "FEE_PAYMENT").reduce((s, t) => s + t.amount, 0)
  const expense = tx.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0)

  return (
    <DashboardShell title="Accountant Portal" nav={nav}>
      <PageHeader title="Finance overview" description="Fee collection and ledger summary" />
      {loading ? (
        <LoadingBlock />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Fees collected" value={`GHS ${paid}`} />
            <StatCard label="Outstanding" value={`GHS ${outstanding}`} />
            <StatCard label="Income (ledger)" value={`GHS ${income}`} />
            <StatCard label="Expenses" value={`GHS ${expense}`} />
          </div>
          <h2 className="font-serif text-lg font-semibold mb-3">Fee defaulters</h2>
          {fees.filter((f) => !f.paid).length === 0 ? (
            <EmptyState message="No outstanding fees." />
          ) : (
            <div className="rounded-xl border bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-emerald-50 text-left">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Due</th>
                    <th className="px-4 py-3">Term</th>
                  </tr>
                </thead>
                <tbody>
                  {fees
                    .filter((f) => !f.paid)
                    .map((f) => (
                      <tr key={f.id} className="border-t">
                        <td className="px-4 py-3">
                          {f.students?.first_name} {f.students?.last_name}
                        </td>
                        <td className="px-4 py-3">GHS {f.amount}</td>
                        <td className="px-4 py-3">{f.due_date}</td>
                        <td className="px-4 py-3">{f.academic_term}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </DashboardShell>
  )
}
