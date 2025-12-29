import { BlogPostAnimator } from "@/components/animations/blog-post-animator"; // Import de l'animateur
import { BlogCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  Facebook,
  Home,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/seo/structured-data";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
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
    });

    return post;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
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
        publishedAt: "desc",
      },
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        imageUrl: true,
        publishedAt: true,
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Article non trouvé | Cozetik",
    };
  }

  const title = post.seoTitle || post.title;
  const truncatedTitle =
    title.length > 60 ? title.substring(0, 57) + "..." : title;

  const description =
    post.seoDescription ||
    post.excerpt ||
    `Découvrez notre article : ${post.title}`;
  const truncatedDescription =
    description.length > 160
      ? description.substring(0, 157) + "..."
      : description;

  return {
    title: truncatedTitle,
    description: truncatedDescription,
    openGraph: {
      title: post.seoTitle || `${post.title} | Blog Cozetik`,
      description: truncatedDescription,
      images: post.imageUrl ? [post.imageUrl] : ["/og-image.jpg"],
      url: `https://cozetik.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || `${post.title} | Blog Cozetik`,
      description: truncatedDescription,
      images: post.imageUrl ? [post.imageUrl] : ["/og-image.jpg"],
    },
    alternates: {
      canonical: `https://cozetik.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id);

  const wordCount = post.content.split(" ").length;
  const readingTime = Math.ceil(wordCount / 200);

  const baseUrl = 'https://cozetik.com'
  const postUrl = `${baseUrl}/blog/${post.slug}`
  const shareUrl = postUrl
  const shareText = post.title

  // Structured Data - Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || post.title,
    image: post.imageUrl ? [post.imageUrl] : [`${baseUrl}/og-image.jpg`],
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString() || post.publishedAt?.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Cozetik',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cozetik',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo-cozetik_Logo-transparent.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
    inLanguage: 'fr-FR',
  }

  // Structured Data - BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  }

  return (
    <>
      <StructuredData data={[articleSchema, breadcrumbSchema]} />
      {/* 1. Envelopper le contenu avec l'animateur */}
      <BlogPostAnimator>
      {post.imageUrl && (
        <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            {/* 2. Ajout de la classe anim-hero-content et suppression des animations Tailwind */}
            <div className="anim-hero-content max-w-4xl space-y-6">
              <h1 className="font-bricolage text-4xl font-bold uppercase tracking-tight text-white md:text-6xl lg:text-7xl">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-white/90 md:text-base">
                {post.publishedAt && (
                  <div className="flex items-center gap-2 rounded-none bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.publishedAt.toISOString()}>
                      {format(new Date(post.publishedAt), "d MMMM yyyy", {
                        locale: fr,
                      })}
                    </time>
                  </div>
                )}
                <div className="flex items-center gap-2 rounded-none bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min de lecture</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      {/* 3. Ajout de la classe anim-breadcrumb */}
      <section className="anim-breadcrumb border-b p-5">
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
              className="transition-colors font-sans hover:text-foreground"
            >
              Blog
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="line-clamp-1 font-medium font-sans text-foreground">
              {post.title}
            </span>
          </nav>
        </div>
      </section>

      {/* Article Header & Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* 4. Ajout de la classe anim-article-body */}
          <article className="anim-article-body mx-auto max-w-4xl">
            {/* Title (Répété pour le SEO/Accessibilité mais visuellement secondaire si Hero présent) */}
            <h1 className="mb-6 text-4xl font-sans font-bold tracking-tight sm:text-5xl">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="mb-8 flex flex-wrap font-sans items-center gap-4 text-sm text-muted-foreground">
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.publishedAt.toISOString()}>
                    {format(new Date(post.publishedAt), "PPP", { locale: fr })}
                  </time>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min de lecture</span>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose font-sans prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-img:rounded-none prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share Section */}
            <Separator className="my-12" />
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <h3 className="text-lg font-semibold font-sans">
                Partager cet article
              </h3>
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
        // 5. Ajout de la classe anim-footer-section
        <section className="anim-footer-section border-t bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold font-sans">
                Articles similaires
              </h2>
              <p className="mt-2 text-muted-foreground font-sans">
                Découvrez d&apos;autres articles qui pourraient vous intéresser
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost, index) => (
                <BlogCard
                  key={relatedPost.id}
                  post={relatedPost}
                  index={index}
                />
              ))}
            </div>

            <div className="mt-8 text-center font-sans">
              <Button
                asChild
                variant="outline"
                className="transition-all duration-300 ease-in-out hover:scale-105"
              >
                <Link href="/blog">Voir tous les articles</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {/* 6. Ajout de la classe anim-footer-section */}
      <section className="anim-footer-section">
        <div className="w-full mx-auto">
          <div className=" bg-[#F2E7D8]">
            <CardContent className="p-8 text-center md:p-12 font-sans">
              <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">
                Intéressé par nos formations ?
              </h2>
              <p className="mb-8 text-muted-foreground">
                Découvrez notre catalogue complet et trouvez la formation qui
                correspond à vos objectifs professionnels.
              </p>
              <div className="flex flex-col font-sans gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  className="transition-all duration-300 ease-in-out hover:scale-105"
                >
                  <Link href="/formations">
                    Découvrir nos formations{" "}
                    <ArrowRight className="text-white" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="transition-all duration-300 ease-in-out hover:scale-105"
                  variant="outline"
                >
                  <Link href="/contact">Nous contacter</Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      </section>
    </BlogPostAnimator>
    </>
  );
}
