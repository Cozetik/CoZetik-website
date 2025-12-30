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
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DeleteBlogPostDialog } from './delete-blog-post-dialog'
import { toast } from 'sonner'

interface BlogPost {
  id: string
  title: string
  slug: string
  imageUrl: string | null
  visible: boolean
  publishedAt: string | null
  createdAt: string
}

export default function BlogTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter()
  const [items, setItems] = useState(posts)

  const formatDate = (date: string | null) => {
    if (!date) return 'Non publié'
    return format(new Date(date), 'dd/MM/yyyy', { locale: fr })
  }

  const handleToggleVisibility = async (postId: string) => {
    const originalItem = items.find(item => item.id === postId)
    if (!originalItem) return

    // Optimistic update
    const newVisibleState = !originalItem.visible
    const newPublishedAt = newVisibleState && !originalItem.publishedAt
      ? new Date().toISOString()
      : originalItem.publishedAt

    setItems((prev) =>
      prev.map((item) =>
        item.id === postId
          ? {
              ...item,
              visible: newVisibleState,
              publishedAt: newPublishedAt,
            }
          : item
      )
    )

    try {
      const response = await fetch(`/api/blog/${postId}/toggle-visibility`, {
        method: 'PATCH',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour')
      }

      // Mettre à jour avec les données réelles du serveur
      setItems((prev) =>
        prev.map((item) =>
          item.id === postId
            ? {
                ...item,
                visible: data.visible,
                publishedAt: data.publishedAt,
              }
            : item
        )
      )

      toast.success(
        data.visible
          ? 'Article publié avec succès'
          : 'Article mis en brouillon'
      )
      router.refresh()
    } catch (error) {
      // Rollback en cas d'erreur
      setItems((prev) =>
        prev.map((item) =>
          item.id === postId
            ? originalItem
            : item
        )
      )
      toast.error(error instanceof Error ? error.message : 'Erreur inconnue')
    }
  }

  return (
    <div className="rounded-none border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead className="w-[120px]">Statut</TableHead>
            <TableHead className="w-[100px]">Publié</TableHead>
            <TableHead className="w-[150px]">Date publication</TableHead>
            <TableHead className="w-[120px]">Créé le</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={50}
                    height={50}
                    className="rounded object-cover"
                  />
                ) : (
                  <div className="w-[50px] h-[50px] bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                    Img
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium max-w-[300px] truncate">
                {post.title}
              </TableCell>
              <TableCell>
                <Badge
                  variant={post.visible ? 'default' : 'secondary'}
                  className={
                    post.visible
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-500 hover:bg-gray-600'
                  }
                >
                  {post.visible ? 'Publié' : 'Brouillon'}
                </Badge>
              </TableCell>
              <TableCell>
                <Switch
                  checked={post.visible}
                  onCheckedChange={() => handleToggleVisibility(post.id)}
                />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(post.publishedAt)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(post.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/blog/${post.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteBlogPostDialog
                    postId={post.id}
                    postTitle={post.title}
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
