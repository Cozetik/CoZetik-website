import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BlogCard } from '@/components/blog/blog-card'
import { BookOpen, Newspaper } from 'lucide-react'

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        visible: true,
        publishedAt: {
          lte: new Date(), // Only show posts that are already published
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        imageUrl: true,
        publishedAt: true,
      },
    })

    return posts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Découvrez nos articles sur les formations professionnelles, les tendances du marché et les conseils pour développer vos compétences.',
  openGraph: {
    title: 'Blog Cozetik - Actualités et conseils formations',
    description:
      'Actualités, conseils et tendances du monde de la formation professionnelle. Articles d\'experts pour rester informé.',
    images: ['/og-image.jpg'],
    url: 'https://cozetik.com/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Cozetik - Actualités et conseils formations',
    description: 'Actualités et tendances de la formation professionnelle.',
    images: ['/og-image.jpg'],
  },
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="border-b bg-gradient-to-br from-primary/5 via-background to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Newspaper className="h-8 w-8 text-primary" />
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Notre blog
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground md:text-xl">
              Actualités, conseils et tendances du monde de la formation
              professionnelle. Restez informé avec nos articles d&apos;experts.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <>
              {/* Posts Count */}
              <div className="mb-8">
                <p className="text-sm text-muted-foreground">
                  {posts.length} article{posts.length > 1 ? 's' : ''} publié
                  {posts.length > 1 ? 's' : ''}
                </p>
              </div>

              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : (
            // Empty State
            <div className="flex min-h-[500px] flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold">
                Aucun article publié pour le moment
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                Nous préparons actuellement de nouveaux articles passionnants sur
                les formations et le développement professionnel. Revenez bientôt
                pour découvrir nos publications !
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA (Optional) */}
      {posts.length > 0 && (
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
                Restez informé
              </h2>
              <p className="mb-8 text-muted-foreground">
                Ne manquez aucun de nos articles ! Suivez-nous sur les réseaux
                sociaux ou contactez-nous pour en savoir plus sur nos formations.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <a
                  href="/contact"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Nous contacter
                </a>
                <Link
                  href="/formations"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Découvrir nos formations
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
