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
import DeleteStepDialog from './delete-step-dialog'
import EditStepDialog from './edit-step-dialog'

interface Step {
  id: string
  order: number
  title: string
  description: string
  duration: string | null
  keyPoints: string[]
}

export default function StepsTable({
  steps,
  formationId,
}: {
  steps: Step[]
  formationId: string
}) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Ordre</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead className="w-[150px]">Durée</TableHead>
            <TableHead className="w-[100px]">Points clés</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {steps.map((step) => (
            <TableRow key={step.id}>
              <TableCell className="font-medium">
                <Badge variant="outline">#{step.order}</Badge>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{step.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {step.description}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {step.duration || '-'}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {step.keyPoints.length} point{step.keyPoints.length > 1 ? 's' : ''}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <EditStepDialog formationId={formationId} step={step} />
                  <DeleteStepDialog
                    formationId={formationId}
                    stepId={step.id}
                    stepTitle={step.title}
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
