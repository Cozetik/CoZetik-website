import CandidaturesTable from "@/components/admin/requests/candidatures-table";
import { prisma } from "@/lib/prisma";
import { AlertCircle } from "lucide-react";

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
  const serializedCandidatures = candidatures.map((candidature: any) => {
    try {
      const serialized = {
        ...candidature,
        birthDate: candidature.birthDate instanceof Date 
          ? candidature.birthDate.toISOString() 
          : new Date(candidature.birthDate).toISOString(),
        createdAt: candidature.createdAt instanceof Date 
          ? candidature.createdAt.toISOString() 
          : new Date(candidature.createdAt).toISOString(),
        updatedAt: candidature.updatedAt instanceof Date 
          ? candidature.updatedAt.toISOString() 
          : new Date(candidature.updatedAt).toISOString(),
        // S'assurer que tous les champs sont présents
        address: candidature.address ?? null,
        postalCode: candidature.postalCode ?? null,
        city: candidature.city ?? null,
        startDate: candidature.startDate ?? null,
        cvUrl: candidature.cvUrl ?? null,
        cvFileName: candidature.cvFileName ?? null,
        coverLetterUrl: candidature.coverLetterUrl ?? null,
        coverLetterFileName: candidature.coverLetterFileName ?? null,
        otherDocumentUrl: candidature.otherDocumentUrl ?? null,
        otherDocumentFileName: candidature.otherDocumentFileName ?? null,
      };
      
      // Debug: vérifier les URLs des fichiers
      if (serialized.cvUrl || serialized.coverLetterUrl || serialized.otherDocumentUrl) {
        console.log(`📎 Candidature ${serialized.id} - URLs fichiers:`, {
          cvUrl: serialized.cvUrl,
          cvFileName: serialized.cvFileName,
          coverLetterUrl: serialized.coverLetterUrl,
          coverLetterFileName: serialized.coverLetterFileName,
          otherDocumentUrl: serialized.otherDocumentUrl,
          otherDocumentFileName: serialized.otherDocumentFileName,
        });
      }
      
      return serialized;
    } catch (serializeError) {
      console.error(`❌ Erreur sérialisation candidature ${candidature.id}:`, serializeError);
      // Retourner une version minimale en cas d'erreur
      return {
        ...candidature,
        birthDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        address: candidature.address ?? null,
        postalCode: candidature.postalCode ?? null,
        city: candidature.city ?? null,
        startDate: candidature.startDate ?? null,
        cvUrl: candidature.cvUrl ?? null,
        coverLetterUrl: candidature.coverLetterUrl ?? null,
        otherDocumentUrl: candidature.otherDocumentUrl ?? null,
      };
    }
  });

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Candidatures</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Gérez les candidatures reçues via le formulaire
        </p>
      </div>

      {hasError ? (
        <div className="rounded-none border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">
                Erreur
              </h3>
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      ) : (
        <CandidaturesTable candidatures={serializedCandidatures} />
      )}
    </div>
  );
}
