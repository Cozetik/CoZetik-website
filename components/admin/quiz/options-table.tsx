"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Hash, Type } from "lucide-react";
import DeleteOptionDialog from "./delete-option-dialog";
import EditOptionDialog from "./edit-option-dialog";

interface Option {
  id: string;
  letter: string;
  text: string;
  order: number;
}

export default function OptionsTable({
  options,
  questionId,
}: {
  options: Option[];
  questionId: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
            <TableHead className="w-[100px] font-sans font-semibold text-foreground">
              <div className="flex items-center gap-2">
                <Type className="h-3.5 w-3.5 text-muted-foreground" />
                Lettre
              </div>
            </TableHead>
            <TableHead className="font-sans font-semibold text-foreground">
              <div className="flex items-center gap-2">
                Texte
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </TableHead>
            <TableHead className="w-[120px] font-sans font-semibold text-foreground">
              <div className="flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                Ordre
              </div>
            </TableHead>
            <TableHead className="w-[150px] text-right font-sans font-semibold text-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {options.map((option) => (
            <TableRow
              key={option.id}
              className="hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0"
            >
              <TableCell className="py-4">
                <Badge
                  variant="outline"
                  className="font-mono text-lg font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 px-3 py-1"
                >
                  {option.letter}
                </Badge>
              </TableCell>
              <TableCell className="py-4 max-w-[600px]">
                <span className="font-sans text-foreground line-clamp-2">
                  {option.text}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Hash className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-sans font-semibold text-foreground">
                    {option.order}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4">
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
  );
}
