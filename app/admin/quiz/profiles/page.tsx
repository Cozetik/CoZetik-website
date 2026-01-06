import ProfilesTable from "@/components/admin/quiz/profiles-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Plus, User, UserCircle } from "lucide-react";
import Link from "next/link";

export default async function QuizProfilesPage() {
  const profiles = await prisma.quizProfile.findMany({
    orderBy: { letter: "asc" },
  });

  const stats = {
    total: profiles.length,
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bricolage font-bold tracking-tight text-gray-900">
            Profils du Quiz
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez les profils et leurs recommandations
          </p>
        </div>
        <Link href="/admin/quiz/profiles/new">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg font-semibold"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nouveau Profil
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {profiles.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-2xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-2.5 shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm font-bricolage text-gray-700">
                  Total profils
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-bricolage text-gray-900">
                {stats.total}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profiles List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bricolage font-semibold text-gray-900">
          Tous les profils
        </h2>

        {profiles.length === 0 ? (
          <Card className="rounded-2xl border-2 border-dashed border-gray-200">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <UserCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Aucun profil créé
              </p>
              <p className="text-gray-600 mb-6 text-center max-w-sm">
                Commencez par créer votre premier profil pour le quiz
              </p>
              <Link href="/admin/quiz/profiles/new">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un profil
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <ProfilesTable profiles={profiles} />
          </div>
        )}
      </div>
    </div>
  );
}
