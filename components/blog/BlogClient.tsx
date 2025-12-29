"use client";

import { AnimatedLine } from "@/components/animations/animated-line";
import { BlogPageAnimator } from "@/components/animations/blog-page-animator";
import { BlogCard } from "@/components/blog/blog-card";
import { ThemeFilter } from "@/components/blog/theme-filter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

// On définit les types des props pour recevoir les données du serveur
interface BlogClientProps {
  posts: any[]; // Vous pouvez importer le type exact de Prisma si vous l'avez
  themes: any[];
  activeThemeSlug?: string;
}

export default function BlogClient({
  posts,
  themes,
  activeThemeSlug,
}: BlogClientProps) {
  // 1. Signaler que la page est prête (pour l'overlay de transition)
  useEffect(() => {
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("page-transition-ready"));
    });
  }, []);

  return (
    // 2. Motion div pour gérer l'apparition fluide et éviter le flash
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BlogPageAnimator>
        {/* Page Header */}
        <section className="border-b bg-[#C792DF] py-16 pt-36 text-center">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl ">
              {/* Title */}
              <h1 className="anim-header text-4xl font-bold tracking-tight text-center text-cozetik-white font-bricolage uppercase md:text-7xl">
                Explorez des contenus inspirants{" "}
              </h1>

              <div className="anim-header mb-4">
                <AnimatedLine />
              </div>

              {/* Description */}
              <p className="anim-header text-lg text-cozetik-white font-sans md:text-xl">
                Actualités, conseils et tendances du monde de la formation
                professionnelle. Restez informé avec nos articles
                d&apos;experts.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section className="py-12 md:py-16">
          <div className="anim-header relative justify-self-center border bg-[#262626] -translate-y-20">
            <p className="font-bricolage uppercase text-cozetik-white p-5 font-semibold text-6xl text-center">
              Notre BlogETIK
            </p>
          </div>
          <div className="container mx-auto px-4">
            <div className="anim-filter justify-self-start">
              <ThemeFilter themes={themes} activeTheme={activeThemeSlug} />
            </div>

            {posts.length > 0 ? (
              <>
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
              <div className="anim-filter flex min-h-[400px] flex-col items-center justify-center rounded-none border border-dashed p-12 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-none bg-muted">
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
        <section className="border-t bg-[#F2E7D8] py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-2xl font-sans font-semibold sm:text-3xl">
                Restez informé
              </h2>
              <p className="mb-8 text-muted-foreground font-sans">
                Ne manquez aucun de nos articles ! Suivez-nous sur les réseaux
                sociaux ou contactez-nous pour en savoir plus sur nos
                formations.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <a
                  href="/contact"
                  className="inline-flex h-10 items-center font-sans justify-center rounded-none bg-primary px-8 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-all duration-300 ease-in-out hover:scale-105  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Nous contacter
                </a>
                <Link
                  href="/formations"
                  className="inline-flex h-10 items-center gap-2 font-sans justify-center rounded-none border border-input bg-background px-8 py-2 text-sm font-medium ring-offset-background transition-all duration-300 ease-in-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Découvrir nos formations <ArrowRight width={20} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </BlogPageAnimator>
    </motion.div>
  );
}
