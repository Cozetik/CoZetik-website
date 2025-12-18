import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BlogCard } from '@/components/blog/blog-card'
import {
  Calendar,
  Clock,
  ChevronRight,
  Home,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        visible: true,
        publishedAt: {
          lte: new Date(),
        },
      },
    })

    return post
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

async function getRelatedPosts(currentPostId: string, limit = 3) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        visible: true,
        publishedAt: {
          lte: new Date(),
        },
        id: {
          not: currentPostId,
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
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
    console.error('Error fetching related posts:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Article non trouvé | Cozetik',
    }
  }

  return {
    title: post.seoTitle || `${post.title} | Blog Cozetik`,
    description:
      post.seoDescription ||
      post.excerpt ||
      `Découvrez notre article : ${post.title}`,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.id)

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = post.content.split(' ').length
  const readingTime = Math.ceil(wordCount / 200)

  // Share URLs
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = post.title

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <section className="border-b bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="flex items-center transition-colors hover:text-foreground"
            >
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/blog"
              className="transition-colors hover:text-foreground"
            >
              Blog
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="line-clamp-1 font-medium text-foreground">
              {post.title}
            </span>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <article className="mx-auto max-w-4xl">
            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.publishedAt.toISOString()}>
                    {format(new Date(post.publishedAt), 'PPP', { locale: fr })}
                  </time>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min de lecture</span>
              </div>
            </div>

            {/* Featured Image */}
            {post.imageUrl && (
              <div className="mb-12 overflow-hidden rounded-lg">
                <div className="relative aspect-video w-full">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <div className="mb-8 rounded-lg border-l-4 border-primary bg-primary/5 p-6">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              </div>
            )}

            {/* Article Content */}
            <div
              className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-img:rounded-lg prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share Section */}
            <Separator className="my-12" />
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <h3 className="text-lg font-semibold">Partager cet article</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  title="Partager sur Facebook"
                >
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  title="Partager sur Twitter"
                >
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  title="Partager sur LinkedIn"
                >
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="border-t bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Articles similaires</h2>
              <p className="mt-2 text-muted-foreground">
                Découvrez d'autres articles qui pourraient vous intéresser
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link href="/blog">Voir tous les articles</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-8 text-center md:p-12">
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
                Intéressé par nos formations ?
              </h2>
              <p className="mb-8 text-muted-foreground">
                Découvrez notre catalogue complet et trouvez la formation qui
                correspond à vos objectifs professionnels.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg">
                  <Link href="/formations">Découvrir nos formations</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/contact">Nous contacter</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
