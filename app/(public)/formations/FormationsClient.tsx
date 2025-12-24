'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, BookOpen } from 'lucide-react'

type PrimaryFilter = 'all' | 'pro' | 'perso'
type SecondaryFilter = 'all' | 'tech' | 'expression' | 'alignement' | 'harmonie'

type Formation = {
  id: string
  titre: string
  description: string
  accroche: string
  category: PrimaryFilter
  subCategory: SecondaryFilter
}

const FORMATIONS: Formation[] = [
  {
    id: 'ia-productivite',
    titre: 'IA & productivité',
    description: 'S’adresse à celles et ceux qui veulent travailler mieux, pas plus, tout en restant maîtres de leurs outils',
    accroche: 'Tech & outils',
    category: 'pro',
    subCategory: 'tech',
  },
  {
    id: 'prise-de-parole',
    titre: 'Prise de parole',
    description: 'Transformer la prise de parole en un véritable levier de confiance et d’influence.',
    accroche: 'Expression & impact',
    category: 'pro',
    subCategory: 'expression',
  },
  {
    id: 'intelligence-emotionnelle',
    titre: 'Intelligence émotionnelle',
    description: 'Développer une intelligence émotionnelle solide pour mieux vivre, mieux décider et mieux interagir',
    accroche: 'Alignement personnel',
    category: 'perso',
    subCategory: 'alignement',
  },
  {
    id: 'kizomba-bien-etre',
    titre: 'Kizomba bien-être et connexion',
    description: 'Une expérience immersive où la kizomba devient un outil de transformation personnelle',
    accroche: 'Harmonie & présence',
    category: 'perso',
    subCategory: 'harmonie',
  },
]

const PRIMARY_FILTERS: { value: PrimaryFilter; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'pro', label: 'Développement professionnel' },
  { value: 'perso', label: 'Développement personnel' },
]

const SECONDARY_FILTERS: Record<PrimaryFilter, { value: SecondaryFilter; label: string }[]> = {
  all: [],
  pro: [
    { value: 'all', label: 'Tous' },
    { value: 'tech', label: 'Tech et outils' },
    { value: 'expression', label: 'Expression et impact' },
  ],
  perso: [
    { value: 'all', label: 'Tous' },
    { value: 'alignement', label: 'Alignement personnel' },
    { value: 'harmonie', label: 'Harmonie & présence' },
  ],
}

function Hero() {
  return (
    <section className="relative bg-[#ADA6DB] pb-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="relative">
          <div className="absolute -right-16 top-2 h-64 w-64 rounded-full bg-[#ADA6DB] opacity-30 blur-3xl" />

          <div className="relative max-w-5xl translate-y-24 overflow-hidden bg-[#262626] px-8 py-14 md:px-16 md:py-20 lg:px-20 lg:py-24">
            <h1 className="mb-4 font-['Bricolage_Grotesque'] text-4xl font-extrabold text-white md:text-6xl lg:text-8xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              Nos formations
            </h1>
            <p className="mt-4 font-sans text-lg text-white md:text-xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              Des parcours post-bac adaptés à vos ambitions professionnelles
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Filters({
  primary,
  secondary,
  onPrimaryChange,
  onSecondaryChange,
}: {
  primary: PrimaryFilter
  secondary: SecondaryFilter
  onPrimaryChange: (value: PrimaryFilter) => void
  onSecondaryChange: (value: SecondaryFilter) => void
}) {
  const secondaryOptions = SECONDARY_FILTERS[primary]

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-3">
        {PRIMARY_FILTERS.map(option => (
          <button
            key={option.value}
            onClick={() => {
              onPrimaryChange(option.value)
              onSecondaryChange('all')
            }}
            className={`rounded-none border border-[#262626] px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors md:px-6 ${
              primary === option.value
                ? 'bg-[#262626] text-white'
                : 'bg-white text-[#262626] hover:bg-[#f3f0fa]'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {secondaryOptions.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {secondaryOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onSecondaryChange(option.value)}
              className={`rounded-none border border-[#ADA6DB] px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors md:px-6 ${
                secondary === option.value
                  ? 'bg-[#ADA6DB] text-[#262626]'
                  : 'bg-white text-[#262626] hover:bg-[#f3f0fa]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function FormationCard({ formation }: { formation: Formation }) {
  return (
    <div className="flex h-full flex-col bg-[#262626] px-8 py-10 text-white">
      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[#ADA6DB]">
        {formation.accroche}
      </div>
      <h3 className="mt-4 font-['Bricolage_Grotesque'] text-2xl font-extrabold md:text-3xl">
        {formation.titre}
      </h3>
      <p className="mt-4 text-base leading-relaxed text-white/80">
        {formation.description}
      </p>
      <div className="mt-auto flex items-center justify-between pt-8">
        <div className="text-sm uppercase tracking-wide text-white/60">
          Parcours {formation.category === 'pro' ? 'professionnel' : 'personnel'}
        </div>
        <button className="flex items-center gap-2 bg-[#ADA6DB] px-4 py-3 text-base font-semibold uppercase text-white transition-colors hover:bg-[#bdb7e3]">
          Découvrir
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default function FormationsClientPage() {
  const [primaryFilter, setPrimaryFilter] = useState<PrimaryFilter>('all')
  const [secondaryFilter, setSecondaryFilter] = useState<SecondaryFilter>('all')

  const filteredFormations = useMemo(() => {
    return FORMATIONS.filter(formation => {
      if (primaryFilter !== 'all' && formation.category !== primaryFilter) {
        return false
      }

      if (primaryFilter === 'pro' && secondaryFilter !== 'all') {
        return formation.subCategory === secondaryFilter
      }

      if (primaryFilter === 'perso' && secondaryFilter !== 'all') {
        return formation.subCategory === secondaryFilter
      }

      return true
    })
  }, [primaryFilter, secondaryFilter])

  return (
    <div className="bg-[#FDFDFD] font-sans">
      <Hero />

      <section className="pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col gap-10">
            <Filters
              primary={primaryFilter}
              secondary={secondaryFilter}
              onPrimaryChange={setPrimaryFilter}
              onSecondaryChange={setSecondaryFilter}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredFormations.map(formation => (
                <FormationCard key={formation.id} formation={formation} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

