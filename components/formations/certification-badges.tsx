import React from "react";
import Image from "next/image";

export function CertificationBadges() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-8 pb-12">
      <div className="flex flex-col items-center">
        <div className="relative h-32 w-80 transition-all duration-300">
          <Image
            src="/qualiopi.png"
            alt="Qualiopi - Processus certifié"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative h-48 w-48 transition-all duration-300">
          <Image
            src="/CPF.png"
            alt="Éligible Mon Compte Formation"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
