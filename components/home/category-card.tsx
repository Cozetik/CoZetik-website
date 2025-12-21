'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface CategoryCardProps {
  name: string
  slug: string
  index: number
}

export function CategoryCard({ name, slug, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      className="will-change-transform"
    >
      <Link
        href={`/formations?category=${slug}`}
        className="group block"
        role="link"
        aria-label={`Catégorie ${name}`}
      >
        <div className="flex h-48 items-center justify-center bg-cozetik-white px-8 transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 hover:bg-cozetik-beige">
          <h3 className="text-center font-sans text-xl font-bold uppercase leading-tight tracking-normal text-cozetik-black md:text-2xl">
            {name}
          </h3>
        </div>
      </Link>
    </motion.div>
  )
}
