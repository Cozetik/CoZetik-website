'use client'

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
import { Pencil } from 'lucide-react'
import EditOptionDialog from './edit-option-dialog'
import DeleteOptionDialog from './delete-option-dialog'

interface Option {
  id: string
  letter: string
  text: string
  order: number
}

export default function OptionsTable({
  options,
  questionId,
}: {
  options: Option[]
  questionId: string
}) {
  return (
    <div className="border rounded-none">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Lettre</TableHead>
            <TableHead>Texte</TableHead>
            <TableHead className="w-[100px]">Ordre</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {options.map((option) => (
            <TableRow key={option.id}>
              <TableCell>
                <Badge variant="outline" className="font-mono text-lg">
                  {option.letter}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[600px]">
                {option.text}
              </TableCell>
              <TableCell>{option.order}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <EditOptionDialog option={option} questionId={questionId} />
                  <DeleteOptionDialog
                    optionId={option.id}
                    optionLetter={option.letter}
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
