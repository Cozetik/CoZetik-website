import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import FormationHeroEffortel from '@/components/formations/formation-hero-effortel'
import FormationKeyInfos from '@/components/formations/formation-key-infos'
import FormationObjectives from '@/components/formations/formation-objectives'
import FormationCTAMid from '@/components/formations/formation-cta-mid'
import FormationFormWrapper from '@/components/formations/formation-form-wrapper'
import FormationFAQ from '@/components/formations/formation-faq'

interface FormationPageProps {
  params: Promise<{ slug: string }>
}

async function getFormation(slug: string) {
  try {
    const formation = await prisma.formation.findFirst({
      where: {
        slug,
        visible: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
        faqs: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    return formation
  } catch (error) {
    console.error('Error fetching formation:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: FormationPageProps): Promise<Metadata> {
  const { slug } = await params
  const formation = await getFormation(slug)

  if (!formation) {
    return {
      title: 'Formation non trouvée | Cozetik',
    }
  }

  const title = formation.title.length > 60 ? formation.title.substring(0, 57) + '...' : formation.title
  const description = formation.description?.length > 160
    ? formation.description.substring(0, 157) + '...'
    : formation.description || `Découvrez notre formation ${formation.title} et développez vos compétences professionnelles.`

  return {
    title,
    description,
    openGraph: {
      title: `${formation.title} | Cozetik`,
      description,
      images: formation.imageUrl ? [formation.imageUrl] : ['/og-image.jpg'],
      url: `https://cozetik.com/formations/${formation.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formation.title} | Cozetik`,
      description,
      images: formation.imageUrl ? [formation.imageUrl] : ['/og-image.jpg'],
    },
  }
}

export default async function FormationPage({ params }: FormationPageProps) {
  const { slug } = await params
  const formation = await getFormation(slug)

  if (!formation) {
    notFound()
  }

  return (
    <main className="bg-cozetik-beige">
      {/* 1. Hero avec Carousel Horizontal Effortel style - Fond Noir */}
      <FormationHeroEffortel
        formation={formation}
        steps={formation.steps}
      />

      {/* 2. Infos Clés - Beige (Prix, Durée, Niveau, etc.) */}
      <FormationKeyInfos formation={formation} />

      {/* 3. Objectifs - Beige */}
      {formation.objectives.length > 0 && (
        <FormationObjectives objectives={formation.objectives} />
      )}

      {/* 4. CTA Milieu - Vert */}
      <FormationCTAMid
        rating={formation.rating}
        reviewsCount={formation.reviewsCount}
        studentsCount={formation.studentsCount}
      />

      {/* 5. Formulaire - Beige */}
      <FormationFormWrapper
        formationId={formation.id}
        formationTitle={formation.title}
      />

      {/* 6. FAQ - Blanc */}
      {formation.faqs.length > 0 && <FormationFAQ faqs={formation.faqs} />}
    </main>
  )
}
