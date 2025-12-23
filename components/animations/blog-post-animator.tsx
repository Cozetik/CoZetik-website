"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

interface BlogPostAnimatorProps {
  children: React.ReactNode;
}

export function BlogPostAnimator({ children }: BlogPostAnimatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 },
      });

      // 1. Animation du texte dans le Hero (Titre + Métadonnées)
      tl.from(".anim-hero-content > *", {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        delay: 0.2, // Petit délai pour laisser l'image charger
      })
        // 2. Animation du fil d'ariane (Breadcrumb)
        .from(
          ".anim-breadcrumb",
          {
            opacity: 0,
            x: -20,
            duration: 0.8,
          },
          "-=0.8"
        )
        // 3. Animation du corps de l'article
        .from(
          ".anim-article-body",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6"
        )
        // 4. Animation des sections suivantes (Articles liés, CTA)
        .from(
          ".anim-footer-section",
          {
            y: 30,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
          },
          "-=0.4"
        );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen">
      {children}
    </div>
  );
}
