import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProdutoForm } from "@/components/admin/produto-form"

export const dynamic = "force-dynamic"

export default async function NovoProdutoPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  return <ProdutoForm />
}
