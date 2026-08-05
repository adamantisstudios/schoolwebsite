"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useShop } from "./shop-context"
import { sendWhatsAppMessage } from "@/utils/whatsapp"

export function CartSidebar() {
  const { state, dispatch } = useShop()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    parentName: "",
    childName: "",
    phone: "",
    location: "",
    notes: "",
  })

  const updateQuantity = (productId: string, newQuantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity: newQuantity })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", productId })
  }

  const handleCheckout = async () => {
    if (!customerInfo.parentName || !customerInfo.childName || !customerInfo.phone || !customerInfo.location) {
      alert("Please fill in all required fields")
      return
    }

    const orderSummary = `
🛒 *SCHOOL SHOP ORDER*

👤 *Customer Details:*
Parent Name: ${customerInfo.parentName}
Child Name: ${customerInfo.childName}
Phone: ${customerInfo.phone}
Location: ${customerInfo.location}

📦 *Order Items:*
${state.cart.map((item) => `• ${item.name} x${item.quantity} - ₵${(item.price * item.quantity).toFixed(2)}`).join("\n")}

💰 *Total Amount: ₵${state.total.toFixed(2)}*

${customerInfo.notes ? `📝 *Notes:* ${customerInfo.notes}` : ""}

Please confirm this order and provide delivery details.
    `.trim()

    try {
      await sendWhatsAppMessage(orderSummary)
      dispatch({ type: "CLEAR_CART" })
      dispatch({ type: "CLOSE_CART" })
      setCustomerInfo({
        parentName: "",
        childName: "",
        phone: "",
        location: "",
        notes: "",
      })
      setIsCheckingOut(false)
      alert("Order sent successfully! We will contact you shortly.")
    } catch (error) {
      alert("Failed to send order. Please try again.")
    }
  }

  if (!state.isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => dispatch({ type: "CLOSE_CART" })}>
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-sage-900 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart ({state.cart.length})
            </h2>
            <Button variant="ghost" size="icon" onClick={() => dispatch({ type: "CLOSE_CART" })}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {state.cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {state.cart.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex gap-3">
                      <div className="relative w-16 h-16 bg-gray-100 rounded">
                        <Image
                          src={item.image || `/placeholder.svg?height=64&width=64&query=${item.name}`}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sage-900 text-sm">{item.name}</h3>
                        <p className="text-amber-600 font-semibold">₵{item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 ml-2"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-amber-600">₵{state.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Form */}
              {!isCheckingOut ? (
                <Button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Proceed to Checkout
                </Button>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="parentName">Parent Name *</Label>
                      <Input
                        id="parentName"
                        value={customerInfo.parentName}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, parentName: e.target.value }))}
                        placeholder="Enter parent's full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="childName">Child Name *</Label>
                      <Input
                        id="childName"
                        value={customerInfo.childName}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, childName: e.target.value }))}
                        placeholder="Enter child's name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location/Address *</Label>
                      <Input
                        id="location"
                        value={customerInfo.location}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter delivery address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any special instructions or notes"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsCheckingOut(false)} className="flex-1">
                        Back
                      </Button>
                      <Button onClick={handleCheckout} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        Send Order via WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
