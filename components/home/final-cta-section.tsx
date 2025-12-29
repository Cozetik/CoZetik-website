"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FinalCTASection() {
  return (
    <section className="w-full bg-cozetik-violet px-5 py-28 md:px-[60px] md:py-40 lg:px-[120px] lg:py-52">
      <div className="container mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-8 justify-between items-center lg:flex-row lg:gap-12"
        >
          {/* Left - Text Content (70%) */}
          <div className="flex flex-1 flex-col text-center lg:max-w-[70%] lg:text-left">
            {/* Main Title */}
            <h2
              className="mb-3 font-display text-4xl font-extrabold leading-[110%] text-cozetik-white md:text-5xl lg:text-[60px]"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              Prêt à transformer votre avenir ?
            </h2>

            {/* Subtitle */}
            <p
              className="font-sans text-base text-cozetik-white md:text-lg"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              Rejoignez Cozetik et passez à l&apos;étape suivante de votre
              carrière
            </p>
          </div>

          {/* Right - CTA Button (30%) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="flex w-full justify-center lg:w-auto lg:max-w-[30%] lg:justify-end"
          >
            <Link
              href="/candidater"
              className="group inline-flex items-center gap-3 rounded-none border-2 border-transparent bg-cozetik-black px-8 py-4 font-sans text-lg font-semibold text-cozetik-white shadow-none transition-all duration-300 ease-out hover:scale-105 hover:bg-[#363636] hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-98 focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-cozetik-white md:w-auto lg:px-8"
              tabIndex={0}
            >
              <span>Je candidate</span>
              <ArrowRight
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
