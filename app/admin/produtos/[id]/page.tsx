import { notFound, redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProdutoForm } from "@/components/admin/produto-form"
import type { ProdutoRow } from "@/lib/supabase/database.types"

export const dynamic = "force-dynamic"

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    notFound()
  }

  return <ProdutoForm initial={data as ProdutoRow} />
}
