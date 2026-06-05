"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Image as ImageIcon, Loader2, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const BUCKET = "produtos-imagens"
const MAX_BYTES = 5 * 1024 * 1024

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
}

function slugifyName(name: string) {
  const base = name.toLowerCase().replace(/\.[^.]+$/, "")
  const ext = name.match(/\.[^.]+$/)?.[0] ?? ""
  return (
    base
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) + ext.toLowerCase()
  )
}

function pathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.slice(idx + marker.length)
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setError(null)
    if (file.size > MAX_BYTES) {
      setError("Imagem maior que 5MB. Escolha um arquivo menor.")
      return
    }
    setUploading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const fileName = `${Date.now()}-${slugifyName(file.name) || "imagem.jpg"}`
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) {
        setError(uploadError.message)
        return
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName)
      onChange(data.publicUrl)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!value) return
    setError(null)
    const path = pathFromPublicUrl(value)
    onChange("")
    if (path) {
      const supabase = getSupabaseBrowserClient()
      // best-effort: ignora erro (a referência já foi limpa do form)
      await supabase.storage.from(BUCKET).remove([path])
    }
  }

  const showPreview = !!value

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "relative flex aspect-square w-full max-w-[240px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/40",
          uploading && "opacity-70"
        )}
      >
        {showPreview ? (
          <Image
            src={value}
            alt="Pré-visualização"
            fill
            className="object-cover"
            unoptimized
            onError={() => setError("Não foi possível carregar a imagem.")}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs">Sem imagem</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4" />
          {value ? "Trocar imagem" : "Enviar imagem"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-2 text-destructive hover:bg-destructive/10"
            onClick={handleRemove}
            disabled={uploading}
          >
            <Trash2 className="h-4 w-4" />
            Remover
          </Button>
        )}
      </div>

      <Input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = "" // permite reenviar o mesmo arquivo
        }}
      />

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <p className="text-xs text-muted-foreground">
        PNG, JPG, WEBP, SVG ou GIF. Máximo 5MB.
      </p>
    </div>
  )
}
