"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, LogOut, ExternalLink } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
]

interface AdminShellProps {
  email: string
  children: React.ReactNode
}

export function AdminShell({ email, children }: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.replace("/admin/login")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <aside className="border-b border-border bg-card lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col p-4 lg:p-6">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Painel</p>
            <h1 className="text-xl font-bold text-foreground">
              Smoke <span className="text-primary">Pods</span>
            </h1>
          </div>

          <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto hidden flex-col gap-3 pt-6 lg:flex">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3 w-3" />
              Ver loja
            </Link>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Logado como</p>
              <p className="truncate text-sm font-medium text-foreground" title={email}>
                {email}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="h-3 w-3" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 px-4 py-6 lg:px-8 lg:py-10">{children}</main>
    </div>
  )
}
