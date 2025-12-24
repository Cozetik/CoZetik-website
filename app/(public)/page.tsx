import { AboutSection } from "@/components/home/about-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FinalCTASection } from "@/components/home/final-cta-section";
import { HeroSection } from "@/components/home/hero-section";
import { JoinAdventureSection } from "@/components/home/join-adventure-section";
import { ValuesSection } from "@/components/home/values-section";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Développez vos compétences avec Cozetik. Formations professionnelles certifiantes de qualité avec des experts reconnus. Découvrez notre catalogue complet.",
  openGraph: {
    title: "Cozetik - Formations professionnelles certifiantes",
    description:
      "Formations de qualité pour booster votre carrière. Formez-vous avec les meilleurs experts du secteur.",
    images: ["/og-image.jpg"],
    url: "https://cozetik.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cozetik - Formations professionnelles certifiantes",
    description: "Formations de qualité pour booster votre carrière.",
    images: ["/og-image.jpg"],
  },
};

async function getHomeData() {
  try {
    const [categories, formations, partners] = await Promise.all([
      // Fetch visible categories (limit to 5 for homepage)
      prisma.category.findMany({
        where: { visible: true },
        orderBy: { order: "asc" },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),

      // Fetch featured visible formations
      prisma.formation.findMany({
        where: { visible: true },
        orderBy: { order: "asc" },
        take: 4,
        include: {
          category: {
            select: { name: true },
          },
        },
      }),

      // Fetch visible partners
      prisma.partner.findMany({
        where: { visible: true },
        orderBy: { order: "asc" },
      }),
    ]);

    return { categories, formations, partners };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return { categories: [], formations: [], partners: [] };
  }
}

export default async function Home() {
  const { categories, formations, partners } = await getHomeData();

  return (
    <div className="flex flex-col">
      {/* Hero Section - Full viewport, starts at top (under navbar) */}
      <HeroSection />

      {/* About Section - Regular flow with top padding */}
      <AboutSection />

      <section className="relative z-0 bg-[#FDFDFD] px-4 py-10 md:px-6 md:py-16 lg:px-[120px] lg:py-[100px]">
        <div className="container mx-auto max-w-[1440px]">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-cozetik-black md:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              Nos domaines d&apos;expertise
            </h2>
            <p className="font-sans text-lg text-cozetik-black/80 md:text-xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              5 parcours pour révéler votre potentiel
            </p>
          </div>
          <CategoriesSection categories={categories} />
        </div>
      </section>
      
      {/* Section Vision/Philosophie */}
      <section className="relative bg-white px-4 py-16 md:px-6 md:py-20 lg:px-[120px] lg:py-24">
        <div className="container mx-auto max-w-[1200px] text-center">
          <h2 className="mb-6 font-display text-4xl font-bold text-cozetik-black md:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Notre vision
          </h2>
          <p className="mx-auto max-w-4xl font-sans text-base leading-relaxed text-cozetik-black md:text-lg lg:text-xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Chez Cozetik, nous croyons que l&apos;excellence professionnelle naît de l&apos;équilibre entre compétences techniques, intelligence émotionnelle et bien-être. C&apos;est pourquoi nos formations cultivent autant votre savoir-faire que votre savoir-être.
          </p>
        </div>
      </section>

      {/* Nos Valeurs Section - Fond noir */}
      <ValuesSection />

      {/* CTA Section 1 - Rejoins l'Aventure (Violet) */}
      <JoinAdventureSection />

      {/* CTA Section 2 - Franchissez les Étapes (Vert) */}
      <FinalCTASection />
    </div>
  );
}
