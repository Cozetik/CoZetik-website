import { UTApi } from 'uploadthing/server'

const utapi = new UTApi()

/**
 * Upload une image vers Uploadthing
 * @param file - Le fichier image à uploader
 * @returns L'URL publique de l'image uploadée
 * @throws Error si le token n'est pas configuré ou si l'upload échoue
 */
export async function uploadImage(file: File): Promise<string> {
  if (!process.env.UPLOADTHING_TOKEN) {
    throw new Error('UPLOADTHING_TOKEN is not configured')
  }

  try {
    const response = await utapi.uploadFiles(file)

    if (response.error) {
      console.error('Uploadthing error:', response.error)
      throw new Error(response.error.message)
    }

    return response.data.url
  } catch (error) {
    console.error('Error uploading image to Uploadthing:', error)
    throw new Error('Failed to upload image')
  }
}

/**
 * Upload un fichier vers Uploadthing (alias générique)
 * @param file - Le fichier à uploader
 * @returns L'URL publique du fichier uploadé
 */
export async function uploadFile(file: File): Promise<string> {
  return uploadImage(file)
}

/**
 * Supprime un fichier depuis Uploadthing
 * @param urlOrKey - L'URL ou la clé du fichier à supprimer
 * @throws Error si le token n'est pas configuré ou si la suppression échoue
 */
export async function deleteImage(urlOrKey: string): Promise<void> {
  if (!process.env.UPLOADTHING_TOKEN) {
    throw new Error('UPLOADTHING_TOKEN is not configured')
  }

  try {
    // Pour les anciennes URLs Cloudinary, ignorer silencieusement
    if (urlOrKey.includes('cloudinary.com')) {
      console.log('Skipping Cloudinary URL deletion (legacy):', urlOrKey)
      return
    }

    // Extraire la clé du fichier de l'URL si nécessaire
    let fileKey = urlOrKey

    if (urlOrKey.includes('utfs.io') || urlOrKey.includes('uploadthing')) {
      // Format: https://utfs.io/f/KEY ou https://xxx.uploadthing.com/f/KEY
      const urlParts = urlOrKey.split('/')
      fileKey = urlParts[urlParts.length - 1]
    }

    await utapi.deleteFiles(fileKey)
  } catch (error) {
    console.error('Error deleting file from Uploadthing:', error)
    throw new Error('Failed to delete file')
  }
}

/**
 * Supprime un fichier depuis Uploadthing (alias)
 */
export async function deleteFile(urlOrKey: string): Promise<void> {
  return deleteImage(urlOrKey)
}

/**
 * Upload plusieurs fichiers vers Uploadthing
 * @param files - Les fichiers à uploader
 * @returns Les URLs publiques des fichiers uploadés
 */
export async function uploadFiles(files: File[]): Promise<string[]> {
  if (!process.env.UPLOADTHING_TOKEN) {
    throw new Error('UPLOADTHING_TOKEN is not configured')
  }

  try {
    const responses = await utapi.uploadFiles(files)

    return responses.map((response) => {
      if (response.error) {
        throw new Error(response.error.message)
      }
      return response.data.url
    })
  } catch (error) {
    console.error('Error uploading files to Uploadthing:', error)
    throw new Error('Failed to upload files')
  }
}
