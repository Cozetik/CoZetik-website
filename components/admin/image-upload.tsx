'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  disabled?: boolean
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset error state
    setError(null)

    // Validation côté client
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setError('Type de fichier non supporté. Formats acceptés : JPG, PNG, WEBP, GIF')
      return
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setError('Fichier trop volumineux. Taille maximale : 10MB')
      return
    }

    setIsUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erreur lors de l\'upload')
        return
      }

      if (data.url) {
        onChange(data.url)
        setError(null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setIsUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove()
    }
    setError(null)
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        {value ? (
          <div className="relative group">
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            {!disabled && (
              <Button
                onClick={handleRemove}
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <label
            className={`cursor-pointer block ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${
                disabled
                  ? 'border-muted'
                  : 'border-muted-foreground/25 hover:border-primary'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 mb-2 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Upload en cours...
                  </p>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    Cliquez pour uploader une image
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP, GIF (max 10MB)
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading || disabled}
            />
          </label>
        )}
      </Card>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          {error}
        </div>
      )}
    </div>
  )
}
