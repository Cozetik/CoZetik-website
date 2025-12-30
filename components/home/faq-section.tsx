"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQSection() {
  return (
    <section className="relative bg-[#F5EDE4] px-4 py-16 md:px-6 md:py-20 lg:px-[120px] lg:py-24">
      <h3 className="justify-self-center font-display text-6xl md:text-6xl lg:text-8xl pb-12">FAQ</h3>
      <div className="container mx-auto max-w-[1200px]">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-b border-cozetik-black/20">
            <AccordionTrigger className="py-6 text-left font-bricolage text-xl font-bold text-cozetik-black hover:no-underline md:text-2xl lg:text-3xl [&[data-state=open]]:text-cozetik-black [&>svg]:h-6 [&>svg]:w-6 [&>svg]:text-cozetik-black [&[data-state=open]>svg]:rotate-180 md:[&>svg]:h-7 md:[&>svg]:w-7">
              Formations professionnelles certifiantes : développez vos compétences avec Cozetik
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-2">
              <div className="space-y-6 font-sans text-base leading-relaxed text-cozetik-black md:text-lg font-display">
                <p>
                  <strong>Cozetik</strong> est un centre de <strong>formation professionnelle</strong> spécialisé dans l&apos;accompagnement des talents d&apos;avenir. Nous proposons des <strong>formations certifiantes</strong> de qualité adaptées aux besoins du marché actuel. Que vous souhaitiez développer vos compétences en <strong>informatique</strong>, en <strong>business</strong>, en <strong>communication</strong>, en <strong>intelligence émotionnelle</strong> ou en <strong>bien-être</strong>, nos parcours post-bac sont conçus pour vous accompagner vers la réussite professionnelle.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-b border-cozetik-black/20">
            <AccordionTrigger className="py-6 text-left font-bricolage text-xl font-bold text-cozetik-black hover:no-underline md:text-2xl lg:text-3xl [&[data-state=open]]:text-cozetik-black [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-cozetik-black [&[data-state=open]>svg]:rotate-180 md:[&>svg]:h-6 md:[&>svg]:w-6">
              Pourquoi choisir nos formations professionnelles ?
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-2">
              <div className="space-y-6 font-sans text-base leading-relaxed text-cozetik-black md:text-lg">
                <p>
                  Nos <strong>formations professionnelles certifiantes</strong> allient excellence technique et développement personnel. Chaque parcours est pensé pour être immédiatement applicable dans votre environnement professionnel. Nous formons aux compétences clés du monde numérique et humain : <strong>intelligence artificielle</strong>, <strong>automatisation</strong>, <strong>communication</strong>, <strong>leadership</strong> et <strong>bien-être au travail</strong>.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-b border-cozetik-black/20">
            <AccordionTrigger className="py-6 text-left font-bricolage text-xl font-bold text-cozetik-black hover:no-underline md:text-2xl lg:text-3xl [&[data-state=open]]:text-cozetik-black [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-cozetik-black [&[data-state=open]>svg]:rotate-180 md:[&>svg]:h-6 md:[&>svg]:w-6">
              Des formations adaptées à vos objectifs professionnels
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-2">
              <div className="space-y-6 font-sans text-base leading-relaxed text-cozetik-black md:text-lg">
                <p>
                  Que vous soyez en <strong>reconversion professionnelle</strong>, en <strong>recherche d&apos;emploi</strong> ou en activité, nos <strong>formations en ligne</strong> et en présentiel s&apos;adaptent à votre rythme. Nos experts reconnus vous accompagnent tout au long de votre parcours pour garantir votre réussite. Chaque formation délivre une <strong>certification professionnelle</strong> reconnue, valorisant votre profil sur le marché de l&apos;emploi.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-b border-cozetik-black/20">
            <AccordionTrigger className="py-6 text-left font-bricolage text-xl font-bold text-cozetik-black hover:no-underline md:text-2xl lg:text-3xl [&[data-state=open]]:text-cozetik-black [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-cozetik-black [&[data-state=open]>svg]:rotate-180 md:[&>svg]:h-6 md:[&>svg]:w-6">
              Catalogue de formations professionnelles complet
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-2">
              <div className="space-y-6 font-sans text-base leading-relaxed text-cozetik-black md:text-lg">
                <p>
                  Découvrez notre <strong>catalogue de formations</strong> couvrant 5 domaines d&apos;expertise : <strong>informatique et IA</strong>, <strong>business et entrepreneuriat</strong>, <strong>communication et prise de parole</strong>, <strong>intelligence émotionnelle</strong> et <strong>bien-être & connexion</strong>. Chaque formation est structurée en modules progressifs, avec des objectifs pédagogiques clairs et des mises en pratique concrètes.
                </p>
                <p>
                  Nos <strong>formations post-bac</strong> sont accessibles à tous les niveaux, du débutant à l&apos;expert. Grâce à notre quiz d&apos;orientation personnalisé, trouvez la formation qui correspond parfaitement à votre profil et à vos ambitions professionnelles.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}

