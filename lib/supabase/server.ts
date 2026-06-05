import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/lib/supabase/database.types"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env"

export async function getSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Em Server Components a chamada pode falhar — ignoramos; a sessão é
          // renovada na próxima middleware/Route Handler.
        }
      },
    },
  })
}
