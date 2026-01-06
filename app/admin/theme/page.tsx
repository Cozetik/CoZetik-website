import ThemeManager from "@/components/admin/theme/theme-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { BookOpen, Tag } from "lucide-react";

export default async function ThemePage() {
  const themes = await prisma.theme.findMany({
    orderBy: { name: "asc" },
    include: {
      posts: true, // Inclure tous les posts au lieu de juste le count
    },
  });

  // Transformer les données pour ajouter _count
  const themesWithCount = themes.map((theme) => ({
    ...theme,
    _count: {
      posts: theme.posts.length,
    },
    posts: undefined, // Supprimer les posts complets de l'objet
  }));

  const stats = {
    total: themes.length,
    withPosts: themes.filter((t) => t.posts.length > 0).length,
    totalPosts: themes.reduce((sum, t) => sum + t.posts.length, 0),
  };

  return (
    <div className="space-y-2.5 xs:space-y-3 sm:space-y-6 lg:space-y-8 font-sans px-2.5 xs:px-3 sm:px-6 lg:px-8 py-2.5 xs:py-3 sm:py-6 max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg xs:text-xl sm:text-3xl lg:text-4xl font-bricolage font-bold tracking-tight text-gray-900">
            Thèmes du blog
          </h1>
          <p className="mt-0.5 xs:mt-1 sm:mt-2 text-[11px] xs:text-xs sm:text-base text-gray-600">
            Organisez vos articles par thématiques
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {themes.length > 0 && (
        <div className="grid grid-cols-1 gap-1.5 xs:gap-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <Card className="rounded-lg xs:rounded-xl border-0 bg-gradient-to-br from-purple-50 to-violet-50 shadow-sm">
            <CardHeader className="pb-1 xs:pb-1.5 p-1.5 xs:p-2 sm:p-4 lg:p-6">
              <div className="flex items-center gap-1 xs:gap-1.5">
                <div className="rounded-md xs:rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 p-0.5 xs:p-1 sm:p-2 shadow-lg shrink-0">
                  <Tag className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-5 sm:w-5 text-white" />
                </div>
                <CardTitle className="text-[9px] xs:text-[10px] sm:text-sm font-bricolage text-gray-700 truncate">
                  Total thèmes
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-1.5 xs:p-2 sm:p-4 lg:p-6 pt-0">
              <p className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-bold font-bricolage text-gray-900 tabular-nums">
                {stats.total}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-lg xs:rounded-xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
            <CardHeader className="pb-1 xs:pb-1.5 p-1.5 xs:p-2 sm:p-4 lg:p-6">
              <div className="flex items-center gap-1 xs:gap-1.5">
                <div className="rounded-md xs:rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 xs:p-1 sm:p-2 shadow-lg shrink-0">
                  <BookOpen className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-5 sm:w-5 text-white" />
                </div>
                <CardTitle className="text-[9px] xs:text-[10px] sm:text-sm font-bricolage text-gray-700 truncate">
                  Utilisés
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-1.5 xs:p-2 sm:p-4 lg:p-6 pt-0">
              <p className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-bold font-bricolage text-gray-900 tabular-nums">
                {stats.withPosts}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-lg xs:rounded-xl border-0 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-1 xs:pb-1.5 p-1.5 xs:p-2 sm:p-4 lg:p-6">
              <div className="flex items-center gap-1 xs:gap-1.5">
                <div className="rounded-md xs:rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-0.5 xs:p-1 sm:p-2 shadow-lg shrink-0">
                  <BookOpen className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-5 sm:w-5 text-white" />
                </div>
                <CardTitle className="text-[9px] xs:text-[10px] sm:text-sm font-bricolage text-gray-700 truncate">
                  Articles
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-1.5 xs:p-2 sm:p-4 lg:p-6 pt-0">
              <p className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-bold font-bricolage text-gray-900 tabular-nums">
                {stats.totalPosts}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Theme Manager */}
      <ThemeManager initialThemes={themesWithCount} />
    </div>
  );
}
