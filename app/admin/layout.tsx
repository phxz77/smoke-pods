import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { AdminShell } from "@/components/admin/admin-shell"

export const metadata: Metadata = {
  title: "Smoke Pods - Admin",
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // A página de login renderiza fora do shell. O matcher do middleware já
  // protege /admin/*; aqui repetimos a checagem para Server Components.
  if (!isSupabaseConfigured) {
    return <>{children}</>
  }

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <>{children}</>
  }

  return <AdminShell email={user.email ?? ""}>{children}</AdminShell>
}
