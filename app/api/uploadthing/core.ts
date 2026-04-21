import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {
  // Images pour blog, formations, catégories, partenaires (max 8MB)
  imageUploader: f({ image: { maxFileSize: '8MB', maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      console.log('✅ Image uploaded:', file.url)
      return { url: file.url }
    }),

  // Vidéos (max 512MB pour hero video et futurs besoins)
  videoUploader: f({ video: { maxFileSize: '512MB', maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      console.log('✅ Video uploaded:', file.url)
      return { url: file.url }
    }),

  // Documents pour candidatures (PDF, DOC, DOCX - max 8MB)
  documentUploader: f({
    pdf: { maxFileSize: '8MB', maxFileCount: 1 },
    'application/msword': { maxFileSize: '8MB', maxFileCount: 1 },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      maxFileSize: '8MB',
      maxFileCount: 1,
    },
  })
    .onUploadComplete(async ({ file }) => {
      console.log('✅ Document uploaded:', file.url)
      return { url: file.url }
    }),

  // Multi-file uploader pour candidatures (CV + lettre + autre)
  candidatureUploader: f({
    pdf: { maxFileSize: '8MB', maxFileCount: 3 },
    image: { maxFileSize: '8MB', maxFileCount: 3 },
    'application/msword': { maxFileSize: '8MB', maxFileCount: 3 },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      maxFileSize: '8MB',
      maxFileCount: 3,
    },
  })
    .onUploadComplete(async ({ file }) => {
      console.log('✅ Candidature file uploaded:', file.url)
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
