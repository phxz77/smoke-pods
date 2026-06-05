"use client"

import { Header } from "@/components/header"
import { CartPage } from "@/components/cart-page"
import { Footer } from "@/components/footer"

export default function CarrinhoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <CartPage />
      </main>
      <Footer />
    </div>
  )
}
