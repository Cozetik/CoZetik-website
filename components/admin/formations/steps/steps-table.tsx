"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, List } from "lucide-react";
import DeleteStepDialog from "./delete-step-dialog";
import EditStepDialog from "./edit-step-dialog";

interface Step {
  id: string;
  order: number;
  title: string;
  description: string;
  duration: string | null;
  keyPoints: string[];
}

export default function StepsTable({
  steps,
  formationId,
}: {
  steps: Step[];
  formationId: string;
}) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="w-[100px] font-bricolage font-semibold text-gray-700">
                Ordre
              </TableHead>
              <TableHead className="font-bricolage font-semibold text-gray-700">
                Étape
              </TableHead>
              <TableHead className="w-[150px] font-bricolage font-semibold text-gray-700">
                Durée
              </TableHead>
              <TableHead className="w-[140px] font-bricolage font-semibold text-gray-700">
                Points clés
              </TableHead>
              <TableHead className="w-[140px] text-right font-bricolage font-semibold text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {steps.map((step, index) => (
              <TableRow
                key={step.id}
                className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-colors"
              >
                <TableCell className="font-medium font-sans">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-sm shadow-sm">
                      {step.order}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    <div className="font-bricolage font-semibold text-gray-900">
                      {step.title}
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-2 font-sans max-w-2xl">
                      {step.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-sans">
                  {step.duration ? (
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="rounded-lg bg-amber-100 p-1.5">
                        <Clock className="h-3.5 w-3.5 text-amber-700" />
                      </div>
                      <span className="text-sm font-medium">
                        {step.duration}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Non définie</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="font-sans bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200 shadow-sm"
                  >
                    <List className="mr-1.5 h-3.5 w-3.5" />
                    {step.keyPoints.length} point
                    {step.keyPoints.length > 1 ? "s" : ""}
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
    </Card>
  );
}
