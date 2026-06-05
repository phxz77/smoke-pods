// Tipos da camada de apresentação para o catálogo público.
// Os dados vêm do Supabase (tabela `produtos`) e são agrupados por `modelo`
// para que o site mostre 1 card por modelo com seletor de sabor.

import type { ProdutoRow, ProductStatus } from "@/lib/supabase/database.types"

export type { ProductStatus }

export interface ProductFlavor {
  rowId: string
  name: string // string vazia quando o produto não tem sabor (1 linha só)
  stock: number
  status: ProductStatus
}

export interface Product {
  modelo: string
  name: string
  description: string
  categoria: string
  price: number
  originalPrice?: number
  image: string
  puffs?: string
  flavors: ProductFlavor[]
}

export const categories = [
  "Todos",
  "Pods Descartáveis",
  "Pods Recarregáveis",
  "Essências",
  "Acessórios",
] as const

// ---------------------------------------------------------------------------
// Agrupamento DB-row → Product
// ---------------------------------------------------------------------------

export function groupRowsByModelo(rows: ProdutoRow[]): Product[] {
  const order: string[] = []
  const buckets = new Map<string, ProdutoRow[]>()

  for (const row of rows) {
    if (!buckets.has(row.modelo)) {
      buckets.set(row.modelo, [])
      order.push(row.modelo)
    }
    buckets.get(row.modelo)!.push(row)
  }

  return order.map((modelo) => buildProduct(modelo, buckets.get(modelo)!))
}

function buildProduct(modelo: string, rows: ProdutoRow[]): Product {
  const first = rows[0]

  const flavors: ProductFlavor[] = rows.map((row) => ({
    rowId: row.id,
    name: row.sabor ?? "",
    stock: row.estoque,
    status: row.status,
  }))

  const allHaveSabor = rows.every((r) => r.sabor && r.sabor.length > 0)
  const displayName = allHaveSabor ? modelo : first.nome

  return {
    modelo,
    name: displayName,
    description: pickFirstDescription(rows),
    categoria: first.categoria,
    price: Number(first.preco),
    originalPrice:
      first.preco_original != null ? Number(first.preco_original) : undefined,
    image: first.imagem_url || "",
    puffs: first.puffs ?? undefined,
    flavors,
  }
}

function pickFirstDescription(rows: ProdutoRow[]): string {
  for (const r of rows) {
    if (r.descricao && r.descricao.trim().length > 0) return r.descricao
  }
  return ""
}

// ---------------------------------------------------------------------------
// Helpers de estoque / disponibilidade
// ---------------------------------------------------------------------------

export function hasMultipleFlavors(product: Product): boolean {
  return product.flavors.some((f) => f.name.length > 0) && product.flavors.length > 1
}

export function hasFlavorSelector(product: Product): boolean {
  // mostra seletor sempre que houver pelo menos 1 sabor nomeado
  return product.flavors.some((f) => f.name.length > 0)
}

export function totalAvailableStock(product: Product): number {
  return product.flavors.reduce((sum, f) => sum + f.stock, 0)
}

export function isAvailable(product: Product): boolean {
  return totalAvailableStock(product) > 0
}

export function findFlavor(product: Product, flavorName?: string): ProductFlavor | undefined {
  if (!flavorName) {
    return product.flavors.find((f) => f.name === "") ?? product.flavors[0]
  }
  return product.flavors.find((f) => f.name === flavorName)
}

export function getFlavorStock(product: Product, flavorName?: string): number {
  return findFlavor(product, flavorName)?.stock ?? 0
}

export function defaultFlavorName(product: Product): string | undefined {
  if (!hasFlavorSelector(product)) return undefined
  return product.flavors.find((f) => f.stock > 0)?.name ?? product.flavors[0]?.name
}
