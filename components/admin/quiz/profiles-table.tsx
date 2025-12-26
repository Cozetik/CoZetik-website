'use client'

import { useState } from 'react'
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
import DeleteProfileDialog from './delete-profile-dialog'

interface Profile {
  id: string
  letter: string
  emoji: string
  name: string
  programmeSignature: string
  visible: boolean
}

export default function ProfilesTable({
  profiles,
}: {
  profiles: Profile[]
}) {
  const [items, setItems] = useState(profiles)

  const handleToggleVisibility = async (id: string, currentValue: boolean) => {
    try {
      const response = await fetch(`/api/quiz/profiles/${id}/toggle-visibility`, {
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
            <TableHead className="w-[80px]">Lettre</TableHead>
            <TableHead className="w-[80px]">Emoji</TableHead>
            <TableHead>Nom du profil</TableHead>
            <TableHead>Programme signature</TableHead>
            <TableHead className="w-[100px]">Visible</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>
                <Badge variant="outline" className="font-mono text-lg">
                  {profile.letter}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-3xl">{profile.emoji}</span>
              </TableCell>
              <TableCell className="font-medium">
                {profile.name}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {profile.programmeSignature}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={profile.visible}
                    onCheckedChange={() =>
                      handleToggleVisibility(profile.id, profile.visible)
                    }
                  />
                  <Badge
                    variant={profile.visible ? 'default' : 'secondary'}
                    className={
                      profile.visible
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-500 hover:bg-gray-600'
                    }
                  >
                    {profile.visible ? 'Visible' : 'Masqué'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/quiz/profiles/${profile.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteProfileDialog
                    profileId={profile.id}
                    profileName={profile.name}
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
