'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import DeleteValueDialog from './delete-value-dialog'
import EditValueDialog from './edit-value-dialog'
import { toast } from 'sonner'

interface Value {
  id: string
  order: number
  title: string
  description: string
  visible: boolean
}

export default function ValuesTable({ values }: { values: Value[] }) {
  const router = useRouter()
  const [items, setItems] = useState(values)

  const handleToggleVisibility = async (id: string, currentValue: boolean) => {
    // Optimistic update
    const newValue = !currentValue
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, visible: newValue } : item
      )
    )

    try {
      const response = await fetch(`/api/values/${id}/toggle-visibility`, {
        method: 'PATCH',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour')
      }

      toast.success(
        data.visible ? 'Valeur rendue visible' : 'Valeur masquée'
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

  // Formater le numéro d'ordre avec un zéro devant si nécessaire
  const formatOrder = (order: number) => {
    return order.toString().padStart(2, '0')
  }

  return (
    <div className="border rounded-none">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Ordre</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead className="max-w-[400px]">Description</TableHead>
            <TableHead className="w-[100px]">Visible</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((value) => (
            <TableRow key={value.id}>
              <TableCell className="font-medium">
                <Badge variant="outline" className="text-lg font-bold">
                  {formatOrder(value.order)}
                </Badge>
              </TableCell>
              <TableCell className="font-medium max-w-[200px]">
                {value.title}
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {value.description}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={value.visible}
                    onCheckedChange={() =>
                      handleToggleVisibility(value.id, value.visible)
                    }
                  />
                  <Badge
                    variant={value.visible ? 'default' : 'secondary'}
                    className={
                      value.visible
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-500 hover:bg-gray-600'
                    }
                  >
                    {value.visible ? 'Visible' : 'Masqué'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <EditValueDialog value={value} />
                  <DeleteValueDialog
                    valueId={value.id}
                    valueTitle={value.title}
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
