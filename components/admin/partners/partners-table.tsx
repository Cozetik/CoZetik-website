'use client'

import { useState } from 'react'
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
import { Pencil, ExternalLink } from 'lucide-react'
import DeletePartnerDialog from './delete-partner-dialog'

interface Partner {
  id: string
  name: string
  description: string | null
  logoUrl: string | null
  websiteUrl: string | null
  visible: boolean
  order: number
}

export default function PartnersTable({
  partners,
}: {
  partners: Partner[]
}) {
  const [items, setItems] = useState(partners)

  const handleToggleVisibility = async (id: string, currentValue: boolean) => {
    try {
      const response = await fetch(`/api/partners/${id}/toggle-visibility`, {
        method: 'PATCH',
      })

      if (response.ok) {
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, visible: !currentValue } : item
          )
        )
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Logo</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead className="w-[200px]">Site web</TableHead>
            <TableHead className="w-[100px]">Visible</TableHead>
            <TableHead className="w-[80px]">Ordre</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell>
                {partner.logoUrl ? (
                  <Image
                    src={partner.logoUrl}
                    alt={partner.name}
                    width={50}
                    height={50}
                    className="rounded object-contain"
                  />
                ) : (
                  <div className="w-[50px] h-[50px] bg-muted rounded flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">Logo</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{partner.name}</TableCell>
              <TableCell>
                {partner.websiteUrl ? (
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    Visiter
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={partner.visible}
                    onCheckedChange={() =>
                      handleToggleVisibility(partner.id, partner.visible)
                    }
                  />
                  <Badge
                    variant={partner.visible ? 'default' : 'secondary'}
                    className={
                      partner.visible
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-500 hover:bg-gray-600'
                    }
                  >
                    {partner.visible ? 'Visible' : 'Masqué'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{partner.order}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/partners/${partner.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeletePartnerDialog
                    partnerId={partner.id}
                    partnerName={partner.name}
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
