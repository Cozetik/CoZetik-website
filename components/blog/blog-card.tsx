import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface BlogCardProps {
  post: {
    slug: string
    title: string
    excerpt: string | null
    imageUrl: string | null
    publishedAt: Date | null
  }
}

export function BlogCard({ post }: BlogCardProps) {
  // Truncate excerpt to 150 characters
  const truncatedExcerpt = post.excerpt
    ? post.excerpt.length > 150
      ? post.excerpt.substring(0, 150) + '...'
      : post.excerpt
    : 'Découvrez cet article...'

  // Calculate reading time (rough estimate: 200 words per minute)
  const readingTime = post.excerpt
    ? Math.ceil(post.excerpt.split(' ').length / 200)
    : 5

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        {/* Post Image */}
        <Link href={`/blog/${post.slug}`}>
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {post.imageUrl ? (
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <span className="text-5xl font-bold text-primary/20">
                  {post.title.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </Link>
      </CardHeader>

      <CardContent className="flex-1 p-6">
        {/* Published Date */}
        {post.publishedAt && (
          <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.publishedAt.toISOString()}>
                {format(new Date(post.publishedAt), 'PPP', { locale: fr })}
              </time>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{readingTime} min de lecture</span>
            </div>
          </div>
        )}

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="mb-3 text-xl font-semibold leading-tight transition-colors group-hover:text-primary">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {truncatedExcerpt}
        </p>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild variant="ghost" className="w-full gap-2 group-hover:gap-3 transition-all">
          <Link href={`/blog/${post.slug}`}>
            Lire la suite
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
