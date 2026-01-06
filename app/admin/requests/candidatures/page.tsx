import CandidaturesTable from "@/components/admin/requests/candidatures-table";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  FileText,
  Users,
} from "lucide-react";

export default async function CandidaturesPage() {
  // Gestion temporaire si le modèle n'existe pas encore dans le client Prisma
  let candidatures = [];
  let hasError = false;
  let errorMessage = "";

  try {
    // Vérifier si le modèle existe dans le client Prisma
    if ("candidature" in prisma && prisma.candidature) {
      // Récupérer les candidatures, catégories et formations en parallèle
      const [candidaturesData, categories, formations] = await Promise.all([
        (prisma.candidature as any).findMany({
          orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        }),
        prisma.category.findMany({
          select: { id: true, name: true },
        }),
        prisma.formation.findMany({
          select: { id: true, title: true },
        }),
      ]);

      candidatures = candidaturesData;

      // Créer des maps pour un accès rapide
      const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
      const formationMap = new Map(formations.map((f) => [f.id, f.title]));

      // Ajouter les noms aux candidatures
      candidatures = candidatures.map((candidature: any) => ({
        ...candidature,
        categoryName:
          categoryMap.get(candidature.categoryFormation) ||
          candidature.categoryFormation,
        formationName:
          formationMap.get(candidature.formation) || candidature.formation,
      }));
    } else {
      hasError = true;
      errorMessage =
        "Le modèle Candidature n'existe pas encore dans le client Prisma. Veuillez redémarrer le serveur de développement pour que les changements soient pris en compte.";
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures:", error);
    hasError = true;
    errorMessage =
      error instanceof Error
        ? `Erreur lors de la récupération des candidatures: ${error.message}`
        : "Erreur inconnue lors de la récupération des candidatures. Veuillez redémarrer le serveur de développement.";
    candidatures = [];
  }

  // Sérialiser les dates pour le client
  const serializedCandidatures = candidatures.map((candidature: any) => ({
    ...candidature,
    birthDate: candidature.birthDate.toISOString(),
    createdAt: candidature.createdAt.toISOString(),
    updatedAt: candidature.updatedAt.toISOString(),
    // S'assurer que tous les champs sont présents
    address: candidature.address ?? null,
    postalCode: candidature.postalCode ?? null,
    city: candidature.city ?? null,
    startDate: candidature.startDate ?? null,
    cvUrl: candidature.cvUrl ?? null,
    coverLetterUrl: candidature.coverLetterUrl ?? null,
    otherDocumentUrl: candidature.otherDocumentUrl ?? null,
  }));

  const stats = {
    total: candidatures.length,
    new: candidatures.filter((c: any) => c.status === "NEW").length,
    treated: candidatures.filter((c: any) => c.status === "TREATED").length,
    archived: candidatures.filter((c: any) => c.status === "ARCHIVED").length,
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bricolage font-bold tracking-tight text-gray-900">
          Candidatures
        </h1>
        <p className="mt-2 text-gray-600">
          Gérez les candidatures reçues via le formulaire
        </p>
      </div>

      {hasError ? (
        <Card className="rounded-2xl border-2 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-red-100 p-2 mt-0.5">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bricolage font-semibold text-red-900 mb-2">
                  Erreur de chargement
                </h3>
                <p className="text-sm text-red-700 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Cards */}
          {candidatures.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="rounded-2xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 shadow-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-bricolage text-gray-700 font-semibold">
                      Total candidatures
                    </p>
                  </div>
                  <p className="text-3xl font-bold font-bricolage text-gray-900">
                    {stats.total}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-2.5 shadow-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-bricolage text-gray-700 font-semibold">
                      Nouvelles
                    </p>
                  </div>
                  <p className="text-3xl font-bold font-bricolage text-gray-900">
                    {stats.new}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-2.5 shadow-lg">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-bricolage text-gray-700 font-semibold">
                      Traitées
                    </p>
                  </div>
                  <p className="text-3xl font-bold font-bricolage text-gray-900">
                    {stats.treated}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 bg-gradient-to-br from-gray-50 to-slate-50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-xl bg-gradient-to-br from-gray-500 to-slate-500 p-2.5 shadow-lg">
                      <Archive className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-bricolage text-gray-700 font-semibold">
                      Archivées
                    </p>
                  </div>
                  <p className="text-3xl font-bold font-bricolage text-gray-900">
                    {stats.archived}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Candidatures List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bricolage font-semibold text-gray-900">
              Toutes les candidatures
            </h2>

            {candidatures.length === 0 ? (
              <Card className="rounded-2xl border-2 border-dashed border-gray-200">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Aucune candidature reçue
                  </p>
                  <p className="text-gray-600 text-center max-w-sm">
                    Les candidatures apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-card overflow-hidden">
                <CandidaturesTable candidatures={serializedCandidatures} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
