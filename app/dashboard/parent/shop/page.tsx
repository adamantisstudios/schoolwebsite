"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"
import { Button } from "@/components/ui/button"

const nav = [
  { href: "/dashboard/parent", label: "Children" },
  { href: "/dashboard/parent/shop", label: "School shop" },
  { href: "/dashboard/parent/orders", label: "Orders" },
]

export default function ParentShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [category, setCategory] = useState("")

  async function loadCart() {
    const j = await fetch("/api/cart").then((r) => r.json())
    if (j.ok) setCart(j.data)
  }

  useEffect(() => {
    const url = category ? `/api/shop?category=${category}` : "/api/shop"
    Promise.all([fetch(url).then((r) => r.json()), loadCart()]).then(([p]) => {
      if (p.ok) setProducts(p.data)
      setLoading(false)
    })
  }, [category])

  async function add(productId: string) {
    setMessage("")
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    })
    const json = await res.json()
    if (json.ok) setCart(json.data)
    else setMessage(json.error)
  }

  async function updateQty(productId: string, quantity: number) {
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    })
    const json = await res.json()
    if (json.ok) setCart(json.data)
    else setMessage(json.error)
  }

  async function checkout() {
    if (!cart?.id) return
    setMessage("")
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "checkout", orderId: cart.id }),
    })
    const json = await res.json()
    if (json.ok) {
      setMessage("Payment successful (mock). Order marked as paid.")
      await loadCart()
      const j = await fetch("/api/shop").then((r) => r.json())
      if (j.ok) setProducts(j.data)
    } else setMessage(json.error)
  }

  const items = cart?.order_items || []

  return (
    <DashboardShell title="Parent Portal" nav={nav}>
      <PageHeader title="School shop" description="Cart saved to your account until checkout" />
      <div className="flex gap-2 mb-4">
        {["", "BOOK", "ATTIRE", "OTHER"].map((c) => (
          <Button key={c || "all"} variant={category === c ? "default" : "outline"} size="sm" onClick={() => setCategory(c)}>
            {c || "All"}
          </Button>
        ))}
      </div>
      {message && <p className="mb-3 text-sm text-emerald-700">{message}</p>}
      {loading ? (
        <LoadingBlock />
      ) : products.length === 0 ? (
        <EmptyState message="No products available." />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.id} className="rounded-xl border bg-white p-4">
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{p.category}</p>
                <p className="text-sm mt-2 line-clamp-2">{p.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold">GHS {p.price}</span>
                  <Button size="sm" disabled={p.stock < 1} onClick={() => add(p.id)}>
                    Add ({p.stock} left)
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <aside className="rounded-xl border bg-white p-4 h-fit sticky top-20">
            <h2 className="font-serif font-semibold mb-1">Your cart</h2>
            <p className="text-xs text-muted-foreground mb-3">Stored in database (PENDING order)</p>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">Cart is empty.</p>
            ) : (
              <ul className="space-y-3 text-sm mb-4">
                {items.map((item: any) => (
                  <li key={item.id} className="flex flex-col gap-1 border-b pb-2">
                    <span className="font-medium">{item.products?.name}</span>
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="number"
                        min={0}
                        max={50}
                        className="w-16 border rounded px-2 py-1"
                        value={item.quantity}
                        onChange={(e) => updateQty(item.product_id, Number(e.target.value))}
                      />
                      <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
                      <button className="text-red-600 text-xs" onClick={() => updateQty(item.product_id, 0)}>
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="font-semibold mb-3">Total: GHS {(cart?.total_amount || 0).toFixed(2)}</p>
            <Button className="w-full bg-amber-500 hover:bg-amber-600" disabled={!items.length} onClick={checkout}>
              Mock pay & checkout
            </Button>
          </aside>
        </div>
      )}
    </DashboardShell>
  )
}
