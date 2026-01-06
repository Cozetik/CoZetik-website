import SessionsTable from "@/components/admin/formations/sessions/sessions-table";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function FormationSessionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [formation, session] = await Promise.all([
    prisma.formation.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
      },
    }),
    prisma.formationSession.findMany({
      where: { formationId: id },
      orderBy: { startDate: "asc" },
    }),
  ]);

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
              Sessions : {formation.title}
            </h1>
            <p className="text-muted-foreground font-sans">
              Gérez les dates et les disponibilités
            </p>
          </div>
          <Button asChild size="default" className="shadow-sm font-sans">
            <Link href={`/admin/formations/${id}/sessions/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle session
            </Link>
          </Button>
        </div>
      </div>

      {session.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 rounded-lg border border-dashed">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bricolage font-semibold mb-1.5">
            Aucune session programmée
          </h3>
          <p className="text-sm font-sans text-muted-foreground mb-6 text-center max-w-sm">
            Ajoutez des dates de sessions pour permettre aux candidats de
            s&apos;inscrire.
          </p>
          <Button asChild size="sm" className="font-sans">
            <Link href={`/admin/formations/${id}/sessions/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une session
            </Link>
          </Button>
        </div>
      ) : (
        <SessionsTable sessions={session} formationId={id} />
      )}
    </div>
  );
}
