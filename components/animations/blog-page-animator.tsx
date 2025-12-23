"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

interface BlogPageAnimatorProps {
  children: React.ReactNode;
}

export function BlogPageAnimator({ children }: BlogPageAnimatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 },
      });

      tl.from(".anim-header", {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
      })
        .from(
          ".anim-filter",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.8"
        )
        .from(
          ".anim-card",
          {
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
          },
          "-=0.6"
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
