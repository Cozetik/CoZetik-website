import gsap from "gsap";
import { useEffect, useRef } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  as?: React.ElementType;
  delay?: number;
  duration?: number;
}

export function TextReveal({
  text,
  className = "",
  as: Component = "div",
  delay = 0,
  duration = 0.8,
}: TextRevealProps) {
  const compRef = useRef<HTMLElement>(null);
  const isIntroDone = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".char",
        {
          y: 100,
          opacity: 0,
          rotate: 90,
          scale: 0.5,
          transformOrigin: "50% 50%",
        },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          scale: 1,
          duration: duration * 1.5,
          stagger: 0.2,
          ease: "elastic.out(1, 0.3)",
          delay: delay,
          onComplete: () => {
            isIntroDone.current = true;
          },
        }
      );
    }, compRef);

    return () => ctx.revert();
  }, [delay, duration]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!compRef.current || !isIntroDone.current) return;

    const rect = compRef.current.getBoundingClientRect();
    const chars = compRef.current.querySelectorAll(".char");

    const mouseX = e.clientX - (rect.left + rect.width / 2);
    const mouseY = e.clientY - (rect.top + rect.height / 2);

    gsap.to(chars, {
      duration: 1.5,
      x: (index) => (mouseX * ((index % 4) + 1)) / 30,
      y: (index) => (mouseY * ((index % 3) + 1)) / 30,
      rotate: (index) => (mouseX * (index % 2 === 0 ? 1 : -1)) / 150,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (!isIntroDone.current || !compRef.current) return;

    const chars = compRef.current.querySelectorAll(".char");

    gsap.to(chars, {
      x: 0,
      y: 0,
      rotate: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.3)",
      overwrite: true,
    });
  };

  return (
    <Component
      ref={compRef}
      className={`${className} p-20 inline-block`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="sr-only">{text}</span>
      {text.split("").map((char, index) => (
        <span key={index} className="char inline-block" style={{ opacity: 0 }}>
          {char}
        </span>
      ))}
    </Component>
  );
}
