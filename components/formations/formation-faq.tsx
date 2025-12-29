"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FormationFAQ {
  id: string;
  order: number;
  question: string;
  answer: string;
}

interface FormationFAQProps {
  faqs: FormationFAQ[];
}

export default function FormationFAQ({ faqs }: FormationFAQProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 max-w-4xl">
        {/* Titre */}
        <h2 className="font-display text-4xl md:text-5xl text-cozetik-black text-center mb-16">
          QUESTIONS FRÉQUENTES
        </h2>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border-b border-gray-200"
            >
              <AccordionTrigger className="text-left font-sans font-semibold text-lg hover:text-cozetik-green transition-colors py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 font-sans leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
