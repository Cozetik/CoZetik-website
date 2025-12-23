import { BlogPageAnimator } from "@/components/animations/blog-page-animator";
import { BlogCard } from "@/components/blog/blog-card";
import { ThemeFilter } from "@/components/blog/theme-filter";
import { prisma } from "@/lib/prisma";
import { ArrowRight, BookOpen } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Line from "./../../../public/line.svg";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Découvrez nos articles sur les formations professionnelles, les tendances du marché et les conseils pour développer vos compétences.",
  openGraph: {
    title: "Blog Cozetik - Actualités et conseils formations",
    description:
      "Actualités, conseils et tendances du monde de la formation professionnelle. Articles d'experts pour rester informé.",
    images: ["/og-image.jpg"],
    url: "https://cozetik.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Cozetik - Actualités et conseils formations",
    description: "Actualités et tendances de la formation professionnelle.",
    images: ["/og-image.jpg"],
  },
};

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { theme } = await searchParams;
  const activeThemeSlug = typeof theme === "string" ? theme : undefined;

  const themes = await prisma.theme.findMany({
    orderBy: { name: "asc" },
  });

  const whereCondition = {
    visible: true,
    publishedAt: {
      lte: new Date(),
    },
    ...(activeThemeSlug
      ? {
          themes: {
            some: {
              slug: activeThemeSlug,
            },
          },
        }
      : {}),
  };

  const posts = await prisma.blogPost.findMany({
    where: whereCondition,
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      publishedAt: true,
      themes: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  return (
    <BlogPageAnimator>
      {/* Page Header */}
      <section className="border-b bg-[#C792DF] py-16 pt-36 text-center">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl ">
            {/* Title */}
            <h1 className="anim-header text-4xl font-bold tracking-tight text-center text-cozetik-white font-display uppercase md:text-7xl">
              Explorez des contenus inspirants{" "}
            </h1>
            <div className="anim-header flex justify-center mb-4 -translate-y-5">
              <Image src={Line} alt="Decorative line" width={500} />
            </div>
            {/* Description */}
            <p className="anim-header text-lg text-cozetik-white font-sans md:text-xl">
              Actualités, conseils et tendances du monde de la formation
              professionnelle. Restez informé avec nos articles d&apos;experts.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* AJOUT : Le filtre par thème */}
          <div className="anim-filter">
            <ThemeFilter themes={themes} activeTheme={activeThemeSlug} />
          </div>

          {posts.length > 0 ? (
            <>
              {/* Posts Count */}
              <div className="anim-filter mb-8">
                <p className="text-sm text-muted-foreground">
                  {posts.length} article{posts.length > 1 ? "s" : ""} publié
                  {posts.length > 1 ? "s" : ""}
                  {activeThemeSlug && " pour ce thème"}
                </p>
              </div>

              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <div key={post.id} className="anim-card h-full">
                    <BlogCard post={post} index={index} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Empty State
            <div className="anim-filter flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold">
                Aucun article trouvé
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                {activeThemeSlug
                  ? "Il n'y a pas encore d'articles pour ce thème. Essayez d'en sélectionner un autre."
                  : "Nous préparons actuellement de nouveaux articles passionnants."}
              </p>
              {activeThemeSlug && (
                <Link
                  href="/blog"
                  className="mt-6 text-primary hover:underline"
                >
                  Voir tous les articles
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      {/* On l'affiche toujours pour maximiser la conversion, même si la recherche est vide */}
      <section className="border-t bg-[#F2E7D8] py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-sans font-semibold sm:text-3xl">
              Restez informé
            </h2>
            <p className="mb-8 text-muted-foreground font-sans">
              Ne manquez aucun de nos articles ! Suivez-nous sur les réseaux
              sociaux ou contactez-nous pour en savoir plus sur nos formations.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="/contact"
                className="inline-flex h-10 items-center font-sans justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-all duration-300 ease-in-out hover:scale-105  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Nous contacter
              </a>
              <Link
                href="/formations"
                className="inline-flex h-10 items-center gap-2 font-sans justify-center rounded-md border border-input bg-background px-8 py-2 text-sm font-medium ring-offset-background transition-all duration-300 ease-in-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Découvrir nos formations <ArrowRight width={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </BlogPageAnimator>
  );
}
