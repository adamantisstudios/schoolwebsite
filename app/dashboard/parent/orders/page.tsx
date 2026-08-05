"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"

const nav = [
  { href: "/dashboard/parent", label: "Children" },
  { href: "/dashboard/parent/shop", label: "School shop" },
  { href: "/dashboard/parent/orders", label: "Orders" },
]

export default function ParentOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/parent/overview")
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setOrders(j.data.orders || [])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardShell title="Parent Portal" nav={nav}>
      <PageHeader title="Order history" description="Your school shop purchases" />
      {loading ? (
        <LoadingBlock />
      ) : orders.length === 0 ? (
        <EmptyState message="No orders yet." />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border bg-white p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">{o.status}</span>
                <span className="text-muted-foreground">{new Date(o.created_at).toLocaleString()}</span>
              </div>
              <ul className="text-sm space-y-1 mb-2">
                {(o.order_items || []).map((item: any) => (
                  <li key={item.id}>
                    {item.products?.name} × {item.quantity} — GHS {item.price}
                  </li>
                ))}
              </ul>
              <p className="font-semibold">Total: GHS {o.total_amount}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
