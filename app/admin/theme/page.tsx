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
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-4xl font-bricolage font-bold tracking-tight text-gray-900">
            Thèmes du blog
          </h1>
          <p className="mt-2 text-gray-600">
            Organisez vos articles par thématiques
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {themes.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-2xl border-0 bg-gradient-to-br from-purple-50 to-violet-50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 p-2.5 shadow-lg">
                  <Tag className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm font-bricolage text-gray-700">
                  Total thèmes
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-bricolage text-gray-900">
                {stats.total}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 shadow-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm font-bricolage text-gray-700">
                  Thèmes utilisés
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-bricolage text-gray-900">
                {stats.withPosts}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 shadow-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm font-bricolage text-gray-700">
                  Articles associés
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-bricolage text-gray-900">
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
