'use client'

import { useState } from 'react'
import { ImageUploadDeferred, useImageUpload } from '@/components/admin/image-upload-deferred'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function TestUploadPage() {
  const { file, setFile, imageUrl, isUploading, uploadImage, reset } = useImageUpload()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (file) {
      const uploadedUrl = await uploadImage(file)
      if (uploadedUrl) {
        console.log('Form submitted:', { ...formData, imageUrl: uploadedUrl })
        alert(`Formulaire soumis avec succès!\n\nTitre: ${formData.title}\nDescription: ${formData.description}\nImage URL: ${uploadedUrl}`)
      }
    } else if (imageUrl) {
      console.log('Form submitted:', { ...formData, imageUrl })
      alert(`Formulaire soumis avec succès!\n\nTitre: ${formData.title}\nDescription: ${formData.description}\nImage URL: ${imageUrl}`)
    }
  }

  const handleReset = () => {
    reset()
    setFormData({ title: '', description: '' })
  }

  const hasImage = !!file || !!imageUrl

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Test Upload d&apos;Images</h1>
        <p className="text-muted-foreground mt-2">
          L&apos;image sera uploadée vers Cloudinary lors de la soumission du formulaire
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Formulaire de Test</CardTitle>
            <CardDescription>
              Sélectionnez une image et soumettez le formulaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  placeholder="Entrez un titre"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Entrez une description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label>Image</Label>
                <ImageUploadDeferred
                  value={file || imageUrl}
                  onChange={(fileOrUrl) => {
                    if (typeof fileOrUrl !== 'string') {
                      setFile(fileOrUrl)
                    }
                  }}
                  onRemove={() => setFile(null)}
                  disabled={isUploading}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={!hasImage || isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Upload en cours...
                    </>
                  ) : (
                    'Soumettre'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset} disabled={isUploading}>
                  Réinitialiser
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Données du Formulaire</CardTitle>
            <CardDescription>
              Aperçu en temps réel des données
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Titre</p>
                <p className="text-sm mt-1">
                  {formData.title || <span className="italic">Non défini</span>}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm mt-1">
                  {formData.description || <span className="italic">Non défini</span>}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Image</p>
                <p className="text-sm mt-1">
                  {file ? (
                    <span className="text-blue-600">
                      ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      <br />
                      <span className="text-xs text-muted-foreground">
                        Sera uploadée lors de la soumission
                      </span>
                    </span>
                  ) : imageUrl ? (
                    <span className="text-green-600">
                      ✓ Image uploadée
                    </span>
                  ) : (
                    <span className="italic">Aucune image</span>
                  )}
                </p>
              </div>

              {imageUrl && (
                <div className="pt-4 border-t">
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Voir l&apos;image →
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
