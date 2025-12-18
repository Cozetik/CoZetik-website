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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { CheckCircle2, Archive, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ViewInscriptionDialog } from './view-inscription-dialog'
import { toast } from 'sonner'

interface Formation {
  id: string
  title: string
  slug: string
}

interface FormationInscription {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: 'NEW' | 'TREATED' | 'ARCHIVED'
  createdAt: string
  formation: Formation
}

interface InscriptionsTableProps {
  inscriptions: FormationInscription[]
  formations: Formation[]
}

export default function InscriptionsTable({
  inscriptions,
  formations,
}: InscriptionsTableProps) {
  const router = useRouter()
  const [items, setItems] = useState(inscriptions)
  const [selectedFormation, setSelectedFormation] = useState<string>('all')
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
    inscriptionId: string,
    newStatus: 'TREATED' | 'ARCHIVED'
  ) => {
    setLoadingStates((prev) => ({ ...prev, [inscriptionId]: true }))

    try {
      const response = await fetch(
        `/api/requests/inscriptions/${inscriptionId}/status`,
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
          item.id === inscriptionId ? { ...item, status: data.status } : item
        )
      )

      toast.success(
        newStatus === 'TREATED'
          ? 'Inscription marquée comme traitée'
          : 'Inscription archivée'
      )
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setLoadingStates((prev) => ({ ...prev, [inscriptionId]: false }))
    }
  }

  const handleDelete = async (inscriptionId: string) => {
    setIsDeleting(true)

    try {
      const response = await fetch(
        `/api/requests/inscriptions/${inscriptionId}`,
        {
          method: 'DELETE',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression')
      }

      // Retirer de l'état local
      setItems((prev) => prev.filter((item) => item.id !== inscriptionId))

      toast.success('Inscription supprimée avec succès')
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

  const filterByFormation = (inscriptionsList: FormationInscription[]) => {
    if (selectedFormation === 'all') return inscriptionsList
    return inscriptionsList.filter(
      (item) => item.formation.id === selectedFormation
    )
  }

  const renderTable = (filteredItems: FormationInscription[]) => {
    const finalItems = filterByFormation(filteredItems)

    return (
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
            {finalItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  Aucune inscription trouvée
                </TableCell>
              </TableRow>
            ) : (
              finalItems.map((inscription) => (
                <TableRow key={inscription.id}>
                  <TableCell className="font-medium">
                    {inscription.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {inscription.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {inscription.phone}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {inscription.formation.title}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(inscription.createdAt)}
                  </TableCell>
                  <TableCell>{getStatusBadge(inscription.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ViewInscriptionDialog inscription={inscription} />

                      {inscription.status === 'NEW' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleChangeStatus(inscription.id, 'TREATED')
                          }
                          title="Marquer comme traité"
                          disabled={loadingStates[inscription.id]}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}

                      {inscription.status !== 'ARCHIVED' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleChangeStatus(inscription.id, 'ARCHIVED')
                          }
                          title="Archiver"
                          disabled={loadingStates[inscription.id]}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}

                      <AlertDialog
                        open={deleteId === inscription.id}
                        onOpenChange={(open) =>
                          setDeleteId(open ? inscription.id : null)
                        }
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Supprimer cette inscription ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. L&apos;inscription
                              de{' '}
                              <span className="font-semibold">
                                {inscription.name}
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
                                handleDelete(inscription.id)
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
  }

  return (
    <div className="space-y-4">
      {/* Filtre par formation */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filtrer par formation :</label>
        <Select value={selectedFormation} onValueChange={setSelectedFormation}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Toutes les formations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les formations</SelectItem>
            {formations.map((formation) => (
              <SelectItem key={formation.id} value={formation.id}>
                {formation.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Onglets par statut */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            Toutes ({filterByFormation(items).length})
          </TabsTrigger>
          <TabsTrigger value="NEW">
            Nouvelles ({filterByFormation(filterByStatus('NEW')).length})
          </TabsTrigger>
          <TabsTrigger value="TREATED">
            Traitées ({filterByFormation(filterByStatus('TREATED')).length})
          </TabsTrigger>
          <TabsTrigger value="ARCHIVED">
            Archivées ({filterByFormation(filterByStatus('ARCHIVED')).length})
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
    </div>
  )
}
