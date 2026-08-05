"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
}

interface CartItem extends Product {
  quantity: number
}

interface ShopState {
  cart: CartItem[]
  isCartOpen: boolean
  total: number
}

type ShopAction =
  | { type: "ADD_TO_CART"; product: Product }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }

const initialState: ShopState = {
  cart: [],
  isCartOpen: false,
  total: 0,
}

function calculateTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

function shopReducer(state: ShopState, action: ShopAction): ShopState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.cart.find((item) => item.id === action.product.id)
      let newCart: CartItem[]

      if (existingItem) {
        newCart = state.cart.map((item) =>
          item.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        newCart = [...state.cart, { ...action.product, quantity: 1 }]
      }

      return {
        ...state,
        cart: newCart,
        total: calculateTotal(newCart),
      }
    }

    case "REMOVE_FROM_CART": {
      const newCart = state.cart.filter((item) => item.id !== action.productId)
      return {
        ...state,
        cart: newCart,
        total: calculateTotal(newCart),
      }
    }

    case "UPDATE_QUANTITY": {
      const newCart = state.cart
        .map((item) => (item.id === action.productId ? { ...item, quantity: Math.max(0, action.quantity) } : item))
        .filter((item) => item.quantity > 0)

      return {
        ...state,
        cart: newCart,
        total: calculateTotal(newCart),
      }
    }

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
        total: 0,
      }

    case "TOGGLE_CART":
      return {
        ...state,
        isCartOpen: !state.isCartOpen,
      }

    case "OPEN_CART":
      return {
        ...state,
        isCartOpen: true,
      }

    case "CLOSE_CART":
      return {
        ...state,
        isCartOpen: false,
      }

    default:
      return state
  }
}

const ShopContext = createContext<{
  state: ShopState
  dispatch: React.Dispatch<ShopAction>
} | null>(null)

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(shopReducer, initialState)

  return <ShopContext.Provider value={{ state, dispatch }}>{children}</ShopContext.Provider>
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider")
  }
  return context
}
