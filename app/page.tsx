"use client"

import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { ProductGrid } from "@/components/product-grid"
import { Footer } from "@/components/footer"
import { WhatsappFloatButton } from "@/components/whatsapp-float-button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <div id="produtos">
          <ProductGrid />
        </div>
      </main>
      <Footer />
      <WhatsappFloatButton />
    </div>
  )
}
