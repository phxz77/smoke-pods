"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Loader2, Pencil, Search, Trash2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { ProdutoRow } from "@/lib/supabase/database.types"

interface ProdutosTableProps {
  produtos: ProdutoRow[]
}

const BUCKET_MARKER = "/storage/v1/object/public/produtos-imagens/"

function isStorageUrl(url: string) {
  return url.includes(BUCKET_MARKER)
}

function storagePathFromUrl(url: string): string | null {
  const idx = url.indexOf(BUCKET_MARKER)
  if (idx === -1) return null
  return url.slice(idx + BUCKET_MARKER.length)
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function ProdutosTable({ produtos }: ProdutosTableProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [pendingDelete, setPendingDelete] = useState<ProdutoRow | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return produtos
    return produtos.filter((p) =>
      [p.nome, p.modelo, p.sabor ?? "", p.categoria]
        .join(" ")
        .toLowerCase()
        .includes(q)
    )
  }, [produtos, query])

  const handleDelete = async () => {
    if (!pendingDelete) return
    setError(null)
    setDeleting(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error: deleteError } = await supabase
        .from("produtos")
        .delete()
        .eq("id", pendingDelete.id)
      if (deleteError) {
        setError(deleteError.message)
        setDeleting(false)
        return
      }

      // remove imagem do Storage também, se estiver no bucket
      if (pendingDelete.imagem_url && isStorageUrl(pendingDelete.imagem_url)) {
        const path = storagePathFromUrl(pendingDelete.imagem_url)
        if (path) {
          await supabase.storage.from("produtos-imagens").remove([path])
        }
      }

      setPendingDelete(null)
      setDeleting(false)
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado."
      setError(message)
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por nome, modelo ou sabor..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-input pl-10"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Produto</th>
              <th className="px-4 py-3 text-left font-medium">Modelo</th>
              <th className="px-4 py-3 text-left font-medium">Categoria</th>
              <th className="px-4 py-3 text-right font-medium">Preço</th>
              <th className="px-4 py-3 text-right font-medium">Estoque</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  {produtos.length === 0
                    ? "Nenhum produto cadastrado. "
                    : "Nenhum resultado para sua busca."}
                  {produtos.length === 0 && (
                    <Link href="/admin/produtos/novo" className="text-primary hover:underline">
                      Cadastrar o primeiro produto.
                    </Link>
                  )}
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        {row.imagem_url ? (
                          <Image src={row.imagem_url} alt={row.nome} fill className="object-cover" unoptimized />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/produtos/${row.id}`}
                          className="block truncate font-medium text-foreground hover:text-primary"
                        >
                          {row.nome}
                        </Link>
                        {row.sabor && (
                          <p className="truncate text-xs text-muted-foreground">Sabor: {row.sabor}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.modelo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.categoria}</td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {formatCurrency(Number(row.preco))}
                  </td>
                  <td className="px-4 py-3 text-right">{row.estoque}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        row.status === "disponivel"
                          ? "rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300"
                          : "rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive"
                      }
                    >
                      {row.status === "disponivel" ? "Disponível" : "Esgotado"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`/admin/produtos/${row.id}`} aria-label="Editar">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => setPendingDelete(row)}
                        aria-label="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              O produto <strong>{pendingDelete?.nome}</strong> será removido do catálogo e a imagem
              associada também será apagada do Storage. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={deleting}
              className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
