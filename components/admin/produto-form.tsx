"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUploader } from "@/components/admin/image-uploader"
import { categories } from "@/lib/products"
import type { ProdutoRow } from "@/lib/supabase/database.types"

const writableCategories = categories.filter((c) => c !== "Todos")

interface ProdutoFormValues {
  nome: string
  modelo: string
  sabor: string
  categoria: string
  descricao: string
  preco: string
  preco_original: string
  estoque: string
  imagem_url: string
  puffs: string
}

function emptyValues(): ProdutoFormValues {
  return {
    nome: "",
    modelo: "",
    sabor: "",
    categoria: "Pods Descartáveis",
    descricao: "",
    preco: "",
    preco_original: "",
    estoque: "0",
    imagem_url: "",
    puffs: "",
  }
}

function rowToValues(row: ProdutoRow): ProdutoFormValues {
  return {
    nome: row.nome,
    modelo: row.modelo,
    sabor: row.sabor ?? "",
    categoria: row.categoria,
    descricao: row.descricao,
    preco: String(row.preco),
    preco_original: row.preco_original != null ? String(row.preco_original) : "",
    estoque: String(row.estoque),
    imagem_url: row.imagem_url,
    puffs: row.puffs ?? "",
  }
}

interface ProdutoFormProps {
  initial?: ProdutoRow
}

export function ProdutoForm({ initial }: ProdutoFormProps) {
  const router = useRouter()
  const [values, setValues] = useState<ProdutoFormValues>(
    initial ? rowToValues(initial) : emptyValues()
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof ProdutoFormValues>(key: K, value: ProdutoFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const status: "disponivel" | "esgotado" = Number(values.estoque) > 0 ? "disponivel" : "esgotado"

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const preco = Number(values.preco.replace(",", "."))
    const precoOriginalRaw = values.preco_original.trim()
    const precoOriginal = precoOriginalRaw
      ? Number(precoOriginalRaw.replace(",", "."))
      : null
    const estoque = Number(values.estoque)

    if (!values.nome.trim()) return setError("Preencha o nome do produto.")
    if (!values.modelo.trim()) return setError("Preencha o modelo do produto.")
    if (!Number.isFinite(preco) || preco < 0) return setError("Preço inválido.")
    if (precoOriginal !== null && (!Number.isFinite(precoOriginal) || precoOriginal < 0)) {
      return setError("Preço original inválido.")
    }
    if (!Number.isInteger(estoque) || estoque < 0) return setError("Estoque inválido.")
    if (!values.imagem_url) return setError("Envie uma imagem para o produto.")
    if (!values.descricao.trim()) return setError("Preencha a descrição.")

    const payload = {
      nome: values.nome.trim(),
      modelo: values.modelo.trim(),
      sabor: values.sabor.trim() || null,
      categoria: values.categoria,
      descricao: values.descricao.trim(),
      preco,
      preco_original: precoOriginal,
      estoque,
      imagem_url: values.imagem_url,
      puffs: values.puffs.trim() || null,
    }

    setSaving(true)
    try {
      const supabase = getSupabaseBrowserClient()
      if (initial) {
        const { error: updateError } = await supabase
          .from("produtos")
          .update(payload)
          .eq("id", initial.id)
        if (updateError) {
          setError(updateError.message)
          setSaving(false)
          return
        }
      } else {
        const { error: insertError } = await supabase.from("produtos").insert(payload)
        if (insertError) {
          setError(insertError.message)
          setSaving(false)
          return
        }
      }
      router.push("/admin/produtos")
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado."
      setError(message)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para produtos
        </Link>
        <h1 className="text-2xl font-bold text-foreground">
          {initial ? "Editar produto" : "Novo produto"}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Informações básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={values.nome}
                    onChange={(e) => update("nome", e.target.value)}
                    placeholder='Ex.: "V300 - Watermelon Ice"'
                    className="bg-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo *</Label>
                  <Input
                    id="modelo"
                    value={values.modelo}
                    onChange={(e) => update("modelo", e.target.value)}
                    placeholder="Ex.: V300"
                    className="bg-input"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Produtos com o mesmo modelo aparecem como variações de sabor no site.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sabor">Sabor</Label>
                  <Input
                    id="sabor"
                    value={values.sabor}
                    onChange={(e) => update("sabor", e.target.value)}
                    placeholder="Ex.: Watermelon Ice"
                    className="bg-input"
                  />
                  <p className="text-xs text-muted-foreground">Deixe em branco se não tiver sabores.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select
                    value={values.categoria}
                    onValueChange={(v) => update("categoria", v)}
                  >
                    <SelectTrigger id="categoria" className="bg-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {writableCategories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="puffs">Puffs (opcional)</Label>
                  <Input
                    id="puffs"
                    value={values.puffs}
                    onChange={(e) => update("puffs", e.target.value)}
                    placeholder="Ex.: 5000"
                    className="bg-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={values.descricao}
                  onChange={(e) => update("descricao", e.target.value)}
                  rows={3}
                  className="bg-input"
                  placeholder="Breve descrição que aparece no card do produto"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Preço e estoque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$) *</Label>
                  <Input
                    id="preco"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={values.preco}
                    onChange={(e) => update("preco", e.target.value)}
                    className="bg-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preco_original">Preço “de” (opcional)</Label>
                  <Input
                    id="preco_original"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={values.preco_original}
                    onChange={(e) => update("preco_original", e.target.value)}
                    className="bg-input"
                    placeholder="Mostrado riscado"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estoque">Estoque *</Label>
                  <Input
                    id="estoque"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    value={values.estoque}
                    onChange={(e) => update("estoque", e.target.value)}
                    className="bg-input"
                    required
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                Status atual:{" "}
                <span
                  className={
                    status === "disponivel"
                      ? "rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-300"
                      : "rounded-full bg-destructive/15 px-2 py-0.5 font-medium text-destructive"
                  }
                >
                  {status === "disponivel" ? "Disponível" : "Esgotado"}
                </span>
                <p className="mt-1 text-xs text-muted-foreground">
                  O status é calculado automaticamente: estoque {">"} 0 = Disponível, estoque = 0 = Esgotado.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Imagem *</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={values.imagem_url}
                onChange={(url) => update("imagem_url", url)}
              />
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full gap-2" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {initial ? "Salvar alterações" : "Cadastrar produto"}
          </Button>
        </div>
      </div>
    </form>
  )
}
