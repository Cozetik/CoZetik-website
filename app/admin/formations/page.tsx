import FormationsTable from "@/components/admin/formations/formations-table";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";

export default async function FormationsPage() {
  const formations = await prisma.formation.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: {
      category: true,
      _count: {
        select: { sessions: true, inscriptions: true, steps: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bricolage font-semibold tracking-tight">
            Formations
          </h1>
          <p className="text-muted-foreground font-sans">
            Gérez vos formations et programmes
          </p>
        </div>
        <Button asChild size="default" className="shadow-sm font-sans">
          <Link href="/admin/formations/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle formation
          </Link>
        </Button>
      </div>

      {formations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 rounded-lg border border-dashed">
          <div className="rounded-full bg-muted p-3 mb-4">
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bricolage font-semibold mb-1.5">
            Aucune formation créée
          </h3>
          <p className="text-sm font-sans text-muted-foreground mb-6 text-center max-w-sm">
            Commencez par créer votre première formation
          </p>
          <Button asChild size="sm" className="font-sans">
            <Link href="/admin/formations/new">
              <Plus className="mr-2 h-4 w-4" />
              Créer une formation
            </Link>
          </Button>
        </div>
      ) : (
        <FormationsTable formations={formations} />
      )}
    </div>
  );
}
