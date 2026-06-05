import { cepDigits } from "@/lib/cep"

export interface DeliveryAddress {
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  reference: string
}

export const emptyDeliveryAddress = (): DeliveryAddress => ({
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  reference: "",
})

export function formatDeliveryAddress(address: DeliveryAddress): string {
  const parts: string[] = []

  const cep = address.cep.trim()
  if (cep) parts.push(`CEP: ${cep}`)

  const streetLine = [address.street.trim(), address.number.trim()]
    .filter(Boolean)
    .join(", ")
  if (streetLine) parts.push(streetLine)

  if (address.complement.trim()) {
    parts.push(address.complement.trim())
  }

  if (address.neighborhood.trim()) {
    parts.push(address.neighborhood.trim())
  }

  const cityState = [address.city.trim(), address.state.trim()]
    .filter(Boolean)
    .join(" - ")
  if (cityState) parts.push(cityState)

  if (address.reference.trim()) {
    parts.push(`Referencia: ${address.reference.trim()}`)
  }

  return parts.join("\n")
}

export function isDeliveryAddressValid(address: DeliveryAddress): boolean {
  return (
    cepDigits(address.cep).length === 8 &&
    address.street.trim().length >= 3 &&
    address.number.trim().length >= 1 &&
    address.neighborhood.trim().length >= 2 &&
    address.city.trim().length >= 2 &&
    address.state.trim().length === 2
  )
}
