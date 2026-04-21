"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

interface Pack {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  savings: string | null;
  features: string[];
  isPopular: boolean;
}

interface FormationPacksProps {
  packs: Pack[];
  formationId: string;
  categoryId: string;
}

export default function FormationPacks({
  packs,
  formationId,
  categoryId,
}: FormationPacksProps) {
  if (!packs || packs.length === 0) return null;

  return (
    <section className="py-24 bg-white" id="tarifs">
      <div className="container mx-auto px-4 md:px-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#2C2C2C] font-bricolage">
            Choisissez votre pack
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-sans">
            Des formules adaptées à vos besoins pour un accompagnement
            sur-mesure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className={cn(
                "relative flex flex-col p-8 rounded-[40px] transition-all duration-300 hover:scale-[1.02]",
                pack.isPopular
                  ? "bg-[#2C2C2C] text-white shadow-2xl z-10 scale-105 border-4 border-[#9A80B8]"
                  : "bg-[#F8F8F8] text-[#2C2C2C] border-2 border-transparent hover:border-gray-200"
              )}
            >
              {pack.isPopular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#9A80B8] text-white px-6 py-2 rounded-full text-sm font-bold tracking-wider shadow-lg whitespace-nowrap">
                  OFFRE LA PLUS CHOISIE
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 font-bricolage">
                  {pack.name}
                </h3>
                {pack.description && (
                  <p
                    className={cn(
                      "text-sm font-sans",
                      pack.isPopular ? "text-gray-300" : "text-gray-500"
                    )}
                  >
                    {pack.description}
                  </p>
                )}
              </div>

              <div className="mb-8 flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold font-bricolage">
                    {pack.price}€
                  </span>
                  <span
                    className={cn(
                      "text-lg font-medium",
                      pack.isPopular ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    TTC
                  </span>
                </div>

                {(pack.originalPrice || pack.savings) && (
                  <div className="mt-2 flex items-center gap-3">
                    {pack.originalPrice && (
                      <span
                        className={cn(
                          "text-lg line-through",
                          pack.isPopular ? "text-gray-500" : "text-gray-400"
                        )}
                      >
                        {pack.originalPrice}€
                      </span>
                    )}
                    {pack.savings && (
                      <span className="bg-[#9A80B8]/20 text-[#9A80B8] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {pack.savings}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-10 flex-1">
                <p
                  className={cn(
                    "text-xs font-bold uppercase tracking-widest",
                    pack.isPopular ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  Ce qui est inclus :
                </p>
                <ul className="space-y-4">
                  {pack.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "rounded-full p-1 mt-1 shrink-0",
                          pack.isPopular
                            ? "bg-[#9A80B8] text-white"
                            : "bg-gray-200 text-gray-600"
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-medium leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                asChild
                className={cn(
                  "w-full h-14 rounded-2xl text-lg font-bold font-bricolage transition-all duration-300",
                  pack.isPopular
                    ? "bg-[#9A80B8] text-white hover:bg-[#8A70A8] shadow-lg shadow-[#9A80B8]/20"
                    : "bg-[#2C2C2C] text-white hover:bg-black"
                )}
              >
                <Link
                  href={`/candidater?formationId=${formationId}&pack=${encodeURIComponent(pack.name)}`}
                >
                  C&apos;est parti !
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
