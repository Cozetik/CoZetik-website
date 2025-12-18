import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  _count: {
    formations: number
  }
}

interface CategoriesSectionProps {
  categories: Category[]
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Nos catégories de formations
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explorez nos différentes catégories et trouvez la formation qui correspond à vos besoins
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/formations?category=${category.slug}`}
              className="group"
            >
              <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
                <CardContent className="p-0">
                  {/* Category Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <span className="text-4xl font-bold text-primary/20">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Category Info */}
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {category._count.formations} formation
                        {category._count.formations > 1 ? 's' : ''}
                      </span>
                      <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
