import Link from "next/link"
import { Instagram, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-bold text-foreground">
              SMOKE <span className="text-primary">PODS</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Sua loja de confianca para pods e vapes de qualidade.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Contato</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                WhatsApp: (11) 99999-9999
              </p>
              <p className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-primary" />
                @smokepods
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Entrega em toda regiao
              </p>
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Pagamento</h4>
            <p className="text-sm text-muted-foreground">
              Aceitamos Pix, Cartao, Link de Pagamento e Dinheiro na entrega.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Smoke Pods. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
