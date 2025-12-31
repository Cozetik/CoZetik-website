"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AboutSection() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleDiscoverClick = () => {
    setIsNavigating(true);
    // On définit le flag pour que la page suivante sache qu'elle doit ouvrir le rideau
    sessionStorage.setItem("from-home-explore", "true");

    // On attend la fin de l'animation (800ms) avant de changer de page
    setTimeout(() => {
      router.push("/formations");
    }, 800);
  };

  return (
    <>
      <section className="relative bg-[#FDFDFD] px-5 py-10 md:px-10 md:py-16 lg:px-[120px] lg:py-[100px] overflow-hidden">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-12 lg:flex-row lg:gap-20">
          {/* Left Column - Text Content avec fond beige */}
          <motion.div
            className="relative flex flex-1 flex-col z-10 lg:max-w-[60%]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Zone beige wrapper */}
            <div
              id="formations"
              className="bg-cozetik-beige p-8 md:p-12 lg:p-16"
            >
              {/* Title - COZÉTIK broken on 2 lines */}
              <h2 className="font-display text-[80px] font-normal leading-[100%] tracking-[0] text-cozetik-black md:text-[120px] lg:text-[160px]">
                COZ
                <br />
                ÉTIK
              </h2>

              {/* Subtitle */}
              <h3 className="mt-4 font-sans text-base font-extrabold uppercase tracking-[0] text-cozetik-black md:text-lg">
                Passez à l&apos;étape suivante
              </h3>

              {/* Paragraph - Nouveau wording */}
              <p
                className="mt-6 max-w-[600px] relative z-10 font-sans text-base leading-[150%] text-cozetik-black md:text-lg"
                style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
              >
                Chez Cozetik, nous croyons que chaque parcours est unique.
                C&apos;est pourquoi nos formations post-bac allient excellence
                académique, accompagnement personnalisé et innovation
                pédagogique. Du numérique au développement personnel, nous vous
                donnons les clés pour réussir dans un monde professionnel en
                constante évolution.
              </p>

              {/* CTA - Texte avec soulignement au hover */}
              <button
                onClick={handleDiscoverClick}
                className="group mt-8 inline-flex items-center gap-2 border-b-2 border-transparent pb-1 font-sans text-base font-normal text-cozetik-black transition-all duration-300 hover:border-cozetik-black hover:gap-3 md:text-lg"
              >
                Découvrir nos formations
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Autographe SVG Violet - Below button */}
            <svg
              className="pointer-events-none absolute top-[100px] -left-[650px] -z-20  w-[800px] md:top-[150px] md:-left-[750px] md:w-[1000px] lg:top-[220px] lg:-left-[850px] lg:w-[1000px] xl:z-20"
              style={{
                overflow: "visible",
              }}
              viewBox="-220 0 510 418"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-116.915 6.00049C-61.3342 42.6332 -5.75357 79.2659 54.7746 119.296C115.303 159.326 179.094 201.643 220.483 228.18C261.872 254.716 278.925 264.19 282.657 267.176C286.389 270.162 276.284 266.372 232.55 243.261C188.817 220.151 111.762 177.833 55.9612 149.718C0.160492 121.602 -32.051 108.97 -54.3292 101.2C-87.5535 89.611 -101.584 87.6681 -102.245 88.6059C-103.394 90.2386 -96.5889 93.9649 -58.626 117.391C-20.6631 140.818 50.7075 183.767 91.8954 210.313C133.083 236.859 141.926 245.702 149.323 254.362C163.189 270.595 170.156 283.483 168.922 287.961C168.07 291.05 157.582 286.124 140.72 279.77C123.858 273.415 98.5941 263.31 68.2104 254.946C37.8267 246.582 3.0888 240.266 -36.2808 237.328C-75.6504 234.39 -118.599 235.022 -146.409 237.874C-174.218 240.725 -185.587 245.778 -193.654 251.223C-201.721 256.668 -206.142 262.353 -208.736 268.755C-211.961 282.105 -211.98 297.474 -207.233 326.02C-203.118 346.355 -195.539 378.567 -187.73 411.755"
                stroke="#ADA6DB"
                strokeWidth="12"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>

          {/* Right Column - Image étudiants qui déborde beaucoup */}
          <motion.div
            className="relative z-20 flex flex-1 items-center justify-center lg:max-w-[60%] lg:-ml-24 overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image
              src="https://res.cloudinary.com/dqmsyqdc4/image/upload/v1767109593/cozetik/image-landing-page.jpg"
              alt="Étudiants souriants suivant une formation Cozetik"
              width={1000}
              height={750}
              className="h-auto w-full md:w-[120%] lg:w-[150%] object-cover rounded-none"
              priority
              sizes="(max-width: 768px) 100vw, 75vw"
            />
          </motion.div>
        </div>
      </section>

      {/* Curtain Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-br from-[#ada6db] to-[#262626] overlay-slide-in" />
        </div>
      )}
    </>
  );
}
