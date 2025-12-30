import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

// PATCH - Toggle la visibilité d'un article
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Récupérer l'article actuel
    const post = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    // Toggle la visibilité
    const newVisibleState = !post.visible

    // Si passage de false → true (brouillon → publié) ET publishedAt = null, mettre date actuelle
    let publishedAt = post.publishedAt
    if (newVisibleState && !publishedAt) {
      publishedAt = new Date()
    }

    // Mettre à jour l'article
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        visible: newVisibleState,
        publishedAt,
      },
    })

    // Invalider le cache Next.js
    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error toggling blog post visibility:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
