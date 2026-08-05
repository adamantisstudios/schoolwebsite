"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useShop } from "./shop-context"

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useShop()

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", product })
    dispatch({ type: "OPEN_CART" })
  }

  const handleBuyNow = () => {
    dispatch({ type: "ADD_TO_CART", product })
    dispatch({ type: "OPEN_CART" })
  }

  return (
    <Card className="bg-white hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-48 bg-gray-100">
          <Image
            src={product.image || `/placeholder.svg?height=192&width=300&query=${product.name}`}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-sage-900 mb-2">{product.name}</h3>
          <p className="text-sage-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-amber-600">₵{product.price.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleBuyNow} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
              Buy Now
            </Button>
            <Button
              onClick={handleAddToCart}
              variant="outline"
              size="icon"
              className="border-sage-300 hover:bg-sage-50 bg-transparent"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
