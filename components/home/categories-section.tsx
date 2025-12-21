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
    <div className="mx-auto w-full max-w-[1200px]">
      {/* Asymmetric Grid: 3 columns, line 1 has 2 cards (centered), line 2 has 3 cards */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
        {displayCategories.map((category, index) => (
          <div
            key={category.id}
            className={`
              ${index === 0 ? 'md:col-start-1 lg:col-start-2' : ''}
            `}
          >
            <CategoryCard
              name={category.name}
              slug={category.slug}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
