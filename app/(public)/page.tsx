import { AboutSection } from "@/components/home/about-section";
import { CategoriesSection } from "@/components/home/categories-section";
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
    url: "https://cozetik.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cozetik - Formations professionnelles certifiantes",
    description: "Formations de qualité pour booster votre carrière. Parcours certifiants avec experts reconnus.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://cozetik.com",
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

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cozetik',
    url: 'https://cozetik.com',
    logo: 'https://cozetik.com/logo-cozetik_Logo-transparent.png',
    description: 'Cozetik - Formations professionnelles certifiantes. Développez vos compétences avec des formations de qualité adaptées aux besoins du marché.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4 Rue Sarah Bernhardt',
      addressLocality: 'Asnières-sur-Seine',
      postalCode: '92600',
      addressCountry: 'FR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
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
              5 parcours pour révéler votre potentiel
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

      {/* Section Contenu SEO - Texte riche pour le référencement */}
      <section className="relative bg-[#F5EDE4] px-4 py-16 md:px-6 md:py-20 lg:px-[120px] lg:py-24">
        <div className="container mx-auto max-w-[1200px]">
          <article className="space-y-8">
            <h2 className="font-display text-3xl font-bold text-cozetik-black md:text-4xl lg:text-5xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              Formations professionnelles certifiantes : développez vos compétences avec Cozetik
            </h2>
            
            <div className="space-y-6 font-sans text-base leading-relaxed text-cozetik-black md:text-lg" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              <p>
                <strong>Cozetik</strong> est un centre de <strong>formation professionnelle</strong> spécialisé dans l&apos;accompagnement des talents d&apos;avenir. Nous proposons des <strong>formations certifiantes</strong> de qualité adaptées aux besoins du marché actuel. Que vous souhaitiez développer vos compétences en <strong>informatique</strong>, en <strong>business</strong>, en <strong>communication</strong>, en <strong>intelligence émotionnelle</strong> ou en <strong>bien-être</strong>, nos parcours post-bac sont conçus pour vous accompagner vers la réussite professionnelle.
              </p>

              <h3 className="font-display text-2xl font-bold text-cozetik-black md:text-3xl mt-8 mb-4" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Pourquoi choisir nos formations professionnelles ?
              </h3>
              
              <p>
                Nos <strong>formations professionnelles certifiantes</strong> allient excellence technique et développement personnel. Chaque parcours est pensé pour être immédiatement applicable dans votre environnement professionnel. Nous formons aux compétences clés du monde numérique et humain : <strong>intelligence artificielle</strong>, <strong>automatisation</strong>, <strong>communication</strong>, <strong>leadership</strong> et <strong>bien-être au travail</strong>.
              </p>

              <h3 className="font-display text-2xl font-bold text-cozetik-black md:text-3xl mt-8 mb-4" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Des formations adaptées à vos objectifs professionnels
              </h3>
              
              <p>
                Que vous soyez en <strong>reconversion professionnelle</strong>, en <strong>recherche d&apos;emploi</strong> ou en activité, nos <strong>formations en ligne</strong> et en présentiel s&apos;adaptent à votre rythme. Nos experts reconnus vous accompagnent tout au long de votre parcours pour garantir votre réussite. Chaque formation délivre une <strong>certification professionnelle</strong> reconnue, valorisant votre profil sur le marché de l&apos;emploi.
              </p>

              <h3 className="font-display text-2xl font-bold text-cozetik-black md:text-3xl mt-8 mb-4" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Catalogue de formations professionnelles complet
              </h3>
              
              <p>
                Découvrez notre <strong>catalogue de formations</strong> couvrant 5 domaines d&apos;expertise : <strong>informatique et IA</strong>, <strong>business et entrepreneuriat</strong>, <strong>communication et prise de parole</strong>, <strong>intelligence émotionnelle</strong> et <strong>bien-être & connexion</strong>. Chaque formation est structurée en modules progressifs, avec des objectifs pédagogiques clairs et des mises en pratique concrètes.
              </p>

              <p>
                Nos <strong>formations post-bac</strong> sont accessibles à tous les niveaux, du débutant à l&apos;expert. Grâce à notre quiz d&apos;orientation personnalisé, trouvez la formation qui correspond parfaitement à votre profil et à vos ambitions professionnelles.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Nos Valeurs Section - Fond noir */}
      <ValuesSection />

      {/* CTA Section 1 - Rejoins l'Aventure (Violet) */}
      <JoinAdventureSection />

      {/* CTA Section 2 - Franchissez les Étapes (Vert) */}
      <FinalCTASection />
    </div>
    </>
  );
}
