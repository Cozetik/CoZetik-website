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
    <div className="border rounded-none">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] font-bricolage">Ordre</TableHead>
            <TableHead className="font-bricolage">Titre</TableHead>
            <TableHead className="w-[150px] font-bricolage">Durée</TableHead>
            <TableHead className="w-[100px] font-bricolage">
              Points clés
            </TableHead>
            <TableHead className="w-[120px] text-right font-bricolage">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {steps.map((step) => (
            <TableRow key={step.id}>
              <TableCell className="font-medium font-sans">
                <Badge variant="outline">#{step.order}</Badge>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-bricolage font-medium">{step.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2 mt-1 font-sans">
                    {step.description}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground font-sans">
                {step.duration || "-"}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-sans">
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
  );
}
