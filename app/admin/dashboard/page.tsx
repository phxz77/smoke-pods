import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, CheckCircle2, Layers, Package, AlertOctagon, Clock } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProdutoRow } from "@/lib/supabase/database.types"

export const dynamic = "force-dynamic"
export const revalidate = 0

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const [{ data: produtos, error: produtosError }, { data: ultimos, error: ultimosError }] =
    await Promise.all([
      supabase.from("produtos").select("*"),
      supabase
        .from("produtos")
        .select("id, nome, modelo, sabor, preco, estoque, status, imagem_url, updated_at")
        .order("updated_at", { ascending: false })
        .limit(8),
    ])

  if (produtosError || ultimosError) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Erro ao carregar dados: {produtosError?.message ?? ultimosError?.message}
        </p>
      </div>
    )
  }

  const rows = (produtos ?? []) as ProdutoRow[]
  const totalProdutos = rows.length
  const ativos = rows.filter((r) => r.status === "disponivel").length
  const esgotados = rows.filter((r) => r.status === "esgotado").length
  const estoqueTotal = rows.reduce((acc, r) => acc + (r.estoque ?? 0), 0)

  const stats = [
    {
      label: "Produtos cadastrados",
      value: totalProdutos,
      icon: Package,
      tone: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Produtos ativos",
      value: ativos,
      icon: CheckCircle2,
      tone: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Esgotados",
      value: esgotados,
      icon: AlertOctagon,
      tone: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      label: "Unidades em estoque",
      value: estoqueTotal,
      icon: Layers,
      tone: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ]

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Visão geral</p>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Dashboard</h1>
        </div>
        <Button asChild>
          <Link href="/admin/produtos" className="gap-2">
            Gerenciar produtos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.tone}`} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-4 w-4 text-primary" />
            Últimos produtos alterados
          </CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/produtos">Ver tudo</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {(ultimos ?? []).length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhum produto cadastrado ainda.{" "}
              <Link href="/admin/produtos/novo" className="text-primary hover:underline">
                Adicione o primeiro produto.
              </Link>
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 text-left font-medium">Produto</th>
                    <th className="py-2 text-left font-medium">Modelo</th>
                    <th className="py-2 text-right font-medium">Preço</th>
                    <th className="py-2 text-right font-medium">Estoque</th>
                    <th className="py-2 text-left font-medium">Status</th>
                    <th className="py-2 text-right font-medium">Atualizado</th>
                  </tr>
                </thead>
                <tbody>
                  {(ultimos ?? []).map((row) => (
                    <tr key={row.id} className="border-b border-border/60 last:border-0">
                      <td className="py-3 pr-2">
                        <Link
                          href={`/admin/produtos/${row.id}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {row.nome}
                        </Link>
                        {row.sabor && (
                          <p className="text-xs text-muted-foreground">Sabor: {row.sabor}</p>
                        )}
                      </td>
                      <td className="py-3 pr-2 text-muted-foreground">{row.modelo}</td>
                      <td className="py-3 pr-2 text-right text-foreground">
                        {formatCurrency(Number(row.preco))}
                      </td>
                      <td className="py-3 pr-2 text-right">{row.estoque}</td>
                      <td className="py-3 pr-2">
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
                      <td className="py-3 text-right text-xs text-muted-foreground">
                        {formatDateTime(row.updated_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
