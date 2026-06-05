"use client"

import { useState } from "react"
import { Loader2, MapPin } from "lucide-react"
import { fetchAddressByCep, formatCep } from "@/lib/cep"
import { type DeliveryAddress, formatDeliveryAddress } from "@/lib/address"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface DeliveryAddressFormProps {
  value: DeliveryAddress
  onChange: (address: DeliveryAddress) => void
}

export function DeliveryAddressForm({ value, onChange }: DeliveryAddressFormProps) {
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState<string | null>(null)

  const updateField = (field: keyof DeliveryAddress, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue })
  }

  const handleCepChange = (raw: string) => {
    const formatted = formatCep(raw)
    updateField("cep", formatted)
    setCepError(null)
  }

  const handleCepBlur = async () => {
    const digits = value.cep.replace(/\D/g, "")
    if (digits.length !== 8) return

    setCepLoading(true)
    setCepError(null)

    try {
      const data = await fetchAddressByCep(value.cep)
      onChange({
        ...value,
        cep: formatCep(data.cep),
        street: data.logradouro || value.street,
        neighborhood: data.bairro || value.neighborhood,
        city: data.localidade || value.city,
        state: data.uf || value.state,
        complement: data.complemento || value.complement,
      })
    } catch (error) {
      setCepError(error instanceof Error ? error.message : "Erro ao buscar CEP")
    } finally {
      setCepLoading(false)
    }
  }

  const preview = formatDeliveryAddress(value)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="cep">CEP *</Label>
          <div className="relative">
            <Input
              id="cep"
              placeholder="00000-000"
              value={value.cep}
              onChange={(e) => handleCepChange(e.target.value)}
              onBlur={handleCepBlur}
              maxLength={9}
              className="bg-input pr-10"
              inputMode="numeric"
            />
            {cepLoading && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>
          {cepError && <p className="text-sm text-destructive">{cepError}</p>}
          <p className="text-xs text-muted-foreground">
            Digite o CEP e o endereco sera preenchido automaticamente
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado *</Label>
          <Input
            id="state"
            placeholder="SP"
            value={value.state}
            onChange={(e) => updateField("state", e.target.value.toUpperCase().slice(0, 2))}
            maxLength={2}
            className="bg-input uppercase"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="street">Rua / Avenida *</Label>
        <Input
          id="street"
          placeholder="Nome da rua"
          value={value.street}
          onChange={(e) => updateField("street", e.target.value)}
          className="bg-input"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="number">Numero *</Label>
          <Input
            id="number"
            placeholder="123"
            value={value.number}
            onChange={(e) => updateField("number", e.target.value)}
            className="bg-input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            placeholder="Apto, bloco, casa..."
            value={value.complement}
            onChange={(e) => updateField("complement", e.target.value)}
            className="bg-input"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro *</Label>
          <Input
            id="neighborhood"
            placeholder="Bairro"
            value={value.neighborhood}
            onChange={(e) => updateField("neighborhood", e.target.value)}
            className="bg-input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Cidade *</Label>
          <Input
            id="city"
            placeholder="Cidade"
            value={value.city}
            onChange={(e) => updateField("city", e.target.value)}
            className="bg-input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reference">Ponto de referencia</Label>
        <Textarea
          id="reference"
          placeholder="Ex: portao azul, proximo ao mercado..."
          value={value.reference}
          onChange={(e) => updateField("reference", e.target.value)}
          rows={2}
          className="bg-input"
        />
      </div>

      {preview.trim() && (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          <p className="mb-1 flex items-center gap-1 font-medium text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Endereco para entrega
          </p>
          <p className="whitespace-pre-line text-muted-foreground">{preview}</p>
        </div>
      )}
    </div>
  )
}
