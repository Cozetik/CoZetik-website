import { AboutSection } from "@/components/home/about-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FAQSection } from "@/components/home/faq-section";
import { FinalCTASection } from "@/components/home/final-cta-section";
import { HeroSection } from "@/components/home/hero-section";
import { JoinAdventureSection } from "@/components/home/join-adventure-section";
import { ValuesSection } from "@/components/home/values-section";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { StructuredData } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "Cozetik - Formations professionnelles certifiantes",
  description:
    "Développez vos compétences avec Cozetik. Formations professionnelles certifiantes de qualité en informatique, business, communication, intelligence émotionnelle et bien-être. Parcours post-bac adaptés à vos ambitions avec des experts reconnus. Découvrez notre catalogue complet.",
  keywords: [
    "formations professionnelles",
    "formations certifiantes",
    "formation en ligne",
    "formation informatique",
    "formation business",
    "formation communication",
    "formation intelligence émotionnelle",
    "formation post-bac",
    "développement compétences",
    "certification professionnelle",
  ],
  openGraph: {
    title: "Cozetik - Formations professionnelles certifiantes",
    description:
      "Formations de qualité pour booster votre carrière. Formez-vous avec les meilleurs experts du secteur. Parcours certifiants adaptés à vos ambitions.",
    images: ["/og-image.jpg"],
    url: process.env.NEXT_PUBLIC_APP_URL || "https://cozetik.fr",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cozetik - Formations professionnelles certifiantes",
    description: "Formations de qualité pour booster votre carrière. Parcours certifiants avec experts reconnus.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || "https://cozetik.fr",
  },
};

async function getHomeData() {
  try {
    const [categories, formations, partners, values] = await Promise.all([
      // Fetch visible categories
      prisma.category.findMany({
        where: { visible: true },
        orderBy: { order: "asc" },
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

      // Fetch visible values for "Nos Valeurs" section
      prisma.value.findMany({
        where: { visible: true },
        orderBy: { order: "asc" },
      }),
    ]);

    return { categories, formations, partners, values };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return { categories: [], formations: [], partners: [], values: [] };
  }
}

export default async function Home() {
  const { categories, formations, partners, values } = await getHomeData();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cozetik.fr'
  const organizationSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'Organization' as const,
    name: 'Cozetik',
    url: baseUrl,
    logo: `${baseUrl}/logo-cozetik_Logo-transparent.png`,
    description: 'Cozetik - Formations professionnelles certifiantes. Développez vos compétences avec des formations de qualité adaptées aux besoins du marché.',
    address: {
      '@type': 'PostalAddress' as const,
      streetAddress: '4 Rue Sarah Bernhardt',
      addressLocality: 'Asnières-sur-Seine',
      postalCode: '92600',
      addressCountry: 'FR',
    },
    contactPoint: {
      '@type': 'ContactPoint' as const,
      contactType: 'customer service',
      email: 'contact@cozetik.fr',
      areaServed: 'FR',
      availableLanguage: ['French'],
    },
    sameAs: [
      // Ajoutez vos réseaux sociaux ici si disponibles
    ],
  };

  return (
    <>
      <StructuredData data={organizationSchema} />
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
              {categories.length} parcours pour révéler votre potentiel
            </p>
          </div>
          <CategoriesSection categories={categories} />
        </div>
      </section>
      
      {/* Section Vision/Philosophie - Contenu SEO optimisé */}
      <section className="relative bg-white px-4 py-16 md:px-6 md:py-20 lg:px-[120px] lg:py-24">
        <div className="container mx-auto max-w-[1200px]">
          <h2 className="mb-6 font-display text-4xl font-bold text-cozetik-black md:text-5xl lg:text-6xl text-center" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Notre vision
          </h2>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <p className="font-sans text-base leading-relaxed text-cozetik-black md:text-lg lg:text-xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              Chez Cozetik, nous croyons que l&apos;excellence professionnelle naît de l&apos;équilibre entre compétences techniques, intelligence émotionnelle et bien-être. C&apos;est pourquoi nos formations cultivent autant votre savoir-faire que votre savoir-être.
            </p>
          </div>
        </div>
      </section>

      {/* Nos Valeurs Section - Fond noir */}
      <ValuesSection values={values} />

      {/* CTA Section 1 - Rejoins l'Aventure (Violet) */}
      <JoinAdventureSection />

      {/* FAQ Section - Questions fréquentes */}
      <FAQSection />

      {/* CTA Section 2 - Franchissez les Étapes (Vert) */}
      <FinalCTASection />
    </div>
    </>
  );
}
