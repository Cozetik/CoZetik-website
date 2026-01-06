import FormationCardMenu from "@/components/admin/formations/formation-card-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  Calendar,
  Clock,
  Euro,
  Eye,
  EyeOff,
  GraduationCap,
  HelpCircle,
  ListOrdered,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function FormationsPage() {
  const formations = await prisma.formation.findMany({
    include: {
      category: true,
      _count: {
        select: {
          sessions: true,
          steps: true,
          faqs: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Compter les candidatures pour chaque formation
  const formationsWithCandidatures = await Promise.all(
    formations.map(async (formation) => {
      const candidaturesCount = await prisma.candidature.count({
        where: {
          formation: formation.id, // Comparaison avec le titre de la formation
        },
      });

      return {
        ...formation,
        candidaturesCount,
      };
    })
  );

  const stats = {
    total: formations.length,
    visible: formations.filter((f) => f.visible).length,
    hidden: formations.filter((f) => !f.visible).length,
    totalSessions: formations.reduce((acc, f) => acc + f._count.sessions, 0),
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bricolage font-bold tracking-tight text-gray-900">
            Formations
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez vos formations, sessions, étapes et FAQs
          </p>
        </div>
        <Link href="/admin/formations/new">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg font-semibold"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nouvelle Formation
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 shadow-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm font-bricolage text-gray-700">
                Total
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-bricolage text-gray-900">
              {stats.total}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 shadow-lg">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm font-bricolage text-gray-700">
                Visibles
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-bricolage text-gray-900">
              {stats.visible}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-gradient-to-br from-orange-50 to-amber-50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-2.5 shadow-lg">
                <EyeOff className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm font-bricolage text-gray-700">
                Masquées
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-bricolage text-gray-900">
              {stats.hidden}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-gradient-to-br from-violet-50 to-purple-50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 p-2.5 shadow-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm font-bricolage text-gray-700">
                Sessions
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-bricolage text-gray-900">
              {stats.totalSessions}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Formations List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bricolage font-semibold text-gray-900">
          Toutes les formations
        </h2>

        {formationsWithCandidatures.length === 0 ? (
          <Card className="rounded-2xl border-2 border-dashed border-gray-200">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <GraduationCap className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Aucune formation
              </p>
              <p className="text-gray-600 mb-6 text-center max-w-sm">
                Commencez par créer votre première formation pour la rendre
                disponible sur la plateforme
              </p>
              <Link href="/admin/formations/new">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une formation
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {formationsWithCandidatures.map((formation) => (
              <Card
                key={formation.id}
                className="group rounded-2xl border-0 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Image avec overlay au hover */}
                <Link
                  href={`/admin/formations/${formation.id}/edit`}
                  className="block relative h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden"
                >
                  {formation.imageUrl ? (
                    <Image
                      src={formation.imageUrl}
                      alt={formation.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <GraduationCap className="h-16 w-16 text-gray-300" />
                    </div>
                  )}

                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badge de visibilité */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge
                      variant={formation.visible ? "default" : "secondary"}
                      className={`shadow-lg ${
                        formation.visible
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                          : "bg-gray-500 hover:bg-gray-600 text-white border-0"
                      }`}
                    >
                      {formation.visible ? (
                        <>
                          <Eye className="mr-1 h-3 w-3" />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-1 h-3 w-3" />
                          Masqué
                        </>
                      )}
                    </Badge>
                  </div>
                </Link>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/admin/formations/${formation.id}/edit`}
                      className="flex-1 min-w-0 group/title"
                    >
                      <CardTitle className="text-lg font-bricolage font-bold text-gray-900 line-clamp-2 group-hover/title:text-blue-600 transition-colors">
                        {formation.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {formation.category && (
                          <Badge variant="outline" className="text-xs">
                            {formation.category.name}
                          </Badge>
                        )}
                        {formation.level && (
                          <Badge variant="secondary" className="text-xs">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            {formation.level}
                          </Badge>
                        )}
                      </div>
                    </Link>
                    <FormationCardMenu
                      formationId={formation.id}
                      formationTitle={formation.title}
                      stepsCount={formation._count.steps}
                      faqsCount={formation._count.faqs}
                      sessionsCount={formation._count.sessions}
                    />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {formation.description}
                  </p>

                  {/* Informations complémentaires */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {formation.duration && (
                      <div className="flex items-center gap-1 text-gray-600 bg-gray-50 rounded-full px-3 py-1">
                        <Clock className="h-3 w-3" />
                        <span>{formation.duration}</span>
                      </div>
                    )}
                    {formation.price !== null && (
                      <div className="flex items-center gap-1 text-green-600 bg-green-50 rounded-full px-3 py-1 font-medium">
                        <Euro className="h-3 w-3" />
                        <span>{formation.price}€</span>
                      </div>
                    )}
                    {formation.price === null && (
                      <div className="flex items-center gap-1 text-blue-600 bg-blue-50 rounded-full px-3 py-1 font-medium">
                        <span>Gratuit</span>
                      </div>
                    )}
                  </div>

                  {/* Stats grid avec meilleure hiérarchie visuelle */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/admin/formations/${formation.id}/sessions`}
                      className="flex items-center gap-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 hover:shadow-md transition-all group/stat"
                    >
                      <div className="rounded-lg bg-purple-500 p-2 group-hover/stat:scale-110 transition-transform">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-purple-600 font-medium">
                          Sessions
                        </p>
                        <p className="text-lg font-bold font-bricolage text-purple-700">
                          {formation._count.sessions}
                        </p>
                      </div>
                    </Link>

                    <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
                      <div className="rounded-lg bg-blue-500 p-2">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-blue-600 font-medium">
                          Candidatures
                        </p>
                        <p className="text-lg font-bold font-bricolage text-blue-700">
                          {formation.candidaturesCount}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/admin/formations/${formation.id}/steps`}
                      className="flex items-center gap-2 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 hover:shadow-md transition-all group/stat"
                    >
                      <div className="rounded-lg bg-amber-500 p-2 group-hover/stat:scale-110 transition-transform">
                        <ListOrdered className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-amber-600 font-medium">
                          Étapes
                        </p>
                        <p className="text-lg font-bold font-bricolage text-amber-700">
                          {formation._count.steps}
                        </p>
                      </div>
                    </Link>

                    <Link
                      href={`/admin/formations/${formation.id}/faqs`}
                      className="flex items-center gap-2 bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 hover:shadow-md transition-all group/stat"
                    >
                      <div className="rounded-lg bg-green-500 p-2 group-hover/stat:scale-110 transition-transform">
                        <HelpCircle className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-green-600 font-medium">
                          FAQs
                        </p>
                        <p className="text-lg font-bold font-bricolage text-green-700">
                          {formation._count.faqs}
                        </p>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
