import { Check } from 'lucide-react'

interface FormationObjectivesProps {
  objectives: string[]
}

export default function FormationObjectives({ objectives }: FormationObjectivesProps) {
  if (!objectives || objectives.length === 0) {
    return null
  }

  return (
    <section className="bg-cozetik-beige py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 max-w-6xl">

        {/* Titre */}
        <h2 className="font-display font-bold text-4xl md:text-5xl text-cozetik-black text-center mb-16">
          CE QUE VOUS ALLEZ MAÎTRISER
        </h2>

        {/* Grid Objectifs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {objectives.map((objective, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Icon Check avec background circulaire */}
              <div className="flex-shrink-0 w-10 h-10 rounded-none bg-cozetik-green/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-cozetik-green" />
              </div>

              {/* Texte Objectif */}
              <p className="font-semibold text-lg text-cozetik-black leading-relaxed">
                {objective}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
