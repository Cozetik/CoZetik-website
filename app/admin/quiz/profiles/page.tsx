import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, UserCircle } from 'lucide-react'
import ProfilesTable from '@/components/admin/quiz/profiles-table'

export default async function QuizProfilesPage() {
  const profiles = await prisma.quizProfile.findMany({
    orderBy: { letter: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profils du Quiz</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les profils et leurs recommandations
          </p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/admin/quiz/profiles/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau profil
          </Link>
        </Button>
      </div>

      {profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-none bg-muted/50">
          <UserCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Aucun profil créé
          </h3>
          <p className="text-muted-foreground mb-4">
            Commencez par créer votre premier profil
          </p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/admin/quiz/profiles/new">
              <Plus className="mr-2 h-4 w-4" />
              Créer un profil
            </Link>
          </Button>
        </div>
      ) : (
        <ProfilesTable profiles={profiles} />
      )}
    </div>
  )
}
