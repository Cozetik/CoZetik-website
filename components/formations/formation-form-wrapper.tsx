'use client'

import { InscriptionForm } from '@/components/formations/inscription-form'

interface FormationFormWrapperProps {
  formationId: string
  formationTitle: string
}

export default function FormationFormWrapper({
  formationId,
  formationTitle
}: FormationFormWrapperProps) {
  return (
    <section id="formulaire-inscription" className="bg-cozetik-beige py-20 md:py-24">
      <div className="w-full px-4 md:px-10 lg:px-20">

        {/* Titre */}
        <h2 className="font-display font-extrabold text-6xl md:text-7xl lg:text-8xl text-cozetik-black text-center mb-12">
          INSCRIVEZ-VOUS
        </h2>

        {/* Formulaire pleine largeur */}
        <div className="max-w-7xl mx-auto">
          <InscriptionForm
            formationId={formationId}
            formationTitle={formationTitle}
          />
        </div>
      </div>
    </section>
  )
}
