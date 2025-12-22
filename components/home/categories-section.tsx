'use client'

import { CategoryCard } from './category-card'

interface Category {
  id: string
  name: string
  slug: string
}

interface CategoriesSectionProps {
  categories: Category[]
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (categories.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-center font-sans text-lg text-cozetik-black/60">
          Aucune catégorie disponible pour le moment
        </p>
      </div>
    )
  }

  // Limit to max 5 categories for display
  const displayCategories = categories.slice(0, 5)

  return (
    <div className="group/categories mx-auto w-full max-w-[1800px] px-4 md:px-6 lg:px-8">
      {/* Grid layout responsive: 1 col mobile, 2 cols tablet, 6 cols desktop */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-6 lg:gap-12">
        {displayCategories.map((category, index) => {
          // Desktop uniquement : centrage dernière ligne si 5 catégories
          let colSpan = 'lg:col-span-2' // Desktop: 2/6 colonnes = 1/3
          let colStart = ''

          if (displayCategories.length === 5) {
            if (index === 3) colStart = 'lg:col-start-2' // Cat 4 centrée
            if (index === 4) colStart = 'lg:col-start-4' // Cat 5 centrée
          }

          return (
            <div
              key={category.id}
              className={`w-full ${colSpan} ${colStart}`}
            >
              <CategoryCard
                name={category.name}
                slug={category.slug}
                index={index}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
