"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { groupRowsByModelo, type Product } from "@/lib/products"
import type { ProdutoRow } from "@/lib/supabase/database.types"

export interface UseProductsResult {
  products: Product[]
  loading: boolean
  error: string | null
  configured: boolean
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    let cancelled = false
    const supabase = getSupabaseBrowserClient()

    const fetchAll = async () => {
      const { data, error: fetchError } = await supabase
        .from("produtos")
        .select("*")
        .order("modelo", { ascending: true })
        .order("created_at", { ascending: true })

      if (cancelled) return
      if (fetchError) {
        setError(fetchError.message)
        setProducts([])
      } else {
        setError(null)
        setProducts(groupRowsByModelo((data ?? []) as ProdutoRow[]))
      }
      setLoading(false)
    }

    fetchAll()

    const channel = supabase
      .channel("public:produtos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "produtos" },
        () => {
          // qualquer mudança: refaz a query (simples, suficiente para um catálogo pequeno)
          fetchAll()
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [])

  return { products, loading, error, configured: isSupabaseConfigured }
}
