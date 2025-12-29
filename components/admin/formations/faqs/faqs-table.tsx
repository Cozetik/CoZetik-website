'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import EditFaqDialog from './edit-faq-dialog'
import DeleteFaqDialog from './delete-faq-dialog'

interface Faq {
  id: string
  order: number
  question: string
  answer: string
}

export default function FaqsTable({
  faqs,
  formationId,
}: {
  faqs: Faq[]
  formationId: string
}) {
  return (
    <div className="border rounded-none">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Ordre</TableHead>
            <TableHead className="w-[300px]">Question</TableHead>
            <TableHead>Réponse</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.map((faq) => (
            <TableRow key={faq.id}>
              <TableCell className="font-medium">{faq.order}</TableCell>
              <TableCell className="font-medium">
                {faq.question.length > 100
                  ? `${faq.question.substring(0, 100)}...`
                  : faq.question}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {faq.answer.length > 150
                  ? `${faq.answer.substring(0, 150)}...`
                  : faq.answer}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <EditFaqDialog formationId={formationId} faq={faq} />
                  <DeleteFaqDialog
                    formationId={formationId}
                    faqId={faq.id}
                    faqQuestion={faq.question}
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
