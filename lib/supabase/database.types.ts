// Tipos do banco — espelham a tabela criada por supabase/migrations/0001_init.sql.
// Importante: usamos `type` (não `interface`) para que extendam Record<string, unknown>
// exigido pelo GenericSchema do @supabase/supabase-js.

export type ProductStatus = "disponivel" | "esgotado"

export type ProdutoRow = {
  id: string
  nome: string
  modelo: string
  sabor: string | null
  categoria: string
  descricao: string
  preco: number
  preco_original: number | null
  estoque: number
  imagem_url: string
  status: ProductStatus
  puffs: string | null
  created_at: string
  updated_at: string
}

export type ProdutoInsert = {
  id?: string
  nome: string
  modelo: string
  sabor?: string | null
  categoria?: string
  descricao?: string
  preco: number
  preco_original?: number | null
  estoque?: number
  imagem_url?: string
  puffs?: string | null
  created_at?: string
  updated_at?: string
}

export type ProdutoUpdate = {
  id?: string
  nome?: string
  modelo?: string
  sabor?: string | null
  categoria?: string
  descricao?: string
  preco?: number
  preco_original?: number | null
  estoque?: number
  imagem_url?: string
  puffs?: string | null
  updated_at?: string
}

export type Database = {
  public: {
    Tables: {
      produtos: {
        Row: ProdutoRow
        Insert: ProdutoInsert
        Update: ProdutoUpdate
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
