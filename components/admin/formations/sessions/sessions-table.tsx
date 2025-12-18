'use client'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import DeleteSessionDialog from './delete-session-dialog'

interface Session {
  id: string
  startDate: Date
  endDate: Date
  location: string | null
  maxSeats: number | null
  available: boolean
}

export default function SessionsTable({
  sessions,
  formationId,
}: {
  sessions: Session[]
  formationId: string
}) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date de début</TableHead>
            <TableHead>Date de fin</TableHead>
            <TableHead className="w-[200px]">Lieu</TableHead>
            <TableHead className="w-[120px]">Places max</TableHead>
            <TableHead className="w-[120px]">Disponible</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell className="font-medium">
                {format(new Date(session.startDate), 'PPP', { locale: fr })}
              </TableCell>
              <TableCell>
                {format(new Date(session.endDate), 'PPP', { locale: fr })}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {session.location || '-'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {session.maxSeats ? `${session.maxSeats} places` : 'Illimité'}
              </TableCell>
              <TableCell>
                <Badge
                  variant={session.available ? 'default' : 'secondary'}
                  className={
                    session.available
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }
                >
                  {session.available ? 'Disponible' : 'Indisponible'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DeleteSessionDialog
                  formationId={formationId}
                  sessionId={session.id}
                  sessionDate={format(new Date(session.startDate), 'PPP', {
                    locale: fr,
                  })}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
