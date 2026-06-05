import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ProdutosTable } from "@/components/admin/produtos-table"
import type { ProdutoRow } from "@/lib/supabase/database.types"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProdutosPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .order("modelo", { ascending: true })
    .order("nome", { ascending: true })

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Erro ao carregar produtos: {error.message}
        </p>
      </div>
    )
  }

  const produtos = (data ?? []) as ProdutoRow[]

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Catálogo</p>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Produtos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {produtos.length} produto{produtos.length === 1 ? "" : "s"} cadastrado
            {produtos.length === 1 ? "" : "s"}.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/produtos/novo">
            <Plus className="h-4 w-4" />
            Novo produto
          </Link>
        </Button>
      </header>

      <ProdutosTable produtos={produtos} />
    </div>
  )
}
