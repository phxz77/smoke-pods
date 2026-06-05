"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, Search } from "lucide-react"
import { categories } from "@/lib/products"
import { useProducts } from "@/lib/use-products"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function ProductGrid() {
  const { products, loading, error, configured } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "Todos" || product.categoria === selectedCategory
      if (!matchesCategory) return false
      if (!query) return true

      const flavorText = product.flavors.map((f) => f.name).join(" ")
      const haystack = [
        product.name,
        product.description,
        product.categoria,
        product.modelo,
        flavorText,
        product.puffs ?? "",
      ]
        .join(" ")
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [searchQuery, selectedCategory, products])

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          Nossos <span className="text-primary">Produtos</span>
        </h2>

        {!configured && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div>
              <p className="font-medium">Catálogo não conectado ao Supabase.</p>
              <p className="text-amber-100/80">
                Defina <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> em <code>.env.local</code> e
                reinicie o servidor.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            Erro ao carregar produtos: {error}
          </div>
        )}

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar produtos ou sabores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-input pl-10"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "transition-all",
                selectedCategory === category && "shadow-lg shadow-primary/25"
              )}
            >
              {category}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-xl border border-border bg-muted/40"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            {products.length === 0
              ? "Nenhum produto cadastrado ainda."
              : "Nenhum produto encontrado para sua busca."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.modelo} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
