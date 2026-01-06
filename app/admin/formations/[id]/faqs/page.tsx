import FaqsTable from "@/components/admin/formations/faqs/faqs-table";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, MessageCircle, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function FormationFaqsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const formation = await prisma.formation.findUnique({
    where: { id },
    include: {
      faqs: {
        orderBy: { createdAt: "desc" },
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
              FAQ : {formation.title}
            </h1>
            <p className="text-muted-foreground font-sans">
              Questions fréquentes spécifiques à cette formation
            </p>
          </div>
          <Button asChild size="default" className="shadow-sm font-sans">
            <Link href={`/admin/formations/${id}/faqs/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle question
            </Link>
          </Button>
        </div>
      </div>

      {formation.faqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 rounded-lg border border-dashed">
          <div className="rounded-full bg-muted p-3 mb-4">
            <MessageCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bricolage font-semibold mb-1.5">
            Aucune FAQ configurée
          </h3>
          <p className="text-sm font-sans text-muted-foreground mb-6 text-center max-w-sm">
            Ajoutez des questions/réponses pour aider les candidats.
          </p>
          <Button asChild size="sm" className="font-sans">
            <Link href={`/admin/formations/${id}/faqs/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une question
            </Link>
          </Button>
        </div>
      ) : (
        <FaqsTable faqs={formation.faqs} formationId={id} />
      )}
    </div>
  );
}
