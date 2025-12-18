'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ContactRequest {
  id: string
  name: string
  email: string
  message: string
  status: 'NEW' | 'TREATED' | 'ARCHIVED'
  createdAt: string
}

interface ViewContactRequestDialogProps {
  request: ContactRequest
}

export function ViewContactRequestDialog({
  request,
}: ViewContactRequestDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la demande</DialogTitle>
          <DialogDescription>
            Demande reçue le{' '}
            {format(new Date(request.createdAt), 'PPP à HH:mm', { locale: fr })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Statut
            </label>
            <div className="mt-1">{getStatusBadge(request.status)}</div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Nom
            </label>
            <p className="mt-1 text-base">{request.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <p className="mt-1 text-base">
              <a
                href={`mailto:${request.email}`}
                className="text-primary hover:underline"
              >
                {request.email}
              </a>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Message
            </label>
            <div className="mt-1 p-4 bg-muted rounded-lg whitespace-pre-wrap text-base">
              {request.message}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
