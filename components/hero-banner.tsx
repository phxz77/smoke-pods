"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Zap, Truck, CreditCard, Shield } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"

export function HeroBanner() {
  const { itemCount } = useCart()

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-background to-muted">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Sua loja de{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Pods e Vapes
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Produtos de qualidade com os melhores precos e entrega rapida para voce.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="#produtos">
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/25">
                  Ver Produtos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              {itemCount > 0 && (
                <Link href="/carrinho">
                  <Button size="lg" variant="outline" className="gap-2">
                    Finalizar Pedido ({itemCount})
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative h-64 w-64 md:h-80 md:w-80">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl" />
              <Image
                src="/logo.jpeg"
                alt="Smoke Pods"
                fill
                className="relative rounded-full object-cover shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Zap, label: "Entrega Rapida", desc: "Em ate 24h" },
            { icon: Truck, label: "Frete Gratis", desc: "Acima de R$ 200" },
            { icon: CreditCard, label: "Pagamento Facil", desc: "Pix, Cartao, Dinheiro" },
            { icon: Shield, label: "Compra Segura", desc: "Produtos originais" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card/50 p-4 text-center"
            >
              <item.icon className="h-8 w-8 text-primary" />
              <span className="font-semibold text-foreground">{item.label}</span>
              <span className="text-sm text-muted-foreground">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
