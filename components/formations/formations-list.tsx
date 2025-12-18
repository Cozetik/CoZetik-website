'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FormationCard } from './formation-card'
import { Filter } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface Formation {
  id: string
  title: string
  slug: string
  description: string
  price: number | null
  duration: string | null
  imageUrl: string | null
  categoryId: string
  category: {
    name: string
    slug: string
  }
}

interface FormationsListProps {
  formations: Formation[]
  categories: Category[]
}

export function FormationsList({ formations, categories }: FormationsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter formations based on selected category
  const filteredFormations =
    selectedCategory === 'all'
      ? formations
      : formations.filter((f) => f.categoryId === selectedCategory)

  return (
    <div className="space-y-8">
      {/* Filters Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filtrer par catégorie</span>
        </div>

        {/* Category Tabs */}
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Toutes les formations ({formations.length})
            </TabsTrigger>
            {categories.map((category) => {
              const count = formations.filter(
                (f) => f.categoryId === category.id
              ).length
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category.name} ({count})
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredFormations.length} formation
        {filteredFormations.length > 1 ? 's' : ''} trouvée
        {filteredFormations.length > 1 ? 's' : ''}
      </div>

      {/* Formations Grid */}
      {filteredFormations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFormations.map((formation) => (
            <FormationCard key={formation.id} formation={formation} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Filter className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">Aucune formation trouvée</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Aucune formation ne correspond à cette catégorie pour le moment. Essayez
            de sélectionner une autre catégorie ou consultez toutes les formations.
          </p>
        </div>
      )}
    </div>
  )
}
