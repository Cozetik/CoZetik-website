import AddStepDialog from "@/components/admin/formations/steps/add-step-dialog";
import StepsTable from "@/components/admin/formations/steps/steps-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, GraduationCap, Layers } from "lucide-react";
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

  const nextOrder =
    formation.steps.length > 0
      ? Math.max(...formation.steps.map((s) => s.order)) + 1
      : 1;

  return (
    <div className="space-y-8 font-sans">
      {/* Breadcrumb & Back Button */}
      <div>
        <Button
          variant="ghost"
          asChild
          className="-ml-3 mb-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Link href="/admin/formations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux formations
          </Link>
        </Button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 shadow-lg">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bricolage font-bold tracking-tight text-gray-900">
                  Programme
                </h1>
                <p className="text-lg text-gray-600 mt-1">{formation.title}</p>
              </div>
            </div>
            <p className="text-gray-600 max-w-2xl">
              Structurez votre formation en étapes pédagogiques pour guider vos
              apprenants
            </p>
          </div>

          <AddStepDialog formationId={id} nextOrder={nextOrder} />
        </div>
      </div>

      {/* Content */}
      {formation.steps.length === 0 ? (
        <Card className="rounded-2xl border-2 border-dashed border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              {/* Decorative circles */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full blur-2xl opacity-50" />
              <div className="relative rounded-full bg-gradient-to-br from-blue-50 to-purple-50 p-6">
                <Layers className="h-12 w-12 text-blue-600" />
              </div>
            </div>

            <h3 className="text-2xl font-bricolage font-bold text-gray-900 mb-2">
              Aucune étape définie
            </h3>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              Commencez à structurer votre formation en ajoutant des étapes
              pédagogiques. Chaque étape représente une phase clé du parcours
              d&apos;apprentissage.
            </p>

            <AddStepDialog formationId={id} nextOrder={1} />

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-2xl w-full">
              <div className="text-center p-4 rounded-xl bg-gray-50">
                <div className="rounded-lg bg-blue-100 w-10 h-10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-700 font-bold">1</span>
                </div>
                <p className="text-sm text-gray-600">Ordre personnalisé</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gray-50">
                <div className="rounded-lg bg-purple-100 w-10 h-10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 font-bold">2</span>
                </div>
                <p className="text-sm text-gray-600">Descriptions détaillées</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gray-50">
                <div className="rounded-lg bg-pink-100 w-10 h-10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-pink-700 font-bold">3</span>
                </div>
                <p className="text-sm text-gray-600">Réorganisation facile</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Stats Card */}
          <Card className="rounded-2xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 shadow-sm">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 p-3 shadow-lg">
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Étapes du programme
                  </p>
                  <p className="text-3xl font-bold font-bricolage text-gray-900 mt-1">
                    {formation.steps.length}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-xl shadow-sm">
                <GraduationCap className="h-4 w-4" />
                <span>Formation structurée</span>
              </div>
            </CardContent>
          </Card>

          {/* Steps Table */}
          <StepsTable steps={formation.steps} formationId={id} />
        </div>
      )}
    </div>
  );
}
