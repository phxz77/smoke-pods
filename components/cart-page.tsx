"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, CheckCircle, Zap } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DeliveryAddressForm } from "@/components/delivery-address-form"
import {
  DeliveryAddress,
  emptyDeliveryAddress,
  formatDeliveryAddress,
  isDeliveryAddressValid,
} from "@/lib/address"

type PaymentMethod = "pix" | "cartao" | "link" | "dinheiro"

interface CustomerData {
  name: string
  phone: string
  address: DeliveryAddress
  paymentMethod: PaymentMethod
  observations: string
}

export function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()
  const [orderSent, setOrderSent] = useState(false)
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    phone: "",
    address: emptyDeliveryAddress(),
    paymentMethod: "pix",
    observations: "",
  })

  const paymentMethods = [
    { value: "pix", label: "Pix", description: "Pagamento instantaneo" },
    { value: "cartao", label: "Cartao na Entrega", description: "Debito ou Credito" },
    { value: "link", label: "Link de Pagamento", description: "Enviamos o link por WhatsApp" },
    { value: "dinheiro", label: "Dinheiro", description: "Pagamento na entrega" },
  ]

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }))
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value)
    handleInputChange("phone", formatted)
  }

  const isFormValid = () => {
    return (
      customerData.name.trim().length >= 3 &&
      customerData.phone.replace(/\D/g, "").length >= 10 &&
      isDeliveryAddressValid(customerData.address) &&
      items.length > 0
    )
  }

  const generateWhatsAppMessage = () => {
    const itemsList = items
      .map(
        (item) =>
          `- ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}`
      )
      .join("\n")

    const paymentLabel = paymentMethods.find((p) => p.value === customerData.paymentMethod)?.label

    const message = `*NOVO PEDIDO - SMOKE PODS*

*Cliente:* ${customerData.name}
*Telefone:* ${customerData.phone}

*Endereco de Entrega:*
${formatDeliveryAddress(customerData.address)}

*Itens do Pedido:*
${itemsList}

*Total: R$ ${total.toFixed(2).replace(".", ",")}*

*Forma de Pagamento:* ${paymentLabel}

${customerData.observations ? `*Observacoes:* ${customerData.observations}` : ""}`

    return encodeURIComponent(message)
  }

  const handleSubmit = () => {
    if (!isFormValid()) return

    const message = generateWhatsAppMessage()
    const whatsappNumber = "5511940793593"
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    window.open(whatsappUrl, "_blank")
    setOrderSent(true)
    clearCart()
  }

  if (orderSent) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-primary/20 p-6">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-foreground">Pedido Enviado!</h2>
        <p className="mt-2 text-muted-foreground">
          Seu pedido foi enviado para nosso WhatsApp. Entraremos em contato em breve!
        </p>
        <Button onClick={() => router.push("/")} className="mt-6 gap-2">
          <ShoppingBag className="h-4 w-4" />
          Continuar Comprando
        </Button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-muted p-6">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-foreground">Carrinho Vazio</h2>
        <p className="mt-2 text-muted-foreground">
          Adicione produtos ao carrinho para continuar
        </p>
        <Link href="/">
          <Button className="mt-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Ver Produtos
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Voltar para Loja
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-foreground">
        Finalizar <span className="text-primary">Pedido</span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Resumo do Pedido */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Resumo do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.rowId} className="flex gap-4 rounded-lg border border-border bg-muted/50 p-3">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-primary/30" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h4 className="font-medium text-foreground line-clamp-1">{item.name}</h4>
                    {item.flavor && (
                      <p className="text-xs text-muted-foreground">Sabor: {item.flavor}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.rowId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.rowId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.rowId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-primary">A combinar</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados do Cliente */}
        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Seus Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  placeholder="Digite seu nome"
                  value={customerData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  value={customerData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  maxLength={15}
                  className="bg-input"
                />
              </div>
              <DeliveryAddressForm
                value={customerData.address}
                onChange={(address) =>
                  setCustomerData((prev) => ({ ...prev, address }))
                }
              />
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Forma de Pagamento *</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={customerData.paymentMethod}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
                className="space-y-3"
              >
                {paymentMethods.map((method) => (
                  <div
                    key={method.value}
                    className={`flex items-center space-x-3 rounded-lg border p-4 transition-all ${
                      customerData.paymentMethod === method.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value={method.value} id={method.value} />
                    <Label htmlFor={method.value} className="flex-1 cursor-pointer">
                      <span className="font-medium text-foreground">{method.label}</span>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Observacoes (opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Alguma observacao sobre o pedido?"
                value={customerData.observations}
                onChange={(e) => handleInputChange("observations", e.target.value)}
                rows={2}
                className="bg-input"
              />
            </CardContent>
          </Card>

          <Button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            size="lg"
            className="w-full gap-2 text-lg shadow-lg shadow-primary/25"
          >
            Enviar Pedido via WhatsApp
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Ao clicar em enviar, voce sera redirecionado para o WhatsApp da loja.
          </p>
        </div>
      </div>
    </div>
  )
}
