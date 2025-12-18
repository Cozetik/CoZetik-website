'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadDeferredProps {
  value?: File | string // Peut être un File (avant upload) ou une URL (après upload)
  onChange: (file: File | string) => void
  onRemove?: () => void
  disabled?: boolean
}

export function ImageUploadDeferred({
  value,
  onChange,
  onRemove,
  disabled = false,
}: ImageUploadDeferredProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Créer une preview locale
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Passer le fichier au parent (sera uploadé plus tard)
    onChange(file)
    setError(null)

    // Reset input
    e.target.value = ''
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    if (onRemove) {
      onRemove()
    }
    setError(null)
  }

  // Déterminer quelle URL afficher
  const displayUrl = typeof value === 'string' ? value : previewUrl

  return (
    <div className="space-y-4">
      <Card className="p-4">
        {displayUrl ? (
          <div className="relative group">
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
              <Image
                src={displayUrl}
                alt="Preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            {!disabled && (
              <div className="absolute top-2 right-2 flex gap-2">
                {typeof value === 'object' && (
                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    En attente d&apos;upload
                  </div>
                )}
                <Button
                  onClick={handleRemove}
                  variant="destructive"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
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
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                Cliquez pour sélectionner une image
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP, GIF (max 10MB)
              </p>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                L&apos;image sera uploadée lors de la soumission du formulaire
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={disabled}
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

/**
 * Hook helper pour gérer l'upload différé
 * Utilisation dans le composant parent :
 *
 * const { file, imageUrl, isUploading, uploadImage } = useImageUpload()
 *
 * <ImageUploadDeferred value={file || imageUrl} onChange={setFile} />
 *
 * const handleSubmit = async () => {
 *   const uploadedUrl = await uploadImage(file)
 *   // utiliser uploadedUrl
 * }
 */
export function useImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (fileToUpload: File | null): Promise<string | null> => {
    if (!fileToUpload) {
      setError('Aucun fichier à uploader')
      return null
    }

    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', fileToUpload)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erreur lors de l'upload")
        return null
      }

      if (data.url) {
        setImageUrl(data.url)
        setFile(null) // Clear file après upload réussi
        return data.url
      }

      return null
    } catch (err) {
      console.error('Upload error:', err)
      setError('Erreur réseau. Veuillez réessayer.')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setImageUrl('')
    setError(null)
  }

  return {
    file,
    setFile,
    imageUrl,
    setImageUrl,
    isUploading,
    error,
    uploadImage,
    reset,
  }
}
