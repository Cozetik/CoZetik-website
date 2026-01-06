import AddValueDialog from "@/components/admin/values/add-value-dialog";
import ValuesTable from "@/components/admin/values/values-table";
import { prisma } from "@/lib/prisma";
import { Heart } from "lucide-react";

export default async function ValuesPage() {
  const values = await prisma.value.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bricolage font-bold tracking-tight text-gray-900">
            Nos Valeurs
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez les valeurs affichées sur la page d&apos;accueil
          </p>
        </div>
        <AddValueDialog />
      </div>

      {/* Values List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bricolage font-semibold text-gray-900">
          Toutes les valeurs
        </h2>

        {values.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-b from-muted/30 to-muted/10">
            <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-6 mb-6 shadow-lg">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bricolage font-bold mb-2">
              Aucune valeur créée
            </h3>
            <p className="text-base font-sans text-muted-foreground mb-8 text-center max-w-md leading-relaxed">
              Commencez par créer votre première valeur pour définir
              l&apos;identité de votre entreprise
            </p>
            <AddValueDialog />
          </div>
        ) : (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <ValuesTable values={values} />
          </div>
        )}
      </div>
    </div>
  );
}
