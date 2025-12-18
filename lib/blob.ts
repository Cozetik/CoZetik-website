import { v2 as cloudinary } from 'cloudinary'

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload une image vers Cloudinary
 * @param file - Le fichier image à uploader
 * @returns L'URL publique de l'image uploadée
 * @throws Error si les credentials ne sont pas configurés ou si l'upload échoue
 */
export async function uploadImage(file: File): Promise<string> {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error('Cloudinary credentials are not configured')
  }

  try {
    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload vers Cloudinary via Promise
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'cozetik',
            resource_type: 'image',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result as { secure_url: string; public_id: string })
          }
        )

        uploadStream.end(buffer)
      }
    )

    return result.secure_url
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    throw new Error('Failed to upload image')
  }
}

/**
 * Supprime une image depuis Cloudinary
 * @param urlOrPublicId - L'URL ou le public_id de l'image à supprimer
 * @throws Error si les credentials ne sont pas configurés ou si la suppression échoue
 */
export async function deleteImage(urlOrPublicId: string): Promise<void> {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error('Cloudinary credentials are not configured')
  }

  try {
    // Extraire le public_id de l'URL si nécessaire
    let publicId = urlOrPublicId

    // Si c'est une URL Cloudinary, extraire le public_id
    if (urlOrPublicId.includes('cloudinary.com')) {
      const urlParts = urlOrPublicId.split('/')
      const uploadIndex = urlParts.indexOf('upload')
      if (uploadIndex !== -1) {
        // Récupérer tout après 'upload' et avant l'extension
        const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/')
        publicId = pathAfterUpload.replace(/\.[^/.]+$/, '') // Enlever l'extension
      }
    }

    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    throw new Error('Failed to delete image')
  }
}
