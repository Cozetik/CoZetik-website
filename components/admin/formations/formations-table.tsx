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
import { Pencil, Calendar, ListOrdered } from 'lucide-react'
import DeleteFormationDialog from './delete-formation-dialog'
import { toast } from 'sonner'

interface Formation {
  id: string
  title: string
  slug: string
  imageUrl: string | null
  price: number | null
  duration: string | null
  visible: boolean
  order: number
  category: {
    id: string
    name: string
  }
  _count?: {
    sessions: number
    inscriptions: number
    steps: number
  }
}

export default function FormationsTable({
  formations,
}: {
  formations: Formation[]
}) {
  const router = useRouter()
  const [items, setItems] = useState(formations)

  const formatPrice = (price: number | null) => {
    if (!price) return 'Gratuit'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleToggleVisibility = async (id: string, currentValue: boolean) => {
    // Optimistic update - mettre à jour l'UI immédiatement
    const newValue = !currentValue
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, visible: newValue } : item
      )
    )

    try {
      const response = await fetch(`/api/formations/${id}/toggle-visibility`, {
        method: 'PATCH',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour')
      }

      toast.success(
        data.visible
          ? 'Formation rendue visible'
          : 'Formation masquée'
      )
      router.refresh()
    } catch (error) {
      // Rollback en cas d'erreur
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, visible: currentValue } : item
        )
      )
      toast.error(error instanceof Error ? error.message : 'Erreur inconnue')
    }
  }


  return (
    <div className="border rounded-none">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead className="w-[150px]">Catégorie</TableHead>
            <TableHead className="w-[120px]">Prix</TableHead>
            <TableHead className="w-[120px]">Durée</TableHead>
            <TableHead className="w-[100px]">Visible</TableHead>
            <TableHead className="w-[80px]">Ordre</TableHead>
            <TableHead className="w-[150px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((formation) => (
            <TableRow key={formation.id}>
              <TableCell>
                {formation.imageUrl ? (
                  <Image
                    src={formation.imageUrl}
                    alt={formation.title}
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
              <TableCell className="font-medium max-w-[300px]">
                {formation.title}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{formation.category.name}</Badge>
              </TableCell>
              <TableCell>{formatPrice(formation.price)}</TableCell>
              <TableCell className="text-muted-foreground">
                {formation.duration || '-'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formation.visible}
                    onCheckedChange={() =>
                      handleToggleVisibility(formation.id, formation.visible)
                    }
                  />
                  <Badge
                    variant={formation.visible ? 'default' : 'secondary'}
                    className={
                      formation.visible
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-500 hover:bg-gray-600'
                    }
                  >
                    {formation.visible ? 'Visible' : 'Masqué'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{formation.order}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    title={`${formation._count?.steps || 0} step(s) - Gérer les étapes`}
                  >
                    <Link href={`/admin/formations/${formation.id}/steps`}>
                      <ListOrdered className="h-4 w-4" />
                    </Link>
                  </Button>
                  {formation._count && formation._count.sessions > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title={`${formation._count.sessions} session(s)`}
                    >
                      <Link href={`/admin/formations/${formation.id}/sessions`}>
                        <Calendar className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/formations/${formation.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteFormationDialog
                    formationId={formation.id}
                    formationTitle={formation.title}
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
