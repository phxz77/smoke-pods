export interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge?: string
  gia?: string
  ddd?: string
  siafi?: string
  erro?: boolean
}

export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function cepDigits(cep: string): string {
  return cep.replace(/\D/g, "")
}

export async function fetchAddressByCep(cep: string): Promise<ViaCepResponse> {
  const digits = cepDigits(cep)
  if (digits.length !== 8) {
    throw new Error("CEP deve ter 8 digitos")
  }

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    throw new Error("Nao foi possivel consultar o CEP. Tente novamente.")
  }

  const data = (await response.json()) as ViaCepResponse

  if (data.erro) {
    throw new Error("CEP nao encontrado")
  }

  return data
}
