'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { CheckCircle2, Archive, Trash2, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ViewCandidatureDialog } from './view-candidature-dialog'
import { toast } from 'sonner'

interface Candidature {
  id: string
  civility: string
  firstName: string
  lastName: string
  birthDate: string
  email: string
  phone: string
  address: string | null
  postalCode: string | null
  city: string | null
  formation: string
  educationLevel: string
  currentSituation: string
  startDate: string | null
  motivation: string
  cvUrl: string | null
  coverLetterUrl: string | null
  otherDocumentUrl: string | null
  acceptPrivacy: boolean
  acceptNewsletter: boolean
  status: 'NEW' | 'TREATED' | 'ARCHIVED'
  createdAt: string
}

interface CandidaturesTableProps {
  candidatures: Candidature[]
}

export default function CandidaturesTable({
  candidatures,
}: CandidaturesTableProps) {
  const router = useRouter()
  const [items, setItems] = useState(candidatures)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">Nouveau</Badge>
        )
      case 'TREATED':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Traité</Badge>
        )
      case 'ARCHIVED':
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">Archivé</Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleChangeStatus = async (
    candidatureId: string,
    newStatus: 'TREATED' | 'ARCHIVED'
  ) => {
    setLoadingStates((prev) => ({ ...prev, [candidatureId]: true }))

    try {
      const response = await fetch(
        `/api/requests/candidatures/${candidatureId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour')
      }

      // Mettre à jour l'état local
      setItems((prev) =>
        prev.map((item) =>
          item.id === candidatureId ? { ...item, status: data.status } : item
        )
      )

      if (newStatus === 'TREATED') {
        toast.success('Candidature marquée comme traitée')
      } else {
        toast.success('Candidature archivée')
      }
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setLoadingStates((prev) => ({ ...prev, [candidatureId]: false }))
    }
  }

  const handleDelete = async (candidatureId: string) => {
    setIsDeleting(true)

    try {
      const response = await fetch(
        `/api/requests/candidatures/${candidatureId}`,
        {
          method: 'DELETE',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression')
      }

      // Retirer de l'état local
      setItems((prev) => prev.filter((item) => item.id !== candidatureId))

      toast.success('Candidature supprimée avec succès')
      setDeleteId(null)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setIsDeleting(false)
    }
  }

  const filterByStatus = (status?: string) => {
    if (!status) return items
    return items.filter((item) => item.status === status)
  }

  const renderTable = (filteredItems: Candidature[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Formation</TableHead>
            <TableHead className="w-[180px]">Date</TableHead>
            <TableHead className="w-[120px]">Statut</TableHead>
            <TableHead className="w-[180px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-8"
              >
                Aucune candidature trouvée
              </TableCell>
            </TableRow>
          ) : (
            filteredItems.map((candidature) => (
              <TableRow key={candidature.id}>
                <TableCell className="font-medium">
                  {candidature.civility} {candidature.firstName} {candidature.lastName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {candidature.email}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {candidature.phone}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{candidature.formation}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(candidature.createdAt)}
                </TableCell>
                <TableCell>{getStatusBadge(candidature.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <ViewCandidatureDialog candidature={candidature} />

                    {candidature.status === 'NEW' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleChangeStatus(candidature.id, 'TREATED')}
                        title="Marquer comme traité"
                        disabled={loadingStates[candidature.id]}
                      >
                        {loadingStates[candidature.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    {candidature.status !== 'ARCHIVED' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleChangeStatus(candidature.id, 'ARCHIVED')}
                        title="Archiver"
                        disabled={loadingStates[candidature.id]}
                      >
                        {loadingStates[candidature.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Archive className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    <AlertDialog
                      open={deleteId === candidature.id}
                      onOpenChange={(open) =>
                        setDeleteId(open ? candidature.id : null)
                      }
                    >
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Supprimer cette candidature ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. La candidature de{' '}
                            <span className="font-semibold">
                              {candidature.firstName} {candidature.lastName}
                            </span>{' '}
                            sera définitivement supprimée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              e.preventDefault()
                              handleDelete(candidature.id)
                            }}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? 'Suppression...' : 'Supprimer'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">Toutes ({items.length})</TabsTrigger>
        <TabsTrigger value="NEW">
          Nouvelles ({filterByStatus('NEW').length})
        </TabsTrigger>
        <TabsTrigger value="TREATED">
          Traitées ({filterByStatus('TREATED').length})
        </TabsTrigger>
        <TabsTrigger value="ARCHIVED">
          Archivées ({filterByStatus('ARCHIVED').length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-6">
        {renderTable(items)}
      </TabsContent>

      <TabsContent value="NEW" className="mt-6">
        {renderTable(filterByStatus('NEW'))}
      </TabsContent>

      <TabsContent value="TREATED" className="mt-6">
        {renderTable(filterByStatus('TREATED'))}
      </TabsContent>

      <TabsContent value="ARCHIVED" className="mt-6">
        {renderTable(filterByStatus('ARCHIVED'))}
      </TabsContent>
    </Tabs>
  )
}

