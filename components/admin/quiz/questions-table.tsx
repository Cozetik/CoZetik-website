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
import { Pencil, Settings } from 'lucide-react'
import DeleteQuestionDialog from './delete-question-dialog'

interface Question {
  id: string
  order: number
  question: string
  visible: boolean
  _count?: {
    options: number
  }
}

export default function QuestionsTable({
  questions,
}: {
  questions: Question[]
}) {
  const [items, setItems] = useState(questions)

  const handleToggleVisibility = async (id: string, currentValue: boolean) => {
    try {
      const response = await fetch(`/api/quiz/questions/${id}/toggle-visibility`, {
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
            <TableHead className="w-[80px]">Ordre</TableHead>
            <TableHead>Question</TableHead>
            <TableHead className="w-[120px]">Nb options</TableHead>
            <TableHead className="w-[100px]">Visible</TableHead>
            <TableHead className="w-[150px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((question) => (
            <TableRow key={question.id}>
              <TableCell className="font-medium">{question.order}</TableCell>
              <TableCell className="max-w-[500px]">
                {question.question}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {question._count?.options || 0} option(s)
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={question.visible}
                    onCheckedChange={() =>
                      handleToggleVisibility(question.id, question.visible)
                    }
                  />
                  <Badge
                    variant={question.visible ? 'default' : 'secondary'}
                    className={
                      question.visible
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-500 hover:bg-gray-600'
                    }
                  >
                    {question.visible ? 'Visible' : 'Masqué'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    title="Gérer les options"
                  >
                    <Link href={`/admin/quiz/questions/${question.id}/options`}>
                      <Settings className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/quiz/questions/${question.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteQuestionDialog
                    questionId={question.id}
                    questionOrder={question.order}
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
