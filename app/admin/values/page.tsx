import AddValueDialog from "@/components/admin/values/add-value-dialog";
import ValuesTable from "@/components/admin/values/values-table";
import { prisma } from "@/lib/prisma";
import { Heart } from "lucide-react";

export default async function ValuesPage() {
  const values = await prisma.value.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6 sm:space-y-8 font-sans px-4 sm:px-6 lg:px-0">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bricolage font-bold tracking-tight text-gray-900">
            Nos Valeurs
          </h1>
          <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-600">
            Gérez les valeurs affichées sur la page d&apos;accueil
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <AddValueDialog />
        </div>
      </div>

      {/* Values List */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
          Toutes les valeurs
        </h2>

        {values.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-24 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-b from-muted/30 to-muted/10">
            <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-4 sm:p-5 lg:p-6 mb-4 sm:mb-5 lg:mb-6 shadow-lg">
              <Heart className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-primary" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bricolage font-bold mb-2 text-center">
              Aucune valeur créée
            </h3>
            <p className="text-sm sm:text-base font-sans text-muted-foreground mb-6 sm:mb-8 text-center max-w-md leading-relaxed px-4">
              Commencez par créer votre première valeur pour définir
              l&apos;identité de votre entreprise
            </p>
            <div className="w-full sm:w-auto px-4 sm:px-0">
              <AddValueDialog />
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg sm:rounded-xl border shadow-sm overflow-hidden overflow-x-auto">
            <ValuesTable values={values} />
          </div>
        )}
      </div>
    </div>
  );
}
