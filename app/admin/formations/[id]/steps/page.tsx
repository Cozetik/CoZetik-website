import StepsTable from "@/components/admin/formations/steps/steps-table";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Layers, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function FormationStepsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const formation = await prisma.formation.findUnique({
    where: { id },
    include: {
      steps: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!formation) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-3 font-sans">
          <Link href="/admin/formations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux formations
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bricolage font-semibold tracking-tight">
              Programme : {formation.title}
            </h1>
            <p className="text-muted-foreground font-sans">
              Définissez les étapes clés du programme
            </p>
          </div>
          <Button asChild size="default" className="shadow-sm font-sans">
            <Link href={`/admin/formations/${id}/steps/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle étape
            </Link>
          </Button>
        </div>
      </div>

      {formation.steps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 rounded-lg border border-dashed">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Layers className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bricolage font-semibold mb-1.5">
            Le programme est vide
          </h3>
          <p className="text-sm font-sans text-muted-foreground mb-6 text-center max-w-sm">
            Structurez votre formation en ajoutant des étapes pédagogiques.
          </p>
          <Button asChild size="sm" className="font-sans">
            <Link href={`/admin/formations/${id}/steps/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une étape
            </Link>
          </Button>
        </div>
      ) : (
        <StepsTable steps={formation.steps} formationId={id} />
      )}
    </div>
  );
}
