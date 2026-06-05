"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Plus, Minus, ShoppingCart, Zap } from "lucide-react"
import {
  Product,
  defaultFlavorName,
  findFlavor,
  hasFlavorSelector,
  isAvailable,
  totalAvailableStock,
} from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, updateQuantity, getQuantity } = useCart()
  const [imageError, setImageError] = useState(false)

  const showFlavorSelector = hasFlavorSelector(product)
  const [selectedFlavor, setSelectedFlavor] = useState<string | undefined>(
    defaultFlavorName(product)
  )

  // Se os sabores mudarem (via realtime) e o sabor selecionado sumir, reseta.
  useEffect(() => {
    if (!showFlavorSelector) {
      setSelectedFlavor(undefined)
      return
    }
    if (!selectedFlavor || !product.flavors.some((f) => f.name === selectedFlavor)) {
      setSelectedFlavor(defaultFlavorName(product))
    }
  }, [product, showFlavorSelector, selectedFlavor])

  const productAvailable = isAvailable(product)
  const activeFlavor = showFlavorSelector
    ? findFlavor(product, selectedFlavor)
    : product.flavors[0]

  const flavorAvailable = !!activeFlavor && activeFlavor.stock > 0
  const stockForLine = activeFlavor?.stock ?? 0
  const quantity = activeFlavor ? getQuantity(activeFlavor.rowId) : 0

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const totalStock = totalAvailableStock(product)

  const handleAdd = () => {
    if (!productAvailable || !activeFlavor || !flavorAvailable) return
    if (quantity >= stockForLine) return
    if (quantity === 0) {
      addItem(product, activeFlavor)
    } else {
      updateQuantity(activeFlavor.rowId, quantity + 1)
    }
  }

  const handleRemove = () => {
    if (activeFlavor && quantity > 0) {
      updateQuantity(activeFlavor.rowId, quantity - 1)
    }
  }

  return (
    <Card
      className={`group flex flex-col overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 ${
        !productAvailable ? "opacity-75" : ""
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image && !imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform group-hover:scale-105 ${
              !productAvailable ? "grayscale" : ""
            }`}
            onError={() => setImageError(true)}
            unoptimized={product.image.startsWith("http")}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <Zap className="h-16 w-16 text-primary/50" />
          </div>
        )}
        {productAvailable && discount > 0 && (
          <Badge className="absolute left-2 top-2 bg-secondary text-secondary-foreground">
            -{discount}%
          </Badge>
        )}
        {productAvailable && product.puffs && (
          <Badge
            variant="outline"
            className="absolute right-2 top-2 border-primary/50 bg-background/80 text-primary"
          >
            {product.puffs} puffs
          </Badge>
        )}
        {!productAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <Badge className="bg-destructive text-destructive-foreground text-sm uppercase tracking-wide">
              Esgotado
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-4">
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">{product.categoria}</p>
          <span className="text-xs text-muted-foreground">•</span>
          <p className="text-xs font-medium text-primary">{product.modelo}</p>
        </div>
        <h3 className="mt-1 font-semibold text-foreground line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        )}

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              R$ {product.originalPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>

        {showFlavorSelector && (
          <div className="mt-4 space-y-1.5">
            <label className="text-xs font-medium text-foreground">Sabor</label>
            <Select
              value={selectedFlavor}
              onValueChange={(v) => setSelectedFlavor(v)}
              disabled={!productAvailable}
            >
              <SelectTrigger className="w-full bg-input">
                <SelectValue placeholder="Selecione o sabor" />
              </SelectTrigger>
              <SelectContent>
                {product.flavors
                  .filter((f) => f.name.length > 0)
                  .map((f) => {
                    const disabled = f.stock <= 0
                    return (
                      <SelectItem key={f.rowId} value={f.name} disabled={disabled}>
                        <span className="flex w-full items-center justify-between gap-3">
                          <span>{f.name}</span>
                          {disabled && (
                            <span className="text-xs text-destructive">Esgotado</span>
                          )}
                        </span>
                      </SelectItem>
                    )
                  })}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              {product.flavors.filter((f) => f.stock > 0).length} de{" "}
              {product.flavors.filter((f) => f.name.length > 0).length} sabores disponíveis
              {totalStock > 0 && ` • ${totalStock} em estoque`}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {!productAvailable ? (
          <Button disabled className="w-full gap-2" size="lg" variant="secondary">
            Esgotado
          </Button>
        ) : !flavorAvailable ? (
          <Button disabled className="w-full gap-2" size="lg" variant="secondary">
            {showFlavorSelector ? "Sabor esgotado" : "Esgotado"}
          </Button>
        ) : quantity === 0 ? (
          <Button onClick={handleAdd} className="w-full gap-2" size="lg">
            <ShoppingCart className="h-4 w-4" />
            Adicionar
          </Button>
        ) : (
          <div className="flex w-full items-center justify-between rounded-lg border border-border bg-muted p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-foreground">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAdd}
              disabled={quantity >= stockForLine}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
