'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil } from 'lucide-react'
import DeleteCategoryDialog from './delete-category-dialog'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  visible: boolean
  order: number
  _count?: {
    formations: number
  }
}

export default function CategoriesTable({
  categories,
}: {
  categories: Category[]
}) {
  const router = useRouter()
  const [items, setItems] = useState(categories)

  const handleToggleVisibility = async (id: string, currentValue: boolean) => {
    try {
      const response = await fetch(`/api/categories/${id}/toggle-visibility`, {
        method: 'PATCH',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour')
      }

      // Mettre à jour l'état local
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, visible: !currentValue } : item
        )
      )

      toast.success(
        data.visible
          ? 'Catégorie rendue visible'
          : 'Catégorie masquée'
      )
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur inconnue')
    }
  }

  return (
    <div className="border rounded-none">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="w-[100px]">Visible</TableHead>
            <TableHead className="w-[80px]">Ordre</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    width={50}
                    height={50}
                    className="rounded object-cover"
                  />
                ) : (
                  <div className="w-[50px] h-[50px] bg-muted rounded flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">N/A</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {category.slug}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={category.visible}
                    onCheckedChange={() =>
                      handleToggleVisibility(category.id, category.visible)
                    }
                  />
                  <Badge
                    variant={category.visible ? 'default' : 'secondary'}
                    className={
                      category.visible
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-500 hover:bg-gray-600'
                    }
                  >
                    {category.visible ? 'Visible' : 'Masqué'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{category.order}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/categories/${category.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteCategoryDialog
                    categoryId={category.id}
                    categoryName={category.name}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
