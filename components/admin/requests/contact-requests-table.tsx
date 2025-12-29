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
import { CheckCircle2, Archive, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ViewContactRequestDialog } from './view-contact-request-dialog'
import { toast } from 'sonner'

interface ContactRequest {
  id: string
  name: string
  email: string
  message: string
  status: 'NEW' | 'TREATED' | 'ARCHIVED'
  createdAt: string
}

interface ContactRequestsTableProps {
  requests: ContactRequest[]
}

export default function ContactRequestsTable({
  requests,
}: ContactRequestsTableProps) {
  const router = useRouter()
  const [items, setItems] = useState(requests)
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
    requestId: string,
    newStatus: 'TREATED' | 'ARCHIVED'
  ) => {
    setLoadingStates((prev) => ({ ...prev, [requestId]: true }))

    try {
      const response = await fetch(
        `/api/requests/contact/${requestId}/status`,
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
          item.id === requestId ? { ...item, status: data.status } : item
        )
      )

      // Afficher un message selon le résultat
      if (newStatus === 'TREATED') {
        if (data.emailSent) {
          toast.success('Demande marquée comme traitée et email envoyé avec succès')
        } else if (data.emailError) {
          toast.warning(`Demande marquée comme traitée, mais l'email n'a pas pu être envoyé: ${data.emailError}`)
        } else {
          toast.success('Demande marquée comme traitée')
        }
      } else {
        toast.success('Demande archivée')
      }
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setLoadingStates((prev) => ({ ...prev, [requestId]: false }))
    }
  }

  const handleDelete = async (requestId: string) => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/requests/contact/${requestId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression')
      }

      // Retirer de l'état local
      setItems((prev) => prev.filter((item) => item.id !== requestId))

      toast.success('Demande supprimée avec succès')
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

  const renderTable = (filteredItems: ContactRequest[]) => (
    <div className="rounded-none border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[180px]">Date</TableHead>
            <TableHead className="w-[120px]">Statut</TableHead>
            <TableHead className="w-[180px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                Aucune demande trouvée
              </TableCell>
            </TableRow>
          ) : (
            filteredItems.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {request.email}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(request.createdAt)}
                </TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <ViewContactRequestDialog request={request} />

                    {request.status === 'NEW' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleChangeStatus(request.id, 'TREATED')}
                        title="Marquer comme traité"
                        disabled={loadingStates[request.id]}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}

                    {request.status !== 'ARCHIVED' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleChangeStatus(request.id, 'ARCHIVED')}
                        title="Archiver"
                        disabled={loadingStates[request.id]}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}

                    <AlertDialog
                      open={deleteId === request.id}
                      onOpenChange={(open) => setDeleteId(open ? request.id : null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Supprimer cette demande ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. La demande de{' '}
                            <span className="font-semibold">{request.name}</span>{' '}
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
                              handleDelete(request.id)
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
        <TabsTrigger value="all">
          Toutes ({items.length})
        </TabsTrigger>
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
