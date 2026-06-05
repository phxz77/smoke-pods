"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import type { Product, ProductFlavor } from "@/lib/products"

const CART_STORAGE_KEY = "smoke-pods-cart"

export interface CartItem {
  rowId: string
  productModel: string
  name: string
  flavor?: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, flavor: ProductFlavor) => void
  removeItem: (rowId: string) => void
  updateQuantity: (rowId: string, quantity: number) => void
  getQuantity: (rowId: string) => number
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function loadStoredCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item) => typeof item?.rowId === "string")
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setItems(loadStoredCart())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = (product: Product, flavor: ProductFlavor) => {
    const flavorName = flavor.name.length > 0 ? flavor.name : undefined
    const displayName = flavorName
      ? `${product.modelo} - ${flavorName}`
      : product.name

    setItems((prev) => {
      const existing = prev.find((item) => item.rowId === flavor.rowId)
      if (existing) {
        return prev.map((item) =>
          item.rowId === flavor.rowId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [
        ...prev,
        {
          rowId: flavor.rowId,
          productModel: product.modelo,
          name: displayName,
          flavor: flavorName,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ]
    })
  }

  const removeItem = (rowId: string) => {
    setItems((prev) => prev.filter((item) => item.rowId !== rowId))
  }

  const updateQuantity = (rowId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(rowId)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.rowId === rowId ? { ...item, quantity } : item
      )
    )
  }

  const getQuantity = (rowId: string) =>
    items.find((item) => item.rowId === rowId)?.quantity ?? 0

  const clearCart = () => setItems([])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        getQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
